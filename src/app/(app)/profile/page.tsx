"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Award, Book, Loader2 } from 'lucide-react';
import { demoUser } from '@/lib/data';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(demoUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check LocalStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    const currentUserId = parsedUser.id || parsedUser._id;
    
    setUser({ ...demoUser, ...parsedUser });

    // 2. Fetch Latest Profile
    const fetchLatestProfile = async () => {
        try {
            const res = await fetch("/api/users/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId }),
            });
            const data = await res.json();
            
            if (data.user) {
                setUser(prev => ({ ...prev, ...data.user }));
                localStorage.setItem("user", JSON.stringify(data.user));
            }
        } catch (error) {
            console.error("Failed to sync profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (currentUserId) {
        fetchLatestProfile();
    }
  }, [router]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline flex items-center gap-2"><User className="h-5 w-5"/> Your Profile</CardTitle>
                <CardDescription>This is how others see you on the platform.</CardDescription>
            </div>
            {/* ✅ UPDATED: Links to /profile/edit */}
            <Button variant="outline" asChild>
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatarUrl} alt={user.name}/>
                    <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.experienceLevel || "Beginner"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
            </div>
            <p className="text-muted-foreground">{user.bio || "No bio added yet."}</p>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Award className="h-5 w-5"/> Your Skills</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="grid gap-4 md:grid-cols-2">
                {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold">{skill.name}</h4>
                                    <p className="text-sm text-muted-foreground">{skill.level}</p>
                                </div>
                                 <Badge variant="secondary">
                                    <Book className="mr-1 h-3 w-3" /> {skill.mode || "Learner"}
                                </Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground text-sm">No skills added yet. Go to Settings to add some.</p>
                )}
             </div>
        </CardContent>
      </Card>
    </div>
  );
}