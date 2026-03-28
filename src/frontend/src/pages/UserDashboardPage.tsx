import StartMembershipCheckoutButton from "@/components/membership/StartMembershipCheckoutButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetMyMembership,
  useSaveCallerUserProfile,
} from "@/hooks/useQueries";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserDashboardPage() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: membership, isLoading: membershipLoading } =
    useGetMyMembership();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileName, setProfileName] = useState("");

  const isAuthenticated = !!identity;
  const isActive = membership?.active || false;

  useEffect(() => {
    if (
      isAuthenticated &&
      !profileLoading &&
      isFetched &&
      userProfile === null
    ) {
      setShowProfileSetup(true);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: profileName.trim(),
        email: undefined,
        membershipStatus: undefined,
      });
      toast.success("Profile created successfully");
      setShowProfileSetup(false);
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Failed to save profile");
    }
  };

  const handleLogout = async () => {
    await clear();
    window.location.href = "/";
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl border-border/40">
          <CardContent className="flex flex-col items-center py-16">
            <User className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-4 text-2xl font-bold">Login Required</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Please log in to access your dashboard and manage your membership.
            </p>
            <Button
              onClick={login}
              disabled={loginStatus === "logging-in"}
              className="bg-primary hover:bg-primary/90"
            >
              {loginStatus === "logging-in" ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading || membershipLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Profile Setup Dialog */}
      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome! Set Up Your Profile</DialogTitle>
            <DialogDescription>
              Please enter your name to complete your profile setup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                onKeyDown={(e) => e.key === "Enter" && handleSaveProfile()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveProfile}
              disabled={saveProfile.isPending || !profileName.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {saveProfile.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Welcome,{" "}
              <span className="text-neon-purple">
                {userProfile?.name || "Member"}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your membership and access your content
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Membership Status Card */}
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Membership Status
                    </CardTitle>
                    <CardDescription>
                      Your current membership details
                    </CardDescription>
                  </div>
                  {isActive ? (
                    <Badge className="gap-1 bg-green-500/20 text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isActive ? (
                  <Alert className="border-green-500/30 bg-green-500/5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-500">
                      Active Membership
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                      You have full access to all member content including the
                      exercise library and exclusive blog posts.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-neon-purple/30 bg-neon-purple/5">
                    <AlertCircle className="h-4 w-4 text-neon-purple" />
                    <AlertTitle className="text-neon-purple">
                      No Active Membership
                    </AlertTitle>
                    <AlertDescription>
                      <p className="mb-4 text-muted-foreground">
                        Become a member to unlock the full exercise library,
                        exclusive blog content, and all premium features for
                        $24.99/month.
                      </p>
                      <StartMembershipCheckoutButton />
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Account Card */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account
                </CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {userProfile?.name || "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Principal ID</Label>
                  <p className="break-all text-xs text-muted-foreground">
                    {identity?.getPrincipal().toString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links Card */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>
                  Access your content and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.location.href = "/workout-library";
                  }}
                >
                  Workout Library
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.location.href = "/nutrition";
                  }}
                >
                  Nutrition Hub
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.location.href = "/blog";
                  }}
                >
                  Blog & Insights
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.location.href = "/store";
                  }}
                >
                  Affiliate Store
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
