
import React, { useState, useMemo } from 'react';
import { Settings, ChevronDown, ChevronUp, Calculator, RefreshCw, DollarSign, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InputGroup from './components/InputGroup';
import ChangeDisplay from './components/ChangeDisplay';
import { Currency } from './types';
import type { ChangeCalculation } from './types';
import { KHR_SELL_USD, KHR_BUY_USD } from './constants';

const App: React.FC = () => {
  const [amountDue, setAmountDue] = useState<string>('');
  const [dueCurrency, setDueCurrency] = useState<Currency>(Currency.USD);
  const [amountGiven, setAmountGiven] = useState<string>('');
  const [givenCurrency, setGivenCurrency] = useState<Currency>(Currency.KHR);
  
  const [sellRate, setSellRate] = useState<number>(KHR_SELL_USD);
  const [buyRate, setBuyRate] = useState<number>(KHR_BUY_USD);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const parsedAmountDue = parseFloat(amountDue) || 0;
  const parsedAmountGiven = parseFloat(amountGiven) || 0;

  const totalDueInKhr = useMemo(() => {
    if (parsedAmountDue <= 0) return 0;
    return dueCurrency === Currency.USD ? parsedAmountDue * sellRate : parsedAmountDue;
  }, [parsedAmountDue, dueCurrency, sellRate]);

  const changeCalculation: ChangeCalculation | null = useMemo(() => {
    if (parsedAmountDue <= 0 || parsedAmountGiven <= 0) {
      return null;
    }

    const totalGivenInKhr = givenCurrency === Currency.USD ? parsedAmountGiven * buyRate : parsedAmountGiven;
    const changeInKhr = totalGivenInKhr - totalDueInKhr;

    if (changeInKhr < 0) {
      return {
        totalKhr: changeInKhr,
        totalUsd: changeInKhr / sellRate,
        insufficient: Math.abs(changeInKhr),
        breakdown: null,
      };
    }
    
    if (changeInKhr === 0) {
        return {
            totalKhr: 0,
            totalUsd: 0,
            insufficient: 0,
            breakdown: null,
        }
    }

    const khrRounded = Math.round(changeInKhr / 100) * 100;

    return {
      totalKhr: changeInKhr,
      totalUsd: changeInKhr / sellRate,
      insufficient: 0,
      breakdown: {
        khr: khrRounded,
      },
    };
  }, [parsedAmountDue, parsedAmountGiven, givenCurrency, totalDueInKhr, sellRate, buyRate]);

  const formatKhr = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(amount)) + ' ៛';
  };

  const handleReset = () => {
    setAmountDue('');
    setAmountGiven('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F1115] flex items-center justify-center p-4 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#1A1D23] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 p-6 md:p-8 space-y-8"
      >
        <header className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Calculator size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">គិតលុយ</h1>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cambodian Change</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all"
              title="Reset"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-all ${showSettings ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
              title="Exchange Rate Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-[#23272F] p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Exchange Rates</h2>
                  <div className="flex items-center space-x-1 text-[10px] font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>LIVE RATE</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Sell Rate (USD → KHR)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={sellRate}
                        onChange={(e) => setSellRate(Number(e.target.value))}
                        className="w-full pl-3 pr-8 py-2.5 bg-white dark:bg-[#1A1D23] rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">៛</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Buy Rate (USD → KHR)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={buyRate}
                        onChange={(e) => setBuyRate(Number(e.target.value))}
                        className="w-full pl-3 pr-8 py-2.5 bg-white dark:bg-[#1A1D23] rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">៛</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="space-y-8">
          <div className="relative">
            <InputGroup
              label="Amount to Collect"
              amount={amountDue}
              setAmount={setAmountDue}
              currency={dueCurrency}
              setCurrency={setDueCurrency}
              id="amount-due"
            />
            <AnimatePresence>
              {totalDueInKhr > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute -bottom-6 right-1 flex items-center space-x-1.5"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total:</span>
                    <span className="text-xs font-mono font-bold text-blue-500">{formatKhr(totalDueInKhr)}</span>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-2">
            <InputGroup
              label="Cash from Customer"
              amount={amountGiven}
              setAmount={setAmountGiven}
              currency={givenCurrency}
              setCurrency={setGivenCurrency}
              id="amount-given"
            />
          </div>
        </main>

        <footer className="pt-8">
            <ChangeDisplay calculation={changeCalculation} />
        </footer>

        <div className="text-center pt-2">
          <p className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">
            Cambodian Exchange Standard
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
