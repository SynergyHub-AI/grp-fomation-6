import connectDB from "@/lib/db";
import Message from "@/models/Message";
import User from "@/models/User"; // Keep this to ensure User model is loaded
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const messages = await Message.find({ project: id })
      .populate("sender", "name email")
      .populate({
        path: "replyTo",
        populate: { path: "sender", select: "name" }
      })
      .sort({ createdAt: 1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { content, senderId, replyTo } = await req.json();

    const newMessage = await Message.create({
      project: id,
      sender: senderId,
      content,
      replyTo: replyTo || null
    });

    // Populate deeply to show reply details immediately
    await newMessage.populate("sender", "name");
    if (replyTo) {
        await newMessage.populate({
            path: "replyTo",
            populate: { path: "sender", select: "name" }
        });
    }

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Send Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { messageId, content } = await req.json();

        const updated = await Message.findByIdAndUpdate(
            messageId, 
            { content, isEdited: true }, 
            { new: true }
        )
        .populate("sender", "name")
        .populate({ 
            path: "replyTo", 
            populate: { path: "sender", select: "name" }
        });

        return NextResponse.json({ message: updated }, { status: 200 });
    } catch (error) {
        console.error("Edit Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { messageId } = await req.json();
        await Message.findByIdAndDelete(messageId);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}