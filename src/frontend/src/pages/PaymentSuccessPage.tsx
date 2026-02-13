import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useGetStripeSessionStatus } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  if (!sessionId) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl border-border/40">
          <CardContent className="flex flex-col items-center py-16">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="mb-4 text-3xl">Invalid Payment Session</CardTitle>
            <CardDescription className="mb-8 text-center text-lg">
              No session ID was provided. Please try starting the checkout process again.
            </CardDescription>
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="outline"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (sessionStatus?.__kind__ === 'failed') {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive" className="mx-auto max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Payment verification failed. Please contact support if you believe this is an error.
          </AlertDescription>
        </Alert>
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
