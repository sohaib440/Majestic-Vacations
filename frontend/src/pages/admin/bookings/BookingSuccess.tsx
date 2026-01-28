// src/pages/BookingSuccess.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, ArrowRight, AlertTriangle } from 'lucide-react'; // ← FIXED: Added AlertTriangle
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [bookingId] = useState(searchParams.get('bookingId') || '');
  const sessionId = searchParams.get('session_id');
  const provider = searchParams.get('provider');
  const paypalPaymentId = searchParams.get('paymentId');
  const paypalPayerId = searchParams.get('PayerID');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!bookingId) {
        setStatus('error');
        setLoading(false);
        toast({
          variant: 'destructive',
          title: 'Invalid Payment Response',
          description: 'Missing booking information',
        });
        return;
      }

      try {
        if (provider === 'paypal' && paypalPaymentId && paypalPayerId) {
          await api.get('/payment/paypal/execute', {
            params: { paymentId: paypalPaymentId, PayerID: paypalPayerId },
          });
        }

        // Optional: Verify with backend
        const res = await api.get(`/booking/${bookingId}`);
        const booking = res.data.data;

        if (booking.paymentStatus === 'paid' || booking.bookingStatus === 'confirmed') {
          setStatus('success');
          toast({
            title: 'Booking Confirmed!',
            description: 'Your payment was successful and seats are reserved.',
          });
        } else {
          // Optimistic UI while webhook might be processing
          setTimeout(() => setStatus('success'), 3000);
        }
      } catch (err) {
        console.error('Verification failed:', err);
        setStatus('error');
        toast({
          variant: 'destructive',
          title: 'Verification Error',
          description: 'Payment received but status verification failed. Check your email.',
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [bookingId, sessionId, provider, paypalPaymentId, paypalPayerId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Confirming Your Booking</h2>
          <p className="text-muted-foreground">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <Card className="max-w-2xl w-full border-primary/20 shadow-2xl">
        <CardHeader className="text-center pb-2">
          {status === 'success' ? (
            <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
          ) : (
            <AlertTriangle className="h-24 w-24 text-amber-500 mx-auto mb-6" />
          )}
          <CardTitle className="text-4xl font-bold mb-2">
            {status === 'success' ? 'Booking Confirmed!' : 'Payment Received'}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-8">
          {status === 'success' ? (
            <>
              <p className="text-xl text-muted-foreground">
                Thank you for booking with us! Your seats are now reserved.
              </p>
              <div className="bg-muted/50 p-6 rounded-xl">
                <p className="text-lg font-medium mb-2">Booking Reference</p>
                <p className="text-2xl font-bold tracking-wide">
                  {bookingId ? bookingId.slice(-8).toUpperCase() : 'N/A'}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to your inbox.
              </p>
            </>
          ) : (
            <p className="text-lg text-muted-foreground">
              Your payment was processed successfully.<br />
              We're confirming the booking status – this may take a moment.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="min-w-[220px]"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[220px]"
              onClick={() => navigate(`/booking/${bookingId}`)}
              disabled={!bookingId}
            >
              View Booking Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}