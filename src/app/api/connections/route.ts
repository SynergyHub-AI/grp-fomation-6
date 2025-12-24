import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ConnectionRequest from "@/models/ConnectionRequest";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id || session.user._id;

        // Get all requests where current user is sender or recipient
        const requests = await ConnectionRequest.find({
            $or: [{ sender: userId }, { recipient: userId }]
        })
            .populate("sender", "name email image jobTitle")
            .populate("recipient", "name email image jobTitle")
            .sort({ createdAt: -1 });

        return NextResponse.json({ requests });

    } catch (error) {
        console.error("Fetch Connections Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id || session.user._id;
        const { recipientId } = await req.json();

        if (!recipientId) {
            return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 });
        }

        if (userId === recipientId) {
            return NextResponse.json({ error: "Cannot connect with yourself" }, { status: 400 });
        }

        // Check if request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { sender: userId, recipient: recipientId },
                { sender: recipientId, recipient: userId }
            ]
        });

        if (existingRequest) {
            if (existingRequest.status === 'accepted') {
                return NextResponse.json({ error: "Already connected" }, { status: 400 });
            }
            if (existingRequest.status === 'pending') {
                return NextResponse.json({ error: "Request already pending" }, { status: 400 });
            }
            // If rejected, we might allow re-sending or not. For now, let's treat it as needing to handle manually or allow if sufficient time passed.
            // For simplicity, let's just say "Request already exists" or update status to pending again if rejected?
            // Let's stick to "Request already exists" to keep it simple.
            return NextResponse.json({ error: "Request already exists" }, { status: 400 });
        }

        const newRequest = await ConnectionRequest.create({
            sender: userId,
            recipient: recipientId,
            status: "pending"
        });

        return NextResponse.json({ message: "Connection request sent", request: newRequest });

    } catch (error) {
        console.error("Send Connection Request Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
