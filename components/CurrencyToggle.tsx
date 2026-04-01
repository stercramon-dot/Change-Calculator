
import React from 'react';
import { Currency } from '../types';
import { motion } from 'motion/react';

interface CurrencyToggleProps {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ selectedCurrency, setSelectedCurrency }) => {
  return (
    <div className="relative flex items-center bg-gray-100 dark:bg-[#1A1D23] rounded-xl p-1 border border-gray-200 dark:border-gray-700/50">
      <motion.div
        className="absolute h-[calc(100%-8px)] bg-white dark:bg-blue-500 rounded-lg shadow-sm"
        initial={false}
        animate={{
          left: selectedCurrency === Currency.USD ? '4px' : '50%',
          width: 'calc(50% - 4px)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      
      <button
        onClick={() => setSelectedCurrency(Currency.USD)}
        className={`relative z-10 px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors duration-200 w-12 ${
          selectedCurrency === Currency.USD ? 'text-blue-600 dark:text-white' : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        USD
      </button>
      <button
        onClick={() => setSelectedCurrency(Currency.KHR)}
        className={`relative z-10 px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors duration-200 w-12 ${
          selectedCurrency === Currency.KHR ? 'text-blue-600 dark:text-white' : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        KHR
      </button>
    </div>
  );
};

export default CurrencyToggle;
