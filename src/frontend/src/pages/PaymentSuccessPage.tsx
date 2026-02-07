import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useGetStripeSessionStatus } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = useSearch({ from: '/payment-success' }) as { session_id?: string };
  const sessionId = search.session_id;

  const { data: sessionStatus, isLoading } = useGetStripeSessionStatus(sessionId);

  useEffect(() => {
    if (sessionStatus?.__kind__ === 'completed') {
      // Invalidate membership queries to refresh status
      queryClient.invalidateQueries({ queryKey: ['membership'] });
      queryClient.invalidateQueries({ queryKey: ['hasActiveMembership'] });
    }
  }, [sessionStatus, queryClient]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl border-border/40">
        <CardContent className="flex flex-col items-center py-16">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="mb-4 text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="mb-8 text-center text-lg">
            Your membership is now active. You have full access to all member content.
          </CardDescription>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              className="bg-neon-purple hover:bg-neon-purple/90"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/workout-library' })}
            >
              Explore Library
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
