"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, UserPlus, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

export default function SearchProfilesPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to fetch users based on search query
  const searchUsers = async (searchTerm: string) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data.users || []);
      }
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        searchUsers(query);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8">
      {/* Header & Search Input */}
      <div className="flex flex-col gap-6 items-center text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Find Collaborators</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Connect with skilled developers for your next big project.
            Search by name, role, or skills.
          </p>
        </div>

        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Try searching 'React', 'Backend', or 'John'..."
              className="pl-12 h-14 text-lg rounded-full border-border/60 bg-background/80 backdrop-blur-xl shadow-lg focus-visible:ring-primary/50 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in zoom-in-95">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p className="text-lg">Scouring the network...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.map((user) => (
              <Card key={user._id} className="flex flex-col hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 hover:border-primary/50 group bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <Avatar className="h-16 w-16 border-2 border-border group-hover:border-primary transition-colors">
                    <AvatarImage src={user.image || user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <CardTitle className="text-lg truncate font-headline group-hover:text-primary transition-colors">{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 truncate text-sm mt-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {user.title || "Developer"}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10 leading-relaxed">
                    {user.bio || "Passionate developer looking for exciting projects."}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills?.slice(0, 4).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs font-normal bg-secondary/50 hover:bg-secondary">
                        {skill}
                      </Badge>
                    ))}
                    {(user.skills?.length || 0) > 4 && (
                      <Badge variant="outline" className="text-xs bg-transparent">+{user.skills.length - 4}</Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all" variant="outline" asChild>
                    <Link href={`/profile/${user._id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-3xl border border-dashed border-border/50 animate-in fade-in zoom-in-95">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <UserPlus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
            <p className="max-w-md mx-auto">
              We couldn't find anyone matching "{query}".
              Try searching for specific skills like <span className="text-foreground font-medium">React</span> or <span className="text-foreground font-medium">Design</span>.
            </p>
          </div>
        ) : (
          /* Initial Empty State */
          <div className="text-center py-24 text-muted-foreground animate-in fade-in zoom-in-95">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-50" />
              <Search className="relative h-16 w-16 opacity-20" />
            </div>
            <h2 className="text-xl font-medium mb-2">Start exploring</h2>
            <p className="text-lg opacity-70">Type something above to discover amazing talent.</p>
          </div>
        )}
      </div>
    </div>
  );
}