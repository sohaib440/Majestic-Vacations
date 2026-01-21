// src/providers/CurrencyProvider.tsx
import React, { useEffect } from 'react';
import { currencyService } from '@/services/currencyService';

interface CurrencyProviderProps {
   children: React.ReactNode;
}

const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
   useEffect(() => {
      // Initialize currency service on app load
      currencyService.initializeRates();

      // Set up periodic refresh
      const interval = setInterval(() => {
         if (currencyService.areRatesStale()) {
            currencyService.fetchExchangeRates();
         }
      }, 60 * 1000); // Check every minute

      return () => clearInterval(interval);
   }, []);

   return <>{children}</>;
};

export default CurrencyProvider;