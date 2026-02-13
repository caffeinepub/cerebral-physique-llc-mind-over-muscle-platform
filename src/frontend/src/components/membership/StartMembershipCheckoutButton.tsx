import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCreateCheckoutSession } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function StartMembershipCheckoutButton() {
  const createCheckoutSession = useCreateCheckoutSession();

  const handleStartCheckout = async () => {
    try {
      const items = [
        {
          productName: 'Monthly Membership',
          productDescription: 'Full access to exercise library and exclusive content',
          priceInCents: BigInt(1999), // $19.99
          currency: 'usd',
          quantity: BigInt(1),
        },
      ];

      const session = await createCheckoutSession.mutateAsync(items);
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error: any) {
      toast.error(error?.message || 'Failed to start checkout');
    }
  };

  return (
    <Button
      onClick={handleStartCheckout}
      disabled={createCheckoutSession.isPending}
      className="bg-neon-purple hover:bg-neon-purple/90"
    >
      {createCheckoutSession.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Become a Member - $19.99/month
    </Button>
  );
}
