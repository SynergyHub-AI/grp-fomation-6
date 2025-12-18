import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { recommendCandidatesFlow } from "@/ai/flows/ai-candidate-recommendation"; 

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const { projectTitle, projectDescription, requiredSkills } = await request.json();
    
    // Fetch potential candidates (users who are not part of the project yet)
    const candidates = await User.find().limit(20).lean(); 

    const aiInput = {
      projectTitle,
      projectDescription,
      requiredSkills,
      candidateProfiles: candidates.map(c => ({
        id: c._id.toString(),
        name: c.name,
        skills: c.skills.map(s => s.name),
        experienceLevel: c.experienceLevel || "Beginner"
      }))
    };

    const aiResponse = await recommendCandidatesFlow(aiInput);
    return NextResponse.json(aiResponse, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Recommendation Failed" }, { status: 500 });
  }
}