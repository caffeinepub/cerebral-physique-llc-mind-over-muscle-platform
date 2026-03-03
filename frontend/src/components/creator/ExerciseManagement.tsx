import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Image, Video } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetAllExercisesAdmin,
  useAddExercise,
  useUpdateExercise,
  useDeleteExercise,
} from '../../hooks/useQueries';
import { MuscleGroup, EquipmentType, type Exercise, type ExerciseMedia } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface ExerciseFormData {
  name: string;
  description: string;
  primaryMuscle: MuscleGroup;
  equipmentType: EquipmentType;
  videoUrl: string;
  cues: string;
  imageUrls: string[];
  videoUrls: string[];
  isPlaceholder: boolean;
}

const defaultForm: ExerciseFormData = {
  name: '',
  description: '',
  primaryMuscle: MuscleGroup.chest,
  equipmentType: EquipmentType.bodyweight,
  videoUrl: '',
  cues: '',
  imageUrls: [],
  videoUrls: [],
  isPlaceholder: false,
};

function UrlArrayInput({
  label,
  icon: Icon,
  urls,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  urls: string[];
  onChange: (urls: string[]) => void;
  placeholder: string;
}) {
  const [newUrl, setNewUrl] = useState('');

  const addUrl = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    onChange([...urls, trimmed]);
    setNewUrl('');
  };

  const removeUrl = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          className="text-sm"
        />
        <Button type="button" size="sm" variant="outline" onClick={addUrl}>
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
      {urls.length > 0 && (
        <div className="space-y-1.5">
          {urls.map((url, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5">
              <span className="text-xs text-muted-foreground flex-1 truncate">{url}</span>
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExerciseManagement() {
  const { data: exercises = [], isLoading } = useGetAllExercisesAdmin();
  const addExercise = useAddExercise();
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ExerciseFormData>(defaultForm);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (exercise: Exercise) => {
    setForm({
      name: exercise.name,
      description: exercise.description || '',
      primaryMuscle: exercise.primaryMuscle,
      equipmentType: exercise.equipmentType,
      videoUrl: exercise.videoUrl || '',
      cues: exercise.cues || '',
      imageUrls: exercise.media?.imageUrls || [],
      videoUrls: exercise.media?.videoUrls || [],
      isPlaceholder: exercise.isPlaceholder,
    });
    setEditingId(exercise.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Exercise name is required');
      return;
    }

    const media: ExerciseMedia = {
      imageUrls: form.imageUrls,
      videoUrls: form.videoUrls,
    };

    try {
      if (editingId !== null) {
        await updateExercise.mutateAsync({
          id: editingId,
          name: form.name.trim(),
          description: form.description.trim(),
          primaryMuscle: form.primaryMuscle,
          secondaryMuscles: [],
          equipmentType: form.equipmentType,
          videoUrl: form.videoUrl.trim(),
          cues: form.cues.trim(),
          media,
          isPlaceholder: form.isPlaceholder,
        });
        toast.success('Exercise updated successfully');
      } else {
        await addExercise.mutateAsync({
          name: form.name.trim(),
          description: form.description.trim(),
          primaryMuscle: form.primaryMuscle,
          secondaryMuscles: [],
          equipmentType: form.equipmentType,
          videoUrl: form.videoUrl.trim(),
          cues: form.cues.trim(),
          media,
          isPlaceholder: form.isPlaceholder,
        });
        toast.success('Exercise added successfully');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save exercise');
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteExercise.mutateAsync(id);
      toast.success('Exercise deleted');
    } catch {
      toast.error('Failed to delete exercise');
    }
  };

  const muscleGroupOptions = Object.values(MuscleGroup);
  const equipmentOptions = Object.values(EquipmentType);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Exercise Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add and manage exercises with descriptions, images, and videos
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Exercise
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId !== null ? 'Edit Exercise' : 'New Exercise'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Exercise Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Bench Press"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="primaryMuscle">Primary Muscle</Label>
                <Select
                  value={form.primaryMuscle}
                  onValueChange={(v) => setForm({ ...form, primaryMuscle: v as MuscleGroup })}
                >
                  <SelectTrigger id="primaryMuscle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroupOptions.map((mg) => (
                      <SelectItem key={mg} value={mg}>
                        {mg.charAt(0).toUpperCase() + mg.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="equipmentType">Equipment Type</Label>
                <Select
                  value={form.equipmentType}
                  onValueChange={(v) => setForm({ ...form, equipmentType: v as EquipmentType })}
                >
                  <SelectTrigger id="equipmentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentOptions.map((eq) => (
                      <SelectItem key={eq} value={eq}>
                        {eq.charAt(0).toUpperCase() + eq.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="videoUrl">Legacy Video URL</Label>
                <Input
                  id="videoUrl"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://... or /assets/..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the exercise, proper form, benefits..."
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cues">Coaching Cues</Label>
              <Textarea
                id="cues"
                value={form.cues}
                onChange={(e) => setForm({ ...form, cues: e.target.value })}
                placeholder="Key coaching cues and technique tips..."
                rows={2}
              />
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
              <UrlArrayInput
                label="Image URLs"
                icon={Image}
                urls={form.imageUrls}
                onChange={(urls) => setForm({ ...form, imageUrls: urls })}
                placeholder="https://... or /assets/..."
              />
              <UrlArrayInput
                label="Video URLs"
                icon={Video}
                urls={form.videoUrls}
                onChange={(urls) => setForm({ ...form, videoUrls: urls })}
                placeholder="https://youtube.com/... or /assets/..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPlaceholder"
                checked={form.isPlaceholder}
                onChange={(e) => setForm({ ...form, isPlaceholder: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="isPlaceholder" className="cursor-pointer">
                Mark as placeholder (coming soon)
              </Label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={addExercise.isPending || updateExercise.isPending}
                size="sm"
              >
                {(addExercise.isPending || updateExercise.isPending) ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-primary-foreground mr-1.5" />
                ) : (
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                )}
                {editingId !== null ? 'Update Exercise' : 'Add Exercise'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Exercise List */}
      <div className="space-y-3">
        {exercises.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No exercises yet. Add your first exercise above.</p>
          </div>
        ) : (
          exercises.map((exercise) => (
            <div
              key={exercise.id.toString()}
              className="bg-card border border-border rounded-lg p-4 flex items-start gap-4"
            >
              {/* Thumbnail */}
              {exercise.media?.imageUrls?.[0] && (
                <img
                  src={exercise.media.imageUrls[0]}
                  alt={exercise.name}
                  className="w-16 h-16 object-cover rounded-md shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-foreground">{exercise.name}</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {exercise.primaryMuscle}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {exercise.equipmentType}
                      </Badge>
                      {exercise.isPlaceholder && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Placeholder
                        </Badge>
                      )}
                    </div>
                    {exercise.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        {exercise.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                      {exercise.media?.imageUrls?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Image className="w-3 h-3" />
                          {exercise.media.imageUrls.length} image{exercise.media.imageUrls.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {exercise.media?.videoUrls?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {exercise.media.videoUrls.length} video{exercise.media.videoUrls.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(exercise)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
