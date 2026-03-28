import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetMyMembership,
  useGetPublishedBlogPostPreviews,
  useIsCallerAdmin,
} from "@/hooks/useQueries";
import { STATIC_BLOG_POST_PREVIEWS } from "@/lib/staticBlogContent";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Calendar, Loader2, Lock, Settings } from "lucide-react";

// NOTE: Blog content publishing and editing remains manual via the Creator Dashboard.
// No automation, email workflows, or publishing schedules are introduced.

export default function BlogPage() {
  const navigate = useNavigate();
  const { data: blogPreviews = [], isLoading } =
    useGetPublishedBlogPostPreviews();
  const { data: membership } = useGetMyMembership();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { identity: _identity } = useInternetIdentity();

  const hasActiveMembership = membership?.active === true;

  const mergedBlogPreviews = [
    ...STATIC_BLOG_POST_PREVIEWS,
    ...blogPreviews.filter(
      (p) => !STATIC_BLOG_POST_PREVIEWS.some((s) => s.title === p.title),
    ),
  ];

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16 md:py-24">
        <div
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/stretching-scene.dim_1920x1080.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/40 via-background/60 to-neon-purple/20" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Insights & <span className="text-neon-purple">Education</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Science-informed articles on training, breathwork, and mind-body
              performance
            </p>
            {isAdmin && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="border-neon-purple/50 bg-neon-purple/10 hover:bg-neon-purple/20"
                  onClick={() => navigate({ to: "/creator" })}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Blog
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="relative border-b border-border/40 bg-card py-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/breath-quote-overlay-transparent.dim_800x200.png)",
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-base font-semibold italic text-neon-purple md:text-lg">
            "Knowledge is power, but applied knowledge is transformation."
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="relative py-16 md:py-24">
        <div
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-5"
          style={{
            backgroundImage:
              "url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
            </div>
          ) : mergedBlogPreviews.length === 0 ? (
            <div className="mx-auto max-w-2xl text-center">
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No blog posts yet</h3>
              <p className="text-muted-foreground">
                Check back soon for new content
              </p>
              {isAdmin && (
                <Button
                  className="mt-6 bg-neon-purple hover:bg-neon-purple/90"
                  onClick={() => navigate({ to: "/creator" })}
                >
                  Create Your First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {mergedBlogPreviews.map((preview) => {
                const isLocked = preview.memberOnly && !hasActiveMembership;

                return (
                  <Card
                    key={preview.id.toString()}
                    className="border-border/40 transition-shadow hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between">
                        {preview.memberOnly && (
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Members Only
                          </Badge>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(preview.createdAt)}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{preview.title}</CardTitle>
                      <CardDescription className="text-xs">
                        By {preview.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {preview.seoMetaDescription ||
                          "Read this article to learn more..."}
                      </p>
                      <Button
                        variant={isLocked ? "outline" : "default"}
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          navigate({
                            to: "/blog/$id",
                            params: { id: preview.id.toString() },
                          })
                        }
                      >
                        {isLocked ? "Preview Article" : "Read Article"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
