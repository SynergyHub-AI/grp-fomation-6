import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log('🚨 RECOMMEND API - RETURNING MOCK');

  try {
    await connectDB();
    const { projectTitle, requiredSkills } = await request.json();

    // Fetch candidates without AI
    const candidates = await User.find().limit(20).lean();

    // Return mock recommendations
    const mockRecommendations = candidates.slice(0, 10).map((c, index) => ({
      candidateId: c._id.toString(),
      matchPercentage: 95 - (index * 5), // Descending scores
      reasoning: `Good fit for ${projectTitle}`
    }));

    console.log('✅ RECOMMEND API: Returning', mockRecommendations.length, 'recommendations (mock)');
    return NextResponse.json({ recommendations: mockRecommendations, mock: true }, { status: 200 });

  } catch (error) {
    console.error("❌ RECOMMEND API Error:", error);
    return NextResponse.json({ recommendations: [], mock: true }, { status: 200 });
  }
}