"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sparkles, Loader2, BrainCircuit, Send, Clock, CheckCircle, XCircle, Inbox, Check, X, Search, Activity, Users, Layout, Zap } from 'lucide-react';
import { demoUser } from '@/lib/data';
import Link from 'next/link';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ... NoMatchSuggestions Component ...
const NoMatchSuggestions = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-semibold mb-1">No Projects Found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
                Be the first to post a project or wait for others to join!
            </p>
            <Button asChild className="gap-2">
                <Link href="/projects/new"><Zap className="w-4 h-4" /> Create a Project</Link>
            </Button>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [user, setUser] = useState(demoUser);
    const [projects, setProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [myRequests, setMyRequests] = useState<any[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper
    const getShortDescription = (fullDesc: string) => {
        if (!fullDesc) return "No description provided.";
        const [mainText] = fullDesc.split('---');
        return mainText.trim();
    };

    // ✅ SEARCH FUNCTION
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === "") {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter(project =>
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.techStack?.some((tech: string) => tech.toLowerCase().includes(query))
            );
            setFilteredProjects(filtered);
        }
    };

    useEffect(() => {
        let currentUserId: string | null = null;
        let currentUserData: any = null;

        if (session?.user) {
            currentUserData = {
                // @ts-ignore
                id: session.user.id || session.user._id,
                name: session.user.name,
                email: session.user.email,
                avatarUrl: session.user.image,
                // @ts-ignore
                experienceLevel: session.user.experienceLevel || "Beginner",
                // @ts-ignore
                hasCompletedOnboarding: session.user.hasCompletedOnboarding
            };
        } else {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                currentUserData = JSON.parse(storedUser);
            }
        }

        if (currentUserData) {
            if (currentUserData.hasCompletedOnboarding === false) {
                router.push("/onboarding");
                return;
            }
            localStorage.setItem("user", JSON.stringify(currentUserData));
            setUser({ ...demoUser, ...currentUserData });
            currentUserId = currentUserData.id || currentUserData._id;
        } else if (session === null) {
            router.push("/login");
            return;
        }

        const fetchAIProjects = async (id: string) => {
            try {
                const res = await fetch("/api/ai/match", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: id }),
                });
                const data = await res.json();
                if (data.projects) {
                    setProjects(data.projects);
                    setFilteredProjects(data.projects);
                }
            } catch (error) { console.error(error); }
        };

        const fetchMyRequests = async (id: string) => {
            try {
                const res = await fetch("/api/requests/user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: id }),
                });
                const data = await res.json();
                if (data.requests) setMyRequests(data.requests);
            } catch (error) { console.error(error); }
        };

        const fetchIncomingRequests = async (id: string) => {
            try {
                const res = await fetch("/api/requests/owner", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: id }),
                });
                const data = await res.json();
                if (data.requests) setIncomingRequests(data.requests);
            } catch (error) { console.error(error); }
        };

        if (currentUserId) {
            Promise.all([
                fetchAIProjects(currentUserId),
                fetchMyRequests(currentUserId),
                fetchIncomingRequests(currentUserId)
            ]).finally(() => setLoading(false));
        }
    }, [router, session]);

    const handleRequestAction = async (requestId: string, status: 'accepted' | 'rejected') => {
        try {
            const res = await fetch("/api/requests", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, status }),
            });

            if (res.ok) {
                setIncomingRequests(prev => prev.filter(r => r._id !== requestId));
                toast.success(`Request ${status}`);
            } else {
                toast.error("Failed to update request");
            }
        } catch (error) {
            console.error("Action failed", error);
            toast.error("Connection error");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted': return <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 hover:bg-green-500/25 border-0"><CheckCircle className="w-3 h-3 mr-1" /> Accepted</Badge>;
            case 'rejected': return <Badge variant="destructive" className="bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 border-0"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            default: return <Badge variant="secondary" className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/25 border-0"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin text-primary" /> <span className="text-lg font-medium">Loading Dashboard...</span></div>;

    return (
        <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground mt-1">Welcome back, {user.name?.split(' ')[0] || 'User'}. Here's what's happening.</p>
                </div>
                <Button asChild className="hidden sm:flex">
                    <Link href="/projects/new">Post New Project</Link>
                </Button>
            </div>

            {/* METRICS GRID */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                        <BrainCircuit className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projects.length}</div>
                        <p className="text-xs text-muted-foreground">AI-recommended projects</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myRequests.filter(r => r.status === 'pending').length}</div>
                        <p className="text-xs text-muted-foreground">Applications sent by you</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inbox</CardTitle>
                        <Inbox className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{incomingRequests.length}</div>
                        <p className="text-xs text-muted-foreground">Incoming applications</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Layout className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Projects managed by you</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="projects" className="space-y-6">

                {/* TAB LIST + SEARCH BAR LAYOUT */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-4">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><BrainCircuit className="h-4 w-4" /> Recommended</TabsTrigger>
                        <TabsTrigger value="requests" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Send className="h-4 w-4" /> Applications ({myRequests.length})</TabsTrigger>
                        <TabsTrigger value="inbox" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Inbox className="h-4 w-4" /> Inbox
                            {incomingRequests.length > 0 && <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary/20 text-primary border-0 shadow-none hover:bg-primary/20">{incomingRequests.length}</Badge>}
                        </TabsTrigger>
                    </TabsList>

                    {/* SEARCH BAR */}
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            type="search"
                            placeholder="Search projects..."
                            className="pl-9 bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-full"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* === AI PROJECTS TAB === */}
                <TabsContent value="projects" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
                    {filteredProjects.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.map((project, index) => (
                                <Card key={project._id || index} className="flex flex-col border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="font-headline text-lg line-clamp-1 group-hover:text-primary transition-colors">{project.title}</CardTitle>
                                            <Badge variant="outline" className="shrink-0">{project.techStack?.[0] || "Tech"}</Badge>
                                        </div>
                                        <CardDescription>by <span className="font-medium text-foreground">{project.owner?.name}</span></CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-grow pb-4">
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px] leading-relaxed">
                                            {getShortDescription(project.description)}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.techStack?.slice(0, 3).map((t: any, i: number) => <Badge key={i} variant="secondary" className="text-xs font-normal">{t}</Badge>)}
                                            {(project.techStack?.length || 0) > 3 && <Badge variant="secondary" className="text-xs font-normal">+{project.techStack.length - 3}</Badge>}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0">
                                        <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-0" variant="outline" asChild>
                                            <Link href={`/projects/${project._id}/collaborate`}>View Project</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        searchQuery ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <p className="text-lg">No projects match <span className="font-medium text-foreground">"{searchQuery}"</span></p>
                                <Button variant="link" onClick={() => { setSearchQuery(""); setFilteredProjects(projects) }} className="mt-2">Clear Search</Button>
                            </div>
                        ) : <NoMatchSuggestions />
                    )}
                </TabsContent>

                {/* === OUTGOING REQUESTS TAB === */}
                <TabsContent value="requests" className="mt-4 animate-in fade-in-50 zoom-in-95 duration-300">
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Send className="h-5 w-5" /> Sent Applications</CardTitle>
                            <CardDescription>Track the status of your project applications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {myRequests.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>You haven't applied to any projects yet.</p>
                                    <Button variant="link" asChild><Link href="/projects/new">Find a project</Link></Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-muted/50">
                                            <TableHead>Project</TableHead>
                                            <TableHead>Date Sent</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myRequests.map((req) => (
                                            <TableRow key={req._id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{req.project?.title}</TableCell>
                                                <TableCell className="text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>{getStatusBadge(req.status)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* === INCOMING REQUESTS TAB === */}
                <TabsContent value="inbox" className="mt-4 animate-in fade-in-50 zoom-in-95 duration-300">
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Inbox className="h-5 w-5" /> Incoming Requests
                            </CardTitle>
                            <CardDescription>Review developers who want to join your team.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {incomingRequests.length > 0 ? (
                                <div className="space-y-4">
                                    {incomingRequests.map((req) => (
                                        <div key={req._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20 hover:border-primary/30 transition-all gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {req.applicant?.name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold text-sm">{req.applicant?.name || "Unknown User"}</h4>
                                                        <Badge variant="outline" className="text-[10px] h-5">{req.applicant?.experienceLevel || "N/A"}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-0.5">wants to join <span className="font-medium text-foreground">{req.project?.title}</span></p>
                                                    {req.message && <p className="text-xs text-muted-foreground mt-2 bg-background p-2 rounded border border-border/50 italic">"{req.message}"</p>}
                                                </div>
                                            </div>

                                            <div className="flexItems-center gap-2 self-end sm:self-center">
                                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9" onClick={() => handleRequestAction(req._id, 'rejected')}>
                                                    <X className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                                <Button size="sm" className="h-9" onClick={() => handleRequestAction(req._id, 'accepted')}>
                                                    <Check className="h-4 w-4 mr-1" /> Accept
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Inbox className="h-6 w-6 opacity-30" />
                                    </div>
                                    <p>No pending requests.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}