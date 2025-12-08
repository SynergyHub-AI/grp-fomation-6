import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/">
          <Logo className="text-primary-foreground" />
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/signup">Create Profile</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
