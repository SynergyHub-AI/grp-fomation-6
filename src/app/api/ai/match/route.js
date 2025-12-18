import connectDB from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { projectMatchingFlow } from "@/ai/flows/ai-project-matching"; 

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const { userId } = await request.json();
    const user = await User.findById(userId);
    
    // 1. Fetch ALL projects where the user is NOT the owner or a member
    const allProjects = await Project.find({ 
        owner: { $ne: userId }, 
        'team.user': { $ne: userId } 
    }).lean(); 

    if (allProjects.length === 0) {
        return NextResponse.json({ projects: [] }, { status: 200 });
    }

    // 2. Try AI Matching
    try {
        const aiInput = {
          userProfile: {
            name: user.name,
            bio: user.bio || "",
            skills: user.skills.map(s => s.name),
            experienceLevel: user.experienceLevel || "Beginner",
          },
          availableProjects: allProjects.map(p => ({
            id: p._id.toString(),
            title: p.title,
            description: p.description,
            techStack: p.techStack,
          }))
        };

        const aiResponse = await projectMatchingFlow(aiInput);
        
        // Merge AI results
        const aiMap = new Map(aiResponse.recommendations.map(r => [r.projectId, r]));
        const scoredProjects = allProjects.map(p => {
            const match = aiMap.get(p._id.toString());
            return match ? { ...p, matchScore: match.matchScore, aiReasoning: match.reasoning, expertOrLearner: match.expertOrLearner } : p;
        }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        return NextResponse.json({ projects: scoredProjects }, { status: 200 });

    } catch (aiError) {
        console.warn("⚠️ AI Service Failed/Exhausted, returning raw list:", aiError.message);
        
        // 3. Fallback: Return raw projects sorted by newest if AI fails
        const fallbackProjects = allProjects.reverse(); // Newest first
        return NextResponse.json({ projects: fallbackProjects }, { status: 200 });
    }

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}