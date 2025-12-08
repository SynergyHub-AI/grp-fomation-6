import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CheckCircle, Users, Zap, BrainCircuit } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

export default function Home() {
  const steps = [
    {
      title: '1. Create Profile',
      description: 'Showcase your skills, interests, and what you want to learn. Our AI builds your collaboration persona.',
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      title: '2. Post or Join Projects',
      description: 'Launch your own project or discover opportunities perfectly matched to your profile and goals.',
      icon: <Zap className="h-10 w-10 text-primary" />,
    },
    {
      title: '3. Collaborate & Grow',
      description: 'Join your new team in a dedicated workspace with integrated tools to bring your ideas to life.',
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    },
  ];

  const targetAudiences = [
    { name: 'Hackathons', description: 'Find a team with the right skills to build a winning project under pressure.' },
    { name: 'NGOs', description: 'Assemble passionate volunteers for social causes and make a real-world impact.' },
    { name: 'Startups', description: 'Build your MVP with a lean, skilled team matched by AI for synergy and expertise.' },
    { name: 'Social Work', description: 'Collaborate on community projects that matter with like-minded individuals.' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="absolute inset-0 h-full w-full object-cover object-center -z-10 brightness-50"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="container mx-auto px-4 md:px-6 text-center text-primary-foreground">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build What Matters, Together.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl">
              SynergyHub AI is where skilled contributors and motivated learners unite to build real-world projects. Find your team, your project, and your purpose.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="font-headline bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/signup">Create Your Profile</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="font-headline">
                <Link href="/dashboard">Explore Projects</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                A Smarter Way to Collaborate
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                Our AI-driven platform makes team formation effortless.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.title} className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="items-center">
                    {step.icon}
                    <CardTitle className="font-headline mt-4">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="audiences" className="w-full py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                For Every Visionary & Doer
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                Find your community and build something amazing, no matter your field.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {targetAudiences.map((audience) => (
                <div key={audience.name} className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary mt-1" />
                  <div>
                    <h3 className="font-headline text-lg font-semibold">{audience.name}</h3>
                    <p className="text-muted-foreground">{audience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
