import { useState, useEffect, useCallback } from 'react';
import { currencyService } from '@/services/currencyService';
import { CURRENCIES } from '@/lib/currency';

export function useCurrency() {
   const [currentCurrency, setCurrentCurrency] = useState(() => currencyService.getCurrentCurrency());
   const [isLoading, setIsLoading] = useState(false);

   // Subscribe to currency changes
   useEffect(() => {
      const unsubscribe = currencyService.subscribe((currency) => {
         setCurrentCurrency(currency);
      });

      // Initialize rates on first load
      currencyService.initializeRates();

      return unsubscribe;
   }, []);

   // Change currency
   const changeCurrency = useCallback((currencyCode: string) => {
      currencyService.setCurrency(currencyCode);
   }, []);

   // Convert from USD
   const convertFromUSD = useCallback((amount: number, targetCurrency?: string) => {
      return currencyService.convertFromUSD(amount, targetCurrency);
   }, []);

   // Convert between currencies
   const convert = useCallback((amount: number, fromCurrency: string, toCurrency: string) => {
      return currencyService.convert(amount, fromCurrency, toCurrency);
   }, []);

   // Format amount
   const format = useCallback((amount: number, currencyCode?: string, locale?: string) => {
      return currencyService.format(amount, currencyCode, locale);
   }, []);

   // Get current currency info
   const getCurrentCurrencyInfo = () => {
      return CURRENCIES.find(c => c.code === currentCurrency);
   };

   // Get all currencies
   const getCurrencies = () => {
      return currencyService.getCurrencies();
   };

   // Refresh rates
   const refreshRates = async () => {
      setIsLoading(true);
      try {
         await currencyService.fetchExchangeRates();
      } finally {
         setIsLoading(false);
      }
   };

   return {
      currentCurrency,
      setCurrency: changeCurrency,
      convertFromUSD,
      convert,
      format,
      getCurrentCurrencyInfo,
      getCurrencies,
      isLoading,
      refreshRates,
   };
}