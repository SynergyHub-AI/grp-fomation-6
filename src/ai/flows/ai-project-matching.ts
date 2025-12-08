'use server';

/**
 * @fileOverview This file implements the AI-powered project matching flow.
 *
 * It recommends projects to users based on their skills and interests, displaying the match percentage and an Expert/Learner tag.
 *
 * - recommendProjects - A function that recommends projects to users.
 * - RecommendProjectsInput - The input type for the recommendProjects function.
 * - RecommendProjectsOutput - The return type for the recommendProjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendProjectsInputSchema = z.object({
  userSkills: z.array(z.string()).describe('List of user skills.'),
  userInterests: z.array(z.string()).describe('List of user interests.'),
  userAvailability: z.string().describe('User availability.'),
  experienceLevel: z.string().describe('User experience level (Beginner, Intermediate, Advanced).'),
  projects: z.array(z.object({
    title: z.string().describe('Project title.'),
    type: z.string().describe('Project type (Hackathon, NGO, Startup, Social).'),
    description: z.string().describe('Project description.'),
    requiredSkills: z.array(z.string()).describe('List of required skills for the project.'),
    teamSize: z.number().describe('The project team size.'),
  })).describe('List of available projects.'),
});
export type RecommendProjectsInput = z.infer<typeof RecommendProjectsInputSchema>;

const RecommendedProjectSchema = z.object({
  title: z.string().describe('Project title.'),
  matchPercentage: z.number().describe('Match percentage between user and project (0-100).'),
  expertOrLearner: z.string().describe('Whether the user would be an expert or a learner on the project.'),
});

const RecommendProjectsOutputSchema = z.array(RecommendedProjectSchema);
export type RecommendProjectsOutput = z.infer<typeof RecommendProjectsOutputSchema>;

export async function recommendProjects(input: RecommendProjectsInput): Promise<RecommendProjectsOutput> {
  return recommendProjectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProjectsPrompt',
  input: {schema: RecommendProjectsInputSchema},
  output: {schema: RecommendProjectsOutputSchema},
  prompt: `You are an AI project recommender. Given a user's skills, interests, availability, experience level, and a list of projects, recommend the best projects for the user.

Consider the user's skills, interests, availability, and experience level when recommending projects. Calculate a match percentage between the user and each project. Determine whether the user would be an expert or a learner on the project based on their skills and the project's required skills.

User Skills: {{userSkills}}
User Interests: {{userInterests}}
User Availability: {{userAvailability}}
User Experience Level: {{experienceLevel}}

Projects:
{{#each projects}}
Title: {{title}}
Type: {{type}}
Description: {{description}}
Required Skills: {{requiredSkills}}
Team Size: {{teamSize}}
{{/each}}

Format the output as a JSON array of objects, where each object represents a recommended project. Each object should include the project title, match percentage (0-100), and whether the user would be an expert or a learner on the project.

Example:
[
  {
    "title": "Project A",
    "matchPercentage": 85,
    "expertOrLearner": "Expert"
  },
  {
    "title": "Project B",
    "matchPercentage": 70,
    "expertOrLearner": "Learner"
  }
]
`,
});

const recommendProjectsFlow = ai.defineFlow(
  {
    name: 'recommendProjectsFlow',
    inputSchema: RecommendProjectsInputSchema,
    outputSchema: RecommendProjectsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
