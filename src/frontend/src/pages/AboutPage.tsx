import { Card, CardContent } from "@/components/ui/card";
import { Award, Dumbbell, Target, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with energetic background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16 md:py-24">
        <div
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/30 via-background/50 to-neon-purple/10" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              About <span className="text-neon-purple">Cerebral Physique</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              A disciplined approach to mind-body performance
            </p>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-b border-border/40 bg-card py-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/discipline-quote-overlay-transparent.dim_800x200.png)",
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-base font-semibold italic text-neon-purple md:text-lg">
            "Discipline is choosing between what you want now and what you want
            most."
          </p>
        </div>
      </section>

      {/* Founder Story with new portrait */}
      <section className="relative py-16 md:py-24">
        <div
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                Meet Stefan Philip Sweeting
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Stefan Philip Sweeting is not your typical fitness influencer.
                  He's a disciplined guide who has spent years mastering the
                  intersection of mental clarity and physical performance.
                </p>
                <p>
                  His journey began not in a gym, but in the study of human
                  physiology, breathwork, and the neuroscience of movement.
                  Through rigorous self-experimentation and evidence-based
                  practice, Stefan developed a training philosophy that
                  prioritizes quality over quantity, intention over intensity.
                </p>
                <p>
                  Today, Stefan helps individuals build physiques that reflect
                  not just aesthetic goals, but mental discipline, nervous
                  system resilience, and long-term health. His approach is
                  confident, intelligent, and free from the hype that dominates
                  the fitness industry.
                </p>
                <p className="font-semibold text-foreground">
                  "Every rep is a conversation between your mind and muscle.
                  Learn to listen."
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/20 via-transparent to-neon-purple/10" />
                <img
                  src="/assets/IMG_20250130_195852_190.webp"
                  alt="Stefan Philip Sweeting"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Origins Subsection */}
      <section className="relative bg-card py-16 md:py-20">
        <div
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/stretching-scene.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <Dumbbell className="mx-auto mb-4 h-12 w-12 text-neon-purple" />
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Training Origins
              </h2>
              <p className="text-lg text-muted-foreground">
                Where discipline meets practice
              </p>
            </div>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Stefan's training philosophy was forged through years of
                  dedicated practice, combining traditional strength training
                  with modern neuroscience and breathwork principles.
                </p>
                <p>
                  His approach emphasizes the mind-muscle connection, viewing
                  each training session as an opportunity to refine both
                  physical capability and mental discipline.
                </p>
                <p>
                  This foundation of intentional practice has shaped the
                  Cerebral Physique methodology—a system that transforms fitness
                  from mere exercise into a practice of self-mastery.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/30 via-transparent to-neon-purple/20" />
                <img
                  src="/assets/Screenshot_20250315_050658_Instagram.jpg"
                  alt="Stefan training - origins of Cerebral Physique methodology"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative py-16 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Our Philosophy
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border/40 bg-card">
              <CardContent className="pt-6">
                <Target className="mb-4 h-12 w-12 text-neon-purple" />
                <h3 className="mb-3 text-xl font-bold">Intentional Training</h3>
                <p className="text-muted-foreground">
                  Every movement serves a purpose. We train with clear
                  objectives, understanding the 'why' behind each exercise and
                  technique.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card">
              <CardContent className="pt-6">
                <Zap className="mb-4 h-12 w-12 text-neon-purple" />
                <h3 className="mb-3 text-xl font-bold">Nervous System First</h3>
                <p className="text-muted-foreground">
                  True performance comes from a regulated nervous system. We
                  integrate breathwork and recovery to optimize your body's
                  stress response.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card">
              <CardContent className="pt-6">
                <Award className="mb-4 h-12 w-12 text-neon-purple" />
                <h3 className="mb-3 text-xl font-bold">
                  Sustainable Excellence
                </h3>
                <p className="text-muted-foreground">
                  We reject quick fixes and extreme protocols. Our methods are
                  designed for lifelong practice, building resilience that
                  lasts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-y border-border/40 bg-card py-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/breath-quote-overlay-transparent.dim_800x200.png)",
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-base font-semibold italic text-neon-purple md:text-lg">
            "Master your breath, master your mind, master your body."
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative bg-card py-16 md:py-24">
        <div
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)",
          }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              To elevate the standard of physical training by integrating mental
              discipline, breathwork mastery, and evidence-based movement
              science. We empower individuals to build physiques that reflect
              not just strength, but wisdom, resilience, and longevity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
