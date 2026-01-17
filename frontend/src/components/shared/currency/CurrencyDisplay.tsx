// components/shared/CurrencyDisplay.tsx
import React from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { Banknote } from 'lucide-react';

interface CurrencyDisplayProps {
   country?: string;
   defaultCurrency?: string;
   variant?: 'default' | 'compact';
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
   country,
   defaultCurrency,
   variant = 'default',
}) => {
   const { currentCurrency, getCurrentCurrencyInfo } = useCurrency();
   const currencyInfo = getCurrentCurrencyInfo();

   // If user has selected a different currency, show both
   const showConversion = currentCurrency !== defaultCurrency && defaultCurrency;

   if (variant === 'compact') {
      return (
         <div className="flex items-center gap-3">
            <Banknote className="h-8 w-8 text-accent" />
            <div>
               <p className="text-sm text-muted-foreground">Currency</p>
               <div className="flex items-center gap-2">
                  <p className="font-semibold">
                     {showConversion ? `${currencyInfo?.code} (${defaultCurrency})` : defaultCurrency || currencyInfo?.code}
                  </p>
                  {showConversion && (
                     <span className="text-xs text-muted-foreground">
                        {currencyInfo?.symbol}
                     </span>
                  )}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="flex items-center gap-3">
         <Banknote className="h-8 w-8 text-accent" />
         <div>
            <p className="text-sm text-muted-foreground">Currency</p>
            <div className="space-y-1">
               <p className="font-semibold">
                  Local: {defaultCurrency || 'USD'}
               </p>
               {showConversion && (
                  <p className="text-xs text-muted-foreground">
                     Displaying in: {currencyInfo?.code} {currencyInfo?.symbol}
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};