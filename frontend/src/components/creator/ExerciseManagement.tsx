import { useState } from 'react';
import { useGetAllExercises, useAddExercise, useUpdateExercise, useDeleteExercise } from '@/hooks/useQueries';
import { MuscleGroup, EquipmentType, type Exercise } from '@/backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Loader2, AlertCircle, CheckCircle2, Dumbbell, Video } from 'lucide-react';
import { toast } from 'sonner';

// Helper to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

const getMuscleGroupLabel = (muscle: MuscleGroup): string => {
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
  return labels[muscle];
};

const getEquipmentLabel = (equipment: EquipmentType): string => {
  const labels: Record<EquipmentType, string> = {
    [EquipmentType.machine]: 'Machine',
    [EquipmentType.dumbbell]: 'Dumbbell',
    [EquipmentType.cable]: 'Cable',
    [EquipmentType.bodyweight]: 'Bodyweight',
  };
  return labels[equipment];
};

export default function ExerciseManagement() {
  const { data: exercises = [], isLoading, error } = useGetAllExercises();
  const addExercise = useAddExercise();
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    primaryMuscle: MuscleGroup.chest,
    secondaryMuscles: [] as MuscleGroup[],
    equipmentType: EquipmentType.machine,
    videoUrl: '',
    cues: '',
    imageUrl: '',
    isPlaceholder: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      primaryMuscle: MuscleGroup.chest,
      secondaryMuscles: [],
      equipmentType: EquipmentType.machine,
      videoUrl: '',
      cues: '',
      imageUrl: '',
      isPlaceholder: false,
    });
    setValidationErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Exercise name is required');
    }

    if (!formData.cues.trim()) {
      errors.push('Movement cues are required');
    }

    if (!formData.videoUrl.trim()) {
      errors.push('Video URL is required');
    }

    if (!formData.imageUrl.trim()) {
      errors.push('Image URL is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors before adding');
      return;
    }

    try {
      await addExercise.mutateAsync(formData);
      toast.success('Exercise added successfully');
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add exercise';
      toast.error(errorMessage);
      console.error('Add exercise error:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingExercise) return;
    
    if (!validateForm()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      await updateExercise.mutateAsync({
        id: editingExercise.id,
        ...formData,
      });
      toast.success('Exercise updated successfully');
      setIsEditDialogOpen(false);
      setEditingExercise(null);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update exercise';
      toast.error(errorMessage);
      console.error('Edit exercise error:', error);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteExercise.mutateAsync(id);
      toast.success('Exercise deleted successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete exercise';
      toast.error(errorMessage);
      console.error('Delete exercise error:', error);
    }
  };

  const openEditDialog = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      primaryMuscle: exercise.primaryMuscle,
      secondaryMuscles: exercise.secondaryMuscles,
      equipmentType: exercise.equipmentType,
      videoUrl: exercise.videoUrl,
      cues: exercise.cues,
      imageUrl: exercise.imageUrl,
      isPlaceholder: exercise.isPlaceholder,
    });
    setValidationErrors([]);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load exercises. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {exercises.length === 0 && (
        <Alert className="border-neon-purple/30 bg-neon-purple/5">
          <Dumbbell className="h-5 w-5 text-neon-purple" />
          <AlertDescription className="ml-2">
            <p className="font-medium text-neon-purple">No exercises yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Add Exercise" below to create your first exercise for the workout library
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-neon-purple hover:bg-neon-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Add New Exercise</DialogTitle>
              <DialogDescription>
                Create a new exercise with video demonstration and movement cues. You can use local assets (/assets/...) or external URLs (https://...).
              </DialogDescription>
            </DialogHeader>
            <ExerciseForm 
              formData={formData} 
              setFormData={setFormData}
              validationErrors={validationErrors}
              onValidate={validateForm}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={addExercise.isPending}>
                {addExercise.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Exercise
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingExercise(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>
              Update exercise details. You can use local assets (/assets/...) or external URLs (https://...).
            </DialogDescription>
          </DialogHeader>
          <ExerciseForm 
            formData={formData} 
            setFormData={setFormData}
            validationErrors={validationErrors}
            onValidate={validateForm}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={updateExercise.isPending}>
              {updateExercise.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Primary Muscle</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Dumbbell className="h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-muted-foreground">No exercises found</p>
                      <p className="mt-1 text-sm text-muted-foreground/70">
                        Add your first exercise to get started
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              exercises.map((exercise) => (
                <TableRow key={exercise.id.toString()}>
                  <TableCell className="font-medium">{exercise.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getMuscleGroupLabel(exercise.primaryMuscle)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getEquipmentLabel(exercise.equipmentType)}</Badge>
                  </TableCell>
                  <TableCell>
                    {exercise.isPlaceholder ? (
                      <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-500">
                        Placeholder
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-500/20 text-green-500">
                        Complete
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(exercise)}
                        title="Edit exercise"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete exercise">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{exercise.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(exercise.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface ExerciseFormProps {
  formData: {
    name: string;
    primaryMuscle: MuscleGroup;
    secondaryMuscles: MuscleGroup[];
    equipmentType: EquipmentType;
    videoUrl: string;
    cues: string;
    imageUrl: string;
    isPlaceholder: boolean;
  };
  setFormData: (data: any) => void;
  validationErrors: string[];
  onValidate: () => boolean;
}

function ExerciseForm({ formData, setFormData, validationErrors, onValidate }: ExerciseFormProps) {
  const muscleGroups = Object.values(MuscleGroup);
  const equipmentTypes = Object.values(EquipmentType);

  const toggleSecondaryMuscle = (muscle: MuscleGroup) => {
    const current = formData.secondaryMuscles;
    if (current.includes(muscle)) {
      setFormData({ ...formData, secondaryMuscles: current.filter((m) => m !== muscle) });
    } else {
      setFormData({ ...formData, secondaryMuscles: [...current, muscle] });
    }
  };

  return (
    <div className="space-y-4">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="ml-2 list-inside list-disc text-sm">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Exercise Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Barbell Bench Press"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryMuscle">Primary Muscle *</Label>
          <Select
            value={formData.primaryMuscle}
            onValueChange={(value) => setFormData({ ...formData, primaryMuscle: value as MuscleGroup })}
          >
            <SelectTrigger id="primaryMuscle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {muscleGroups.map((muscle) => (
                <SelectItem key={muscle} value={muscle}>
                  {getMuscleGroupLabel(muscle)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipmentType">Equipment Type *</Label>
          <Select
            value={formData.equipmentType}
            onValueChange={(value) => setFormData({ ...formData, equipmentType: value as EquipmentType })}
          >
            <SelectTrigger id="equipmentType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {equipmentTypes.map((equipment) => (
                <SelectItem key={equipment} value={equipment}>
                  {getEquipmentLabel(equipment)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Secondary Muscles (Optional)</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {muscleGroups
            .filter((m) => m !== formData.primaryMuscle)
            .map((muscle) => (
              <div key={muscle} className="flex items-center space-x-2">
                <Checkbox
                  id={`secondary-${muscle}`}
                  checked={formData.secondaryMuscles.includes(muscle)}
                  onCheckedChange={() => toggleSecondaryMuscle(muscle)}
                />
                <Label htmlFor={`secondary-${muscle}`} className="text-sm font-normal">
                  {getMuscleGroupLabel(muscle)}
                </Label>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL *</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="/assets/... or https://..."
        />
        <p className="text-xs text-muted-foreground">
          Use /assets/... for local images or https://... for external URLs
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL *</Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          placeholder="/assets/... or https://..."
        />
        <p className="text-xs text-muted-foreground">
          Use /assets/... for local videos or https://... for external URLs (YouTube, Vimeo, etc.)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cues">Movement Cues *</Label>
        <Textarea
          id="cues"
          value={formData.cues}
          onChange={(e) => setFormData({ ...formData, cues: e.target.value })}
          placeholder="Detailed form cues and technique tips..."
          rows={5}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPlaceholder"
          checked={formData.isPlaceholder}
          onCheckedChange={(checked) => setFormData({ ...formData, isPlaceholder: checked as boolean })}
        />
        <Label htmlFor="isPlaceholder" className="text-sm font-normal">
          Mark as placeholder (for exercises still being prepared)
        </Label>
      </div>
    </div>
  );
}
