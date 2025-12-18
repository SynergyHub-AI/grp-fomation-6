'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AssignLearnerInputSchema = z.object({
  projectName: z.string(),
  learnerSkills: z.array(z.string()),
  availableRoles: z.array(z.string()),
});

const AssignLearnerOutputSchema = z.object({
  assignedRole: z.string(),
  reason: z.string(),
});

export const assignLearnerFlow = ai.defineFlow(
  {
    name: 'assignLearnerFlow',
    inputSchema: AssignLearnerInputSchema,
    outputSchema: AssignLearnerOutputSchema,
  },
  async (input) => {
    const prompt = await ai.generate({
      prompt: `
        Assign a safe, non-critical role to a learner for project "${input.projectName}".
        Skills: ${input.learnerSkills.join(', ')}
        Roles Available: ${input.availableRoles.join(', ')}
        
        Return JSON with 'assignedRole' and 'reason'.
      `,
      output: { schema: AssignLearnerOutputSchema },
    });
    return prompt.output!;
  }
);