'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  const [skills, setSkills] = useState<{name: string, level: string, mode: string}[]>([]);
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4 py-12">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">Create Your Profile</CardTitle>
          <CardDescription>Tell us about yourself to get matched with the perfect projects.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Alex Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="bio">Your Bio</Label>
              <Textarea id="bio" placeholder="Full-stack developer with a passion for..." />
            </div>
          <div className="space-y-2">
            <Label>Your Skills</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g., React, Figma" 
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button type="button" onClick={addSkill} variant="outline" size="icon">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map(skill => (
                <Badge key={skill.name} variant="secondary" className="flex items-center gap-1 text-sm py-1">
                  {skill.name}
                  <button onClick={() => removeSkill(skill.name)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
             <Link href="/dashboard">Create Account & Go to Dashboard</Link>
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
