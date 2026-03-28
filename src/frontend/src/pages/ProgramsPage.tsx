import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";

export default function ProgramsPage() {
  const handlePurchase = (programName: string) => {
    toast.success(
      `Thank you for your interest in ${programName}! Checkout coming soon.`,
    );
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with energetic gym background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16 md:py-24">
        <div
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-45"
          style={{
            backgroundImage:
              "url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/30 via-background/40 to-neon-purple/20" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Transform Your <span className="text-neon-purple">Training</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Structured programs designed to elevate your mind-body performance
            </p>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-b border-border/40 bg-card py-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/discipline-quote-overlay-transparent.dim_800x200.png)",
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-base font-semibold italic text-neon-purple md:text-lg">
            "Excellence is not an act, but a habit."
          </p>
        </div>
      </section>

      {/* Featured Program with dynamic movement background */}
      <section className="relative py-16 md:py-24">
        <div
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <Card className="border-neon-purple/50 bg-gradient-to-br from-deep-blue/20 to-background/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-4 w-fit bg-neon-purple">
                  Featured Program
                </Badge>
                <CardTitle className="text-3xl md:text-4xl">
                  7-Day Mental & Physical Reset Challenge
                </CardTitle>
                <CardDescription className="text-lg">
                  A comprehensive introduction to mind-muscle training,
                  breathwork, and intentional movement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-xl font-semibold">
                      What's Included:
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 shrink-0 text-neon-purple" />
                        <span>
                          7 days of structured workouts with video
                          demonstrations
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 shrink-0 text-neon-purple" />
                        <span>
                          Daily breathwork protocols for nervous system
                          regulation
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 shrink-0 text-neon-purple" />
                        <span>Mind-muscle connection training guides</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 shrink-0 text-neon-purple" />
                        <span>Recovery and mobility routines</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4 text-xl font-semibold">
                      You'll Learn:
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 shrink-0 text-neon-purple" />
                        <span>How to establish conscious muscle control</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 shrink-0 text-neon-purple" />
                        <span>
                          Breathing techniques for performance and recovery
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 shrink-0 text-neon-purple" />
                        <span>Movement quality assessment and correction</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 shrink-0 text-neon-purple" />
                        <span>
                          Sustainable training principles for longevity
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center justify-center space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-neon-purple">$39</p>
                  <p className="text-sm text-muted-foreground">
                    One-time payment
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-neon-purple hover:bg-neon-purple/90"
                  onClick={() => handlePurchase("7-Day Challenge")}
                >
                  Start Your Reset
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Audiobooks with stretching background */}
      <section className="relative bg-card py-16 md:py-24">
        <div
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/stretching-scene.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Audiobooks & Guides
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border/40 bg-background">
              <CardHeader>
                <CardTitle>The Breathwork Blueprint</CardTitle>
                <CardDescription>
                  Master the fundamentals of breathwork for performance,
                  recovery, and nervous system regulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>3+ hours of audio content</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>Guided breathing protocols</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>Science-backed techniques</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <p className="text-2xl font-bold text-neon-purple">$19</p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handlePurchase("The Breathwork Blueprint")}
                >
                  Get Audiobook
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border/40 bg-background">
              <CardHeader>
                <CardTitle>Push-Up Mastery</CardTitle>
                <CardDescription>
                  Transform the humble push-up into a full-body mind-muscle
                  connection exercise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>2+ hours of instruction</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>Progressive variations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>Form correction cues</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <p className="text-2xl font-bold text-neon-purple">$15</p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handlePurchase("Push-Up Mastery")}
                >
                  Get Audiobook
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border/40 bg-background">
              <CardHeader>
                <CardTitle>Mindset for Longevity</CardTitle>
                <CardDescription>
                  Develop the mental frameworks that support lifelong physical
                  excellence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>4+ hours of content</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>Mental discipline practices</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-neon-purple" />
                    <span>Sustainable habit building</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <p className="text-2xl font-bold text-neon-purple">$22</p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handlePurchase("Mindset for Longevity")}
                >
                  Get Audiobook
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-y border-border/40 bg-card py-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/longevity-quote-overlay-transparent.dim_800x200.png)",
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-base font-semibold italic text-neon-purple md:text-lg">
            "Longevity is the ultimate performance metric."
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="relative py-16 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Coming Soon
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-border/40 bg-card">
              <CardHeader>
                <Badge className="mb-2 w-fit" variant="secondary">
                  In Development
                </Badge>
                <CardTitle>12-Week Strength & Longevity Program</CardTitle>
                <CardDescription>
                  A comprehensive program combining progressive strength
                  training with mobility, breathwork, and recovery protocols
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40 bg-card">
              <CardHeader>
                <Badge className="mb-2 w-fit" variant="secondary">
                  In Development
                </Badge>
                <CardTitle>Advanced Mind-Muscle Certification</CardTitle>
                <CardDescription>
                  For coaches and trainers looking to integrate mind-muscle
                  connection principles into their practice
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
