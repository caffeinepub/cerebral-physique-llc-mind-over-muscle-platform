import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExerciseManagement from '../components/creator/ExerciseManagement';
import MuscleGroupManagement from '../components/creator/MuscleGroupManagement';
import BlogManagement from '../components/creator/BlogManagement';
import NutritionManagement from '../components/creator/NutritionManagement';
import AffiliateStoreManagement from '../components/creator/AffiliateStoreManagement';
import { ShieldAlert } from 'lucide-react';

export default function CreatorDashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access the Creator Dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the Creator Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Creator Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your content, exercises, and store</p>
        </div>

        <Tabs defaultValue="exercises">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="muscle-groups">Muscle Groups</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises">
            <ExerciseManagement />
          </TabsContent>

          <TabsContent value="muscle-groups">
            <MuscleGroupManagement />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionManagement />
          </TabsContent>

          <TabsContent value="store">
            <AffiliateStoreManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
