import connectDB from "@/lib/db";
import Request from "@/models/Request";
import Project from "@/models/Project";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// ✅ 1. POST: Create a new collaboration request (Fixes the 405 Error)
// ✅ 1. POST: Create a new collaboration request
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // ✅ FIX: Extract 'userId' and treat it as 'applicantId'
    const { projectId, applicantId, userId, ownerId, message } = body;
    const finalApplicantId = applicantId || userId; // Use whichever one exists

    // Validation
    if (!projectId || !finalApplicantId) {
      console.log("❌ MISSING FIELDS!", { projectId, finalApplicantId });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prevent Duplicate Requests
    // Prevent Duplicate Requests
    const existingRequest = await Request.findOne({
      project: projectId,
      applicant: finalApplicantId,
      status: 'pending'
    });

    if (existingRequest) {
      return NextResponse.json({ error: "Request already pending" }, { status: 409 });
    }

    // ✅ FIX: Prevent applying to own project
    if (ownerId && ownerId.toString() === finalApplicantId.toString()) {
      return NextResponse.json({ error: "You cannot apply to your own project" }, { status: 400 });
    }

    // ✅ FIX: Prevent applying if already a member
    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const isMember = project.team.some(member => member.user.toString() === finalApplicantId.toString());
    if (isMember) {
      return NextResponse.json({ error: "You are already a member of this project" }, { status: 400 });
    }

    // Create the Request
    const newRequest = await Request.create({
      project: projectId,
      applicant: finalApplicantId, // ✅ Use the fixed ID
      owner: ownerId,
      message: message || "I would like to join your project.",
      status: 'pending'
    });

    // (Optional) Notify the Project Owner
    if (ownerId) {
      try {
        await Notification.create({
          recipient: ownerId,
          sender: finalApplicantId,
          type: "REQUEST_RECEIVED",
          message: "You have a new project application.",
          relatedId: projectId
        });
      } catch (e) {
        console.error("Notification failed", e);
      }
    }

    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });

  } catch (error) {
    console.error("POST Request Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ✅ 2. PUT: Accept or Reject a request (Your existing logic)
export async function PUT(req) {
  try {
    await connectDB();
    const { requestId, status } = await req.json();

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    ).populate('project').populate('applicant');

    if (!updatedRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (status === 'accepted') {
      await Project.findByIdAndUpdate(updatedRequest.project._id, {
        $addToSet: { team: { user: updatedRequest.applicant._id, role: 'member' } }
      });
    }

    // Notification Logic
    try {
      await Notification.create({
        recipient: updatedRequest.applicant._id,
        sender: updatedRequest.project.owner,
        type: status === 'accepted' ? "REQUEST_ACCEPTED" : "REQUEST_REJECTED",
        message: `Your request was ${status}`,
        relatedId: updatedRequest.project._id
      });
    } catch (e) { }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}