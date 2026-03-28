import { Button } from "@/components/ui/button";
import { useCreateCheckoutSession } from "@/hooks/useQueries";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StartMembershipCheckoutButton() {
  const createCheckoutSession = useCreateCheckoutSession();

  const handleStartCheckout = async () => {
    try {
      const items = [
        {
          productName: "Monthly Membership",
          productDescription:
            "Full access to exercise library and exclusive content",
          priceInCents: BigInt(2499), // $24.99
          currency: "usd",
          quantity: BigInt(1),
        },
      ];

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      const session = await createCheckoutSession.mutateAsync({
        items,
        successUrl,
        cancelUrl,
      });

      if (!session?.url) {
        throw new Error("Stripe session missing url");
      }

      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Failed to start checkout");
    }
  };

  return (
    <Button
      onClick={handleStartCheckout}
      disabled={createCheckoutSession.isPending}
      className="bg-primary hover:bg-primary/90"
    >
      {createCheckoutSession.isPending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Become a Member — $24.99/month
    </Button>
  );
}
