// src/pages/BookingCancel.tsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <Card className="max-w-lg w-full border-destructive/20">
        <CardHeader className="text-center">
          <XCircle className="h-24 w-24 text-destructive mx-auto mb-6" />
          <CardTitle className="text-3xl font-bold text-destructive">
            Payment Cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <p className="text-xl text-muted-foreground">
            Your payment was not completed.
          </p>
          
          <p className="text-muted-foreground">
            No charges were made to your card.<br />
            Your booking is still pending.
          </p>

          {bookingId && (
            <p className="text-sm text-muted-foreground">
              Booking Reference: <strong>{bookingId.slice(-8).toUpperCase()}</strong>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[220px]"
              onClick={() => navigate(-1)}
            >
              ← Return to Booking
            </Button>
            <Button
              size="lg"
              className="min-w-[220px]"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}