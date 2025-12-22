import { NextResponse } from 'next/server';
import { chatFlow } from '@/ai/flows/ai-chat';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { message, conversationHistory } = await request.json();

        if (!message || message.trim() === '') {
            return NextResponse.json({
                response: "Please provide a message.",
                timestamp: new Date().toISOString(),
                mock: true,
            }, { status: 400 });
        }

        console.log('💬 CHAT API: Attempting AI chat...');

        try {
            // Call the actual AI chatFlow
            const aiResponse = await chatFlow({
                message,
                conversationHistory: conversationHistory || [],
            });

            console.log('✅ CHAT API: AI chat successful');

            return NextResponse.json({
                response: aiResponse.response,
                timestamp: new Date().toISOString(),
                aiPowered: true,
            });

        } catch (aiError) {
            const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown error';
            console.error('⚠️ CHAT API: AI failed, using mock response:', errorMessage);

            // Fallback to mock response
            return NextResponse.json({
                response: `I'm having trouble connecting to my AI brain right now. You said: "${message}". Try asking me about SynergyHub features!`,
                timestamp: new Date().toISOString(),
                mock: true,
            });
        }

    } catch (error) {
        console.error('❌ CHAT API Error:', error);
        return NextResponse.json({
            response: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date().toISOString(),
            mock: true,
        }, { status: 500 });
    }
}
