export interface Currency {
   code: string;
   name: string;
   symbol: string;
   flag: string;
   destination?: string;
}

export const CURRENCIES: Currency[] = [
   { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', destination: 'United States' },
   { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', destination: 'Dubai' },
   { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', destination: 'Turkey' },
   { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', destination: 'Greece' },
   { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', destination: 'Thailand' },
   { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', destination: 'Indonesia' },
];

export const DEFAULT_CURRENCY = 'USD';

export interface ExchangeRates {
   [key: string]: number; // Rate from USD to target currency
   timestamp: number;
}

export interface CurrencyConversionOptions {
   amount: number;
   from?: string; // Default is USD
   to?: string; // Default is current currency
   format?: boolean;
}