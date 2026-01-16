import React from 'react';
import { useCurrency } from '@/hooks/useCurrency';

interface PriceDisplayProps {
   amount: number; // Amount in USD
   className?: string;
   showOriginal?: boolean;
   showSymbol?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
   amount,
   className = '',
   showOriginal = false,
   showSymbol = true,
}) => {
   const { currentCurrency, convertFromUSD, format } = useCurrency();

   // Convert price from USD to current currency
   const convertedAmount = convertFromUSD(amount);
   const formattedPrice = format(convertedAmount);

   // For USD, show simple format
   const displayPrice = currentCurrency === 'USD'
      ? `$${amount.toFixed(2)}`
      : formattedPrice;

   return (
      <div className={`price-display ${className}`}>
         {showSymbol && (
            <span className="currency-symbol">
               {currentCurrency === 'USD' ? '$' : ''}
            </span>
         )}
         <span className="price-amount">{displayPrice}</span>

         {showOriginal && currentCurrency !== 'USD' && (
            <span className="text-xs text-gray-500 ml-2">
               (${amount.toFixed(2)})
            </span>
         )}
      </div>
   );
};

export default PriceDisplay;