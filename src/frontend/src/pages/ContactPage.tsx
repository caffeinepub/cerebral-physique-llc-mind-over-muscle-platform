import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with energetic workout background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16 md:py-24">
        <div 
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/40 via-background/70 to-neon-purple/20" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Get in <span className="text-neon-purple">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Have questions about our programs or training philosophy? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-b border-border/40 bg-card py-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/discipline-quote-overlay-transparent.dim_800x200.png)' }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-base font-semibold italic text-neon-purple md:text-lg">
            "Your questions are the first step toward transformation."
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="relative py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
            {/* Info Cards */}
            <div className="space-y-6">
              <Card className="border-border/40">
                <CardHeader>
                  <MessageSquare className="mb-2 h-8 w-8 text-neon-purple" />
                  <CardTitle>Support</CardTitle>
                  <CardDescription>
                    For questions about memberships, content, or technical support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-gradient-to-br from-deep-blue/20 to-background">
                <CardHeader>
                  <CardTitle>Looking for Training Guidance?</CardTitle>
                  <CardDescription>
                    Check out our programs and workout library first
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = '/programs')}
                  >
                    View Programs
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = '/workout-library')}
                  >
                    Browse Exercises
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = '/store')}
                  >
                    Shop Recommended Gear
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Social & Resources */}
            <div className="space-y-6">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Connect With Us</CardTitle>
                  <CardDescription>
                    Follow us on social media for training tips and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Stay connected for the latest content, training insights, and community updates.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Membership Benefits</CardTitle>
                  <CardDescription>
                    Unlock full access to our platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-purple" />
                      <span>Complete exercise library with video demonstrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-purple" />
                      <span>Exclusive member-only blog content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-purple" />
                      <span>Monthly recurring access for $19.99/month</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-neon-purple hover:bg-neon-purple/90"
                    onClick={() => (window.location.href = '/dashboard')}
                  >
                    Become a Member
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
