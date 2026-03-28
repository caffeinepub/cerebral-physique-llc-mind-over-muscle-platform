import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Dumbbell,
  LayoutDashboard,
  Mail,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-neon-purple/10 p-4">
              <MessageSquare className="h-12 w-12 text-neon-purple" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Have questions about our programs, need support, or want to learn
            more about the Cerebral Physique approach? We're here to help.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Card className="border-neon-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-neon-purple" />
                Support
              </CardTitle>
              <CardDescription>
                For membership and technical support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:support@cerebralphysique.com"
                className="text-neon-purple transition-colors hover:text-neon-purple/80"
              >
                support@cerebralphysique.com
              </a>
            </CardContent>
          </Card>

          <Card className="border-deep-blue/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-deep-blue" />
                General Inquiries
              </CardTitle>
              <CardDescription>
                For partnerships and general questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:info@cerebralphysique.com"
                className="text-deep-blue transition-colors hover:text-deep-blue/80"
              >
                info@cerebralphysique.com
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Explore our platform and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4"
              onClick={() => navigate({ to: "/programs" })}
            >
              <BookOpen className="h-5 w-5 text-neon-purple" />
              <div className="text-left">
                <div className="font-semibold">Programs</div>
                <div className="text-xs text-muted-foreground">
                  View our training programs
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4"
              onClick={() => navigate({ to: "/workout-library" })}
            >
              <Dumbbell className="h-5 w-5 text-neon-purple" />
              <div className="text-left">
                <div className="font-semibold">Workout Library</div>
                <div className="text-xs text-muted-foreground">
                  Browse exercises
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4"
              onClick={() => navigate({ to: "/store" })}
            >
              <ShoppingBag className="h-5 w-5 text-neon-purple" />
              <div className="text-left">
                <div className="font-semibold">Cerebral Shop</div>
                <div className="text-xs text-muted-foreground">
                  Recommended products
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              <LayoutDashboard className="h-5 w-5 text-neon-purple" />
              <div className="text-left">
                <div className="font-semibold">Dashboard</div>
                <div className="text-xs text-muted-foreground">
                  Manage your account
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Membership Benefits */}
        <Card className="border-neon-purple/20 bg-gradient-to-br from-neon-purple/5 to-deep-blue/5">
          <CardHeader>
            <CardTitle className="text-neon-purple">Become a Member</CardTitle>
            <CardDescription>
              Unlock full access to our comprehensive training library and
              exclusive content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-neon-purple">✓</span>
                <span>
                  Complete exercise library with detailed video demonstrations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-neon-purple">✓</span>
                <span>
                  Exclusive member-only blog content and training insights
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-neon-purple">✓</span>
                <span>Access to premium programs and breathwork practices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-neon-purple">✓</span>
                <span>Personalized dashboard to track your progress</span>
              </li>
            </ul>
            <Link to="/dashboard">
              <Button className="w-full bg-neon-purple hover:bg-neon-purple/90">
                Get Started Today
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
