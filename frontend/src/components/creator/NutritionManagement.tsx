import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, Image, Video } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetAllNutritionArticlesAdmin,
  useCreateNutritionArticle,
  useUpdateNutritionArticle,
  usePublishNutritionArticle,
  useDeleteNutritionArticle,
} from '../../hooks/useQueries';
import type { NutritionArticle, BlogMedia } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

interface NutritionFormData {
  title: string;
  content: string;
  author: string;
  memberOnly: boolean;
  imageUrls: string[];
  videoUrls: string[];
}

const defaultForm: NutritionFormData = {
  title: '',
  content: '',
  author: 'Stefan',
  memberOnly: false,
  imageUrls: [],
  videoUrls: [],
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

export default function NutritionManagement() {
  const { data: articles = [], isLoading } = useGetAllNutritionArticlesAdmin();
  const createArticle = useCreateNutritionArticle();
  const updateArticle = useUpdateNutritionArticle();
  const publishArticle = usePublishNutritionArticle();
  const deleteArticle = useDeleteNutritionArticle();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<NutritionFormData>(defaultForm);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (article: NutritionArticle) => {
    setForm({
      title: article.title,
      content: article.content,
      author: article.author,
      memberOnly: article.memberOnly,
      imageUrls: article.media?.imageUrls || [],
      videoUrls: article.media?.videoUrls || [],
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const media: BlogMedia = {
      imageUrls: form.imageUrls,
      videoUrls: form.videoUrls,
    };

    try {
      if (editingId !== null) {
        await updateArticle.mutateAsync({
          id: editingId,
          title: form.title.trim(),
          content: form.content.trim(),
          author: form.author.trim(),
          media,
          memberOnly: form.memberOnly,
        });
        toast.success('Article updated');
      } else {
        await createArticle.mutateAsync({
          title: form.title.trim(),
          content: form.content.trim(),
          author: form.author.trim(),
          media,
          memberOnly: form.memberOnly,
        });
        toast.success('Article created');
      }
      resetForm();
    } catch {
      toast.error('Failed to save article');
    }
  };

  const handlePublishToggle = async (article: NutritionArticle) => {
    try {
      await publishArticle.mutateAsync({ id: article.id, published: !article.published });
      toast.success(article.published ? 'Article unpublished' : 'Article published');
    } catch {
      toast.error('Failed to update publish status');
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast.success('Article deleted');
    } catch {
      toast.error('Failed to delete article');
    }
  };

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
          <h2 className="text-xl font-bold text-foreground">Nutrition Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create and manage nutrition articles with text, images, and videos
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Article
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId !== null ? 'Edit Article' : 'New Nutrition Article'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Article title..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="memberOnly"
                  checked={form.memberOnly}
                  onChange={(e) => setForm({ ...form, memberOnly: e.target.checked })}
                  className="rounded border-border"
                />
                <Label htmlFor="memberOnly" className="cursor-pointer">
                  Members only
                </Label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your nutrition article content here..."
                rows={8}
                required
              />
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
              <UrlArrayInput
                label="Image URLs"
                icon={Image}
                urls={form.imageUrls}
                onChange={(urls) => setForm({ ...form, imageUrls: urls })}
                placeholder="https://... image URL"
              />
              <UrlArrayInput
                label="Video URLs"
                icon={Video}
                urls={form.videoUrls}
                onChange={(urls) => setForm({ ...form, videoUrls: urls })}
                placeholder="https://youtube.com/... or direct video URL"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={createArticle.isPending || updateArticle.isPending}
                size="sm"
              >
                {(createArticle.isPending || updateArticle.isPending) ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-primary-foreground mr-1.5" />
                ) : (
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                )}
                {editingId !== null ? 'Update Article' : 'Create Article'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-3">
        {articles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No nutrition articles yet. Create your first article above.</p>
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id.toString()}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">{article.title}</h4>
                    {article.published ? (
                      <Badge variant="default" className="text-xs">Published</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Draft</Badge>
                    )}
                    {article.memberOnly && (
                      <Badge variant="secondary" className="text-xs">Members Only</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By {article.author} · {new Date(Number(article.createdAt) / 1_000_000).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                    {article.media?.imageUrls?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Image className="w-3 h-3" />
                        {article.media.imageUrls.length} image{article.media.imageUrls.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {article.media?.videoUrls?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {article.media.videoUrls.length} video{article.media.videoUrls.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePublishToggle(article)}
                    disabled={publishArticle.isPending}
                    className="h-8 w-8 p-0"
                    title={article.published ? 'Unpublish' : 'Publish'}
                  >
                    {article.published ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(article)}
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
                        <AlertDialogTitle>Delete Article</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{article.title}"? This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(article.id)}
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
          ))
        )}
      </div>
    </div>
  );
}
