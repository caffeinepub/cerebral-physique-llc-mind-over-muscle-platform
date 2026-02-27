import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Calendar, Lock, Loader2 } from 'lucide-react';
import { useGetBlogPost, useHasActiveMembership } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function BlogPostPage() {
  const { id } = useParams({ from: '/blog/$id' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: post, isLoading } = useGetBlogPost(BigInt(id));
  const { data: hasActiveMembership = false } = useHasActiveMembership();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl border-border/40">
          <CardContent className="flex flex-col items-center py-16">
            <h2 className="mb-4 text-2xl font-bold">Post Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              This blog post doesn't exist or is not published yet.
            </p>
            <Button onClick={() => navigate({ to: '/blog' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLocked = post.memberOnly && !hasActiveMembership;
  const previewContent = post.content.substring(0, 300) + '...';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(/assets/generated/stretching-scene.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/blog' })}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {post.memberOnly && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Members Only
                </Badge>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                {formatDate(post.createdAt)}
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground">By {post.author}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {isLocked ? (
              <div className="space-y-6">
                <Card className="border-border/40">
                  <CardContent className="py-8">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap">{previewContent}</p>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="border-neon-purple/30 bg-neon-purple/5">
                  <Lock className="h-5 w-5 text-neon-purple" />
                  <AlertTitle className="text-neon-purple">Members-Only Content</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p className="mb-4 text-muted-foreground">
                      This article is exclusive to members. Become a member to unlock the full library and all premium content.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        className="bg-neon-purple hover:bg-neon-purple/90"
                        onClick={() => navigate({ to: '/dashboard' })}
                      >
                        Become a Member
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate({ to: '/workout-library' })}
                      >
                        Unlock the Library
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <Card className="border-border/40">
                <CardContent className="py-8">
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>
                  
                  {post.seoKeywords.length > 0 && (
                    <div className="mt-8 border-t border-border/40 pt-6">
                      <p className="mb-3 text-sm font-medium">Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {post.seoKeywords.map((keyword, index) => (
                          <Badge key={index} variant="outline">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
