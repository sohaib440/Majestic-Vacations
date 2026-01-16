import React, { useState } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, RefreshCw } from 'lucide-react';

interface CurrencySelectorProps {
   variant?: 'default' | 'compact';
   showLabel?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
   variant = 'default',
   showLabel = true,
}) => {
   const { currentCurrency, setCurrency, getCurrencies, getCurrentCurrencyInfo, refreshRates, isLoading } = useCurrency();
   const [isOpen, setIsOpen] = useState(false);

   const currencies = getCurrencies();
   const currentCurrencyInfo = getCurrentCurrencyInfo();

   const handleCurrencyChange = (currencyCode: string) => {
      setCurrency(currencyCode);
      setIsOpen(false);
   };

   const handleRefreshRates = async (e: React.MouseEvent) => {
      e.stopPropagation();
      await refreshRates();
   };

   if (variant === 'compact') {
      return (
         <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="sm" className="gap-1">
                  <span>{currentCurrencyInfo?.flag || currentCurrency}</span>
                  <ChevronDown className="h-3 w-3" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
               {currencies.map((currency) => (
                  <DropdownMenuItem
                     key={currency.code}
                     onClick={() => handleCurrencyChange(currency.code)}
                     className={`flex items-center justify-between ${currentCurrency === currency.code ? 'bg-primary/10' : ''
                        }`}
                  >
                     <div className="flex items-center gap-2">
                        <span className="text-lg">{currency.flag}</span>
                        <div className="flex flex-col">
                           <span className="font-medium">{currency.code}</span>
                           {currency.destination && (
                              <span className="text-xs text-muted-foreground">
                                 {currency.destination}
                              </span>
                           )}
                        </div>
                     </div>
                     {currentCurrency === currency.code && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                     )}
                  </DropdownMenuItem>
               ))}
               <div className="border-t pt-2 mt-1">
                  <Button
                     variant="ghost"
                     size="sm"
                     className="w-full justify-start text-xs"
                     onClick={handleRefreshRates}
                     disabled={isLoading}
                  >
                     <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                     Refresh Rates
                  </Button>
               </div>
            </DropdownMenuContent>
         </DropdownMenu>
      );
   }

   return (
      <div className="flex items-center gap-2">
         {showLabel && (
            <span className="text-sm font-medium text-foreground/80">Currency:</span>
         )}
         <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="outline"
                  className="gap-2 border-border/50 hover:bg-accent/50"
               >
                  <div className="flex items-center gap-2">
                     <span className="text-lg">{currentCurrencyInfo?.flag}</span>
                     <span className="font-medium">{currentCurrency}</span>
                     <span className="text-muted-foreground">
                        {currentCurrencyInfo?.symbol}
                     </span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
               <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Select Destination Currency
               </div>
               {currencies.map((currency) => (
                  <DropdownMenuItem
                     key={currency.code}
                     onClick={() => handleCurrencyChange(currency.code)}
                     className={`py-2.5 px-3 my-1 rounded-md ${currentCurrency === currency.code
                           ? 'bg-primary/10 text-primary font-medium'
                           : 'hover:bg-accent'
                        }`}
                  >
                     <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                           <span className="text-2xl">{currency.flag}</span>
                           <div className="flex flex-col items-start">
                              <span className="font-medium">{currency.name}</span>
                              <span className="text-xs text-muted-foreground">
                                 {currency.destination || currency.code}
                              </span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="font-mono">{currency.symbol}</span>
                           {currentCurrency === currency.code && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                           )}
                        </div>
                     </div>
                  </DropdownMenuItem>
               ))}
               <div className="border-t pt-2 mt-1 px-2">
                  <div className="flex items-center justify-between">
                     <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={handleRefreshRates}
                        disabled={isLoading}
                     >
                        <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Update Rates
                     </Button>
                     <span className="text-xs text-muted-foreground">
                        Auto-refresh in 5 min
                     </span>
                  </div>
               </div>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

export default CurrencySelector;