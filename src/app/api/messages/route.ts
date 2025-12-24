import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DirectMessage from "@/models/DirectMessage";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Fetch list of users I have chatted with (Conversations)
export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id || session.user._id;

        // Aggregate to find unique interlocutors
        // This is a bit complex in pure Mongoose without a Conversation model, but doable.
        // Or we can just find all unique sender/recipient IDs where current user is involved.

        const messages = await DirectMessage.find({
            $or: [{ sender: userId }, { recipient: userId }]
        }).sort({ createdAt: -1 });

        const conversationUserIds = new Set<string>();
        messages.forEach(msg => {
            if (msg.sender.toString() !== userId) conversationUserIds.add(msg.sender.toString());
            if (msg.recipient.toString() !== userId) conversationUserIds.add(msg.recipient.toString());
        });

        // Fetch user details
        const conversations = await User.find({ _id: { $in: Array.from(conversationUserIds) } })
            .select("name email image jobTitle");

        // Add last message info (optional but good for UI)
        const conversationsWithLastMessage = await Promise.all(conversations.map(async (user) => {
            const lastMsg = messages.find(m =>
                (m.sender.toString() === userId && m.recipient.toString() === user._id.toString()) ||
                (m.sender.toString() === user._id.toString() && m.recipient.toString() === userId)
            );
            return {
                ...user.toObject(),
                lastMessage: lastMsg ? lastMsg.content : "",
                lastMessageTime: lastMsg ? lastMsg.createdAt : null,
                isRead: lastMsg?.sender.toString() === userId ? true : lastMsg?.isRead // if I sent it, it's "read" by me
            };
        }));

        // Sort by last message time
        conversationsWithLastMessage.sort((a, b) => {
            return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });

        return NextResponse.json({ conversations: conversationsWithLastMessage });

    } catch (error) {
        console.error("Fetch Conversations Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// POST: Send a new message
export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id || session.user._id;
        const { recipientId, content } = await req.json();

        if (!recipientId || !content) {
            return NextResponse.json({ error: "Recipient ID and Content are required" }, { status: 400 });
        }

        const newMessage = await DirectMessage.create({
            sender: userId,
            recipient: recipientId,
            content,
            isRead: false
        });

        return NextResponse.json({ message: "Message sent", data: newMessage });

    } catch (error) {
        console.error("Send Message Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
