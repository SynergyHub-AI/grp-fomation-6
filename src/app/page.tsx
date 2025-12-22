import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Check, Users, Zap, BrainCircuit, ArrowRight, Star, Shield, Rocket, Globe } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
const avatar1 = PlaceHolderImages.find((img) => img.id === 'avatar1')?.imageUrl || '';
const avatar2 = PlaceHolderImages.find((img) => img.id === 'avatar2')?.imageUrl || '';
const avatar3 = PlaceHolderImages.find((img) => img.id === 'avatar3')?.imageUrl || '';

export default function Home() {
  const features = [
    {
      title: 'AI-Powered Matching',
      description: 'Our smart algorithm connects you with the right projects and people based on your skills, interests, and learning goals.',
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Collaborative Workspaces',
      description: 'Each project gets a dedicated space with real-time chat, tasks, and file sharing to keep your team synced.',
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Skill Verification',
      description: 'Validate your expertise through peer reviews and project completions. Build a portfolio that stands out.',
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
  ];

  const testimonials = [
    {
      name: 'Alex Doe',
      role: 'Full Stack Developer',
      quote: 'SynergyHub helped me find a team for a weekend hackathon in just a few hours. The AI matching was spot on!',
      avatar: avatar1,
    },
    {
      name: 'Sarah Chen',
      role: 'Product Designer',
      quote: "I was looking to get into a social impact project, and I found the perfect one here. It's been an amazing experience.",
      avatar: avatar2,
    },
    {
      name: 'Marcus Johnson',
      role: 'CS Student',
      quote: "As a student, getting real-world experience is tough. SynergyHub made it possible for me to contribute to a startup's MVP.",
      avatar: avatar3,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <SiteHeader />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden border-b border-border/40">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[100px] rounded-full opacity-50 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="container relative mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 md:px-6 z-10">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm">
                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px] font-bold">NEW</Badge>
                <span className="text-xs font-medium">Smart AI Recommendations</span>
              </div>
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl lg:text-7xl leading-[1.1]">
                Build Faster with the <span className="text-primary">Perfect Team.</span>
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-muted-foreground text-lg md:text-xl leading-relaxed">
                SynergyHub connects skilled developers with innovative projects. Stop searching and start building the future together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                  <Link href="/signup">Start Building Free <Rocket className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm hover:bg-muted/50">
                  <Link href="#how-it-works">How it Works</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex -space-x-3">
                  {[avatar1, avatar2, avatar3].map((src, i) => (
                    <Avatar key={i} className="border-2 border-background w-8 h-8"><AvatarImage src={src} /><AvatarFallback>U</AvatarFallback></Avatar>
                  ))}
                </div>
                <p>Joined by 1,000+ creators</p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end relative">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={600}
                    height={400}
                    className="relative rounded-xl shadow-2xl border border-border/50 bg-background/50 backdrop-blur-xl"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-block text-primary font-bold tracking-wider uppercase text-xs mb-2">Features</div>
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to collaborate
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                We provide the tools to make team formation and project management seamless.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <Card key={i} className="border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="flex flex-col items-start p-8 space-y-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/30 -skew-y-3 transform scale-110 pointer-events-none" />

          <div className="container relative mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-16">
              From Idea to MVP in 3 Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

              <div className="flex flex-col items-center gap-4 relative">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-background border-4 border-secondary shadow-xl z-10 mb-4">
                  <span className="text-4xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-headline text-xl font-bold">Create Profile</h3>
                <p className="text-muted-foreground max-w-xs leading-relaxed">Showcase your skills, experience, and the type of projects you're interested in.</p>
              </div>

              <div className="flex flex-col items-center gap-4 relative">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-background border-4 border-secondary shadow-xl z-10 mb-4">
                  <span className="text-4xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-headline text-xl font-bold">Get Matched</h3>
                <p className="text-muted-foreground max-w-xs leading-relaxed">Our AI analyzes your profile to suggest the perfect teammates and opportunities.</p>
              </div>

              <div className="flex flex-col items-center gap-4 relative">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-background border-4 border-secondary shadow-xl z-10 mb-4">
                  <span className="text-4xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-headline text-xl font-bold">Start Building</h3>
                <p className="text-muted-foreground max-w-xs leading-relaxed">Launch your project workspace and collaborate in real-time with your new team.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Community Stories
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="border-border/50 bg-background/50 backdrop-blur-sm p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex gap-1 text-yellow-500 mb-2">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/30">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="container relative mx-auto text-center px-4 md:px-6">
            <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Ready to Launch Your Next Big Idea?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-xl mb-10 leading-relaxed">
              Join thousands of developers, designers, and innovators building the future on SynergyHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                <Link href="/signup">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground opacity-70">No credit card required • Free forever for individuals</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
