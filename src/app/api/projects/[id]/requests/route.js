import connectDB from "@/lib/db";
import Request from "@/models/Request";
import User from "@/models/User"; // Ensure User model is loaded
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Project ID

    const requests = await Request.find({ project: id, status: 'pending' })
        .populate('applicant', 'name email experienceLevel')
        .sort({ createdAt: -1 });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project requests" }, { status: 500 });
  }
}