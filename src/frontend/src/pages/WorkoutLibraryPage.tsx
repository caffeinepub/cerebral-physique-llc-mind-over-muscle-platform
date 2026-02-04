import { useState } from 'react';
import { useGetMuscleGroupExercises, useGetAllBreathworkPractices, useGetAllExercises, useGetRoutine, useAddToRoutine, useRemoveFromRoutine, useCreateRoutine } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Dumbbell, Loader2, Wind, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { MuscleGroup, EquipmentType, type Exercise, type BreathworkPractice } from '@/backend';

const getMuscleGroupImage = (muscleGroup: MuscleGroup): string => {
  const imageMap: Record<MuscleGroup, string> = {
    [MuscleGroup.chest]: '/assets/generated/chest-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.back]: '/assets/generated/back-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.legs]: '/assets/generated/leg-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.shoulders]: '/assets/generated/shoulder-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.arms]: '/assets/generated/arms-exercises-gym.dim_800x600.jpg',
    [MuscleGroup.core]: '/assets/generated/core-exercises-gym.dim_800x600.jpg',
  };
  return imageMap[muscleGroup];
};

const getMuscleGroupLabel = (muscleGroup: MuscleGroup): string => {
  const labelMap: Record<MuscleGroup, string> = {
    [MuscleGroup.chest]: 'Chest',
    [MuscleGroup.back]: 'Back',
    [MuscleGroup.legs]: 'Legs',
    [MuscleGroup.shoulders]: 'Shoulders',
    [MuscleGroup.arms]: 'Arms',
    [MuscleGroup.core]: 'Core',
  };
  return labelMap[muscleGroup];
};

