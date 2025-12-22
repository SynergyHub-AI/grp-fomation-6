"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, X, Github, Linkedin, Globe, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Logo } from '@/components/logo';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: ""
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.email) {
      setUserEmail(session.user.email);
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { email } = JSON.parse(storedUser);
      setUserEmail(email);
    } else {
      router.push("/login"); // Force login if no email found
    }
  }, [session, status, router]);

  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          jobTitle: formData.jobTitle,
          bio: formData.bio,
          skills: skills,
          socialLinks: {
            github: formData.github,
            linkedin: formData.linkedin,
            portfolio: formData.portfolio
          }
        }),
      });

      if (res.ok) {
        const manualUpdate = {
          hasCompletedOnboarding: true,
          email: userEmail,
          name: session?.user?.name || "User"
        };
        localStorage.setItem("user", JSON.stringify(manualUpdate));

        toast.success("Profile Setup Complete! 🎉", {
          description: "Welcome to your new workspace."
        });

        window.location.href = "/dashboard";
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Connection Error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[100px] rounded-full opacity-40 pointer-events-none" />

      <Card className="w-full max-w-2xl shadow-2xl border-border/50 bg-card/50 backdrop-blur-xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4"><Logo /></div>
          <CardTitle className="font-headline text-3xl font-bold">Welcome Aboard!</CardTitle>
          <CardDescription className="text-base">Let's verify your profile and get you ready for collaboration.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">

            {/* Professional Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Professional Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title / Role</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Full Stack Developer"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Core Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add skill..."
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="bg-background/50 border-border/50 focus:border-primary/50"
                    />
                    <Button type="button" size="icon" variant="outline" onClick={addSkill} className="shrink-0"><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="pl-3 pr-2 py-1 flex items-center gap-1">
                    {skill} <X className="w-3 h-3 cursor-pointer opacity-50 hover:opacity-100" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
                {skills.length === 0 && <span className="text-xs text-muted-foreground italic">No skills added yet.</span>}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                placeholder="Briefly describe your experience and what sort of projects you are looking for..."
                className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50 resize-y"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Social Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</Label>
                  <Input placeholder="username" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className="bg-background/50 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-500" /> LinkedIn</Label>
                  <Input placeholder="username" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="bg-background/50 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-green-500" /> Portfolio</Label>
                  <Input placeholder="https://..." value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} className="bg-background/50 border-border/50" />
                </div>
              </div>
            </div>

          </CardContent>

          <CardFooter>
            <Button className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing...
                </>
              ) : (
                <>Complete Setup <Sparkles className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}