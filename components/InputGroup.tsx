
import React from 'react';
import { Currency } from '../types';
import CurrencyToggle from './CurrencyToggle';
import { motion } from 'motion/react';

interface InputGroupProps {
  label: string;
  amount: string;
  setAmount: (value: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  id: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, amount, setAmount, currency, setCurrency, id }) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="space-y-3 group">
      <div className="flex items-center justify-between px-1">
        <label htmlFor={id} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
          {label}
        </label>
      </div>
      
      <div className="relative flex items-center bg-gray-50 dark:bg-[#23272F] rounded-2xl border-2 border-transparent focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-[#1A1D23] transition-all duration-300 shadow-sm group-hover:shadow-md">
        <div className="pl-5 flex items-center justify-center">
          <span className={`text-xl font-bold transition-colors duration-300 ${amount ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`}>
            {currency === Currency.USD ? '$' : '៛'}
          </span>
        </div>
        
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.00"
          className="w-full py-5 px-3 bg-transparent text-gray-900 dark:text-white text-2xl font-mono font-bold focus:outline-none placeholder:text-gray-200 dark:placeholder:text-gray-700"
        />
        
        <div className="pr-3">
          <CurrencyToggle selectedCurrency={currency} setSelectedCurrency={setCurrency} />
        </div>
      </div>
    </div>
  );
};

export default InputGroup;
