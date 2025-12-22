'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'genkit';

const ChatInputSchema = z.object({
    message: z.string(),
    conversationHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
    })).optional(),
});

const ChatOutputSchema = z.object({
    response: z.string(),
});

export async function chatFlow(input: z.infer<typeof ChatInputSchema>): Promise<z.infer<typeof ChatOutputSchema>> {
    const systemPrompt = `You are SynergyHelp, a friendly and knowledgeable AI assistant for the SynergyHub platform.

**Your Role:**
- Help developers navigate the SynergyHub application
- Provide guidance on finding projects and collaborators
- Assist with profile management and settings
- Be concise, encouraging, and tech-savvy

**Platform Features & Routes:**
- Dashboard (/dashboard): View your projects, recommendations, and activity
- Search Profiles (/search): Find collaborators by skills, name, or expertise
- My Projects (/projects): Manage your current projects and teams
- Create Project (/projects/new): Start a new project and recruit team members
- Settings (/settings): Update your profile, preferences, and account details
- Profile (/profile): View and edit your public profile

**Guidelines:**
- Keep responses concise (2-3 sentences max)
- Use emojis sparingly but effectively ✨
- Suggest specific routes when relevant
- Be encouraging and positive
- If asked about technical implementation details, politely redirect to documentation or support

**Conversation Style:**
- Friendly but professional
- Direct and actionable
- Tech-savvy without being condescending`;

    const conversationContext = input.conversationHistory?.map(msg =>
        `${msg.role === 'user' ? 'User' : 'SynergyHelp'}: ${msg.content}`
    ).join('\n') || '';

    const fullPrompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}
User: ${input.message}

SynergyHelp:`;

    try {
        console.log('🔑 Chatbot - API Key exists:', !!process.env.GEMINI_API_KEY);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        console.log('📤 Chatbot - Sending request...');
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
            },
        });

        console.log('📥 Chatbot - Response received');
        const response = result.response;
        const text = response.text();
        console.log('✅ Chatbot - Generated text length:', text?.length);

        return {
            response: text,
        };
    } catch (error) {
        console.error('❌ Chatbot Error:', error);
        throw error;
    }
}

