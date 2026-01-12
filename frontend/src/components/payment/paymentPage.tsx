// src/pages/PaymentPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const redirectToPayment = async () => {
      if (!bookingId) {
        setError("No booking ID found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Get booking details (for display & validation)
        const bookingRes = await api.get(`/booking/${bookingId}`);
        setBooking(bookingRes.data.data);

        // 2. Create payment session (Stripe Checkout or PayPal redirect)
        const paymentRes = await api.post('/payment', {
          bookingId,
          provider: 'stripe', // Change to 'paypal' if you want PayPal instead
          paymentPlan: bookingRes.data.data.pricing.paymentPlan,
          installmentNumber: 1,
        });

        const { clientData } = paymentRes.data;

        if (clientData?.checkoutUrl) {
          // Redirect to Stripe Checkout
          window.location.href = clientData.checkoutUrl;
        } else if (clientData?.approvalUrl) {
          // Redirect to PayPal
          window.location.href = clientData.approvalUrl;
        } else {
          throw new Error("No payment redirect URL received");
        }
      } catch (err: any) {
        console.error("Payment redirect error:", err);
        setError(err.response?.data?.message || "Failed to start payment process");
      } finally {
        setLoading(false);
      }
    };

    redirectToPayment();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <ShieldCheck className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Redirecting to Secure Payment</h2>
          <p className="text-muted-foreground">
            You'll be taken to Stripe's trusted checkout page...
          </p>
          <div className="mt-8">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-destructive/30">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive text-2xl">Payment Setup Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                ← Return to Booking
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null; // Redirect should happen before this
}