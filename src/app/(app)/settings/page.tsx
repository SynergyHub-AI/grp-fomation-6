'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle, Link as LinkIcon, AlertTriangle, Book, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { demoUser } from '@/lib/data';
import type { Skill } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const { toast } = useToast();
    const [user, setUser] = useState(demoUser);
    const [skills, setSkills] = useState<Skill[]>(demoUser.skills);
    const [currentSkill, setCurrentSkill] = useState('');

    const addSkill = () => {
        if (currentSkill && !skills.find(s => s.name.toLowerCase() === currentSkill.toLowerCase())) {
            const newSkill: Skill = {
                id: `skill-${Date.now()}`,
                name: currentSkill,
                level: 'Beginner',
                mode: 'Learner',
                verification: { type: 'Self-Declared' }
            };
            setSkills([...skills, newSkill]);
            setCurrentSkill('');
        }
    };

    const removeSkill = (skillId: string) => {
        setSkills(skills.filter(s => s.id !== skillId));
    };

    const handleUpdateSkill = (skillId: string, field: keyof Skill, value: any) => {
        setSkills(skills.map(s => s.id === skillId ? { ...s, [field]: value } : s));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    };

    return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <div>
            <h1 className="font-headline text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and profile information.</p>
        </div>

        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email} disabled />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience Level</Label>
                            <Select defaultValue={user.experienceLevel}>
                                <SelectTrigger>
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availability">Availability</Label>
                             <Select defaultValue={user.availability}>
                                <SelectTrigger>
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Your Bio</Label>
                        <Textarea id="bio" defaultValue={user.bio} />
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline">Manage Skills</CardTitle>
                    <CardDescription>Add, remove, or edit your skills and how you want to apply them.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="flex gap-2">
                        <Input 
                            placeholder="Add a new skill..."
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button type="button" onClick={addSkill}><PlusCircle className="mr-2 h-4 w-4"/>Add Skill</Button>
                    </div>
                    <div className="space-y-4">
                        {skills.map(skill => (
                            <div key={skill.id} className="p-4 border rounded-lg space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-lg">{skill.name}</h4>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(skill.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <Label className="text-sm">Proficiency</Label>
                                         <Select value={skill.level} onValueChange={(value) => handleUpdateSkill(skill.id, 'level', value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between mt-5 p-3 rounded-md bg-muted">
                                        <Label className="flex items-center gap-2"><Book className="h-4 w-4" /> Learn</Label>
                                        <Switch checked={skill.mode === 'Expert'} onCheckedChange={(checked) => handleUpdateSkill(skill.id, 'mode', checked ? 'Expert' : 'Learner')} />
                                        <Label className="flex items-center gap-2">Contribute <Award className="h-4 w-4" /></Label>
                                    </div>
                                </div>
                                <div>
                                    <Label>Verification</Label>
                                     <div className="flex items-center gap-2 mt-1">
                                        <Input 
                                            placeholder="https://github.com/your-repo"
                                            defaultValue={skill.verification.url}
                                            onChange={(e) => handleUpdateSkill(skill.id, 'verification', { type: e.target.value ? 'Link' : 'Self-Declared', url: e.target.value })}
                                        />
                                        {skill.verification.type === 'Link' ? (
                                            <Badge variant="default" className="whitespace-nowrap"><LinkIcon className="mr-1 h-3 w-3"/> Verified</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="whitespace-nowrap"><AlertTriangle className="mr-1 h-3 w-3"/> Self-Declared</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

             <div className="mt-8 flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    </div>
  );
}
