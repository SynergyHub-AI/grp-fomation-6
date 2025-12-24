import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ConnectionRequest from "@/models/ConnectionRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id || session.user._id;
        const { requestId, action } = await req.json(); // action: 'accept' or 'reject'

        if (!requestId || !action) {
            return NextResponse.json({ error: "Request ID and Action are required" }, { status: 400 });
        }

        const request = await ConnectionRequest.findById(requestId);

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // specific check: only the recipient can accept/reject
        if (request.recipient.toString() !== userId) {
            return NextResponse.json({ error: "Not authorized to respond to this request" }, { status: 403 });
        }

        if (request.status !== "pending") {
            return NextResponse.json({ error: "Request is not pending" }, { status: 400 });
        }

        if (action === "accept") {
            request.status = "accepted";
        } else if (action === "reject") {
            request.status = "rejected";
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        await request.save();

        return NextResponse.json({ message: `Request ${action}ed`, request });

    } catch (error) {
        console.error("Respond Connection Request Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
