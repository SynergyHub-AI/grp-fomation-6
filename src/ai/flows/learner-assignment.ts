'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
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

export async function assignLearnerFlow(input: z.infer<typeof AssignLearnerInputSchema>): Promise<z.infer<typeof AssignLearnerOutputSchema>> {
  const prompt = `Assign a safe, non-critical role to a learner for project "${input.projectName}".
Skills: ${input.learnerSkills.join(', ')}
Roles Available: ${input.availableRoles.join(', ')}

Return JSON with 'assignedRole' and 'reason'.
Return ONLY valid JSON.`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
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
    console.error('Google AI Error in assignLearnerFlow:', error);
    throw error;
  }
}