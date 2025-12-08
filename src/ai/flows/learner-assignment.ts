// src/ai/flows/learner-assignment.ts
'use server';
/**
 * @fileOverview A flow for assigning learners to non-critical roles in a project.
 *
 * - assignLearnerToProject - A function that handles the learner assignment process.
 * - AssignLearnerToProjectInput - The input type for the assignLearnerToProject function.
 * - AssignLearnerToProjectOutput - The return type for the assignLearnerToProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignLearnerToProjectInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to assign the learner to.'),
  learnerSkills: z.array(z.string()).describe('The skills of the learner.'),
  availableRoles: z.array(z.string()).describe('The available roles in the project.'),
  projectDescription: z.string().describe('The project description.'),
  projectName: z.string().describe('The project name.'),
});
export type AssignLearnerToProjectInput = z.infer<typeof AssignLearnerToProjectInputSchema>;

const AssignLearnerToProjectOutputSchema = z.object({
  assignedRole: z.string().describe('The role assigned to the learner.'),
  reason: z.string().describe('The reason for the role assignment.'),
});
export type AssignLearnerToProjectOutput = z.infer<typeof AssignLearnerToProjectOutputSchema>;

export async function assignLearnerToProject(input: AssignLearnerToProjectInput): Promise<AssignLearnerToProjectOutput> {
  return assignLearnerToProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assignLearnerToProjectPrompt',
  input: {schema: AssignLearnerToProjectInputSchema},
  output: {schema: AssignLearnerToProjectOutputSchema},
  prompt: `You are an AI assistant specialized in assigning learners to suitable, non-critical roles within projects.  Consider the learner's skills and interests, the available roles, and the project's requirements to suggest the best role for the learner. Prioritize roles where the learner can contribute and gain experience without negatively impacting critical project outcomes.

Project Name: {{{projectName}}}
Project Description: {{{projectDescription}}}
Learner Skills: {{#each learnerSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Available Roles: {{#each availableRoles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Based on the above information, suggest a role for the learner and provide a brief explanation of why that role is a good fit.  The role MUST be selected from the list of Available Roles.  If no roles are appropriate for learners, return an empty string in the assignedRole field and explain why in the reason field.

Output MUST be a JSON object with "assignedRole" and "reason" fields.  If no role can be assigned, "assignedRole" MUST be an empty string.
`,
});

const assignLearnerToProjectFlow = ai.defineFlow(
  {
    name: 'assignLearnerToProjectFlow',
    inputSchema: AssignLearnerToProjectInputSchema,
    outputSchema: AssignLearnerToProjectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
