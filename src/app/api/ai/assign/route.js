import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log('🚨 ASSIGN API - RETURNING MOCK');

  try {
    const { projectName, availableRoles } = await request.json();

    // Return mock assignment
    const mockAssignment = {
      assignedRole: availableRoles?.[0] || "Junior Developer",
      reason: `This role is perfect for learning on ${projectName}`
    };

    console.log('✅ ASSIGN API: Returning mock assignment');
    return NextResponse.json(mockAssignment, { status: 200 });

  } catch (error) {
    console.error("❌ ASSIGN API Error:", error);
    return NextResponse.json({
      assignedRole: "Team Member",
      reason: "General team support role"
    }, { status: 200 });
  }
}