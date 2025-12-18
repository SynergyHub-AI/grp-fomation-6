'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Palette, Smartphone, Mail } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-headline text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account & Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* ACCOUNT TAB */}
        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5"/> Security</CardTitle>
              <CardDescription>Manage your password and security questions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between">
                  <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5"/> Email Notifications</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label className="flex flex-col space-y-1">
                  <span>Project Invites</span>
                  <span className="font-normal text-xs text-muted-foreground">Receive emails when you are invited to a project.</span>
                </Label>
                <Switch defaultChecked />
              </div>
              <Separator />
               <div className="flex items-center justify-between space-x-2">
                <Label className="flex flex-col space-y-1">
                  <span>New Matches</span>
                  <span className="font-normal text-xs text-muted-foreground">Weekly summary of new AI project matches.</span>
                </Label>
                <Switch defaultChecked />
              </div>
              <Separator />
               <div className="flex items-center justify-between space-x-2">
                <Label className="flex flex-col space-y-1">
                  <span>Marketing</span>
                  <span className="font-normal text-xs text-muted-foreground">Receive updates about new features.</span>
                </Label>
                <Switch />
              </div>
            </CardContent>
             <CardFooter className="border-t bg-muted/50 px-6 py-4">
              <Button variant="outline">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
         <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5"/> Theme Preferences</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Coming soon (System default active)
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}