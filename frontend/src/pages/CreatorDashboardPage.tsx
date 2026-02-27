import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Dumbbell, BookOpen, ShieldAlert, ShoppingBag, Image } from 'lucide-react';
import ExerciseManagement from '@/components/creator/ExerciseManagement';
import BlogManagement from '@/components/creator/BlogManagement';
import AffiliateStoreManagement from '@/components/creator/AffiliateStoreManagement';
import MuscleGroupManagement from '@/components/creator/MuscleGroupManagement';

export default function CreatorDashboardPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState('exercises');

  if (isAdminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive" className="mx-auto max-w-2xl">
          <ShieldAlert className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Access Denied: This section is only available to authorized creators. Please contact the administrator if you believe you should have access.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-deep-blue/5">
      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-br from-deep-blue/20 via-background to-neon-purple/10 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 bg-gradient-to-r from-neon-purple via-deep-blue to-neon-purple bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Creator Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your workout library, blog content, affiliate products, and memberships
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-7xl">
            <TabsList className="grid w-full grid-cols-4 bg-card/50">
              <TabsTrigger value="exercises" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Exercises
              </TabsTrigger>
              <TabsTrigger value="muscle-groups" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Muscle Groups
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="store" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Store
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exercises" className="mt-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl text-neon-purple">Exercise Management</CardTitle>
                  <CardDescription>
                    Add, edit, or remove exercises from the workout library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExerciseManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="muscle-groups" className="mt-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl text-neon-purple">Muscle Group Cards</CardTitle>
                  <CardDescription>
                    Customize the display content for each muscle group card in the Workout Library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MuscleGroupManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="mt-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl text-neon-purple">Blog Management</CardTitle>
                  <CardDescription>
                    Create, edit, publish, and manage blog posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BlogManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="store" className="mt-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl text-neon-purple">Affiliate Store Management</CardTitle>
                  <CardDescription>
                    Manage Amazon affiliate products and categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AffiliateStoreManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
