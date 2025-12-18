'use server';

import { ai } from '@/ai/genkit';
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

export const recommendCandidatesFlow = ai.defineFlow(
  {
    name: 'recommendCandidatesFlow',
    inputSchema: RecommendCandidatesInputSchema,
    outputSchema: RecommendCandidatesOutputSchema,
  },
  async (input) => {
    const prompt = await ai.generate({
      prompt: `
        You are an AI Recruiter.
        Project: ${input.projectTitle} - ${input.projectDescription}
        Skills Needed: ${input.requiredSkills.join(', ')}
        
        Candidates: ${JSON.stringify(input.candidateProfiles)}
        
        Task: Rank candidates based on fit.
        Return JSON with 'recommendations' array.
      `,
      output: { schema: RecommendCandidatesOutputSchema },
    });
    return prompt.output!;
  }
);