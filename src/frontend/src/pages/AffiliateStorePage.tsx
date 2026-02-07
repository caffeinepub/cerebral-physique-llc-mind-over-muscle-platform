import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Loader2, ShoppingBag, Info } from 'lucide-react';
import { useGetAllAmazonProducts, useGetAffiliateDisclosure } from '@/hooks/useQueries';

export default function AffiliateStorePage() {
  const { data: products = [], isLoading } = useGetAllAmazonProducts();
  const { data: disclosure = '' } = useGetAffiliateDisclosure();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-deep-blue/20 to-background py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(/assets/generated/gym-training-scene.dim_1920x1080.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/40 via-background/60 to-neon-purple/20" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Recommended <span className="text-neon-purple">Gear & Equipment</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Curated fitness equipment and accessories to support your training journey
            </p>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      {disclosure && (
        <section className="border-b border-border/40 bg-card py-6">
          <div className="container mx-auto px-4">
            <Alert className="mx-auto max-w-4xl border-neon-purple/30 bg-neon-purple/5">
              <Info className="h-4 w-4 text-neon-purple" />
              <AlertDescription className="text-sm text-muted-foreground">
                {disclosure}
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="relative py-16 md:py-24">
        <div 
          className="absolute inset-0 animate-subtle-pan bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(/assets/generated/dynamic-movement.dim_1920x1080.jpg)' }}
        />
        <div className="container relative mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
            </div>
          ) : products.length === 0 ? (
            <div className="mx-auto max-w-2xl text-center">
              <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No products yet</h3>
              <p className="text-muted-foreground">Check back soon for recommended gear and equipment</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id.toString()} className="border-border/40 transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <Badge variant="secondary" className="mb-2 w-fit">
                      {product.category}
                    </Badge>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm">
                      {product.description}
                    </CardDescription>
                    <Button
                      className="w-full bg-neon-purple hover:bg-neon-purple/90"
                      onClick={() => window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Amazon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
