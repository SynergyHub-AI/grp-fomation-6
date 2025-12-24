import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DirectMessage from "@/models/DirectMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const { userId: otherUserId } = await params;

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const currentUserId = session.user.id || session.user._id;

        if (!otherUserId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const messages = await DirectMessage.find({
            $or: [
                { sender: currentUserId, recipient: otherUserId },
                { sender: otherUserId, recipient: currentUserId }
            ]
        }).sort({ createdAt: 1 }); // Oldest first

        return NextResponse.json({ messages });

    } catch (error) {
        console.error("Fetch Chat History Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
