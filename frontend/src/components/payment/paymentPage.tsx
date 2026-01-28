// src/pages/PaymentPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CurrencyPrice } from '@/components/shared/currency/CurrencyPrice';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [provider, setProvider] = useState<'stripe' | 'paypal' | 'affirm' | 'klarna'>('stripe');

  useEffect(() => {
    const loadBooking = async () => {
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
      } catch (err: any) {
        console.error("Payment redirect error:", err);
        setError(err.response?.data?.message || "Failed to start payment process");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const startPayment = async () => {
    if (!bookingId || !booking) return;
    try {
      setIsRedirecting(true);
      if (booking.pricing.paymentPlan === 'monthly' && !booking.pricing.monthlyAmount) {
        setError("Monthly payment amount is missing. Please contact support.");
        return;
      }
      const paymentRes = await api.post('/payment', {
        bookingId,
        provider,
        paymentPlan: booking.pricing.paymentPlan,
        installmentNumber: 1,
      });

      const { clientData } = paymentRes.data;

      if (clientData?.checkoutUrl) {
        window.location.href = clientData.checkoutUrl;
      } else if (clientData?.approvalUrl) {
        window.location.href = clientData.approvalUrl;
      } else {
        throw new Error("No payment redirect URL received");
      }
    } catch (err: any) {
      console.error("Payment redirect error:", err);
      setError(err.response?.data?.message || "Failed to start payment process");
    } finally {
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <ShieldCheck className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Redirecting to Secure Payment</h2>
          <p className="text-muted-foreground">
            Preparing your payment options...
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

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={provider} onValueChange={(value) => setProvider(value as any)}>
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">Card & Wallets</Label>
                  <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <div>
                      <p className="font-medium">Card (Stripe)</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, Apple Pay</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-sm text-muted-foreground">Buy Now, Pay Later</Label>
                  <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary">
                    <RadioGroupItem value="affirm" id="affirm" />
                    <div>
                      <p className="font-medium">Affirm</p>
                      <p className="text-sm text-muted-foreground">Split payments with Affirm</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary">
                    <RadioGroupItem value="klarna" id="klarna" />
                    <div>
                      <p className="font-medium">Klarna</p>
                      <p className="text-sm text-muted-foreground">Pay in installments with Klarna</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>

              <Button
                className="w-full h-12 text-base"
                onClick={startPayment}
                disabled={isRedirecting}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  "Proceed to Secure Payment"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm h-fit">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">{booking.tour?.title}</p>
                <p className="text-muted-foreground">{booking.tour?.destination}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">
                  <CurrencyPrice amount={booking.pricing.totalAmount} variant="compact" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment plan</span>
                <span className="font-medium capitalize">{booking.pricing.paymentPlan}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}