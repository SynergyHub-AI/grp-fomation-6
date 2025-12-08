import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Award, Book, GitBranch, Link as LinkIcon, AlertTriangle, User, Briefcase, Clock, Sparkles } from 'lucide-react';
import { demoUser, mockProjects, mockJoinRequests } from '@/lib/data';
import Link from 'next/link';

// AI-powered function (mocked for now)
const getRecommendedProjects = async () => {
    // In a real app, this would call the `recommendProjects` AI flow
    return mockProjects.map(p => ({
        project: p,
        matchPercentage: Math.floor(Math.random() * (95 - 70 + 1) + 70),
        role: Math.random() > 0.5 ? 'Expert' : 'Learner'
    }));
};

const NoMatchSuggestions = () => {
    const suggestions = [
        { name: "Devpost", url: "https://devpost.com" },
        { name: "Unstop", url: "https://unstop.com" },
        { name: "VolunteerMatch", url: "https://www.volunteermatch.org" },
        { name: "GitHub Open Source", url: "https://github.com/explore" },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="text-primary w-5 h-5"/>
                    Explore External Opportunities
                </CardTitle>
                <CardDescription>
                    No matches yet? Don't worry. Here are some other great platforms to check out.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {suggestions.map(s => (
                     <a href={s.url} target="_blank" rel="noopener noreferrer" key={s.name}>
                        <Card className="hover:bg-accent/10 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <span className="font-semibold">{s.name}</span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </CardContent>
        </Card>
    );
}

export default async function DashboardPage() {
  const recommendedProjects = await getRecommendedProjects();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome, {demoUser.name}!</h1>
        <p className="text-muted-foreground">Here&apos;s your personal mission control.</p>
      </div>

      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 sm:w-auto">
          <TabsTrigger value="projects">AI Matched Projects</TabsTrigger>
          <TabsTrigger value="profile">My Profile & Skills</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-6 mt-6">
            {recommendedProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recommendedProjects.map(({ project, matchPercentage, role }) => (
                    <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                        <CardTitle className="font-headline">{project.title}</CardTitle>
                        <CardDescription>{project.type} Project</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                            <div>
                                <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                    {project.requiredSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-4">
                             <div className="w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold">Match Score</span>
                                    <Badge variant={role === 'Expert' ? 'default' : 'outline'}>{role}</Badge>
                                </div>
                                <Progress value={matchPercentage} />
                                <span className="text-xs text-muted-foreground">{matchPercentage}% compatible with your profile</span>
                            </div>
                           
                            <Button className="w-full" asChild>
                                <Link href={`/projects/${project.id}`}>View & Join</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    ))}
                </div>
            ) : <NoMatchSuggestions />}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2"><User className="h-5 w-5"/> Your Profile</CardTitle>
                    <CardDescription>This is how others see you on the platform.</CardDescription>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/settings">Edit Profile</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={demoUser.avatarUrl} alt={demoUser.name}/>
                        <AvatarFallback>{demoUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-bold">{demoUser.name}</h3>
                        <p className="text-muted-foreground">{demoUser.experienceLevel}</p>
                    </div>
                </div>
                <p className="text-muted-foreground">{demoUser.bio}</p>
                <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4"/> Availability</h4>
                    <Badge variant="outline">{demoUser.availability}</Badge>
                </div>
                 <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4"/>Interests</h4>
                    <div className="flex flex-wrap gap-2">
                        {demoUser.interests.map(interest => <Badge key={interest}>{interest}</Badge>)}
                    </div>
                </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Award className="h-5 w-5"/> Your Skills</CardTitle>
                <CardDescription>Manage your skills and how you want to use them.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid gap-4 md:grid-cols-2">
                    {demoUser.skills.map(skill => (
                        <div key={skill.id} className="p-4 border rounded-lg space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold">{skill.name}</h4>
                                    <p className="text-sm text-muted-foreground">{skill.level}</p>
                                </div>
                                 <Badge variant={skill.mode === 'Expert' ? 'default' : 'secondary'}>
                                    {skill.mode === 'Expert' ? <Award className="mr-1 h-3 w-3" /> : <Book className="mr-1 h-3 w-3" />}
                                    {skill.mode}
                                </Badge>
                            </div>
                            {skill.verification.type === 'Link' ? (
                                <a href={skill.verification.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    <LinkIcon className="h-3 w-3"/> Verified by Link
                                </a>
                            ) : (
                                <p className="text-sm text-amber-600 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3"/> Self-Declared
                                </p>
                            )}
                        </div>
                    ))}
                 </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">My Join Requests</CardTitle>
              <CardDescription>Track the status of projects you&apos;ve applied to.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockJoinRequests.map(req => {
                    const project = mockProjects.find(p => p.id === req.projectId);
                    return (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{project?.title}</TableCell>
                        <TableCell>
                          <Badge variant={
                            req.status === 'Accepted' ? 'default' :
                            req.status === 'Pending' ? 'secondary' : 'destructive'
                          }>{req.status}</Badge>
                        </TableCell>
                        <TableCell>{req.timestamp.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" asChild>
                               <Link href={`/projects/${project?.id}`}>
                                View
                               </Link>
                           </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
