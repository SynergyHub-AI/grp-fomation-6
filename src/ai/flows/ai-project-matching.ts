'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'genkit';

const RecommendProjectsInputSchema = z.object({
  userProfile: z.object({
    name: z.string(),
    bio: z.string(),
    skills: z.array(z.string()),
    experienceLevel: z.string(),
  }),
  availableProjects: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    type: z.string().optional(),
    teamSize: z.number().optional(),
  })),
});

const RecommendProjectsOutputSchema = z.object({
  recommendations: z.array(z.object({
    projectId: z.string(),
    matchScore: z.number(),
    reasoning: z.string(),
    expertOrLearner: z.string(),
  }))
});

export async function projectMatchingFlow(input: z.infer<typeof RecommendProjectsInputSchema>): Promise<z.infer<typeof RecommendProjectsOutputSchema>> {
  const prompt = `You are an AI Career Matcher.
User: ${JSON.stringify(input.userProfile)}
Projects: ${JSON.stringify(input.availableProjects)}

Task: Analyze fit for EVERY project.
Return JSON with 'recommendations' array containing:
- projectId: string
- matchScore: number (0-100)
- reasoning: string
- expertOrLearner: string ("expert" or "learner")

Return ONLY valid JSON.`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
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
    console.error('Google AI Error in projectMatchingFlow:', error);
    throw error;
  }
}