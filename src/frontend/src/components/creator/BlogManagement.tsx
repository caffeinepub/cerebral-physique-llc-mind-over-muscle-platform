import { useState } from 'react';
import { useGetAllBlogPosts, useCreateBlogPost, useEditBlogPost, useDeleteBlogPost, usePublishBlogPost, useUnpublishBlogPost } from '@/hooks/useQueries';
import type { BlogPost } from '@/backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogManagement() {
  const { data: blogPosts = [], isLoading, error } = useGetAllBlogPosts();
  const createBlogPost = useCreateBlogPost();
  const editBlogPost = useEditBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  const publishBlogPost = usePublishBlogPost();
  const unpublishBlogPost = useUnpublishBlogPost();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    seoTitle: '',
    seoMetaDescription: '',
    seoKeywords: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      seoTitle: '',
      seoMetaDescription: '',
      seoKeywords: '',
    });
    setValidationErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push('Title is required');
    }

    if (!formData.content.trim()) {
      errors.push('Content is required');
    }

    if (!formData.author.trim()) {
      errors.push('Author name is required');
    }

    if (formData.content.length < 50) {
      errors.push('Content should be at least 50 characters long');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors before creating');
      return;
    }

    try {
      await createBlogPost.mutateAsync({
        ...formData,
        seoKeywords: formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k),
      });
      toast.success('Blog post created successfully');
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create blog post';
      toast.error(errorMessage);
      console.error('Create blog post error:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingPost) return;
    
    if (!validateForm()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      await editBlogPost.mutateAsync({
        id: editingPost.id,
        ...formData,
        seoKeywords: formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k),
      });
      toast.success('Blog post updated successfully');
      setIsEditDialogOpen(false);
      setEditingPost(null);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update blog post';
      toast.error(errorMessage);
      console.error('Edit blog post error:', error);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteBlogPost.mutateAsync(id);
      toast.success('Blog post deleted successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete blog post';
      toast.error(errorMessage);
      console.error('Delete blog post error:', error);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      if (post.published) {
        await unpublishBlogPost.mutateAsync(post.id);
        toast.success('Blog post unpublished successfully');
      } else {
        await publishBlogPost.mutateAsync(post.id);
        toast.success('Blog post published successfully');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update publish status';
      toast.error(errorMessage);
      console.error('Toggle publish error:', error);
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      seoTitle: post.seoTitle,
      seoMetaDescription: post.seoMetaDescription,
      seoKeywords: post.seoKeywords.join(', '),
    });
    setValidationErrors([]);
    setIsEditDialogOpen(true);
  };

  const openPreview = () => {
    const previewData: BlogPost = {
      id: BigInt(0),
      title: formData.title,
      content: formData.content,
      author: formData.author,
      seoTitle: formData.seoTitle,
      seoMetaDescription: formData.seoMetaDescription,
      seoKeywords: formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k),
      published: false,
      createdAt: BigInt(Date.now() * 1000000),
      modifiedAt: BigInt(Date.now() * 1000000),
    };
    setPreviewPost(previewData);
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
          Failed to load blog posts. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Empty State Message */}
      {blogPosts.length === 0 && (
        <Alert className="border-neon-purple/30 bg-neon-purple/5">
          <BookOpen className="h-5 w-5 text-neon-purple" />
          <AlertDescription className="ml-2">
            <p className="font-medium text-neon-purple">No blog posts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Create Blog Post" below to write your first article
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Add Blog Post Button */}
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-neon-purple hover:bg-neon-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Write a new blog post for your audience with SEO optimization
              </DialogDescription>
            </DialogHeader>
            <BlogPostForm 
              formData={formData} 
              setFormData={setFormData}
              validationErrors={validationErrors}
              onValidate={validateForm}
            />
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={openPreview} disabled={!formData.title || !formData.content}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createBlogPost.isPending}>
                  {createBlogPost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Post
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Blog Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingPost(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update blog post content and SEO settings
            </DialogDescription>
          </DialogHeader>
          <BlogPostForm 
            formData={formData} 
            setFormData={setFormData}
            validationErrors={validationErrors}
            onValidate={validateForm}
          />
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={openPreview} disabled={!formData.title || !formData.content}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={editBlogPost.isPending}>
                {editBlogPost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Blog Post Preview</DialogTitle>
            <DialogDescription>
              Preview how this blog post will appear to readers
            </DialogDescription>
          </DialogHeader>
          {previewPost && (
            <BlogPostPreview post={previewPost} />
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Posts Table */}
      <div className="rounded-md border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-muted-foreground">No blog posts found</p>
                      <p className="mt-1 text-sm text-muted-foreground/70">
                        Create your first post to get started
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              blogPosts.map((post) => (
                <TableRow key={post.id.toString()}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <Badge variant={post.published ? 'default' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(post)}
                        title={post.published ? 'Unpublish' : 'Publish'}
                        disabled={publishBlogPost.isPending || unpublishBlogPost.isPending}
                      >
                        {publishBlogPost.isPending || unpublishBlogPost.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : post.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(post)}
                        title="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete post">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone and will permanently remove the post from your blog.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {deleteBlogPost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

interface BlogPostFormProps {
  formData: {
    title: string;
    content: string;
    author: string;
    seoTitle: string;
    seoMetaDescription: string;
    seoKeywords: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    content: string;
    author: string;
    seoTitle: string;
    seoMetaDescription: string;
    seoKeywords: string;
  }>>;
  validationErrors: string[];
  onValidate: () => boolean;
}

function BlogPostForm({ formData, setFormData, validationErrors, onValidate }: BlogPostFormProps) {
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
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          onBlur={onValidate}
          placeholder="Enter an engaging blog post title"
          className={validationErrors.some(e => e.includes('Title')) ? 'border-destructive' : ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author *</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          onBlur={onValidate}
          placeholder="Author name"
          className={validationErrors.some(e => e.includes('Author')) ? 'border-destructive' : ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          onBlur={onValidate}
          placeholder="Write your blog post content here... (minimum 50 characters)"
          rows={10}
          className={validationErrors.some(e => e.includes('Content')) ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">
          {formData.content.length} characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seoTitle">SEO Title</Label>
        <Input
          id="seoTitle"
          value={formData.seoTitle}
          onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
          placeholder="SEO optimized title (optional)"
        />
        <p className="text-xs text-muted-foreground">
          Optimized title for search engines (leave blank to use main title)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seoMetaDescription">SEO Meta Description</Label>
        <Textarea
          id="seoMetaDescription"
          value={formData.seoMetaDescription}
          onChange={(e) => setFormData({ ...formData, seoMetaDescription: e.target.value })}
          placeholder="Brief description for search engines (optional)"
          rows={2}
        />
        <p className="text-xs text-muted-foreground">
          Recommended: 150-160 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seoKeywords">SEO Keywords</Label>
        <Input
          id="seoKeywords"
          value={formData.seoKeywords}
          onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
          placeholder="fitness, workout, training, mindset (comma-separated)"
        />
        <p className="text-xs text-muted-foreground">
          Separate keywords with commas
        </p>
      </div>

      {/* Validation Status */}
      {validationErrors.length === 0 && formData.title && formData.content && formData.author && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            All required fields are valid and ready to save
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface BlogPostPreviewProps {
  post: BlogPost;
}

function BlogPostPreview({ post }: BlogPostPreviewProps) {
  return (
    <Card className="border-border/40 bg-card/50">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>By {post.author}</span>
            <span>•</span>
            <Badge variant={post.published ? 'default' : 'secondary'}>
              {post.published ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
        
        {post.seoKeywords.length > 0 && (
          <div className="space-y-2 border-t border-border/40 pt-4">
            <p className="text-sm font-medium">Keywords:</p>
            <div className="flex flex-wrap gap-2">
              {post.seoKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline">{keyword}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
