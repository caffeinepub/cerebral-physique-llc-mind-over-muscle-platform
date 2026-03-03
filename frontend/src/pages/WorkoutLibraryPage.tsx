import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Loader2, Lock } from 'lucide-react';
import {
  useGetAllExercises,
  useGetMyMembership,
  useGetAllMuscleGroups,
  useIsCallerAdmin,
} from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { MuscleGroup, type Exercise } from '@/backend';

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

function isVideoUrl(url: string): boolean {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

interface ExerciseCardProps {
  exercise: Exercise;
  fallbackImage: string;
}

function ExerciseCard({ exercise, fallbackImage }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const imageUrls = exercise.media?.imageUrls || [];
  const videoUrls = exercise.media?.videoUrls || [];
  const primaryImage = imageUrls[0] || fallbackImage;

  return (
    <Card className="overflow-hidden border-border/40 bg-card/80">
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-muted">
        <img
          src={primaryImage}
          alt={exercise.name}
          className="h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
        />
        {exercise.isPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="text-xs text-muted-foreground">Coming Soon</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-medium text-sm text-foreground leading-tight">{exercise.name}</h4>
          <Badge variant="outline" className="text-xs shrink-0">{exercise.equipmentType}</Badge>
        </div>

        {exercise.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{exercise.description}</p>
        )}

        {(exercise.cues || videoUrls.length > 0 || imageUrls.length > 1) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {expanded ? 'Less' : 'More details'}
          </button>
        )}

        {expanded && (
          <div className="mt-3 space-y-3">
            {exercise.cues && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Coaching Cues:</p>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{exercise.cues}</p>
              </div>
            )}

            {/* Additional images */}
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-2 gap-1.5">
                {imageUrls.slice(1).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${exercise.name} ${i + 2}`}
                    className="w-full h-20 object-cover rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ))}
              </div>
            )}

            {/* Videos */}
            {videoUrls.map((url, i) => {
              if (isYouTubeUrl(url)) {
                return (
                  <div key={i} className="aspect-video rounded overflow-hidden">
                    <iframe
                      src={getYouTubeEmbedUrl(url)}
                      title={`${exercise.name} video ${i + 1}`}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                );
              }
              if (isVideoUrl(url)) {
                return (
                  <video key={i} src={url} controls className="w-full rounded max-h-40" />
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

interface MuscleGroupSectionProps {
  muscleGroup: MuscleGroup;
  exercises: Exercise[];
  isLoading: boolean;
  hasActiveMembership: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  cardTitle?: string;
  cardDescription?: string;
  cardImageUrl?: string;
}

function MuscleGroupSection({
  muscleGroup,
  exercises,
  isLoading,
  hasActiveMembership,
  isAuthenticated,
  isAdmin,
  cardTitle,
  cardDescription,
  cardImageUrl,
}: MuscleGroupSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const canView = isAdmin || hasActiveMembership;
  const muscleGroupName = getMuscleGroupLabel(muscleGroup);
  const displayImage = cardImageUrl || getDefaultMuscleGroupImage(muscleGroup);
  const displayDescription = cardDescription || `Explore ${muscleGroupName.toLowerCase()} exercises with detailed form cues and video demonstrations.`;
  const displayTitle = cardTitle || muscleGroupName;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur transition-all hover:border-primary/30">
        <CollapsibleTrigger className="w-full text-left">
          <div className="relative h-48 overflow-hidden">
            <img
              src={displayImage}
              alt={displayTitle}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultMuscleGroupImage(muscleGroup);
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
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant="secondary">{exercises.length} exercises</Badge>
            )}
          </Button>
        </CardContent>

        <CollapsibleContent>
          <div className="border-t border-border/40 p-4">
            {!isAuthenticated ? (
              <Alert className="border-primary/30 bg-primary/5">
                <Lock className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Members Only</AlertTitle>
                <AlertDescription>
                  Log in with an active membership to access the full exercise library
                </AlertDescription>
              </Alert>
            ) : !canView ? (
              <Alert className="border-primary/30 bg-primary/5">
                <Lock className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Membership Required</AlertTitle>
                <AlertDescription>
                  Upgrade to an active membership to unlock all exercises
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : exercises.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No exercises available yet for this muscle group
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id.toString()}
                    exercise={exercise}
                    fallbackImage={displayImage}
                  />
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
  const { data: membership, isLoading: membershipLoading } = useGetMyMembership();
  const { data: muscleGroupDetails = [], isLoading: cardsLoading } = useGetAllMuscleGroups();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: allExercises = [], isLoading: exercisesLoading } = useGetAllExercises();

  const isAuthenticated = !!identity;
  const hasActiveMembership = membership?.active === true;

  const muscleGroupList = [
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

  // Filter exercises by muscle group client-side from the single fetched list
  const getExercisesForMuscleGroup = (muscleGroup: MuscleGroup): Exercise[] => {
    return allExercises.filter((e) => e.primaryMuscle === muscleGroup);
  };

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
              Comprehensive exercise database with detailed form cues, images, and video demonstrations
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
            {isAuthenticated && !hasActiveMembership && !membershipLoading && !isAdmin && (
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
          {cardsLoading || exercisesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {muscleGroupList.map((muscleGroup) => {
                const label = getMuscleGroupLabel(muscleGroup);
                const mgDetail = muscleGroupDetails.find(
                  (mg) => mg.name === label || mg.card?.title === label
                );
                const filteredExercises = getExercisesForMuscleGroup(muscleGroup);
                return (
                  <MuscleGroupSection
                    key={muscleGroup}
                    muscleGroup={muscleGroup}
                    exercises={filteredExercises}
                    isLoading={false}
                    hasActiveMembership={hasActiveMembership}
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    cardTitle={mgDetail?.card?.title}
                    cardDescription={mgDetail?.card?.description}
                    cardImageUrl={mgDetail?.card?.imageUrl}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
