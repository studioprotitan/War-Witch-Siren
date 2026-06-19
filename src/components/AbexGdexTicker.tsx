import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Cpu, Flame, Zap, ShieldAlert } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

export default function AbexGdexTicker() {
  const [gasPrice, setGasPrice] = useState('14.8');
  const [gasGvr, setGasGvr] = useState('0.0031');
  const [gvrFuelIndex, setGvrFuelIndex] = useState('1.042');
  const [blockNumber, setBlockNumber] = useState(21489102);

  const [items, setItems] = useState<TickerItem[]>([
    { symbol: 'ABEX-STOCK', price: '$841.50', change: '+3.44%', isUp: true },
    { symbol: 'GDEX-MINT', price: '$1,249.12', change: '-1.18%', isUp: false },
    { symbol: 'GVR/USD', price: '$42.08', change: '+0.42%', isUp: true },
    { symbol: 'LEY/USD', price: '$0.1509', change: '+8.15%', isUp: true },
    { symbol: 'STYX-INDEX', price: '$244.15', change: '-4.90%', isUp: false },
    { symbol: 'CENOTE-VAL', price: '$1.049', change: '+0.01%', isUp: true }
  ]);

  useEffect(() => {
    // Dynamic ticker fluctuation to make the board look fully real
    const interval = setInterval(() => {
      setBlockNumber(prev => prev + 1);
      
      setGasPrice(prev => {
        const val = parseFloat(prev) + (Math.random() - 0.48) * 0.4;
        return Math.max(8.0, Math.min(28.0, val)).toFixed(1);
      });

      setGasGvr(prev => {
        const val = parseFloat(prev) + (Math.random() - 0.5) * 0.0001;
        return Math.max(0.0015, Math.min(0.0062, val)).toFixed(4);
      });

      setGvrFuelIndex(prev => {
        const val = parseFloat(prev) + (Math.random() - 1.2) * 0.001;
        return Math.max(0.950, Math.min(1.250, val)).toFixed(3);
      });

      setItems(prev => prev.map(item => {
        const currentPrice = parseFloat(item.price.replace(/[$,]/g, ''));
        const factor = item.isUp ? 1 : -1;
        const delta = currentPrice * (Math.random() - 0.48) * 0.01;
        const nextPrice = currentPrice + delta;
        const nextPercent = (Math.random() * 5).toFixed(2);
        const randUp = Math.random() > 0.45;
        
        return {
          ...item,
          price: item.price.startsWith('$') 
            ? `$${nextPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : nextPrice.toFixed(4),
          change: `${randUp ? '+' : '-'}${nextPercent}%`,
          isUp: randUp
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="abex-gdex-ticker-hud" className="h-[26px] bg-[#050403] border-b border-[#2e2418] flex items-center overflow-hidden w-full select-none text-[8.5px] font-mono shrink-0 relative z-20">
      
      {/* Network indicator prefix */}
      <div className="bg-[#120e0a] border-r border-[#2e2418] h-full px-3.5 flex items-center gap-1.5 shrink-0 text-[#c46a1a] font-bold tracking-wider z-10 select-none">
        <Cpu className="w-3 h-3 text-[#c46a1a] animate-spin" />
        <span>BASE_SEPOLIA: 0x8be...fd1a</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping ml-1" />
      </div>

      {/* Fuel deployment system diagnostics */}
      <div className="bg-[#0b0907] border-r border-[#2e2418] h-full px-3 flex items-center gap-2 shrink-0 text-slate-400 z-10 text-[8px] font-sans">
        <div className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-[#c46a1a] animate-pulse" />
          <span className="text-slate-500 font-mono">GAS:</span> 
          <span className="text-amber-500 font-mono font-bold animate-pulse">{gasPrice} Gwei</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-mono">DEPLOY FUEL:</span> 
          <span className="text-cyan-400 font-mono font-bold">{gasGvr} GVR/MNT</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-mono">MULTIPLIER:</span> 
          <span className="text-[#bf9f62] font-mono font-bold">{gvrFuelIndex}x LEY</span>
        </div>
      </div>

      {/* Sliding ticker entries container */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="flex gap-6 animate-ticker whitespace-nowrap">
          {/* First block of items */}
          {items.map((it, idx) => (
            <div key={`t1-${idx}`} className="inline-flex items-center gap-1.5 px-1 pr-3 border-r border-[#1a140f] h-full py-1">
              <span className="text-slate-500 font-bold tracking-tight">{it.symbol}:</span>
              <span className="text-white font-bold">{it.price}</span>
              <span className={`inline-flex items-center text-[7.5px] font-bold ${it.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {it.isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {it.change}
              </span>
            </div>
          ))}
          {/* Duplicated items block for seamless wrapping flow */}
          {items.map((it, idx) => (
            <div key={`t2-${idx}`} className="inline-flex items-center gap-1.5 px-1 pr-3 border-r border-[#1a140f] h-full py-1">
              <span className="text-slate-500 font-bold tracking-tight">{it.symbol}:</span>
              <span className="text-white font-bold">{it.price}</span>
              <span className={`inline-flex items-center text-[7.5px] font-bold ${it.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {it.isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {it.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Segment suffix block info */}
      <div className="bg-[#120e0a] border-l border-[#2e2418] h-full px-3.5 flex items-center gap-1.5 shrink-0 text-slate-500 z-10 select-none text-[8px] font-sans">
        <span>BLOCK_INDEX:</span>
        <span className="text-white font-mono font-bold">{blockNumber.toLocaleString()}</span>
      </div>

    </div>
  );
}
