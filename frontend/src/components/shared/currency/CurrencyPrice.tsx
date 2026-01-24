// src/components/shared/CurrencyPrice.tsx
import React from 'react';
import { useCurrency } from '@/hooks/useCurrency';

interface CurrencyPriceProps {
   amount: number; // Amount in USD
   className?: string;
   showOriginal?: boolean;
   showSymbol?: boolean;
   variant?: 'compact' | 'full' | 'detail';
}

export const CurrencyPrice: React.FC<CurrencyPriceProps> = ({
   amount = 0,
   className = '',
   showOriginal = false,
   showSymbol = true,
   variant = 'full',
}) => {
   const { currentCurrency, convertFromUSD, format } = useCurrency();

   const safeAmount = Number(amount || 0);

   // Convert price from USD to current currency
   const convertedAmount = convertFromUSD(safeAmount);
   const formattedPrice = format(convertedAmount, currentCurrency);

   // For USD, show simple format without currency code
   const displayPrice = currentCurrency === 'USD'
      ? `$${safeAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : formattedPrice.replace(currentCurrency, '').trim();

   // Compact variant for cards
   if (variant === 'compact') {
      return (
         <div className={`flex flex-col ${className}`}>
            <div className="flex items-baseline gap-1">
               {showSymbol && (
                  <span className="text-xs font-normal text-muted-foreground">
                     {currentCurrency === 'USD' ? '$' : format(1, currentCurrency).replace(/[\d\s.,]/g, '')}
                  </span>
               )}
               <span className="text-lg md:text-xl font-bold text-primary">
                  {displayPrice}
               </span>
               <span className="text-xs font-normal text-muted-foreground">/person</span>
            </div>
            {showOriginal && currentCurrency !== 'USD' && (
               <span className="text-xs text-muted-foreground">
                  ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
               </span>
            )}
         </div>
      );
   }

   // Detail variant for tour detail pages
   if (variant === 'detail') {
      return (
         <div className={`flex flex-col ${className}`}>
            <div className="flex items-baseline gap-2">
               {showSymbol && currentCurrency === 'USD' && (
                  <span className="text-lg font-semibold">$</span>
               )}
               <span className="text-2xl md:text-3xl font-bold text-primary">
                  {formattedPrice}
               </span>
            </div>
            {showOriginal && currentCurrency !== 'USD' && (
               <span className="text-sm text-muted-foreground mt-1">
                  ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
               </span>
            )}
         </div>
      );
   }

   // Full variant (default)
   return (
      <div className={`price-display ${className}`}>
         <span className="price-amount font-semibold">{formattedPrice}</span>
         {showOriginal && currentCurrency !== 'USD' && (
            <span className="text-xs text-muted-foreground ml-2">
               (${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })})
            </span>
         )}
      </div>
   );
};