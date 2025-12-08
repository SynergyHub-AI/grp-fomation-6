import { mockProjects, mockUsers, demoUser } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Book, Users, MessageSquare, Award, ClipboardList } from 'lucide-react';

export default function CollaboratePage({ params }: { params: { id: string } }) {
  const project = mockProjects.find(p => p.id === params.id) || mockProjects[0];
  const teamMembers = mockUsers.filter(u => project.team.some(t => t.userId === u.id));
  const otherMembers = teamMembers.filter(m => m.id !== demoUser.id);
  
  const requirements = [
    { title: "Problem Statement", content: "Users need a way to find and form teams for projects efficiently, balancing skills and learning goals." },
    { title: "Goals", content: "1. Create an AI-driven matching system. 2. Foster collaboration with an in-app workspace. 3. Ensure a balanced ecosystem of creators and joiners." },
    { title: "Tech Stack", content: "Next.js, Tailwind CSS, Firebase (Auth, Firestore), Genkit AI." },
    { title: "Deliverables", content: "A full-stack web application with the 4 core modules: Landing Page, User Dashboard, Project Dashboard, and Collaboration Space." },
    { title: "Timeline", content: "Phase 1 (UI/UX & Core Structure): 1 week. Phase 2 (Backend & AI Integration): 2 weeks. Phase 3 (Testing & Deployment): 1 week." }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Collaboration: {project.title}</h1>
        <p className="text-muted-foreground">Your team's dedicated workspace.</p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <Tabs defaultValue="chat" className="w-full">
            <TabsList>
                <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2"/>Team Chat</TabsTrigger>
                <TabsTrigger value="board"><ClipboardList className="w-4 h-4 mr-2"/>Project Board</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
                 <Card className="h-[600px] flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline">Team Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-4">
                                {otherMembers.map(member => (
                                    <div key={member.id} className="flex items-start gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member.avatarUrl} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="rounded-lg bg-muted p-3 max-w-[75%]">
                                            <p className="text-sm font-semibold">{member.name}</p>
                                            <p className="text-sm">Welcome to the team! Excited to get started.</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3 justify-end">
                                    <div className="rounded-lg bg-primary text-primary-foreground p-3 max-w-[75%]">
                                        <p className="text-sm">Great to have you all! Let's build something amazing.</p>
                                    </div>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={demoUser.avatarUrl} />
                                        <AvatarFallback>{demoUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="pt-4 border-t">
                        <div className="flex w-full items-center space-x-2">
                            <Input placeholder="Type a message..." />
                            <Button><Send className="h-4 w-4" /></Button>
                        </div>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="board">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Project Requirements Board</CardTitle>
                        <CardDescription>An editable board for your team to align on project goals.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {requirements.map(req => (
                           <div key={req.title}>
                                <h3 className="font-semibold">{req.title}</h3>
                                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md mt-1">{req.content}</p>
                           </div>
                       ))}
                    </CardContent>
                </Card>
            </TabsContent>
           </Tabs>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Users className="w-5 h-5"/> Team Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {teamMembers.map(member => {
                        const teamInfo = project.team.find(t => t.userId === member.id);
                        return (
                            <div key={member.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                                <Avatar>
                                    <AvatarImage src={member.avatarUrl} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{teamInfo?.role}</p>
                                </div>
                                {teamInfo?.isLearner ? 
                                    <Badge variant="secondary"><Book className="mr-1 h-3 w-3"/>Learner</Badge> : 
                                    <Badge variant="default"><Award className="mr-1 h-3 w-3"/>Expert</Badge>
                                }
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
