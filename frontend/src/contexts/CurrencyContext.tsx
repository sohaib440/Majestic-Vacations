// context/CurrencyContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrency } from '@/hooks/useCurrency';

interface CurrencyContextType {
   currentCurrency: string;
   convertFromUSD: (amount: number, targetCurrency?: string) => number;
   format: (amount: number, currencyCode?: string, locale?: string) => string;
   getCurrentCurrencyInfo: () => any;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrencyContext = () => {
   const context = useContext(CurrencyContext);
   if (!context) {
      throw new Error('useCurrencyContext must be used within CurrencyProvider');
   }
   return context;
};

interface CurrencyProviderProps {
   children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
   const currency = useCurrency();

   return (
      <CurrencyContext.Provider value={currency}>
         {children}
      </CurrencyContext.Provider>
   );
};