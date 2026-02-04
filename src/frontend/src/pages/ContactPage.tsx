import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

      {/* Contact Form */}
      <section className="relative py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
            {/* Form */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll respond within 24-48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what's on your mind..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-neon-purple hover:bg-neon-purple/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="space-y-6">
              <Card className="border-border/40">
                <CardHeader>
                  <Mail className="mb-2 h-8 w-8 text-neon-purple" />
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>
                    For general inquiries and support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:info@cerebralphysique.com"
                    className="text-neon-purple hover:underline"
                  >
                    info@cerebralphysique.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <MessageSquare className="mb-2 h-8 w-8 text-neon-purple" />
                  <CardTitle>Response Time</CardTitle>
                  <CardDescription>
                    We typically respond within 24-48 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    For urgent matters, please indicate "URGENT" in your message subject.
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
