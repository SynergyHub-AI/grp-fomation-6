import { NextResponse } from "next/server";
import { assignLearnerFlow } from "@/ai/flows/learner-assignment"; 

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { projectName, learnerSkills, availableRoles } = await request.json();

    const aiResponse = await assignLearnerFlow({
      projectName,
      learnerSkills,
      availableRoles
    });

    return NextResponse.json(aiResponse, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Assignment Failed" }, { status: 500 });
  }
}