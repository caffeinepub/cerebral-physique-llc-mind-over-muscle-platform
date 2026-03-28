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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Edit2,
  Eye,
  EyeOff,
  Image,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BlogMedia, BlogPost } from "../../backend";
import {
  useCreateBlogPost,
  useDeleteBlogPost,
  useGetAllBlogPostsAdmin,
  usePublishBlogPost,
  useUpdateBlogPost,
} from "../../hooks/useQueries";

// No automation, emails, or publishing workflows — blog management is manual only.

interface BlogFormData {
  title: string;
  content: string;
  author: string;
  memberOnly: boolean;
  imageUrls: string[];
  videoUrls: string[];
  seoTitle: string;
  seoMetaDescription: string;
  seoKeywords: string;
}

const defaultForm: BlogFormData = {
  title: "",
  content: "",
  author: "Stefan",
  memberOnly: false,
  imageUrls: [],
  videoUrls: [],
  seoTitle: "",
  seoMetaDescription: "",
  seoKeywords: "",
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
  const [newUrl, setNewUrl] = useState("");

  const addUrl = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    onChange([...urls, trimmed]);
    setNewUrl("");
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          className="text-sm"
        />
        <Button type="button" size="sm" variant="outline" onClick={addUrl}>
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
      {urls.length > 0 && (
        <div className="space-y-1.5">
          {urls.map((url, i) => (
            <div
              key={url}
              className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5"
            >
              <span className="text-xs text-muted-foreground flex-1 truncate">
                {url}
              </span>
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

export default function BlogManagement() {
  const { data: posts = [], isLoading } = useGetAllBlogPostsAdmin();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const publishPost = usePublishBlogPost();
  const deletePost = useDeleteBlogPost();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<BlogFormData>(defaultForm);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      content: post.content,
      author: post.author,
      memberOnly: post.memberOnly,
      imageUrls: post.media?.imageUrls || [],
      videoUrls: post.media?.videoUrls || [],
      seoTitle: post.seoTitle || "",
      seoMetaDescription: post.seoMetaDescription || "",
      seoKeywords: post.seoKeywords?.join(", ") || "",
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const media: BlogMedia = {
      imageUrls: form.imageUrls,
      videoUrls: form.videoUrls,
    };

    const keywords = form.seoKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      if (editingId !== null) {
        await updatePost.mutateAsync({
          id: editingId,
          title: form.title.trim(),
          content: form.content.trim(),
          author: form.author.trim(),
          memberOnly: form.memberOnly,
          media,
          seoTitle: form.seoTitle.trim(),
          seoMetaDescription: form.seoMetaDescription.trim(),
          seoKeywords: keywords,
        });
        toast.success("Blog post updated");
      } else {
        await createPost.mutateAsync({
          title: form.title.trim(),
          content: form.content.trim(),
          author: form.author.trim(),
          memberOnly: form.memberOnly,
          media,
          seoTitle: form.seoTitle.trim(),
          seoMetaDescription: form.seoMetaDescription.trim(),
          seoKeywords: keywords,
        });
        toast.success("Blog post created");
      }
      resetForm();
    } catch {
      toast.error("Failed to save blog post");
    }
  };

  const handlePublishToggle = async (post: BlogPost) => {
    try {
      await publishPost.mutateAsync({
        id: post.id,
        published: !post.published,
      });
      toast.success(post.published ? "Post unpublished" : "Post published");
    } catch {
      toast.error("Failed to update publish status");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Blog post deleted");
    } catch {
      toast.error("Failed to delete blog post");
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
          <h2 className="text-xl font-bold text-foreground">Blog Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create and manage blog posts with text, images, and videos
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Post
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId !== null ? "Edit Post" : "New Blog Post"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Post title..."
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
                  onChange={(e) =>
                    setForm({ ...form, memberOnly: e.target.checked })
                  }
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
                placeholder="Write your blog post content here..."
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

            {/* SEO */}
            <div className="space-y-3 pt-2 border-t border-border">
              <h4 className="text-sm font-medium text-foreground">
                SEO Settings
              </h4>
              <div className="space-y-1.5">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={form.seoTitle}
                  onChange={(e) =>
                    setForm({ ...form, seoTitle: e.target.value })
                  }
                  placeholder="SEO title (defaults to post title)"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seoMeta">Meta Description</Label>
                <Textarea
                  id="seoMeta"
                  value={form.seoMetaDescription}
                  onChange={(e) =>
                    setForm({ ...form, seoMetaDescription: e.target.value })
                  }
                  placeholder="Brief description for search engines..."
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seoKeywords">Keywords (comma-separated)</Label>
                <Input
                  id="seoKeywords"
                  value={form.seoKeywords}
                  onChange={(e) =>
                    setForm({ ...form, seoKeywords: e.target.value })
                  }
                  placeholder="fitness, training, nutrition..."
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={createPost.isPending || updatePost.isPending}
                size="sm"
              >
                {createPost.isPending || updatePost.isPending ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-primary-foreground mr-1.5" />
                ) : (
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                )}
                {editingId !== null ? "Update Post" : "Create Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No blog posts yet. Create your first post above.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id.toString()}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">
                      {post.title}
                    </h4>
                    {post.published ? (
                      <Badge variant="default" className="text-xs">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Draft
                      </Badge>
                    )}
                    {post.memberOnly && (
                      <Badge variant="secondary" className="text-xs">
                        Members Only
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By {post.author} ·{" "}
                    {new Date(
                      Number(post.createdAt) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                    {post.media?.imageUrls?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Image className="w-3 h-3" />
                        {post.media.imageUrls.length} image
                        {post.media.imageUrls.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {post.media?.videoUrls?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {post.media.videoUrls.length} video
                        {post.media.videoUrls.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePublishToggle(post)}
                    disabled={publishPost.isPending}
                    className="h-8 w-8 p-0"
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(post)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{post.title}"? This
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post.id)}
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
