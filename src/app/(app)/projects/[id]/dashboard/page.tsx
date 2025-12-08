import { mockUsers, mockProjects } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, Users, Award, Book, Briefcase, Mail, Sparkles, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';

// Mock AI function
const getRecommendedCandidates = async (project: any) => {
  return mockUsers
    .filter(u => u.id !== project.creatorId) // Don't recommend the creator to their own project
    .map(user => ({
        user,
        matchPercentage: Math.floor(Math.random() * (98 - 75 + 1) + 75),
        reasoning: `Strong match in ${user.skills.length > 0 ? user.skills[0].name : 'skills'} and interests.`,
        learningIntent: user.skills.some(s => s.mode === 'Learner')
    }))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export default async function ProjectDashboardPage({ params }: { params: { id: string } }) {
  const project = mockProjects.find(p => p.id === params.id) || mockProjects[0];
  const recommendedCandidates = await getRecommendedCandidates(project);
  const finalTeam = mockUsers.filter(u => project.team.some(t => t.userId === u.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">{project.title}</h1>
        <p className="text-muted-foreground">Manage your project and build your team.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Sparkles className="text-primary w-5 h-5" />
                        AI Recommended Candidates
                    </CardTitle>
                    <CardDescription>
                        Top candidates suggested by our AI based on your project requirements.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {recommendedCandidates.length > 0 ? recommendedCandidates.map(candidate => (
                        <Card key={candidate.user.id} className="hover:bg-muted/50">
                            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={candidate.user.avatarUrl} />
                                    <AvatarFallback>{candidate.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <h4 className="font-semibold">{candidate.user.name}</h4>
                                    <p className="text-sm text-muted-foreground">{candidate.user.experienceLevel}</p>
                                     <p className="text-sm text-muted-foreground mt-1">{candidate.reasoning}</p>
                                      {candidate.learningIntent && <Badge variant="outline" className="mt-2">Wants to learn</Badge>}
                                </div>
                                <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-2">
                                    <div className="w-32 text-right">
                                        <span className="text-sm font-medium">Match: {candidate.matchPercentage}%</span>
                                        <Progress value={candidate.matchPercentage} className="h-2" />
                                    </div>
                                    <Button size="sm"><Check className="mr-2 h-4 w-4"/> Accept</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="text-center py-8">
                             <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No candidates yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Our AI is searching for the best matches. Check back soon!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Users className="w-5 h-5" /> Final Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {finalTeam.length > 0 ? finalTeam.map(member => {
                        const teamInfo = project.team.find(t => t.userId === member.id);
                        return (
                            <div key={member.id} className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={member.avatarUrl} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{teamInfo?.role}</p>
                                </div>
                                 {teamInfo?.isLearner && <Badge variant="secondary" className="ml-auto">Learner</Badge>}
                            </div>
                        )
                    }) : (
                        <p className="text-sm text-muted-foreground">Your team is empty. Accept candidates to add them.</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" variant="outline" asChild>
                        <Link href={`/projects/${project.id}/collaborate`}>Go to Collaboration Space</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
