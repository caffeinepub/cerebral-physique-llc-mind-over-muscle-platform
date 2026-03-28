import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getStaticNutritionArticle } from "@/lib/staticNutritionContent";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Leaf, Lock, User } from "lucide-react";
import StartMembershipCheckoutButton from "../components/membership/StartMembershipCheckoutButton";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetMyMembership,
  useGetNutritionArticle,
  useIsCallerAdmin,
} from "../hooks/useQueries";

function MediaGallery({
  imageUrls,
  videoUrls,
}: { imageUrls: string[]; videoUrls: string[] }) {
  const isYouTube = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = (url: string) => url.includes("vimeo.com");

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  };

  return (
    <div className="space-y-6 mt-6">
      {imageUrls.length > 0 && (
        <div
          className={`grid gap-4 ${imageUrls.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}
        >
          {imageUrls.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={`Article ${i + 1}`}
              className="w-full rounded-xl object-cover max-h-80"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ))}
        </div>
      )}

      {videoUrls.length > 0 && (
        <div className="space-y-4">
          {videoUrls.map((url, i) => {
            if (isYouTube(url)) {
              return (
                <div
                  key={url}
                  className="aspect-video rounded-xl overflow-hidden"
                >
                  <iframe
                    src={getYouTubeEmbedUrl(url)}
                    title={`Video ${i + 1}`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              );
            }
            if (isVimeo(url)) {
              return (
                <div
                  key={url}
                  className="aspect-video rounded-xl overflow-hidden"
                >
                  <iframe
                    src={getVimeoEmbedUrl(url)}
                    title={`Video ${i + 1}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              );
            }
            return (
              <video
                key={url}
                src={url}
                controls
                className="w-full rounded-xl max-h-80"
              >
                <track kind="captions" />
              </video>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NutritionArticlePage() {
  const { id } = useParams({ from: "/nutrition/$id" });
  const articleId = BigInt(id);
  const isStaticId = articleId < 0n;

  // Always call hook (Rules of Hooks), but ignore backend error for static articles
  const { data: article, isLoading } = useGetNutritionArticle(articleId);
  const { data: membership } = useGetMyMembership();
  const { data: isAdmin } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();

  // Static articles resolve immediately from local data; skip backend for them
  const resolvedArticle = isStaticId
    ? getStaticNutritionArticle(articleId)
    : (article ?? (!isLoading ? null : undefined));

  const isMember = membership?.active === true;
  const isAuthenticated = !!identity;

  // Only show skeleton for non-static articles that are still loading
  if (!isStaticId && isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 mt-8">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!resolvedArticle) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Leaf className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
          <h2 className="text-xl font-semibold text-foreground">
            Article Not Found
          </h2>
          <p className="text-muted-foreground">
            This article doesn't exist or isn't published yet.
          </p>
          <Link to="/nutrition">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Nutrition
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = resolvedArticle.memberOnly && !isMember && !isAdmin;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/nutrition"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Nutrition
        </Link>

        {/* Article header */}
        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {resolvedArticle.memberOnly && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
                  <Leaf className="w-3 h-3" />
                  Member Content
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {resolvedArticle.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {resolvedArticle.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(
                  Number(resolvedArticle.createdAt) / 1_000_000,
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* Content or locked state */}
          {isLocked ? (
            <div className="space-y-6">
              {/* Preview snippet */}
              <div className="relative">
                <p className="text-muted-foreground leading-relaxed line-clamp-4">
                  {resolvedArticle.content}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </div>

              {/* Membership CTA */}
              <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Members Only Content
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This nutrition article is exclusively available to Cerebral
                  Physique members. Join today to unlock all premium content.
                </p>
                {!isAuthenticated ? (
                  <p className="text-sm text-muted-foreground">
                    Please log in first to become a member.
                  </p>
                ) : (
                  <StartMembershipCheckoutButton />
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Full content */}
              <div className="prose prose-invert max-w-none">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {resolvedArticle.content}
                </div>
              </div>

              {/* Media */}
              {(resolvedArticle.media?.imageUrls?.length > 0 ||
                resolvedArticle.media?.videoUrls?.length > 0) && (
                <MediaGallery
                  imageUrls={resolvedArticle.media.imageUrls}
                  videoUrls={resolvedArticle.media.videoUrls}
                />
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
