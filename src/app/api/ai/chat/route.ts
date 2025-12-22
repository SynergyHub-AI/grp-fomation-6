import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    console.log('🚨 CHAT API CALLED - RETURNING MOCK');

    try {
        const { message } = await request.json();

        return NextResponse.json({
            response: "✅ Mock chatbot response: I'm working! You said: " + message,
            timestamp: new Date().toISOString(),
            mock: true,
        });
    } catch (error) {
        return NextResponse.json({
            response: "Mock response - API is working",
            timestamp: new Date().toISOString(),
        });
    }
}