const getEquipmentLabel = (equipment: EquipmentType): string => {
  const labelMap: Record<EquipmentType, string> = {
    [EquipmentType.barbell]: 'Barbell',
    [EquipmentType.dumbbell]: 'Dumbbell',
    [EquipmentType.cable]: 'Cable',
    [EquipmentType.machine]: 'Machine',
    [EquipmentType.bodyweight]: 'Bodyweight',
    [EquipmentType.bands]: 'Bands',
  };
  return labelMap[equipment];
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'intermediate':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'advanced':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

// Helper to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

interface MuscleGroupCardProps {
  muscleGroup: MuscleGroup;
  routineExerciseIds: number[];
  onToggleExercise: (exerciseId: bigint, isChecked: boolean, isBreathwork: boolean) => void;
  isAuthenticated: boolean;
}

function MuscleGroupCard({ muscleGroup, routineExerciseIds, onToggleExercise, isAuthenticated }: MuscleGroupCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: exercises = [], isLoading } = useGetMuscleGroupExercises(muscleGroup);

  const label = getMuscleGroupLabel(muscleGroup);
  const image = getMuscleGroupImage(muscleGroup);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border/40 transition-all hover:border-neon-purple/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/30 to-neon-purple/30" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{label}</CardTitle>
                  <CardDescription>
                    {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}
                  </CardDescription>
                </div>
              </div>
              {isOpen ? (
                <ChevronDown className="h-6 w-6 shrink-0 text-muted-foreground transition-transform" />
              ) : (
                <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground transition-transform" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
              </div>
            ) : exercises.length === 0 ? (
              <Alert className="border-neon-purple/30 bg-neon-purple/5">
                <AlertCircle className="h-4 w-4 text-neon-purple" />
                <AlertTitle className="text-neon-purple">No exercises available yet</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Demo exercises will be automatically populated soon. Check back later or contact the creator to add exercises for this muscle group.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => {
                  const isInRoutine = routineExerciseIds.includes(Number(exercise.id));
                  const hasVideo = isVideoUrl(exercise.mediaUrl);
                  const benefitsList = exercise.benefits ? exercise.benefits.split('\n').filter(b => b.trim()) : [];
                  
                  return (
                    <Card key={Number(exercise.id)} className="border-border/40 bg-card/50">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Exercise Media (Video or Image) */}
                          <div className="relative h-48 w-full overflow-hidden rounded-lg">
                            {hasVideo ? (
                              <video
                                src={exercise.mediaUrl}
                                className="h-full w-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                              />
                            ) : (
                              <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${exercise.mediaUrl || exercise.imageUrl || image})` }}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                          </div>

                          {/* Exercise Details */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-semibold leading-tight">{exercise.name}</h4>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getDifficultyColor(exercise.difficultyLevel)}`}
                                  >
                                    {exercise.difficultyLevel}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {getEquipmentLabel(exercise.equipmentType)}
                                  </Badge>
                                </div>
                              </div>
                              {isAuthenticated && (
                                <Checkbox
                                  checked={isInRoutine}
                                  onCheckedChange={(checked) => 
                                    onToggleExercise(exercise.id, checked as boolean, false)
                                  }
                                  className="mt-1 shrink-0"
                                />
                              )}
                            </div>
                            
                            <div className="rounded-md border border-neon-purple/20 bg-neon-purple/5 p-3">
                              <p className="text-xs font-medium text-neon-purple">How to perform:</p>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {exercise.instructions}
                              </p>
                            </div>

                            {/* Benefits Section */}
                            {exercise.benefits && (
                              <div className="rounded-md border border-deep-blue/20 bg-deep-blue/5 p-3">
                                <p className="text-xs font-medium text-deep-blue">Benefits:</p>
                                {benefitsList.length > 0 ? (
                                  <ul className="mt-1 space-y-0.5 text-xs leading-relaxed text-muted-foreground">
                                    {benefitsList.map((benefit, idx) => (
                                      <li key={idx} className="flex items-start gap-1">
                                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-deep-blue" />
                                        <span>{benefit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    {exercise.benefits}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

interface BreathworkStationCardProps {
  routineBreathworkIds: number[];
  onToggleBreathwork: (breathworkId: bigint, isChecked: boolean, isBreathwork: boolean) => void;
  isAuthenticated: boolean;
}

function BreathworkStationCard({ routineBreathworkIds, onToggleBreathwork, isAuthenticated }: BreathworkStationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: breathworkPractices = [], isLoading } = useGetAllBreathworkPractices();
  const { data: allExercises = [] } = useGetAllExercises();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border/40 bg-gradient-to-br from-deep-blue/10 to-neon-purple/10 transition-all hover:border-neon-purple/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/assets/generated/breathing-visual.dim_400x400.jpg)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/40 to-neon-purple/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wind className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl">Breathwork Station</CardTitle>
                  <CardDescription>
                    {breathworkPractices.length} {breathworkPractices.length === 1 ? 'practice' : 'practices'}
                  </CardDescription>
                </div>
              </div>
              {isOpen ? (
                <ChevronDown className="h-6 w-6 shrink-0 text-muted-foreground transition-transform" />
              ) : (
                <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground transition-transform" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
              </div>
            ) : breathworkPractices.length === 0 ? (
              <Alert className="border-deep-blue/30 bg-deep-blue/5">
                <AlertCircle className="h-4 w-4 text-deep-blue" />
                <AlertTitle className="text-deep-blue">No breathwork practices available yet</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Demo breathwork practices will be automatically populated soon. Check back later or contact the creator to add breathwork practices.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {breathworkPractices.map((practice) => {
                  const isInRoutine = routineBreathworkIds.includes(Number(practice.id));
                  const pairedExercises = allExercises.filter(ex => 
                    practice.recommendedExerciseIds.some(id => id === ex.id)
                  );
                  
                  return (
                    <Card key={Number(practice.id)} className="border-border/40 bg-card/50">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Practice Image */}
                          <div className="relative h-48 w-full overflow-hidden rounded-lg">
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${practice.mediaUrl})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                          </div>

                          {/* Practice Details */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-semibold leading-tight">{practice.name}</h4>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getDifficultyColor(practice.difficultyLevel)}`}
                                  >
                                    {practice.difficultyLevel}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {practice.duration.toString()} min
                                  </Badge>
                                </div>
                              </div>
                              {isAuthenticated && (
                                <Checkbox
                                  checked={isInRoutine}
                                  onCheckedChange={(checked) => 
                                    onToggleBreathwork(practice.id, checked as boolean, true)
                                  }
                                  className="mt-1 shrink-0"
                                />
                              )}
                            </div>
                            
                            <div className="rounded-md border border-neon-purple/20 bg-neon-purple/5 p-3">
                              <p className="text-xs font-medium text-neon-purple">Technique:</p>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {practice.techniqueDescription}
                              </p>
                            </div>

                            <div className="rounded-md border border-deep-blue/20 bg-deep-blue/5 p-3">
                              <p className="text-xs font-medium text-deep-blue">Benefits:</p>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {practice.mindfulnessBenefits}
                              </p>
                            </div>

                            {pairedExercises.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Pairs well with:</p>
                                <div className="flex flex-wrap gap-1">
                                  {pairedExercises.slice(0, 2).map(ex => (
                                    <Badge key={ex.id.toString()} variant="secondary" className="text-xs">
                                      {ex.name}
                                    </Badge>
                                  ))}
                                  {pairedExercises.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{pairedExercises.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

interface RoutineMuscleGroupSectionProps {
  muscleGroup: MuscleGroup;
  exercises: Exercise[];
  routineExerciseIds: number[];
  onToggleExercise: (exerciseId: bigint, isChecked: boolean, isBreathwork: boolean) => void;
}

function RoutineMuscleGroupSection({ muscleGroup, exercises, routineExerciseIds, onToggleExercise }: RoutineMuscleGroupSectionProps) {
  const routineExercises = exercises.filter((ex) => 
    routineExerciseIds.includes(Number(ex.id))
  );

  if (routineExercises.length === 0) return null;

  const label = getMuscleGroupLabel(muscleGroup);
  const image = getMuscleGroupImage(muscleGroup);

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/30 to-neon-purple/30" />
          </div>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routineExercises.map((exercise) => {
            const hasVideo = isVideoUrl(exercise.mediaUrl);
            const benefitsList = exercise.benefits ? exercise.benefits.split('\n').filter(b => b.trim()) : [];
            
            return (
              <Card key={Number(exercise.id)} className="border-border/40 bg-card/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      {hasVideo ? (
                        <video
                          src={exercise.mediaUrl}
                          className="h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${exercise.mediaUrl || exercise.imageUrl || image})` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold leading-tight">{exercise.name}</h4>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getDifficultyColor(exercise.difficultyLevel)}`}
                            >
                              {exercise.difficultyLevel}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getEquipmentLabel(exercise.equipmentType)}
                            </Badge>
                          </div>
                        </div>
                        <Checkbox
                          checked={true}
                          onCheckedChange={() => onToggleExercise(exercise.id, false, false)}
                          className="mt-1 shrink-0"
                        />
                      </div>
                      
                      <div className="rounded-md border border-neon-purple/20 bg-neon-purple/5 p-3">
                        <p className="text-xs font-medium text-neon-purple">How to perform:</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {exercise.instructions}
                        </p>
                      </div>

                      {exercise.benefits && (
                        <div className="rounded-md border border-deep-blue/20 bg-deep-blue/5 p-3">
                          <p className="text-xs font-medium text-deep-blue">Benefits:</p>
                          {benefitsList.length > 0 ? (
                            <ul className="mt-1 space-y-0.5 text-xs leading-relaxed text-muted-foreground">
                              {benefitsList.map((benefit, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-deep-blue" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {exercise.benefits}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface RoutineBreathworkSectionProps {
  breathworkPractices: BreathworkPractice[];
  routineBreathworkIds: number[];
  onToggleBreathwork: (breathworkId: bigint, isChecked: boolean, isBreathwork: boolean) => void;
  allExercises: Exercise[];
}

function RoutineBreathworkSection({ breathworkPractices, routineBreathworkIds, onToggleBreathwork, allExercises }: RoutineBreathworkSectionProps) {
  const routineBreathwork = breathworkPractices.filter((bp) => 
    routineBreathworkIds.includes(Number(bp.id))
  );

  if (routineBreathwork.length === 0) return null;

  return (
    <Card className="border-border/40 bg-gradient-to-br from-deep-blue/5 to-neon-purple/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-deep-blue/40 to-neon-purple/40">
            <div className="flex h-full items-center justify-center">
              <Wind className="h-6 w-6 text-white" />
            </div>
          </div>
          Breathwork Practices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routineBreathwork.map((practice) => {
            const pairedExercises = allExercises.filter(ex => 
              practice.recommendedExerciseIds.some(id => id === ex.id)
            );
            
            return (
              <Card key={Number(practice.id)} className="border-border/40 bg-card/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${practice.mediaUrl})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold leading-tight">{practice.name}</h4>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getDifficultyColor(practice.difficultyLevel)}`}
                            >
                              {practice.difficultyLevel}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {practice.duration.toString()} min
                            </Badge>
                          </div>
                        </div>
                        <Checkbox
                          checked={true}
                          onCheckedChange={() => onToggleBreathwork(practice.id, false, true)}
                          className="mt-1 shrink-0"
                        />
                      </div>
                      
                      <div className="rounded-md border border-neon-purple/20 bg-neon-purple/5 p-3">
                        <p className="text-xs font-medium text-neon-purple">Technique:</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {practice.techniqueDescription}
                        </p>
                      </div>

                      <div className="rounded-md border border-deep-blue/20 bg-deep-blue/5 p-3">
                        <p className="text-xs font-medium text-deep-blue">Benefits:</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {practice.mindfulnessBenefits}
                        </p>
                      </div>

                      {pairedExercises.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Pairs well with:</p>
                          <div className="flex flex-wrap gap-1">
                            {pairedExercises.slice(0, 2).map(ex => (
                              <Badge key={ex.id.toString()} variant="secondary" className="text-xs">
                                {ex.name}
                              </Badge>
                            ))}
                            {pairedExercises.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{pairedExercises.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkoutLibraryPage() {
  const { identity, login, isLoginSuccess } = useInternetIdentity();
  const { data: routine } = useGetRoutine(identity?.getPrincipal());
  const { data: breathworkPractices = [] } = useGetAllBreathworkPractices();
  const createRoutineMutation = useCreateRoutine();
  const addToRoutineMutation = useAddToRoutine();
  const removeFromRoutineMutation = useRemoveFromRoutine();

  const [activeView, setActiveView] = useState<'library' | 'routine'>('library');

  const routineExerciseIds = routine?.exerciseIds.map((id) => Number(id)) || [];
  const routineBreathworkIds = routine?.breathworkPracticeIds.map((id) => Number(id)) || [];

  const muscleGroups = [
    MuscleGroup.chest,
    MuscleGroup.back,
    MuscleGroup.legs,
    MuscleGroup.shoulders,
    MuscleGroup.arms,
    MuscleGroup.core,
  ];

  // Pre-fetch all muscle group exercises at the top level
  const chestExercises = useGetMuscleGroupExercises(MuscleGroup.chest);
  const backExercises = useGetMuscleGroupExercises(MuscleGroup.back);
  const legsExercises = useGetMuscleGroupExercises(MuscleGroup.legs);
  const shouldersExercises = useGetMuscleGroupExercises(MuscleGroup.shoulders);
  const armsExercises = useGetMuscleGroupExercises(MuscleGroup.arms);
  const coreExercises = useGetMuscleGroupExercises(MuscleGroup.core);
  const { data: allExercises = [] } = useGetAllExercises();

  const exercisesByMuscleGroup: Record<MuscleGroup, Exercise[]> = {
    [MuscleGroup.chest]: chestExercises.data || [],
    [MuscleGroup.back]: backExercises.data || [],
    [MuscleGroup.legs]: legsExercises.data || [],
    [MuscleGroup.shoulders]: shouldersExercises.data || [],
    [MuscleGroup.arms]: armsExercises.data || [],
    [MuscleGroup.core]: coreExercises.data || [],
  };

  const handleToggleItem = async (itemId: bigint, isChecked: boolean, isBreathwork: boolean) => {
    if (!identity) {
      login();
      return;
    }

    try {
      if (isChecked) {
        // Add to routine
        if (!routine) {
          await createRoutineMutation.mutateAsync();
        }
        await addToRoutineMutation.mutateAsync({ exerciseId: itemId, isBreathwork });
        toast.success(isBreathwork ? 'Breathwork practice added to routine!' : 'Exercise added to routine!');
      } else {
        // Remove from routine
        await removeFromRoutineMutation.mutateAsync({ exerciseId: itemId, isBreathwork });
        toast.success(isBreathwork ? 'Breathwork practice removed from routine!' : 'Exercise removed from routine!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update routine');
    }
  };

  const totalRoutineItems = routineExerciseIds.length + routineBreathworkIds.length;

  return (
    <div className="flex flex-col">
      {/* Hero Section with energetic gym background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16 md:py-24">
        <div 
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-50"
          style={{ backgroundImage: 'url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/30 via-background/40 to-neon-purple/20" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Workout <span className="text-neon-purple">Library</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Explore comprehensive exercises and breathwork practices. Check the box to add to your personal routine.
            </p>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-b border-border/40 bg-card py-8">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(/assets/generated/breath-quote-overlay-transparent.dim_800x200.png)' }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-lg font-semibold italic text-neon-purple md:text-xl">
            "Breath is the bridge between mind and muscle."
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16">
        <div 
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          {/* View Toggle */}
          <div className="mb-8 flex justify-center gap-2">
            <Button
              variant={activeView === 'library' ? 'default' : 'outline'}
              onClick={() => setActiveView('library')}
              className={activeView === 'library' ? 'bg-neon-purple hover:bg-neon-purple/90' : ''}
            >
              <Dumbbell className="mr-2 h-4 w-4" />
              Exercise Library
            </Button>
            <Button
              variant={activeView === 'routine' ? 'default' : 'outline'}
              onClick={() => setActiveView('routine')}
              className={activeView === 'routine' ? 'bg-neon-purple hover:bg-neon-purple/90' : ''}
            >
              My Routine
              {routine && totalRoutineItems > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalRoutineItems}
                </Badge>
              )}
            </Button>
          </div>

          {/* Library View */}
          {activeView === 'library' && (
            <div className="space-y-6">
              {!isLoginSuccess && (
                <Card className="border-neon-purple/30 bg-neon-purple/5">
                  <CardContent className="flex items-center justify-between p-6">
                    <p className="text-muted-foreground">
                      Sign in to save exercises and breathwork practices to your personal routine
                    </p>
                    <Button onClick={login} className="bg-neon-purple hover:bg-neon-purple/90">
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Breathwork Station */}
              <BreathworkStationCard
                routineBreathworkIds={routineBreathworkIds}
                onToggleBreathwork={handleToggleItem}
                isAuthenticated={isLoginSuccess}
              />

              {/* Muscle Groups */}
              {muscleGroups.map((muscleGroup) => (
                <MuscleGroupCard
                  key={muscleGroup}
                  muscleGroup={muscleGroup}
                  routineExerciseIds={routineExerciseIds}
                  onToggleExercise={handleToggleItem}
                  isAuthenticated={isLoginSuccess}
                />
              ))}
            </div>
          )}

          {/* Routine View */}
          {activeView === 'routine' && (
            <div className="space-y-6">
              {!isLoginSuccess ? (
                <Card className="border-border/40">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Dumbbell className="mb-4 h-16 w-16 text-muted-foreground" />
                    <p className="mb-4 text-lg text-muted-foreground">
                      Sign in to create and manage your routine
                    </p>
                    <Button onClick={login} className="bg-neon-purple hover:bg-neon-purple/90">
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              ) : !routine || totalRoutineItems === 0 ? (
                <Card className="border-border/40">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Dumbbell className="mb-4 h-16 w-16 text-muted-foreground" />
                    <p className="mb-2 text-lg font-semibold">Your routine is empty</p>
                    <p className="mb-4 text-muted-foreground">
                      Add exercises and breathwork practices from the library by checking the boxes
                    </p>
                    <Button 
                      onClick={() => setActiveView('library')}
                      className="bg-neon-purple hover:bg-neon-purple/90"
                    >
                      Browse Library
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="border-neon-purple/30 bg-neon-purple/5">
                    <CardHeader>
                      <CardTitle className="text-2xl">My Routine</CardTitle>
                      <CardDescription>
                        {routineExerciseIds.length} {routineExerciseIds.length === 1 ? 'exercise' : 'exercises'} 
                        {' • '}
                        {routineBreathworkIds.length} breathwork {routineBreathworkIds.length === 1 ? 'practice' : 'practices'}
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Breathwork Section */}
                  <RoutineBreathworkSection
                    breathworkPractices={breathworkPractices}
                    routineBreathworkIds={routineBreathworkIds}
                    onToggleBreathwork={handleToggleItem}
                    allExercises={allExercises}
                  />

                  {/* Muscle Groups */}
                  {muscleGroups.map((muscleGroup) => (
                    <RoutineMuscleGroupSection
                      key={muscleGroup}
                      muscleGroup={muscleGroup}
                      exercises={exercisesByMuscleGroup[muscleGroup]}
                      routineExerciseIds={routineExerciseIds}
                      onToggleExercise={handleToggleItem}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
