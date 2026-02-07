import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Loader2, Lock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useGetMuscleGroupExercisePreviews, useHasActiveMembership, useGetMuscleGroupCards, useIsCallerAdmin } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { MuscleGroup, EquipmentType, type Exercise } from '@/backend';

// Helper to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

// Default fallback images for muscle groups
const getDefaultMuscleGroupImage = (muscleGroup: MuscleGroup): string => {
  const imageMap: Record<MuscleGroup, string> = {
    [MuscleGroup.chest]: '/assets/generated/chest-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.back]: '/assets/generated/back-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.shoulders]: '/assets/generated/shoulder-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.biceps]: '/assets/generated/arms-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.triceps]: '/assets/generated/arms-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.quads]: '/assets/generated/leg-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.hamstrings]: '/assets/generated/leg-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.glutes]: '/assets/generated/leg-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.calves]: '/assets/generated/leg-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.core]: '/assets/generated/core-exercises-gym.dim_800x600.jpg',
  };
  return imageMap[muscleGroup];
};

const getMuscleGroupLabel = (muscleGroup: MuscleGroup): string => {
  const labels: Record<MuscleGroup, string> = {
    [MuscleGroup.chest]: 'Chest',
    [MuscleGroup.back]: 'Back',
    [MuscleGroup.shoulders]: 'Shoulders',
    [MuscleGroup.biceps]: 'Biceps',
    [MuscleGroup.triceps]: 'Triceps',
    [MuscleGroup.quads]: 'Quads',
    [MuscleGroup.hamstrings]: 'Hamstrings',
    [MuscleGroup.glutes]: 'Glutes',
    [MuscleGroup.calves]: 'Calves',
    [MuscleGroup.core]: 'Core',
  };
  return labels[muscleGroup];
};

const getDefaultDescription = (muscleGroup: MuscleGroup): string => {
  return `Explore ${getMuscleGroupLabel(muscleGroup).toLowerCase()} exercises with detailed form cues and video demonstrations.`;
};

// NOTE: Leg exercises are represented by existing quads/hamstrings/glutes/calves sections.
// No new "Legs" muscle group is introduced.

interface MuscleGroupSectionProps {
  muscleGroup: MuscleGroup;
  hasActiveMembership: boolean;
  isAuthenticated: boolean;
  muscleGroupCards: any[];
}

function MuscleGroupSection({ muscleGroup, hasActiveMembership, isAuthenticated, muscleGroupCards }: MuscleGroupSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: exercises = [], isLoading } = useGetMuscleGroupExercisePreviews(muscleGroup);
  
  const muscleGroupName = getMuscleGroupLabel(muscleGroup);
  const card = muscleGroupCards.find((c) => c.title === muscleGroupName);
  
  const displayImage = card?.imageUrl || getDefaultMuscleGroupImage(muscleGroup);
  const displayDescription = card?.description || getDefaultDescription(muscleGroup);
  const displayTitle = card?.title || muscleGroupName;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur transition-all hover:border-neon-purple/30">
        <CollapsibleTrigger className="w-full">
          <div className="relative h-48 overflow-hidden">
            <img
              src={displayImage}
              alt={displayTitle}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = getDefaultMuscleGroupImage(muscleGroup);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl font-bold text-foreground">{displayTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{displayDescription}</p>
            </div>
          </div>
        </CollapsibleTrigger>
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="flex items-center gap-2">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              {isOpen ? 'Hide' : 'View'} Exercises
            </span>
            <Badge variant="secondary">{exercises.length} exercises</Badge>
          </Button>
        </CardContent>
        <CollapsibleContent>
          <div className="border-t border-border/40 p-4">
            {!isAuthenticated ? (
              <Alert className="border-neon-purple/30 bg-neon-purple/5">
                <Lock className="h-4 w-4 text-neon-purple" />
                <AlertTitle className="text-neon-purple">Members Only</AlertTitle>
                <AlertDescription>
                  Log in with an active membership to access the full exercise library
                </AlertDescription>
              </Alert>
            ) : !hasActiveMembership ? (
              <Alert className="border-neon-purple/30 bg-neon-purple/5">
                <Lock className="h-4 w-4 text-neon-purple" />
                <AlertTitle className="text-neon-purple">Membership Required</AlertTitle>
                <AlertDescription>
                  Upgrade to an active membership to unlock all exercises
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-neon-purple" />
              </div>
            ) : exercises.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No exercises available yet for this muscle group
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => (
                  <Card key={exercise.id.toString()} className="overflow-hidden border-border/40">
                    <div className="relative h-32 overflow-hidden bg-muted">
                      <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = displayImage;
                        }}
                      />
                    </div>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{exercise.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function WorkoutLibraryPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: hasActiveMembership = false, isLoading: membershipLoading } = useHasActiveMembership();
  const { data: muscleGroupCards = [], isLoading: cardsLoading } = useGetMuscleGroupCards();
  const { data: isAdmin = false } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  const muscleGroups = [
    MuscleGroup.chest,
    MuscleGroup.back,
    MuscleGroup.shoulders,
    MuscleGroup.biceps,
    MuscleGroup.triceps,
    MuscleGroup.quads,
    MuscleGroup.hamstrings,
    MuscleGroup.glutes,
    MuscleGroup.calves,
    MuscleGroup.core,
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16 md:py-24">
        <div 
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/40 via-background/60 to-neon-purple/20" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Workout <span className="text-neon-purple">Library</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Comprehensive exercise database with detailed form cues and video demonstrations
            </p>
            {!isAuthenticated && (
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-neon-purple hover:bg-neon-purple/90"
                  onClick={() => navigate({ to: '/dashboard' })}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Login to Access Library
                </Button>
              </div>
            )}
            {isAuthenticated && !hasActiveMembership && !membershipLoading && (
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-neon-purple hover:bg-neon-purple/90"
                  onClick={() => navigate({ to: '/dashboard' })}
                >
                  Upgrade to Access Full Library
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Muscle Groups Grid */}
      <section className="relative py-16 md:py-24">
        <div 
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          {cardsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {muscleGroups.map((muscleGroup) => (
                <MuscleGroupSection
                  key={muscleGroup}
                  muscleGroup={muscleGroup}
                  hasActiveMembership={hasActiveMembership}
                  isAuthenticated={isAuthenticated}
                  muscleGroupCards={muscleGroupCards}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
