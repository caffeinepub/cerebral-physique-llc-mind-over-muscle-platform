import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl border-border/40">
        <CardContent className="flex flex-col items-center py-16">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="mb-4 text-3xl">Payment Failed</CardTitle>
          <CardDescription className="mb-8 text-center text-lg">
            Your payment could not be processed. Please try again or contact support if the issue persists.
          </CardDescription>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              className="bg-neon-purple hover:bg-neon-purple/90"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/contact' })}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
