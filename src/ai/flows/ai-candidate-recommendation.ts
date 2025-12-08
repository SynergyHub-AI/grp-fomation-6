'use server';

/**
 * @fileOverview An AI-powered candidate recommendation tool for project creators.
 *
 * - recommendCandidates - A function that suggests suitable candidates for a project.
 * - RecommendCandidatesInput - The input type for the recommendCandidates function.
 * - RecommendCandidatesOutput - The return type for the recommendCandidates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCandidatesInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project.'),
  projectType: z.string().describe('The type of the project (e.g., Hackathon, NGO, Startup, Social).'),
  projectDescription: z.string().describe('A detailed description of the project.'),
  requiredSkills: z.array(z.string()).describe('An array of skills required for the project.'),
  requiredRoles: z.array(z.string()).describe('An array of roles required for the project (e.g., Team Lead, Developer, Designer, Operations).'),
  teamSize: z.number().describe('The desired team size for the project.'),
  timeCommitment: z.string().describe('The expected time commitment for the project (e.g., Part-time, Full-time).'),
  candidateProfiles: z.array(z.object({
    name: z.string().describe('The name of the candidate.'),
    bio: z.string().describe('A short biography of the candidate.'),
    skills: z.array(z.string()).describe('An array of skills possessed by the candidate.'),
    interests: z.array(z.string()).describe('An array of interests of the candidate.'),
    availability: z.string().describe('The availability of the candidate (e.g., Available immediately, Available in 2 weeks).'),
    experienceLevel: z.string().describe('The experience level of the candidate (e.g., Beginner, Intermediate, Advanced).'),
    learningIntent: z.array(z.string()).optional().describe('Skills that candidate wants to learn.'),
  })).describe('Array of candidate profiles to evaluate against project requirements.'),
});
export type RecommendCandidatesInput = z.infer<typeof RecommendCandidatesInputSchema>;

const CandidateRecommendationSchema = z.object({
  name: z.string().describe('The name of the candidate.'),
  matchPercentage: z.number().describe('A percentage indicating how well the candidate matches the project requirements.'),
  reasoning: z.string().describe('Explanation of why the candidate is a good fit for the project.'),
});

const RecommendCandidatesOutputSchema = z.array(CandidateRecommendationSchema).describe('An array of recommended candidates with their match percentages and reasons.');
export type RecommendCandidatesOutput = z.infer<typeof RecommendCandidatesOutputSchema>;

export async function recommendCandidates(input: RecommendCandidatesInput): Promise<RecommendCandidatesOutput> {
  return recommendCandidatesFlow(input);
}

const recommendCandidatesPrompt = ai.definePrompt({
  name: 'recommendCandidatesPrompt',
  input: {schema: RecommendCandidatesInputSchema},
  output: {schema: RecommendCandidatesOutputSchema},
  prompt: `You are an AI-powered recommendation system designed to suggest the best candidates for a given project.

  Given the following project details:
  Project Title: {{{projectTitle}}}
  Project Type: {{{projectType}}}
  Project Description: {{{projectDescription}}}
  Required Skills: {{#each requiredSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Required Roles: {{#each requiredRoles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Team Size: {{{teamSize}}}
  Time Commitment: {{{timeCommitment}}}

  And the following candidate profiles:
  {{#each candidateProfiles}}
  Candidate Name: {{{name}}}
  Candidate Bio: {{{bio}}}
  Candidate Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Candidate Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Candidate Availability: {{{availability}}}
  Candidate Experience Level: {{{experienceLevel}}}
  Candidate Learning Intent: {{#each learningIntent}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Evaluate each candidate and provide a match percentage (0-100) indicating how well they fit the project requirements.
  Also, provide a brief reasoning for each candidate's suitability, considering their skills, interests, availability, experience level, and learning intent.
  Output the recommendations as a JSON array of CandidateRecommendation objects.
  {{~/each}}
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const recommendCandidatesFlow = ai.defineFlow(
  {
    name: 'recommendCandidatesFlow',
    inputSchema: RecommendCandidatesInputSchema,
    outputSchema: RecommendCandidatesOutputSchema,
  },
  async input => {
    const {output} = await recommendCandidatesPrompt(input);
    return output!;
  }
);
