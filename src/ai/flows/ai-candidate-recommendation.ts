'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'genkit';

const RecommendCandidatesInputSchema = z.object({
  projectTitle: z.string(),
  projectDescription: z.string(),
  requiredSkills: z.array(z.string()),
  candidateProfiles: z.array(z.object({
    id: z.string(),
    name: z.string(),
    skills: z.array(z.string()),
    experienceLevel: z.string(),
  })),
});

const RecommendCandidatesOutputSchema = z.object({
  recommendations: z.array(z.object({
    candidateId: z.string(),
    matchPercentage: z.number(),
    reasoning: z.string(),
  }))
});

export async function recommendCandidatesFlow(input: z.infer<typeof RecommendCandidatesInputSchema>): Promise<z.infer<typeof RecommendCandidatesOutputSchema>> {
  const prompt = `You are an AI Recruiter.
Project: ${input.projectTitle} - ${input.projectDescription}
Skills Needed: ${input.requiredSkills.join(', ')}

Candidates: ${JSON.stringify(input.candidateProfiles)}

Task: Rank candidates based on fit.
Return JSON with 'recommendations' array containing:
- candidateId: string
- matchPercentage: number (0-100)
- reasoning: string

Return ONLY valid JSON.`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',  // Using stable model instead of experimental
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const text = response.text();
    const parsed = JSON.parse(text);

    return parsed;
  } catch (error) {
    console.error('Google AI Error in recommendCandidatesFlow:', error);
    throw error;
  }
}