import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Leaf, Lock, User } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetMyMembership,
  useGetPublishedNutritionArticlePreviews,
  useIsCallerAdmin,
} from "../hooks/useQueries";

export default function NutritionPage() {
  const { data: previews = [], isLoading } =
    useGetPublishedNutritionArticlePreviews();
  const { data: membership } = useGetMyMembership();
  const { data: isAdmin } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();

  const isMember = membership?.active === true;

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/dynamic-movement.dim_1920x1080.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Nutrition Hub
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Fuel Your Performance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Science-backed nutrition guidance to complement your training and
            optimize your results.
          </p>
        </div>
      </section>

      {/* Admin link */}
      {isAdmin && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            to="/creator"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Manage Nutrition Articles in Creator Dashboard
          </Link>
        </div>
      )}

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
              <div
                key={sk}
                className="bg-card border border-border rounded-xl p-6 space-y-3"
              >
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : previews.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Articles Yet
            </h3>
            <p className="text-muted-foreground">
              Nutrition articles will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previews.map((article) => {
              const isLocked = article.memberOnly && !isMember && !isAdmin;
              return (
                <Link
                  key={article.id.toString()}
                  to="/nutrition/$id"
                  params={{ id: article.id.toString() }}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 block"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                      {article.title}
                    </h3>
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    ) : (
                      <Leaf className="w-4 h-4 text-primary shrink-0 mt-0.5 opacity-60" />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(
                        Number(article.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {article.memberOnly && (
                    <Badge
                      variant={isLocked ? "secondary" : "default"}
                      className="text-xs"
                    >
                      {isLocked ? "🔒 Members Only" : "✓ Member Content"}
                    </Badge>
                  )}

                  {isLocked && !identity && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Log in and become a member to read this article.
                    </p>
                  )}
                  {isLocked && identity && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Become a member to unlock this article.
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
