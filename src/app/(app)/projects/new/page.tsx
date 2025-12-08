'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState('');

    const addSkill = () => {
        if (currentSkill && !skills.includes(currentSkill)) {
            setSkills([...skills, currentSkill]);
            setCurrentSkill('');
        }
    };
    
    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        toast({
            title: "Project Created!",
            description: "Your project is now live and candidates can be recommended.",
        });
        router.push('/projects/proj-1/dashboard'); // Redirect to a mock dashboard
    }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <Button variant="ghost" asChild>
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Link>
        </Button>
      
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-3xl">Create a New Project</CardTitle>
                <CardDescription>Fill out the details below to get your project started and find your team.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" placeholder="e.g., AI-Powered Code Reviewer" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea id="description" placeholder="Describe your project's goals, features, and impact." required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label htmlFor="type">Project Type</Label>
                    <Select required>
                        <SelectTrigger id="type">
                        <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Hackathon">Hackathon</SelectItem>
                        <SelectItem value="NGO">NGO</SelectItem>
                        <SelectItem value="Startup">Startup</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="time-commitment">Time Commitment</Label>
                    <Select required>
                        <SelectTrigger id="time-commitment">
                        <SelectValue placeholder="Select commitment" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label htmlFor="team-size">Team Size</Label>
                    <Input id="team-size" type="number" placeholder="e.g., 5" required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input id="location" placeholder="e.g., Remote" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Required Skills</Label>
                    <div className="flex items-center gap-2">
                        <Input 
                            id="skill-input" 
                            placeholder="Add a skill and press Enter" 
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSkill();
                                }
                            }}
                        />
                        <Button type="button" variant="outline" onClick={addSkill}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                            {skill}
                            <button type="button" className="ml-2" onClick={() => removeSkill(skill)}>
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <Label>Required Roles</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Team Lead', 'Developer', 'Designer', 'Operations'].map((role) => (
                            <div key={role} className="flex items-center space-x-2">
                                <Checkbox id={`role-${role}`} />
                                <Label htmlFor={`role-${role}`} className="font-normal">{role}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="items-top flex space-x-2 rounded-md border p-4">
                    <Checkbox id="autofill" />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="autofill">Auto-fill Team (Optional)</Label>
                        <p className="text-sm text-muted-foreground">
                        Enable AI to automatically suggest and add members to fill missing expert roles.
                        </p>
                    </div>
                </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full md:w-auto">Create Project</Button>
                </CardFooter>
            </Card>
        </form>
    </div>
  );
}
