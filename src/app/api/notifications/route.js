import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // ✅ FIX: Block invalid IDs effectively
    // This stops the crash when the frontend sends "undefined" or "null"
    if (!userId || userId === "undefined" || userId === "null") {
      return NextResponse.json({ notifications: [] });
    }

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ notifications });

  } catch (error) {
    console.error("Notification API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ✅ PUT: Mark as Read
export async function PUT(req) {
  try {
    await connectDB();
    const { notificationId } = await req.json();

    if (!notificationId) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await Notification.findByIdAndUpdate(notificationId, { read: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}