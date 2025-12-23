'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { z } from 'genkit';

const UserMatchingInputSchema = z.object({
    currentUser: z.object({
        name: z.string(),
        bio: z.string().optional(),
        jobTitle: z.string().optional(),
        skills: z.array(z.string()),
    }),
    candidateUsers: z.array(z.object({
        id: z.string(),
        name: z.string(),
        bio: z.string().optional(),
        jobTitle: z.string().optional(),
        skills: z.array(z.string()),
    })),
});

const UserMatchingOutputSchema = z.object({
    matches: z.array(z.object({
        userId: z.string(),
        compatibilityScore: z.number().min(0).max(100),
        reasoning: z.string(),
    }))
});

export async function userMatchingFlow(input: z.infer<typeof UserMatchingInputSchema>): Promise<z.infer<typeof UserMatchingOutputSchema>> {
    const prompt = `You are an AI matchmaking expert for a developer collaboration platform called SynergyHub.

**Current User Profile:**
Name: ${input.currentUser.name}
Job Title: ${input.currentUser.jobTitle || 'Not specified'}
Bio: ${input.currentUser.bio || 'No bio provided'}
Skills: ${input.currentUser.skills.join(', ') || 'None listed'}

**Candidate Users:**
${JSON.stringify(input.candidateUsers, null, 2)}

**Task:**
Analyze the compatibility between the current user and each candidate based on:
1. **Skill Overlap**: Do they share common technical skills?
2. **Complementary Skills**: Do they have skills that complement each other?
3. **Role Compatibility**: Do their job titles suggest good collaboration potential?
4. **Interest Alignment**: Based on their bios, do they have similar interests or goals?

For each candidate, provide:
- **compatibilityScore**: A score from 0-100 (100 = perfect match)
- **reasoning**: A concise, friendly explanation (1-2 sentences) of why they match

**Scoring Guidelines:**
- 90-100: Exceptional match (very similar skills + complementary expertise + aligned interests)
- 75-89: Strong match (good skill overlap + compatible roles)
- 60-74: Good match (some skill overlap or complementary skills)
- 40-59: Moderate match (minimal overlap but potential synergy)
- 0-39: Weak match (little in common)

Return ONLY valid JSON matching this exact schema:
{
  "matches": [
    {
      "userId": "string",
      "compatibilityScore": number,
      "reasoning": "string"
    }
  ]
}`;

    try {
        // Validate API key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey.trim() === '') {
            console.error('❌ GEMINI_API_KEY is not set or empty');
            throw new Error('GEMINI_API_KEY is not configured. Please set it in .env.local');
        }

        console.log('🔑 API Key found, length:', apiKey.length);
        console.log('🚀 Calling Google AI API for user matching...');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            generationConfig: {
                responseMimeType: "application/json",
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,
            },
        });

        const response = result.response;
        console.log('📦 Response received from Google AI');

        const text = response.text();
        console.log('📝 Response text length:', text.length);

        const parsed = JSON.parse(text);
        console.log('✅ Successfully parsed AI response');

        return parsed;
    } catch (error) {
        console.error('❌ Google AI Error in userMatchingFlow:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw error;
    }
}
