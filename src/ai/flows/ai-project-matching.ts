'use server';

import { ai } from '@/ai/genkit';
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

export const projectMatchingFlow = ai.defineFlow(
  {
    name: 'projectMatchingFlow',
    inputSchema: RecommendProjectsInputSchema,
    outputSchema: RecommendProjectsOutputSchema,
  },
  async (input) => {
    const prompt = await ai.generate({
      prompt: `
        You are an AI Career Matcher.
        User: ${JSON.stringify(input.userProfile)}
        Projects: ${JSON.stringify(input.availableProjects)}
        
        Task: Analyze fit for EVERY project.
        Return JSON with 'recommendations' array.
      `,
      output: { schema: RecommendProjectsOutputSchema },
    });
    return prompt.output!;
  }
);