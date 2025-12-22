import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';
import { userMatchingFlow } from '@/ai/flows/ai-user-matching';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const userId = searchParams.get('userId');

        if (!query) {
            return NextResponse.json({ users: [] });
        }

        await connectToDatabase();

        // Get current user for matching context
        let currentUser = null;
        if (userId) {
            currentUser = await User.findById(userId).select('name bio jobTitle skills');
        }

        // If no userId provided, try to get from session
        if (!currentUser) {
            const session = await getServerSession();
            if (session?.user?.email) {
                currentUser = await User.findOne({ email: session.user.email }).select('name bio jobTitle skills');
            }
        }

        // Fetch candidate users based on search query (same as basic search)
        const candidateUsers = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { skills: { $regex: query, $options: 'i' } },
                { jobTitle: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } }
            ]
        })
            .select('name email image avatarUrl jobTitle skills bio')
            .limit(20)
            .lean();

        if (candidateUsers.length === 0) {
            return NextResponse.json({ users: [] });
        }

        // If we don't have a current user, fall back to basic search
        if (!currentUser) {
            return NextResponse.json({
                users: candidateUsers,
                fallback: true,
                message: 'AI matching requires authentication'
            });
        }

        try {
            console.log('🎯 USER MATCH: Attempting AI matching...');

            // Prepare data for AI matching
            const aiInput = {
                currentUser: {
                    name: currentUser.name,
                    bio: currentUser.bio || '',
                    jobTitle: currentUser.jobTitle || '',
                    skills: Array.isArray(currentUser.skills) ? currentUser.skills : [],
                },
                candidateUsers: candidateUsers.map(user => ({
                    id: user._id.toString(),
                    name: user.name,
                    bio: user.bio || '',
                    jobTitle: user.jobTitle || '',
                    skills: Array.isArray(user.skills) ? user.skills : [],
                }))
            };

            // Call AI matching flow
            const aiResponse = await userMatchingFlow(aiInput);
            console.log('✅ USER MATCH: AI matching successful');

            // Merge AI results with user data
            const matchMap = new Map(aiResponse.matches.map(m => [m.userId, m]));

            const enrichedUsers = candidateUsers.map(user => {
                const match = matchMap.get(user._id.toString());
                return {
                    ...user,
                    compatibilityScore: match?.compatibilityScore || 0,
                    matchReasoning: match?.reasoning || '',
                };
            });

            // Sort by compatibility score (highest first)
            enrichedUsers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

            return NextResponse.json({
                users: enrichedUsers,
                aiPowered: true
            });

        } catch (aiError) {
            const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown error';
            console.error('⚠️ USER MATCH: AI failed, using mock matching:', errorMessage);

            // Generate mock matches based on skill overlap
            const mockMatches = candidateUsers.map(candidate => {
                const currentSkills = new Set(
                    (Array.isArray(currentUser.skills) ? currentUser.skills : []).map((s: string) => s.toLowerCase())
                );
                const candidateSkills = (Array.isArray(candidate.skills) ? candidate.skills : []).map((s: string) => s.toLowerCase());
                const overlap = candidateSkills.filter((s: string) => currentSkills.has(s)).length;

                // Generate score (40-95 range for variety)
                const baseScore = 40 + (overlap * 10);
                const randomBonus = Math.floor(Math.random() * 15);
                const score = Math.min(95, baseScore + randomBonus);

                // Generate reasoning based on score
                let reasoning = '';
                if (score >= 85) {
                    reasoning = `Excellent match! You both share ${overlap} common skills and have complementary expertise.`;
                } else if (score >= 70) {
                    reasoning = `Strong match with ${overlap} overlapping skills. Great potential for collaboration.`;
                } else if (score >= 55) {
                    reasoning = `Good fit! You share some common skills and could learn from each other's expertise.`;
                } else {
                    reasoning = `Potential collaboration opportunity. Different skill sets could bring fresh perspectives.`;
                }

                return {
                    ...candidate,
                    compatibilityScore: score,
                    matchReasoning: reasoning,
                };
            });

            // Sort by compatibility score (highest first)
            mockMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

            return NextResponse.json({
                users: mockMatches,
                aiPowered: true,
                mock: true
            });
        }

    } catch (error) {
        console.error('Match API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
