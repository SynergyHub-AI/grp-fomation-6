import Link from "next/link";
import { mockProjects, demoUser } from "@/lib/data";
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
import { Users, PlusCircle } from "lucide-react";

export default function MyProjectsPage() {
  const createdProjects = mockProjects.filter(
    (p) => p.creatorId === demoUser.id
  );
  const joinedProjects = mockProjects.filter((p) =>
    p.team.some((member) => member.userId === demoUser.id && p.creatorId !== demoUser.id)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground">
            All projects you have created or joined.
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </div>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">
          Created by Me
        </h2>
        {createdProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {createdProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isCreator />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven&apos;t created any projects yet.</p>
        )}
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">
          Joined Projects
        </h2>
        {joinedProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {joinedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven&apos;t joined any projects yet.</p>
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project, isCreator = false }: { project: any; isCreator?: boolean }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">{project.title}</CardTitle>
        <CardDescription>{project.type}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{project.team.length} / {project.teamSize} members</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant={project.status === "Active" ? "default" : "secondary"}>
          {project.status}
        </Badge>
        <Button asChild variant="secondary" size="sm">
          <Link href={isCreator ? `/projects/${project.id}/dashboard` : `/projects/${project.id}/collaborate`}>
            {isCreator ? "Manage" : "Collaborate"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
