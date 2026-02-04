import { useState } from 'react';
import { useGetAllExercises, useAddExercise, useEditExercise, useDeleteExercise } from '@/hooks/useQueries';
import { MuscleGroup, EquipmentType, DifficultyLevel, type Exercise } from '@/backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Loader2, Eye, AlertCircle, CheckCircle2, Video, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

// Helper to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
};

export default function ExerciseManagement() {
  const { data: exercises = [], isLoading, error } = useGetAllExercises();
  const addExercise = useAddExercise();
  const editExercise = useEditExercise();
  const deleteExercise = useDeleteExercise();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: MuscleGroup.chest,
    equipmentType: EquipmentType.barbell,
    difficulty: DifficultyLevel.beginner,
    instructions: '',
    mediaUrl: '',
    imageUrl: '',
    benefits: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      muscleGroup: MuscleGroup.chest,
      equipmentType: EquipmentType.barbell,
      difficulty: DifficultyLevel.beginner,
      instructions: '',
      mediaUrl: '',
      imageUrl: '',
      benefits: '',
    });
    setValidationErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Exercise name is required');
    }

    if (!formData.instructions.trim()) {
      errors.push('Instructions are required');
    }

    if (!formData.benefits.trim()) {
      errors.push('Benefits description is required');
    }

    if (!formData.mediaUrl.trim()) {
      errors.push('Media URL is required');
    } else if (!formData.mediaUrl.startsWith('/assets/')) {
      errors.push('Media URL must start with /assets/');
    }

    if (!formData.imageUrl.trim()) {
      errors.push('Image URL is required');
    } else if (!formData.imageUrl.startsWith('/assets/')) {
      errors.push('Image URL must start with /assets/');
    }

    // Validate muscle group correspondence
    const nameLower = formData.name.toLowerCase();
    const muscleGroupName = formData.muscleGroup.toLowerCase();
    
    // Basic validation for common muscle group keywords
    const muscleGroupKeywords: Record<string, string[]> = {
      chest: ['chest', 'pec', 'press', 'fly', 'flye', 'push-up', 'pushup', 'dip', 'bench'],
      back: ['back', 'row', 'pull', 'lat', 'deadlift'],
      legs: ['leg', 'squat', 'lunge', 'calf', 'thigh', 'quad', 'hamstring', 'hip'],
      shoulders: ['shoulder', 'delt', 'overhead', 'lateral', 'front raise', 'shrug'],
      arms: ['bicep', 'tricep', 'curl', 'arm', 'extension'],
      core: ['core', 'ab', 'plank', 'crunch', 'twist', 'sit-up'],
    };

    const keywords = muscleGroupKeywords[muscleGroupName] || [];
    const hasKeyword = keywords.some(keyword => nameLower.includes(keyword));
    
    if (!hasKeyword && formData.name.trim()) {
      errors.push(`Exercise name "${formData.name}" may not match muscle group "${muscleGroupName}". Please verify this is correct.`);
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
      await editExercise.mutateAsync({
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
      muscleGroup: exercise.muscleGroup,
      equipmentType: exercise.equipmentType,
      difficulty: exercise.difficultyLevel,
      instructions: exercise.instructions,
      mediaUrl: exercise.mediaUrl,
      imageUrl: exercise.imageUrl,
      benefits: exercise.benefits,
    });
    setValidationErrors([]);
    setIsEditDialogOpen(true);
  };

  const openPreview = () => {
    const previewData: Exercise = {
      id: BigInt(0),
      name: formData.name,
      muscleGroup: formData.muscleGroup,
      equipmentType: formData.equipmentType,
      difficultyLevel: formData.difficulty,
      instructions: formData.instructions,
      mediaUrl: formData.mediaUrl,
      imageUrl: formData.imageUrl,
      benefits: formData.benefits,
    };
    setPreviewExercise(previewData);
    setIsPreviewDialogOpen(true);
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
      {/* Empty State Message */}
      {exercises.length === 0 && (
        <Alert className="border-neon-purple/30 bg-neon-purple/5">
          <Dumbbell className="h-5 w-5 text-neon-purple" />
          <AlertDescription className="ml-2">
            <p className="font-medium text-neon-purple">No custom exercises yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Add Exercise" below to create your first custom exercise for the workout library
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Add Exercise Button */}
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
                Create a new exercise with video/image demonstration and detailed benefits
              </DialogDescription>
            </DialogHeader>
            <ExerciseForm 
              formData={formData} 
              setFormData={setFormData}
              validationErrors={validationErrors}
              onValidate={validateForm}
            />
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={openPreview} disabled={!formData.name || !formData.mediaUrl}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={addExercise.isPending}>
                  {addExercise.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Exercise
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Exercise Dialog */}
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
              Update exercise details including video/image and benefits
            </DialogDescription>
          </DialogHeader>
          <ExerciseForm 
            formData={formData} 
            setFormData={setFormData}
            validationErrors={validationErrors}
            onValidate={validateForm}
          />
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={openPreview} disabled={!formData.name || !formData.mediaUrl}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={editExercise.isPending}>
                {editExercise.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Exercise Preview</DialogTitle>
            <DialogDescription>
              Preview how this exercise will appear in the workout library
            </DialogDescription>
          </DialogHeader>
          {previewExercise && (
            <ExercisePreviewCard exercise={previewExercise} />
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exercises Table */}
      <div className="rounded-md border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Muscle Group</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Media</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
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
                    <Badge variant="outline">{exercise.muscleGroup}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{exercise.equipmentType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{exercise.difficultyLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    {isVideoUrl(exercise.mediaUrl) ? (
                      <Badge variant="outline" className="gap-1">
                        <Video className="h-3 w-3" />
                        Video
                      </Badge>
                    ) : (
                      <Badge variant="outline">Image</Badge>
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
                              Are you sure you want to delete "{exercise.name}"? This action cannot be undone and will remove the exercise from all user routines.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(exercise.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {deleteExercise.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
    muscleGroup: MuscleGroup;
    equipmentType: EquipmentType;
    difficulty: DifficultyLevel;
    instructions: string;
    mediaUrl: string;
    imageUrl: string;
    benefits: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    muscleGroup: MuscleGroup;
    equipmentType: EquipmentType;
    difficulty: DifficultyLevel;
    instructions: string;
    mediaUrl: string;
    imageUrl: string;
    benefits: string;
  }>>;
  validationErrors: string[];
  onValidate: () => boolean;
}

function ExerciseForm({ formData, setFormData, validationErrors, onValidate }: ExerciseFormProps) {
  const [mediaError, setMediaError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasVideo = isVideoUrl(formData.mediaUrl);

  const handleMediaUrlChange = (url: string) => {
    setFormData({ ...formData, mediaUrl: url });
    setMediaError(false);
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setImageError(false);
  };

  return (
    <div className="space-y-4">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="ml-2 list-inside list-disc space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
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
          onBlur={onValidate}
          placeholder="e.g., Barbell Bench Press, Incline Dumbbell Flyes"
          className={validationErrors.some(e => e.includes('name')) ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">
          Use correct, verified exercise names that match the muscle group
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="muscleGroup">Muscle Group *</Label>
          <Select
            value={formData.muscleGroup}
            onValueChange={(value) => {
              setFormData({ ...formData, muscleGroup: value as MuscleGroup });
              setTimeout(onValidate, 100);
            }}
          >
            <SelectTrigger id="muscleGroup">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MuscleGroup.chest}>Chest</SelectItem>
              <SelectItem value={MuscleGroup.back}>Back</SelectItem>
              <SelectItem value={MuscleGroup.legs}>Legs</SelectItem>
              <SelectItem value={MuscleGroup.shoulders}>Shoulders</SelectItem>
              <SelectItem value={MuscleGroup.arms}>Arms</SelectItem>
              <SelectItem value={MuscleGroup.core}>Core</SelectItem>
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
              <SelectItem value={EquipmentType.barbell}>Barbell</SelectItem>
              <SelectItem value={EquipmentType.dumbbell}>Dumbbell</SelectItem>
              <SelectItem value={EquipmentType.cable}>Cable</SelectItem>
              <SelectItem value={EquipmentType.machine}>Machine</SelectItem>
              <SelectItem value={EquipmentType.bodyweight}>Bodyweight</SelectItem>
              <SelectItem value={EquipmentType.bands}>Bands</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty Level *</Label>
        <Select
          value={formData.difficulty}
          onValueChange={(value) => setFormData({ ...formData, difficulty: value as DifficultyLevel })}
        >
          <SelectTrigger id="difficulty">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DifficultyLevel.beginner}>Beginner</SelectItem>
            <SelectItem value={DifficultyLevel.intermediate}>Intermediate</SelectItem>
            <SelectItem value={DifficultyLevel.advanced}>Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Movement Instructions *</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          onBlur={onValidate}
          placeholder="Detailed instructions explaining proper form, setup, execution technique, and safety considerations..."
          rows={4}
          className={validationErrors.some(e => e.includes('Instructions')) ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">
          Provide factual, detailed movement descriptions
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="benefits">Benefits *</Label>
        <Textarea
          id="benefits"
          value={formData.benefits}
          onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
          onBlur={onValidate}
          placeholder="Explain muscle targets, stability benefits, mind-muscle connection, longevity benefits, and functional applications..."
          rows={4}
          className={validationErrors.some(e => e.includes('Benefits')) ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">
          Detail primary/secondary muscles, stability, mind-muscle connection, and longevity benefits
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Primary Media URL (Video or Image) *</Label>
        <div className="space-y-2">
          <Input
            id="mediaUrl"
            value={formData.mediaUrl}
            onChange={(e) => handleMediaUrlChange(e.target.value)}
            onBlur={onValidate}
            placeholder="/assets/generated/exercise-name.dim_400x300.mp4 or .jpg"
            className={validationErrors.some(e => e.includes('Media URL')) ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground">
            Use unique video (.mp4) or image (.jpg) that accurately demonstrates the exercise
          </p>
          
          {/* Media Preview */}
          {formData.mediaUrl && (
            <div className="relative mt-2 overflow-hidden rounded-lg border border-border/40">
              {!mediaError ? (
                hasVideo ? (
                  <video
                    src={formData.mediaUrl}
                    className="h-48 w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setMediaError(true)}
                  />
                ) : (
                  <img
                    src={formData.mediaUrl}
                    alt="Exercise preview"
                    className="h-48 w-full object-cover"
                    onError={() => setMediaError(true)}
                  />
                )
              ) : (
                <div className="flex h-48 items-center justify-center bg-muted">
                  <div className="text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Failed to load media</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Fallback Image URL *</Label>
        <div className="space-y-2">
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            onBlur={onValidate}
            placeholder="/assets/generated/exercise-name.dim_400x300.jpg"
            className={validationErrors.some(e => e.includes('Image URL')) ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground">
            Provide a unique image that matches the exercise (used as fallback or alternative view)
          </p>
          
          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="relative mt-2 overflow-hidden rounded-lg border border-border/40">
              {!imageError ? (
                <img
                  src={formData.imageUrl}
                  alt="Exercise fallback preview"
                  className="h-48 w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-muted">
                  <div className="text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Failed to load image</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Validation Status */}
      {validationErrors.length === 0 && formData.name && formData.instructions && formData.benefits && formData.mediaUrl && formData.imageUrl && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            All fields are valid and ready to save
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface ExercisePreviewCardProps {
  exercise: Exercise;
}

function ExercisePreviewCard({ exercise }: ExercisePreviewCardProps) {
  const [mediaError, setMediaError] = useState(false);
  const hasVideo = isVideoUrl(exercise.mediaUrl);

  // Parse benefits into array if it's a string
  const benefitsList = exercise.benefits.split('\n').filter(b => b.trim());

  return (
    <Card className="overflow-hidden border-border/40 bg-card/50">
      <div className="relative h-48 overflow-hidden">
        {!mediaError ? (
          hasVideo ? (
            <video
              src={exercise.mediaUrl}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              onError={() => setMediaError(true)}
            />
          ) : (
            <img
              src={exercise.mediaUrl}
              alt={exercise.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setMediaError(true)}
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="text-lg font-bold">{exercise.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">{exercise.muscleGroup}</Badge>
            <Badge variant="secondary">{exercise.equipmentType}</Badge>
            <Badge>{exercise.difficultyLevel}</Badge>
            {hasVideo && (
              <Badge variant="outline" className="gap-1">
                <Video className="h-3 w-3" />
                Video
              </Badge>
            )}
          </div>
        </div>
        
        <div className="rounded-md border border-neon-purple/20 bg-neon-purple/5 p-3">
          <p className="text-xs font-medium text-neon-purple">How to perform:</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{exercise.instructions}</p>
        </div>

        <div className="rounded-md border border-deep-blue/20 bg-deep-blue/5 p-3">
          <p className="text-xs font-medium text-deep-blue">Benefits:</p>
          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {benefitsList.length > 0 ? (
              <ul className="space-y-0.5">
                {benefitsList.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-deep-blue" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{exercise.benefits}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
