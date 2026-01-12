// src/components/payment/StripePaymentForm.tsx
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import api from '@/lib/api';

interface StripePaymentFormProps {
  bookingId: string;
  onSuccess: () => void;
  amount?: number;
}

export default function StripePaymentForm({
  bookingId,
  onSuccess,
  amount = 0,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        variant: 'destructive',
        title: 'Payment system not ready',
        description: 'Please refresh the page and try again.',
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast({
        variant: 'destructive',
        title: 'Card element not found',
        description: 'Please try again or refresh.',
      });
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setCardError(null);

    try {
      // ──────────────────────────────────────────────────────────────
      // Important: We DON'T pass clientSecret here manually!
      // Stripe automatically uses the clientSecret from <Elements> wrapper
      // ──────────────────────────────────────────────────────────────
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        '', // ← intentionally empty - Elements provides it automatically
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Customer Name', // ← TODO: get from user profile / booking
            },
          },
        }
      );

      if (error) {
        console.error('Stripe confirmation error:', error);

        if (error.type === 'validation_error') {
          setCardError(error.message || 'Invalid card details');
        } else {
          setErrorMessage(error.message || 'Payment could not be processed');
        }

        toast({
          variant: 'destructive',
          title: 'Payment Failed',
          description: error.message || 'Please check your card information.',
        });
      } else if (paymentIntent?.status === 'succeeded') {
        toast({
          title: 'Payment Successful!',
          description: 'Your booking is now confirmed.',
        });

        // Optional: notify backend (webhook should handle most cases)
        try {
          await api.post('/payment/confirm', {
            bookingId,
            paymentIntentId: paymentIntent.id,
          });
        } catch (e) {
          console.warn('Backend confirm call failed (webhook will handle)', e);
        }

        onSuccess();
      } else {
        setErrorMessage(`Payment status: ${paymentIntent?.status}`);
        toast({
          variant: 'destructive',
          title: 'Payment Incomplete',
          description: 'Unexpected status. Please contact support.',
        });
      }
    } catch (err: any) {
      console.error('Unexpected payment error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Please check your internet and try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-primary/30 transition-all">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: 'system-ui, sans-serif',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
              },
            },
          }}
          onChange={(event) => {
            if (event.error) {
              setCardError(event.error.message);
            } else {
              setCardError(null);
            }
          }}
        />
      </div>

      {/* Show real-time card validation errors */}
      {(cardError || errorMessage) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {cardError || errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full h-12 text-base font-semibold"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Secure Payment...
          </>
        ) : (
          <>
            <ShieldCheck className="mr-2 h-5 w-5" />
            Pay ${amount.toFixed(2)} Securely
          </>
        )}
      </Button>

      <div className="text-center text-xs text-muted-foreground pt-4">
        <p>🔒 Secured by Stripe • No card data is stored on our servers</p>
      </div>
    </form>
  );
}