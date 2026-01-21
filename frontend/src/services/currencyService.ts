import { ExchangeRates, DEFAULT_CURRENCY, CURRENCIES } from '@/lib/currency';

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';
// Alternative: 'https://api.exchangerate.host/latest?base=USD'
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const LOCAL_STORAGE_KEY = 'selected_currency';
const RATES_STORAGE_KEY = 'exchange_rates';

class CurrencyService {
   private rates: ExchangeRates | null = null;
   private lastFetchTime: number = 0;
   private subscribers: ((currency: string) => void)[] = [];

   constructor() {
      this.loadCurrencyFromStorage();
      this.loadRatesFromStorage();
      this.initializeRates();
   }

   // Get current selected currency
   getCurrentCurrency(): string {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored || DEFAULT_CURRENCY;
   }

   // Set currency and save to localStorage
   setCurrency(currencyCode: string): void {
      const validCurrency = CURRENCIES.find(c => c.code === currencyCode);
      if (!validCurrency) {
         console.warn(`Invalid currency code: ${currencyCode}`);
         return;
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, currencyCode);
      this.notifySubscribers(currencyCode);
   }

   // Subscribe to currency changes
   subscribe(callback: (currency: string) => void): () => void {
      this.subscribers.push(callback);
      return () => {
         this.subscribers = this.subscribers.filter(cb => cb !== callback);
      };
   }

   private notifySubscribers(currency: string): void {
      this.subscribers.forEach(callback => callback(currency));
   }

   // Load currency from localStorage on initialization
   private loadCurrencyFromStorage(): void {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) {
         localStorage.setItem(LOCAL_STORAGE_KEY, DEFAULT_CURRENCY);
      }
   }

   // Load rates from localStorage
   private loadRatesFromStorage(): void {
      const stored = localStorage.getItem(RATES_STORAGE_KEY);
      if (stored) {
         try {
            const data = JSON.parse(stored);
            this.rates = data.rates;
            this.lastFetchTime = data.timestamp;
         } catch (error) {
            console.error('Failed to parse stored exchange rates:', error);
         }
      }
   }

   // Save rates to localStorage
   private saveRatesToStorage(rates: ExchangeRates): void {
      localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify({
         rates,
         timestamp: Date.now()
      }));
   }

   // Initialize rates - fetch if needed
   async initializeRates(): Promise<void> {
      const now = Date.now();

      // If rates are old or don't exist, fetch new ones
      if (!this.rates || (now - this.lastFetchTime) > REFRESH_INTERVAL) {
         await this.fetchExchangeRates();
      }
   }

   // Fetch exchange rates from API
   async fetchExchangeRates(): Promise<ExchangeRates | null> {
      try {
         const response = await fetch(EXCHANGE_RATE_API);

         if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
         }

         const data = await response.json();

         // Transform the API response to our format
         const rates: ExchangeRates = {
            ...data.rates,
            timestamp: Date.now()
         };

         this.rates = rates;
         this.lastFetchTime = Date.now();
         this.saveRatesToStorage(rates);

         return rates;
      } catch (error) {
         console.error('Failed to fetch exchange rates:', error);

         // Fallback to hardcoded rates if API fails
         if (!this.rates) {
            this.rates = this.getFallbackRates();
            this.saveRatesToStorage(this.rates);
         }

         return this.rates;
      }
   }

   // Get fallback rates (for when API is unavailable)
   private getFallbackRates(): ExchangeRates {
      return {
         USD: 1,
         AED: 3.67,
         TRY: 32.5,
         EUR: 0.92,
         THB: 36.5,
         IDR: 15600,
         timestamp: Date.now()
      };
   }

   // Convert amount from USD to target currency
   convertFromUSD(amount: number, targetCurrency: string = this.getCurrentCurrency()): number {
      if (targetCurrency === 'USD') return amount;

      if (!this.rates) {
         console.warn('Exchange rates not loaded yet');
         return amount;
      }

      const rate = this.rates[targetCurrency];
      if (!rate) {
         console.warn(`No exchange rate found for ${targetCurrency}`);
         return amount;
      }

      return amount * rate;
   }

   // Convert between any two currencies
   convert(amount: number, fromCurrency: string, toCurrency: string): number {
      if (fromCurrency === toCurrency) return amount;

      if (!this.rates) {
         console.warn('Exchange rates not loaded yet');
         return amount;
      }

      // Convert from source currency to USD first
      const fromRate = this.rates[fromCurrency];
      const toRate = this.rates[toCurrency];

      if (!fromRate || !toRate) {
         console.warn(`Missing exchange rates for conversion`);
         return amount;
      }

      // Convert: amount → USD → target currency
      const amountInUSD = amount / fromRate;
      return amountInUSD * toRate;
   }

   // Format currency amount
   format(amount: number, currencyCode: string = this.getCurrentCurrency(), locale: string = 'en-US'): string {
      const currency = CURRENCIES.find(c => c.code === currencyCode);
      if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;

      try {
         return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
         }).format(amount);
      } catch (error) {
         // Fallback formatting
         return `${currency.symbol}${amount.toFixed(2)} ${currencyCode}`;
      }
   }

   // Get all available currencies
   getCurrencies() {
      return CURRENCIES;
   }

   // Get rate for a specific currency
   getRate(currencyCode: string): number | null {
      if (!this.rates) return null;
      return this.rates[currencyCode] || null;
   }

   // Check if rates are stale
   areRatesStale(): boolean {
      if (!this.lastFetchTime) return true;
      return (Date.now() - this.lastFetchTime) > REFRESH_INTERVAL;
   }
}

// Create singleton instance
export const currencyService = new CurrencyService();