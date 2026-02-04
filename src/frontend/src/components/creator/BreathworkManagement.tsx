import { useState } from 'react';
import { useGetAllBreathworkPractices, useGetAllExercises, useAddBreathworkPractice, useEditBreathworkPractice, useDeleteBreathworkPractice } from '@/hooks/useQueries';
import { DifficultyLevel, type BreathworkPractice, type Exercise } from '@/backend';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2, Loader2, Eye, AlertCircle, CheckCircle2, Wind } from 'lucide-react';
import { toast } from 'sonner';

export default function BreathworkManagement() {
  const { data: breathworkPractices = [], isLoading, error } = useGetAllBreathworkPractices();
  const { data: exercises = [] } = useGetAllExercises();
  const addBreathwork = useAddBreathworkPractice();
  const editBreathwork = useEditBreathworkPractice();
  const deleteBreathwork = useDeleteBreathworkPractice();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState<BreathworkPractice | null>(null);
  const [previewPractice, setPreviewPractice] = useState<BreathworkPractice | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    techniqueDescription: '',
    mediaUrl: '',
    recommendedExerciseIds: [] as bigint[],
    mindfulnessBenefits: '',
    duration: '',
    difficulty: DifficultyLevel.beginner,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      techniqueDescription: '',
      mediaUrl: '',
      recommendedExerciseIds: [],
      mindfulnessBenefits: '',
      duration: '',
      difficulty: DifficultyLevel.beginner,
    });
    setValidationErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Practice name is required');
    }

    if (!formData.techniqueDescription.trim()) {
      errors.push('Technique description is required');
    }

    if (!formData.mindfulnessBenefits.trim()) {
      errors.push('Mindfulness benefits are required');
    }

    if (!formData.mediaUrl.trim()) {
      errors.push('Image URL is required');
    } else if (!formData.mediaUrl.startsWith('/assets/')) {
      errors.push('Image URL must start with /assets/');
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      errors.push('Duration must be a positive number (in minutes)');
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
      await addBreathwork.mutateAsync({
        name: formData.name,
        techniqueDescription: formData.techniqueDescription,
        mediaUrl: formData.mediaUrl,
        recommendedExerciseIds: formData.recommendedExerciseIds,
        mindfulnessBenefits: formData.mindfulnessBenefits,
        duration: BigInt(parseInt(formData.duration)),
        difficulty: formData.difficulty,
      });
      toast.success('Breathwork practice added successfully');
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add breathwork practice';
      toast.error(errorMessage);
      console.error('Add breathwork error:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingPractice) return;
    
    if (!validateForm()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      await editBreathwork.mutateAsync({
        id: editingPractice.id,
        name: formData.name,
        techniqueDescription: formData.techniqueDescription,
        mediaUrl: formData.mediaUrl,
        recommendedExerciseIds: formData.recommendedExerciseIds,
        mindfulnessBenefits: formData.mindfulnessBenefits,
        duration: BigInt(parseInt(formData.duration)),
        difficulty: formData.difficulty,
      });
      toast.success('Breathwork practice updated successfully');
      setIsEditDialogOpen(false);
      setEditingPractice(null);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update breathwork practice';
      toast.error(errorMessage);
      console.error('Edit breathwork error:', error);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteBreathwork.mutateAsync(id);
      toast.success('Breathwork practice deleted successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete breathwork practice';
      toast.error(errorMessage);
      console.error('Delete breathwork error:', error);
    }
  };

  const openEditDialog = (practice: BreathworkPractice) => {
    setEditingPractice(practice);
    setFormData({
      name: practice.name,
      techniqueDescription: practice.techniqueDescription,
      mediaUrl: practice.mediaUrl,
      recommendedExerciseIds: practice.recommendedExerciseIds,
      mindfulnessBenefits: practice.mindfulnessBenefits,
      duration: practice.duration.toString(),
      difficulty: practice.difficultyLevel,
    });
    setValidationErrors([]);
    setIsEditDialogOpen(true);
  };

  const openPreview = () => {
    const previewData: BreathworkPractice = {
      id: BigInt(0),
      name: formData.name,
      techniqueDescription: formData.techniqueDescription,
      mediaUrl: formData.mediaUrl,
      recommendedExerciseIds: formData.recommendedExerciseIds,
      mindfulnessBenefits: formData.mindfulnessBenefits,
      duration: BigInt(parseInt(formData.duration) || 0),
      difficultyLevel: formData.difficulty,
    };
    setPreviewPractice(previewData);
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
          Failed to load breathwork practices. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Empty State Message */}
      {breathworkPractices.length === 0 && (
        <Alert className="border-neon-purple/30 bg-neon-purple/5">
          <Wind className="h-5 w-5 text-neon-purple" />
          <AlertDescription className="ml-2">
            <p className="font-medium text-neon-purple">No custom breathwork practices yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Add Breathwork Practice" below to create your first breathwork practice for the Mind Over Muscle philosophy
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Add Breathwork Button */}
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-neon-purple hover:bg-neon-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Breathwork Practice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Add New Breathwork Practice</DialogTitle>
              <DialogDescription>
                Create a new breathwork practice for the Mind Over Muscle philosophy
              </DialogDescription>
            </DialogHeader>
            <BreathworkForm 
              formData={formData} 
              setFormData={setFormData}
              validationErrors={validationErrors}
              onValidate={validateForm}
              exercises={exercises}
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
                <Button onClick={handleAdd} disabled={addBreathwork.isPending}>
                  {addBreathwork.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Practice
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingPractice(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Breathwork Practice</DialogTitle>
            <DialogDescription>
              Update breathwork practice details and exercise pairings
            </DialogDescription>
          </DialogHeader>
          <BreathworkForm 
            formData={formData} 
            setFormData={setFormData}
            validationErrors={validationErrors}
            onValidate={validateForm}
            exercises={exercises}
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
              <Button onClick={handleEdit} disabled={editBreathwork.isPending}>
                {editBreathwork.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Breathwork Practice Preview</DialogTitle>
            <DialogDescription>
              Preview how this practice will appear in the Breathwork Station
            </DialogDescription>
          </DialogHeader>
          {previewPractice && (
            <BreathworkPreviewCard practice={previewPractice} exercises={exercises} />
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Breathwork Practices Table */}
      <div className="rounded-md border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Pairings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breathworkPractices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Wind className="h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-muted-foreground">No breathwork practices found</p>
                      <p className="mt-1 text-sm text-muted-foreground/70">
                        Add your first practice to get started
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              breathworkPractices.map((practice) => (
                <TableRow key={practice.id.toString()}>
                  <TableCell className="font-medium">{practice.name}</TableCell>
                  <TableCell>{practice.duration.toString()} min</TableCell>
                  <TableCell>
                    <Badge>{practice.difficultyLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{practice.recommendedExerciseIds.length} exercises</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(practice)}
                        title="Edit practice"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete practice">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Breathwork Practice</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{practice.name}"? This action cannot be undone and will remove the practice from all user routines.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(practice.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {deleteBreathwork.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

interface BreathworkFormProps {
  formData: {
    name: string;
    techniqueDescription: string;
    mediaUrl: string;
    recommendedExerciseIds: bigint[];
    mindfulnessBenefits: string;
    duration: string;
    difficulty: DifficultyLevel;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    techniqueDescription: string;
    mediaUrl: string;
    recommendedExerciseIds: bigint[];
    mindfulnessBenefits: string;
    duration: string;
    difficulty: DifficultyLevel;
  }>>;
  validationErrors: string[];
  onValidate: () => boolean;
  exercises: Exercise[];
}

function BreathworkForm({ formData, setFormData, validationErrors, onValidate, exercises }: BreathworkFormProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, mediaUrl: url });
    setImageError(false);
  };

  const toggleExercise = (exerciseId: bigint) => {
    const isSelected = formData.recommendedExerciseIds.some(id => id === exerciseId);
    if (isSelected) {
      setFormData({
        ...formData,
        recommendedExerciseIds: formData.recommendedExerciseIds.filter(id => id !== exerciseId),
      });
    } else {
      setFormData({
        ...formData,
        recommendedExerciseIds: [...formData.recommendedExerciseIds, exerciseId],
      });
    }
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
        <Label htmlFor="name">Practice Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onBlur={onValidate}
          placeholder="e.g., Box Breathing, Diaphragmatic Breathing"
          className={validationErrors.some(e => e.includes('name')) ? 'border-destructive' : ''}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            onBlur={onValidate}
            placeholder="5"
            className={validationErrors.some(e => e.includes('Duration')) ? 'border-destructive' : ''}
          />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="techniqueDescription">Technique Description *</Label>
        <Textarea
          id="techniqueDescription"
          value={formData.techniqueDescription}
          onChange={(e) => setFormData({ ...formData, techniqueDescription: e.target.value })}
          onBlur={onValidate}
          placeholder="Detailed instructions on how to perform this breathing technique..."
          rows={4}
          className={validationErrors.some(e => e.includes('Technique')) ? 'border-destructive' : ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mindfulnessBenefits">Mindfulness & Focus Benefits *</Label>
        <Textarea
          id="mindfulnessBenefits"
          value={formData.mindfulnessBenefits}
          onChange={(e) => setFormData({ ...formData, mindfulnessBenefits: e.target.value })}
          onBlur={onValidate}
          placeholder="Describe the mental and physical benefits of this practice..."
          rows={3}
          className={validationErrors.some(e => e.includes('benefits')) ? 'border-destructive' : ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Image URL *</Label>
        <div className="space-y-2">
          <Input
            id="mediaUrl"
            value={formData.mediaUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            onBlur={onValidate}
            placeholder="/assets/generated/breathing-visual.dim_400x400.jpg"
            className={validationErrors.some(e => e.includes('Image URL')) ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground">
            Use calm, meditative images from /assets/generated/
          </p>
          
          {/* Image Preview */}
          {formData.mediaUrl && (
            <div className="relative mt-2 overflow-hidden rounded-lg border border-border/40">
              {!imageError ? (
                <img
                  src={formData.mediaUrl}
                  alt="Practice preview"
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

      <div className="space-y-2">
        <Label>Recommended Exercise Pairings</Label>
        <p className="text-xs text-muted-foreground">
          Select exercises that pair well with this breathwork practice
        </p>
        <ScrollArea className="h-48 rounded-md border border-border/40 p-4">
          <div className="space-y-2">
            {exercises.length === 0 ? (
              <p className="text-sm text-muted-foreground">No exercises available</p>
            ) : (
              exercises.map((exercise) => (
                <div key={exercise.id.toString()} className="flex items-center space-x-2">
                  <Checkbox
                    id={`exercise-${exercise.id}`}
                    checked={formData.recommendedExerciseIds.some(id => id === exercise.id)}
                    onCheckedChange={() => toggleExercise(exercise.id)}
                  />
                  <label
                    htmlFor={`exercise-${exercise.id}`}
                    className="flex-1 cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {exercise.name} <span className="text-muted-foreground">({exercise.muscleGroup})</span>
                  </label>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <p className="text-xs text-muted-foreground">
          {formData.recommendedExerciseIds.length} exercise{formData.recommendedExerciseIds.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Validation Status */}
      {validationErrors.length === 0 && formData.name && formData.techniqueDescription && formData.mindfulnessBenefits && formData.mediaUrl && formData.duration && (
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

interface BreathworkPreviewCardProps {
  practice: BreathworkPractice;
  exercises: Exercise[];
}

function BreathworkPreviewCard({ practice, exercises }: BreathworkPreviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const pairedExercises = exercises.filter(ex => 
    practice.recommendedExerciseIds.some(id => id === ex.id)
  );

  return (
    <Card className="overflow-hidden border-border/40 bg-card/50">
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <img
            src={practice.mediaUrl}
            alt={practice.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Wind className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white">{practice.name}</h3>
        </div>
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{practice.difficultyLevel}</Badge>
          <Badge variant="outline">{practice.duration.toString()} min</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-neon-purple">Technique:</p>
          <p className="text-sm text-muted-foreground">{practice.techniqueDescription}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-neon-purple">Benefits:</p>
          <p className="text-sm text-muted-foreground">{practice.mindfulnessBenefits}</p>
        </div>
        {pairedExercises.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-neon-purple">Pairs well with:</p>
            <div className="flex flex-wrap gap-1">
              {pairedExercises.slice(0, 3).map(ex => (
                <Badge key={ex.id.toString()} variant="secondary" className="text-xs">
                  {ex.name}
                </Badge>
              ))}
              {pairedExercises.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{pairedExercises.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
