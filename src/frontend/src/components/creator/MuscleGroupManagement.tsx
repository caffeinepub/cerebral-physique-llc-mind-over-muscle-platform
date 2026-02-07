import { useState } from 'react';
import { useGetMuscleGroupCards, useUpdateMuscleGroupCard } from '@/hooks/useQueries';
import { type MuscleGroupCard } from '@/backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Loader2, AlertCircle, Dumbbell, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const muscleGroupNames = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
];

export default function MuscleGroupManagement() {
  const { data: muscleGroupCards = [], isLoading, error } = useGetMuscleGroupCards();
  const updateCard = useUpdateMuscleGroupCard();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingName, setEditingName] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState<MuscleGroupCard>({
    title: '',
    description: '',
    imageUrl: '',
    heroImage: undefined,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      heroImage: undefined,
    });
    setEditingName('');
    setImageError(false);
  };

  const openEditDialog = (name: string) => {
    const existingCard = muscleGroupCards.find((card) => card.title === name);
    
    if (existingCard) {
      setFormData({
        title: existingCard.title,
        description: existingCard.description,
        imageUrl: existingCard.imageUrl,
        heroImage: existingCard.heroImage,
      });
    } else {
      setFormData({
        title: name,
        description: `Explore ${name.toLowerCase()} exercises with detailed form cues and video demonstrations.`,
        imageUrl: '',
        heroImage: undefined,
      });
    }
    
    setEditingName(name);
    setImageError(false);
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.imageUrl.trim()) {
      toast.error('Image URL is required');
      return;
    }

    try {
      await updateCard.mutateAsync({
        name: editingName,
        card: formData,
      });
      toast.success('Muscle group card updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update muscle group card';
      toast.error(errorMessage);
      console.error('Update muscle group card error:', error);
    }
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
          Failed to load muscle group cards. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-neon-purple/30 bg-neon-purple/5">
        <Dumbbell className="h-5 w-5 text-neon-purple" />
        <AlertDescription className="ml-2">
          <p className="font-medium text-neon-purple">Customize Muscle Group Cards</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit the display content for each muscle group card shown in the Workout Library. You can add custom images, descriptions, and titles.
          </p>
        </AlertDescription>
      </Alert>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit {editingName} Card</DialogTitle>
            <DialogDescription>
              Customize the display content for the {editingName} muscle group card
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Card Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Chest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the muscle group and what users will find..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setImageError(false);
                }}
                placeholder="/assets/... or https://..."
              />
              <p className="text-xs text-muted-foreground">
                Use /assets/... for local images or https://... for external URLs
              </p>
            </div>

            {formData.imageUrl && (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/40 bg-muted">
                  {!imageError ? (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto mb-2 h-8 w-8" />
                        <p className="text-sm">Failed to load image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateCard.isPending}>
              {updateCard.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {muscleGroupNames.map((name) => {
          const card = muscleGroupCards.find((c) => c.title === name);
          const hasCustomContent = !!card && (card.imageUrl !== '' || card.description !== `This is the default description for the ${name} muscle group. Please add a more detailed description.`);

          return (
            <Card key={name} className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {name}
                  {hasCustomContent && (
                    <span className="text-xs font-normal text-green-500">Customized</span>
                  )}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {card?.description || `Default ${name.toLowerCase()} description`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => openEditDialog(name)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Card
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
