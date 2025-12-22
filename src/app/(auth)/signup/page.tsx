"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle, Loader2, Sparkles, User, Mail, Lock, Briefcase } from 'lucide-react';
import { Logo } from '@/components/logo';
import { toast } from "sonner";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    experienceLevel: '',
    bio: ''
  });

  const [skills, setSkills] = useState<{ name: string, level: string, mode: string }[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const addSkill = () => {
    if (currentSkill && !skills.find(s => s.name.toLowerCase() === currentSkill.toLowerCase())) {
      setSkills([...skills, { name: currentSkill, level: 'Beginner', mode: 'Learner' }]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.name !== skillName));
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, skills };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account Created! 🎉", {
          description: "Redirecting to login...",
          action: {
            label: "Login Now",
            onClick: () => router.push("/login"),
          },
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);

      } else {
        toast.error("Signup Failed", {
          description: data.error || "Please try again."
        });
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Connection Error", {
        description: "Something went wrong. Please check your connection."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4 py-12 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[100px] rounded-full opacity-40 pointer-events-none" />

      <Card className="w-full max-w-2xl shadow-2xl border-border/50 bg-card/50 backdrop-blur-xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <CardTitle className="font-headline text-3xl font-bold tracking-tight">Create Your Account</CardTitle>
          <CardDescription className="text-base">Join the SynergyHub community today.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Alex Doe"
                    required
                    className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    required
                    className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
                  <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="Intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="Advanced">Advanced (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Your Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a bit about yourself... (e.g. Full-stack developer passionate about AI)"
                className="min-h-[80px] bg-background/50 border-border/50 focus:border-primary/50 resize-y"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label>Your Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., React, Figma (Press Enter to add)"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} variant="outline" size="icon" className="shrink-0 border-border/50">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[38px] p-2 rounded-lg bg-muted/20 border border-dashed border-border/40">
                {skills.length === 0 && <span className="text-sm text-muted-foreground w-full text-center py-1">Type a skill and press Enter</span>}
                {skills.map(skill => (
                  <Badge key={skill.name} variant="secondary" className="flex items-center gap-1.5 text-sm py-1 bg-secondary/80 hover:bg-secondary">
                    {skill.name}
                    <button type="button" onClick={() => removeSkill(skill.name)} className="opacity-50 hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Account...
                </>
              ) : (
                <>Create Account <Sparkles className="ml-2 h-4 w-4" /></>
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            <GoogleLoginButton />

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline font-semibold text-primary hover:text-primary/80 transition-colors">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}