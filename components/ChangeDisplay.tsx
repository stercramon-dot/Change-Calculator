
import React from 'react';
import type { ChangeCalculation } from '../types';
import { KHR_DENOMINATIONS, USD_DENOMINATIONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, ReceiptText } from 'lucide-react';

interface ChangeDisplayProps {
  calculation: ChangeCalculation | null;
}

const formatKhr = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' ៛';
};

const formatUsd = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const BreakdownList: React.FC<{ amount: number; denominations: number[]; currency: 'USD' | 'KHR' }> = ({ amount, denominations, currency }) => {
    let remaining = amount;
    const breakdown = denominations.map(denom => {
        const count = Math.floor(remaining / denom);
        if (count > 0) {
            remaining %= denom;
            return { denom, count };
        }
        return null;
    }).filter(Boolean);

    if (breakdown.length === 0 && amount > 0) {
        return (
             <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-200 dark:border-gray-700 last:border-0"
             >
                <span className="text-xs text-gray-500 dark:text-gray-400">Remainder</span>
                <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">
                    {currency === 'USD' ? formatUsd(amount) : formatKhr(amount)}
                </span>
             </motion.li>
        )
    }

    return (
        <>
            {breakdown.map((item, index) => item && (
                <motion.li 
                    key={index} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-700 last:border-0"
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                            {item.count}x
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Notes</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">
                        {currency === 'USD' ? formatUsd(item.denom) : formatKhr(item.denom)}
                    </span>
                </motion.li>
            ))}
        </>
    );
};


const ChangeDisplay: React.FC<ChangeDisplayProps> = ({ calculation }) => {
  if (!calculation) {
    return (
      <div className="text-center p-8 bg-gray-50/50 dark:bg-[#23272F]/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Awaiting transaction details...</p>
      </div>
    );
  }

  if (calculation.insufficient > 0) {
    return (
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-6 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col items-center text-center space-y-3"
      >
        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
            <AlertCircle size={24} />
        </div>
        <div>
            <h2 className="text-sm font-bold text-red-800 dark:text-red-300 uppercase tracking-widest">Insufficient Funds</h2>
            <p className="text-2xl font-mono font-bold text-red-600 dark:text-red-400 mt-1">
                {formatKhr(calculation.insufficient)}
            </p>
            <p className="text-xs font-medium text-red-500/70 dark:text-red-400/50 mt-1">
                Remaining balance due
            </p>
        </div>
      </motion.div>
    );
  }

  if (calculation.totalKhr === 0) {
     return (
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-100 dark:border-green-900/30 flex flex-col items-center text-center space-y-3"
        >
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
                <CheckCircle2 size={24} />
            </div>
            <div>
                <h2 className="text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-widest">Exact Amount</h2>
                <p className="text-xs font-medium text-green-500/70 dark:text-green-400/50 mt-1">No change required for this transaction</p>
            </div>
        </motion.div>
     )
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden p-6 bg-blue-500 rounded-3xl text-center shadow-xl shadow-blue-500/20"
      >
        <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
            <ReceiptText size={120} />
        </div>
        <h2 className="relative z-10 text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em] mb-1">Total Change Due</h2>
        <p className="relative z-10 text-4xl font-mono font-bold text-white tracking-tight">{formatKhr(calculation.totalKhr)}</p>
        <p className="relative z-10 text-sm font-medium text-blue-100 mt-1 opacity-80">{formatUsd(calculation.totalUsd)}</p>
      </motion.div>

      {calculation.breakdown && calculation.breakdown.khr > 0 && (
        <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
        >
            <div className="flex items-center space-x-2 px-1">
                <ReceiptText size={14} className="text-gray-400" />
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Note Breakdown (KHR)</h3>
            </div>
            <div className="p-5 bg-gray-50 dark:bg-[#23272F] rounded-3xl border border-gray-100 dark:border-gray-700/50">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    <BreakdownList amount={calculation.breakdown.khr} denominations={KHR_DENOMINATIONS} currency="KHR" />
                </ul>
            </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChangeDisplay;
