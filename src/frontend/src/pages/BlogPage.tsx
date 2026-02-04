import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen } from 'lucide-react';

export default function BlogPage() {
  const articles = [
    {
      title: 'The Science of Mind-Muscle Connection',
      description: 'Understanding the neuroscience behind conscious muscle control and how it enhances training outcomes.',
      category: 'Science',
      date: 'January 15, 2026',
      readTime: '8 min read',
    },
    {
      title: 'Breathwork for Performance: Beyond the Basics',
      description: 'Advanced breathing techniques for optimizing strength, endurance, and nervous system regulation.',
      category: 'Breathwork',
      date: 'January 10, 2026',
      readTime: '12 min read',
    },
    {
      title: 'Training for Longevity: A Paradigm Shift',
      description: 'Why the fitness industry has it backwards, and how to train for sustainable health span.',
      category: 'Longevity',
      date: 'January 5, 2026',
      readTime: '10 min read',
    },
    {
      title: 'The Role of Tempo in Muscle Development',
      description: 'How controlling movement speed enhances hypertrophy, strength, and mind-muscle connection.',
      category: 'Training',
      date: 'December 28, 2025',
      readTime: '7 min read',
    },
    {
      title: 'Nervous System Regulation: The Missing Link',
      description: 'Why your training results depend more on your nervous system state than your workout program.',
      category: 'Science',
      date: 'December 20, 2025',
      readTime: '9 min read',
    },
    {
      title: 'Building Sustainable Training Habits',
      description: 'Evidence-based strategies for creating training routines that last a lifetime.',
      category: 'Mindset',
      date: 'December 15, 2025',
      readTime: '6 min read',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section with energetic gym background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16 md:py-24">
        <div 
          className="absolute inset-0 animate-subtle-zoom bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/stretching-scene.dim_1920x1080.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/40 via-background/60 to-neon-purple/20" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Insights & <span className="text-neon-purple">Education</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Science-informed articles on training, breathwork, and mind-body performance
            </p>
          </div>
        </div>
      </section>

      {/* Fitness Quote Overlay */}
      <section className="relative border-b border-border/40 bg-card py-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/breath-quote-overlay-transparent.dim_800x200.png)' }}
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
          style={{ backgroundImage: 'url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Card key={index} className="border-border/40 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    {article.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{article.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative bg-card py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Stay Informed
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Get new articles delivered directly to your inbox. No spam, just quality content on training and performance.
            </p>
            <div className="text-sm text-muted-foreground">
              Newsletter coming soon. Follow us on social media for updates.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
