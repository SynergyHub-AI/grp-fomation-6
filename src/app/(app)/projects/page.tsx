"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, PlusCircle, Loader2, FolderKanban, Sparkles, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyProjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<any[]>([]);

  useEffect(() => {
    // 1. Get Logged In User
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    const currentUserId = user.id || user._id; // Get ID safely

    // 2. Fetch All Projects
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();

        if (data.projects) {
          const allProjects = data.projects;

          // ✅ ROBUST FILTER: Created by Me
          const myCreated = allProjects.filter((p: any) => {
            const ownerId = p.owner?._id || p.owner;
            return String(ownerId) === String(currentUserId);
          });
          setCreatedProjects(myCreated);

          // ✅ ROBUST FILTER: Joined Projects
          const myJoined = allProjects.filter((p: any) =>
            p.team && p.team.some((member: any) => {
              const memberId = member.user?._id || member.user;
              const ownerId = p.owner?._id || p.owner;
              return String(memberId) === String(currentUserId) &&
                String(ownerId) !== String(currentUserId);
            })
          );
          setJoinedProjects(myJoined);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="font-headline text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">My Projects</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Manage your innovations and collaborations.
          </p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Project
          </Link>
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-headline text-xl font-semibold text-foreground/90">
          <Sparkles className="h-5 w-5 text-yellow-500" /> Created by Me
        </h2>
        {createdProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {createdProjects.map((project) => (
              <ProjectCard key={project._id} project={project} isCreator />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/50 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FolderKanban className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No projects created yet</h3>
              <p className="text-muted-foreground max-w-sm">Start your journey by creating your first AI-powered project workspace.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/projects/new">Create Project</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="space-y-4 pt-4">
        <h2 className="flex items-center gap-2 font-headline text-xl font-semibold text-foreground/90">
          <Users className="h-5 w-5 text-blue-500" /> Joined Projects
        </h2>
        {joinedProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {joinedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border border-border/40 rounded-xl bg-card/30 gap-2 text-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-muted-foreground">You haven&apos;t joined any external projects yet.</p>
            <Button variant="link" asChild className="text-primary h-auto p-0">
              <Link href="/search">Find Projects to Join</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project, isCreator = false }: { project: any; isCreator?: boolean }) {
  // CLEANUP: Handle legacy descriptions that have metadata appended
  const cleanDescription = project.description.split('---')[0].trim();

  // PARSE LEGACY DATA: If structured fields are missing, try to extract from description
  let type = project.type;
  let commitment = project.timeCommitment;

  if (!type && project.description.includes('Type:')) {
    const match = project.description.match(/Type: (.*?)(\n|$|•)/);
    if (match) type = match[1].trim();
  }
  if (!commitment && project.description.includes('Commitment:')) {
    const match = project.description.match(/Commitment: (.*?)(\n|$|•)/);
    if (match) commitment = match[1].trim();
  }

  return (
    <Card className="flex flex-col group hover:shadow-xl hover:border-primary/50 transition-all duration-300 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm border-border/60">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <CardTitle className="font-headline text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">{project.title}</CardTitle>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {type && <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> {type}</span>}
              {commitment && <span className="flex items-center gap-1 opacity-70">| {commitment}</span>}
            </div>
          </div>
          <Badge variant={project.status === "Closed" ? "secondary" : "outline"} className="shrink-0 bg-background/50">
            {project.status || "Active"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {cleanDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.techStack?.slice(0, 3).map((tech: string) => (
            <Badge key={tech} variant="secondary" className="text-[10px] px-2 py-0 h-5 bg-primary/5 text-primary border-primary/10">
              {tech}
            </Badge>
          ))}
          {project.techStack?.length > 3 && (
            <span className="text-[10px] text-muted-foreground flex items-center">+{project.techStack.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <Users className="mr-1.5 h-3 w-3" />
            <span className="">{project.team ? project.team.length + 1 : 1} / {project.teamSize || project.description.match(/Team Size Goal: (\d+)/)?.[1] || 1} Members</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button asChild variant={isCreator ? "default" : "secondary"} className="w-full shadow-sm">
          <Link href={`/projects/${project._id}/collaborate`}>
            {isCreator ? "Manage Workspace" : "Open Workspace"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}