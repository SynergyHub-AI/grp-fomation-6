import connectDB from "@/lib/db";
import Request from "@/models/Request";
import Project from "@/models/Project";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// 1. APPLY TO JOIN (POST)
export async function POST(req) {
  try {
    await connectDB();
    const { projectId, userId, ownerId } = await req.json();

    if (!projectId || !userId || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if already requested
    const existing = await Request.findOne({ project: projectId, applicant: userId });
    if (existing) {
        if (existing.status === 'pending') return NextResponse.json({ error: "Request already pending" }, { status: 400 });
        if (existing.status === 'accepted') return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    // Create Request
    const newRequest = await Request.create({
      project: projectId,
      applicant: userId,
      owner: ownerId,
      status: 'pending'
    });

    return NextResponse.json({ message: "Request sent successfully", request: newRequest }, { status: 201 });

  } catch (error) {
    console.error("Apply Error:", error);
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 });
  }
}

// 2. ACCEPT / REJECT REQUEST (PUT)
export async function PUT(req) {
  try {
    await connectDB();
    const { requestId, action } = await req.json(); // action = 'accepted' | 'rejected'

    if (!requestId || !['accepted', 'rejected'].includes(action)) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }

    const request = await Request.findById(requestId);
    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // Update Request Status
    request.status = action;
    await request.save();

    // IF ACCEPTED: Add to Project Team
    if (action === 'accepted') {
        await Project.findByIdAndUpdate(request.project, {
            $addToSet: { 
                team: { user: request.applicant, role: 'Member' } 
            }
        });
    }

    return NextResponse.json({ message: `Request ${action}`, request }, { status: 200 });

  } catch (error) {
    console.error("Request Update Error:", error);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}