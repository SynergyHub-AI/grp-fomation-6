'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from '@/components/logo';
import {
  LayoutDashboard,
  FolderKanban,
  FilePlus2,
  Settings,
  LogOut,
  ArrowLeft,
  Search,
  User,
  ChevronsUpDown,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import NotificationBell from '@/components/ui/NotificationBell';

// Fallback data
import { demoUser } from '@/lib/data';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  const { data: session } = useSession();

  // Normalize user data
  const user = {
    name: session?.user?.name || demoUser.name,
    email: session?.user?.email || demoUser.email,
    avatar: session?.user?.image || demoUser.avatarUrl,
  };

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    // Redirect to onboarding if not completed
    if (session?.user && (session.user as any).hasCompletedOnboarding === false) {
      router.push("/onboarding");
    }
  }, [session, router]);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    await signOut({ callbackUrl: "/" });
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/search', label: 'Search Profiles', icon: Search },
    { href: '/projects', label: 'My Projects', icon: FolderKanban },
    { href: '/projects/new', label: 'Create Project', icon: FilePlus2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const rootPages = ['/dashboard', '/projects', '/settings', '/profile', '/search'];
  const showBackButton = !rootPages.includes(pathname);

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/40 bg-sidebar/60 backdrop-blur-xl">
        <SidebarHeader className="border-b border-border/40 px-4 py-4">
          <Logo />
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href} className="mb-1">
                    <Link href={item.href}>
                      <SidebarMenuButton
                        isActive={isActive(item.href)}
                        tooltip={item.label}
                        className={`transition-all duration-200 px-4 py-3 h-auto ${isActive(item.href) ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                      >
                        <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm">{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border/40">
          <SidebarMenu>
            <SidebarMenuItem>
              {isMounted ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-9 w-9 rounded-lg border border-border/50">
                        <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-medium">
                          {user.name ? user.name.charAt(0) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-border/40 bg-background/95 backdrop-blur-xl"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
                          <AvatarFallback className="rounded-lg">
                            {user.name ? user.name.charAt(0) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{user.name}</span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SidebarMenuButton size="lg" className="animate-pulse">
                  <div className="h-8 w-8 rounded-lg bg-muted" />
                  <div className="grid flex-1 gap-1 ml-2">
                    <div className="h-3 w-16 rounded bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                  </div>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="flex h-16 items-center gap-4 border-b border-border/40 bg-background/60 backdrop-blur-md px-4 md:px-6 sticky top-0 z-30 transition-all">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />

          <div className="flex-1" />

          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 pl-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}

          <div className="flex items-center gap-3">
            <ModeToggle />
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in-0 duration-500 slide-in-from-bottom-2">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
