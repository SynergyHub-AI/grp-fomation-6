'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Palette, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [preferences, setPreferences] = useState({
    projectInvites: true,
    newMatches: true,
    marketing: false
  });

  // Fetch initial preferences
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id || parsedUser._id;

      try {
        const res = await fetch("/api/users/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        if (data.user && data.user.preferences) {
          setPreferences(data.user.preferences);
        }
      } catch (error) {
        console.error("Failed to load preferences", error);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Password updated successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) throw new Error("Failed to save preferences");
      toast.success("Preferences saved");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateAccount = async () => {
    if (!confirm("Are you sure you want to deactivate your account? You can reactivate it by logging in again.")) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'deactivate' })
      });
      if (!res.ok) throw new Error("Failed to deactivate");

      toast.success("Account deactivated. Logging out...");
      setTimeout(() => signOut({ callbackUrl: "/" }), 2000);
    } catch (error) {
      toast.error("Failed to deactivate account");
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    const confirmation = prompt("Type 'DELETE' to permanently delete your account. This cannot be undone.");
    if (confirmation !== "DELETE") return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/settings", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Account deleted. Goodbye.");
      setTimeout(() => signOut({ callbackUrl: "/" }), 2000);
    } catch (error) {
      toast.error("Failed to delete account");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account preferences, notifications, and security.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-muted/50 p-1">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* ACCOUNT TAB */}
        <TabsContent value="account" className="mt-8 space-y-6">
          <Card className="border-border/40 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Security & Login</CardTitle>
              <CardDescription>Update your password and secure your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="bg-background/50 border-input/50"
                  />
                </div>
              </div>
              <Separator className="bg-border/50" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="bg-background/50 border-input/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="bg-background/50 border-input/50"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/40 bg-muted/20 px-6 py-4 flex justify-end">
              <Button onClick={updatePassword} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Danger Zone</CardTitle>
              <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-yellow-200 dark:border-yellow-900/50 rounded-lg bg-background/50">
                <div>
                  <p className="font-semibold text-foreground">Deactivate Account</p>
                  <p className="text-sm text-muted-foreground">Temporarily disable your account. You can reactivate it anytime.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={deactivateAccount}
                  disabled={isLoading}
                  className="border-yellow-200 dark:border-yellow-900 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500"
                >
                  Deactivate
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-background/50">
                <div>
                  <p className="font-semibold text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently remove your account and all associated data.</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={deleteAccount}
                  disabled={isLoading}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="mt-8">
          <Card className="border-border/40 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Email Preferences</CardTitle>
              <CardDescription>Choose exactly what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                <Label className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium">Project Invites</span>
                  <span className="font-normal text-sm text-muted-foreground">Receive emails when you are invited to a project.</span>
                </Label>
                <Switch
                  checked={preferences.projectInvites}
                  onCheckedChange={() => handlePreferenceChange('projectInvites')}
                />
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                <Label className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium">New Matches</span>
                  <span className="font-normal text-sm text-muted-foreground">Weekly summary of new AI project matches.</span>
                </Label>
                <Switch
                  checked={preferences.newMatches}
                  onCheckedChange={() => handlePreferenceChange('newMatches')}
                />
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                <Label className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium">Marketing & Tips</span>
                  <span className="font-normal text-sm text-muted-foreground">Receive updates about new features and best practices.</span>
                </Label>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={() => handlePreferenceChange('marketing')}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/40 bg-muted/20 px-6 py-4 flex justify-end">
              <Button onClick={savePreferences} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="mt-8">
          <Card className="border-border/40 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Theme Preferences</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Interface Theme</Label>
                  <span className="text-sm text-muted-foreground">Managed via the header toggle</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 rounded-lg border-2 border-primary bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                    <span className="text-xs text-white z-10 font-bold">Dark (Active)</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-zinc-900/50" />
                  </div>
                  <div className="h-24 rounded-lg border border-border bg-white flex items-center justify-center opacity-50 cursor-not-allowed">
                    <span className="text-xs text-black">Light</span>
                  </div>
                  <div className="h-24 rounded-lg border border-border bg-gradient-to-br from-white to-zinc-950 flex items-center justify-center opacity-50 cursor-not-allowed">
                    <span className="text-xs text-zinc-500 font-bold">System</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}