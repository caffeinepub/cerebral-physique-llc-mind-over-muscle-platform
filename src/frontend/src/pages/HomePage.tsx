import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Dumbbell, Wind } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

export default function HomePage() {
  const navigate = useNavigate();
  const { play, pause, setAudioElement, userMuted, volume } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlayRef = useRef(false);

  useEffect(() => {
    // Create and configure audio element
    if (!audioRef.current) {
      const audio = new Audio('/assets/background-music.mp3');
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;
      setAudioElement(audio);

      // Handle audio loading errors gracefully
      audio.addEventListener('error', (e) => {
        console.log('Background music file not found or failed to load. Please add background-music.mp3 to /assets/');
      });
    }

    // Auto-play music when homepage loads (if not manually muted by user)
    if (!hasAttemptedPlayRef.current && !userMuted) {
      hasAttemptedPlayRef.current = true;
      // Small delay to improve autoplay success rate
      const timer = setTimeout(() => {
        play();
      }, 100);
      return () => clearTimeout(timer);
    }

    // Cleanup: pause music when leaving homepage
    return () => {
      pause();
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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
                onClick={() => navigate({ to: '/dashboard' })}
              >
                Become a Member
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                onClick={() => navigate({ to: '/workout-library' })}
              >
                Explore Library
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
                Every exercise, every technique, every principle is backed by research and refined through practice. We don't chase trends—we build foundations.
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neon-purple" />
                  <span>Evidence-based exercise selection and programming</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neon-purple" />
                  <span>Biomechanics-focused movement patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neon-purple" />
                  <span>Nervous system optimization through breathwork</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neon-purple" />
                  <span>Recovery protocols for sustainable progress</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/mind-muscle-visual.dim_800x600.jpg"
                alt="Mind-muscle connection visualization"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neon-purple/10 via-background to-deep-blue/10 py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(/assets/generated/hero-background.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Unlock the Library!
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Get full access to our comprehensive exercise library, exclusive programs, and member-only content. Start your transformation today.
          </p>
          <Button
            size="lg"
            className="bg-neon-purple text-white hover:bg-neon-purple/90"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            Become a Member
          </Button>
        </div>
      </section>
    </div>
  );
}
