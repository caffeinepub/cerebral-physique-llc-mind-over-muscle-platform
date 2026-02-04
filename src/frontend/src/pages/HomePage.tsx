import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Brain, Heart, Dumbbell, Wind } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function HomePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for signing up! We\'ll be in touch soon.');
      setEmail('');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with energetic gym background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background">
        <div 
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-45" 
          style={{ backgroundImage: 'url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/30 via-background/40 to-neon-purple/20" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Master the{' '}
              <span className="text-neon-purple">Mind-Muscle Connection</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Transform your training through disciplined mindset, intentional breathwork, and longevity-focused movement. Build a physique that reflects mental clarity and physical excellence.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-neon-purple text-white hover:bg-neon-purple/90"
                onClick={() => navigate({ to: '/programs' })}
              >
                7-Day Challenge
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                onClick={() => navigate({ to: '/programs' })}
              >
                Explore Audiobooks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-b border-border/40 bg-card py-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/breath-quote-overlay-transparent.dim_800x200.png)' }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-base font-semibold italic text-neon-purple md:text-lg">
            "Breath is the bridge between body and mind."
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="relative bg-card py-16 md:py-24">
        <div 
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/stretching-scene.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Core Principles
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40 bg-background">
              <CardHeader>
                <Brain className="mb-4 h-12 w-12 text-neon-purple" />
                <CardTitle>Mind-Muscle Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Develop conscious control over every contraction. Train with intention, not just intensity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-background">
              <CardHeader>
                <Wind className="mb-4 h-12 w-12 text-neon-purple" />
                <CardTitle>Breathwork Mastery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Harness the power of breath to optimize performance, recovery, and nervous system regulation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-background">
              <CardHeader>
                <Dumbbell className="mb-4 h-12 w-12 text-neon-purple" />
                <CardTitle>Functional Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build strength that serves you for life. Movement quality over ego-driven numbers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-background">
              <CardHeader>
                <Heart className="mb-4 h-12 w-12 text-neon-purple" />
                <CardTitle>Longevity Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Train for the long game. Sustainable practices that enhance health span, not just performance.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Visual */}
      <section className="relative py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                Science-Informed Training
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Every exercise, every breath, every rep is designed with purpose. Our approach combines cutting-edge exercise science with time-tested principles of mindful movement.
              </p>
              <p className="mb-8 text-lg text-muted-foreground">
                No gimmicks. No shortcuts. Just intelligent, disciplined training that builds both body and mind.
              </p>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/workout-library' })}
              >
                Explore Workout Library
              </Button>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-lg shadow-2xl">
                <img
                  src="/assets/generated/mind-muscle-visual.dim_800x600.jpg"
                  alt="mind-muscle visual"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-neon-purple/20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-y border-border/40 bg-card py-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/longevity-quote-overlay-transparent.dim_800x200.png)' }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-base font-semibold italic text-neon-purple md:text-lg">
            "Train for longevity, not just intensity."
          </p>
        </div>
      </section>

      {/* Email Signup */}
      <section className="relative bg-gradient-to-b from-deep-blue/10 to-background py-16 md:py-24">
        <div 
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Join the Community
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Get exclusive insights, training tips, and early access to new programs.
            </p>
            <form onSubmit={handleEmailSignup} className="flex flex-col gap-4 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" size="lg" className="bg-neon-purple hover:bg-neon-purple/90">
                Sign Up
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
