import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Train, ShieldAlert, Thermometer, User, Gauge, Droplets, MapPin, 
  Calendar, Zap, Shield, HelpCircle, Activity, ChevronRight, Waves, Globe,
  Warehouse, Wrench, GitFork, AlertTriangle
} from 'lucide-react';

interface StationDetails {
  city: string;
  depot: string;
  yard: string;
  junction: string;
  floodLevel: number; // 0 to 100
  riftIncursions: number; // count
  ward: number; // 1 to 8
  manager: string;
  baseGas: number; // GVR
  fuelNeeded: number; // Liters
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'RIPPLED';
  coordinates: { x: number; y: number };
}

interface ScheduleItem {
  id: string;
  train: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  status: 'ON_TIME' | 'DELAYED' | 'REROUTED';
}

const STATION_DATABASE: Record<string, StationDetails> = {
  'Jane District': {
    city: 'Jane District Central',
    depot: 'Station-01 Depot',
    yard: 'Gloom Yard Alpha',
    junction: 'Layline Junction 01',
    floodLevel: 12,
    riftIncursions: 2,
    ward: 4,
    manager: 'Supervisor Jane',
    baseGas: 0.0018,
    fuelNeeded: 450,
    status: 'SAFE',
    coordinates: { x: 120, y: 160 }
  },
  'Corgemont Primary': {
    city: 'Corgemont Alliance',
    depot: 'Sovereign Fleet Depot',
    yard: 'Lightning Yard',
    junction: 'High-Grid Junction',
    floodLevel: 48,
    riftIncursions: 5,
    ward: 7,
    manager: 'Agent Auremis Vael',
    baseGas: 0.0044,
    fuelNeeded: 820,
    status: 'WARNING',
    coordinates: { x: 280, y: 90 }
  },
  'Keystone Bridge': {
    city: 'Keystone Crossing',
    depot: 'Steamfitters Central Depot',
    yard: 'Iron-Plated Yard',
    junction: 'Bridge Cross Junction',
    floodLevel: 72,
    riftIncursions: 11,
    ward: 1,
    manager: 'Captain Kazenōbu',
    baseGas: 0.0035,
    fuelNeeded: 1200,
    status: 'CRITICAL',
    coordinates: { x: 440, y: 180 }
  },
  'Abyssal Maw': {
    city: 'Abyssum Deeps',
    depot: 'Anomalous Deep Depot',
    yard: 'Spore-Grow Yard',
    junction: 'Siren Biome Junction',
    floodLevel: 95,
    riftIncursions: 24,
    ward: 8,
    manager: 'Inquisitor Nyxi Glitch',
    baseGas: 0.0058,
    fuelNeeded: 2150,
    status: 'RIPPLED',
    coordinates: { x: 340, y: 280 }
  },
  'Mortex Gate': {
    city: 'Decayed Frontier',
    depot: 'Corrupted Cradle Depot',
    yard: 'Ash Spill Yard',
    junction: 'Boundary Gate Junction',
    floodLevel: 85,
    riftIncursions: 42,
    ward: 3,
    manager: 'UNKNOWN (Spore Intercept)',
    baseGas: 0.0075,
    fuelNeeded: 3400,
    status: 'CRITICAL',
    coordinates: { x: 180, y: 310 }
  }
};

const SCHEDULE_DATABASE: ScheduleItem[] = [
  { id: 'CST-201', train: 'CST-ERT Heavy Shield Escort', from: 'Jane District', to: 'Corgemont Primary', departure: '11:30', arrival: '12:15', status: 'ON_TIME' },
  { id: 'SIREN-88', train: 'Siren Whisp-Chitin Local', from: 'Abyssal Maw', to: 'Jane District', departure: '11:55', arrival: '12:50', status: 'DELAYED' },
  { id: 'STEAM-04', train: 'Kazenōbu Heavy Ore Train', from: 'Keystone Bridge', to: 'Corgemont Primary', departure: '12:10', arrival: '13:05', status: 'ON_TIME' },
  { id: 'MORT-00X', train: 'Ash Core Transmute Cargo', from: 'Mortex Gate', to: 'Abyssal Maw', departure: '12:45', arrival: '14:20', status: 'REROUTED' },
  { id: 'CST-703', train: 'CST-ERT Train Escort II', from: 'Jane District', to: 'Keystone Bridge', departure: '13:15', arrival: '14:10', status: 'ON_TIME' }
];

interface TrainRouteRadarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainRouteRadar({ isOpen, onClose }: TrainRouteRadarProps) {
  const [selectedStationName, setSelectedStationName] = useState<string>('Jane District');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [riftIntensityMultiplier, setRiftIntensityMultiplier] = useState<number>(1.2);
  const [simulatedGasRate, setSimulatedGasRate] = useState<number>(0.0024);
  const [gasApiStatus, setGasApiStatus] = useState<'ONLINE' | 'STANDBY' | 'SYNCING'>('ONLINE');
  const [pulseCount, setPulseCount] = useState<number>(0);

  // Ley Line Fluctuation & Corruption states
  const [leyThreshold, setLeyThreshold] = useState<number>(75);
  const [globalLeyBaseline, setGlobalLeyBaseline] = useState<number>(55);
  const [leyNoise, setLeyNoise] = useState<Record<string, number>>({
    'Jane District': 0,
    'Corgemont Primary': 0,
    'Keystone Bridge': 0,
    'Abyssal Maw': 0,
    'Mortex Gate': 0
  });

  // Real-time Ley line fluctuation noise generator
  useEffect(() => {
    const interval = setInterval(() => {
      setLeyNoise(prev => {
        const next = { ...prev };
        Object.keys(STATION_DATABASE).forEach(key => {
          // Soft random walk or sine wave modification
          const shift = (Math.random() - 0.5) * 8;
          // Keep noise clamped within -15 to +15
          next[key] = Math.max(-15, Math.min(15, (prev[key] || 0) + shift));
        });
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const getLeyFluctuation = (stationName: string) => {
    const stat = STATION_DATABASE[stationName];
    if (!stat) return 0;
    // Base is proportional to floodLevel and riftIncursions
    const baseVal = (stat.floodLevel * 0.4) + (stat.riftIncursions * 1.5);
    // Combine with global baseline, add individual real-time noise, and scale with riftIntensityMultiplier
    const rawVal = (baseVal + globalLeyBaseline + (leyNoise[stationName] || 0)) * (0.8 + (riftIntensityMultiplier * 0.2));
    return Math.max(0, Math.min(100, Math.round(rawVal)));
  };

  const corruptedStations = Object.keys(STATION_DATABASE).filter(name => {
    return getLeyFluctuation(name) >= leyThreshold;
  });
  const [hoveredNode, setHoveredNode] = useState<{
    name: string;
    type: 'DEPOT' | 'YARD' | 'JUNCTION' | 'STATION';
    label: string;
    manager: string;
    status: string;
    x: number;
    y: number;
  } | null>(null);

  // Helper to map unique, realistic subgroup designations / sub-managers based on the main station manager
  const getSubManager = (stationManager: string, type: 'DEPOT' | 'YARD' | 'JUNCTION') => {
    const base = stationManager.replace('UNKNOWN (Spore Intercept)', 'Nexus AI Proxy');
    if (type === 'DEPOT') return `${base} (Depot Deputy)`;
    if (type === 'YARD') return `Engineer ${base.split(' ').pop()} (Yard Specialist)`;
    return `Dispatcher ${base.split(' ').pop()} (Junction Dispatcher)`;
  };

  // Auto pulsing effect for radar overlay sweeps
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount(prev => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Simulating an active "Gas API" live polling update
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedGasRate(prev => {
        const change = (Math.random() - 0.5) * 0.0003;
        const next = Math.max(0.0010, prev + change);
        return parseFloat(next.toFixed(6));
      });
      setGasApiStatus(prev => (prev === 'ONLINE' ? 'SYNCING' : 'ONLINE'));
      setTimeout(() => setGasApiStatus('ONLINE'), 600);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const activeStation = STATION_DATABASE[selectedStationName] || STATION_DATABASE['Jane District'];

  // Calculate local dynamic threat parameters based on live slider values
  const currentIncursions = Math.round(activeStation.riftIncursions * riftIntensityMultiplier);
  const localGasPrice = parseFloat((activeStation.baseGas * (1 + (simulatedGasRate * 120))).toFixed(6));

  const getThreatLabel = (incursions: number, flood: number) => {
    const combinedRating = incursions * 2 + flood;
    if (combinedRating > 130) {
      return { label: 'Ω APOCALYPTIC INCURSION', style: 'text-red-500 border-red-500/45 bg-red-500/10' };
    }
    if (combinedRating > 80) {
      return { label: '☢ CATASTROPHIC BREACH', style: 'text-rose-400 border-rose-500/35 bg-rose-500/10' };
    }
    if (combinedRating > 40) {
      return { label: '⚠️ SEVERE ANOMALY', style: 'text-amber-400 border-amber-500/35 bg-amber-500/10' };
    }
    return { label: '✓ STANDBY STABLE', style: 'text-emerald-400 border-emerald-500/35 bg-emerald-500/10' };
  };

  const threatStatus = getThreatLabel(currentIncursions, activeStation.floodLevel);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030100] z-40 backdrop-blur-sm"
          />

          {/* Right Slide-Overs Terminal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 120 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0a0705] border-l border-[#421d0a] shadow-[0_0_50px_rgba(196,106,26,0.35)] z-50 flex flex-col overflow-hidden text-slate-300 font-mono"
          >
            {/* Terminal Header */}
            <header className="p-4 bg-[#140e0a] border-b border-[#301c0f] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#c46a1a]/15 border border-[#c46a1a]/55 flex items-center justify-center animate-pulse">
                  <Train className="w-4 h-4 text-[#c46a1a]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] bg-[#c46a1a]/20 border border-[#c46a1a]/40 text-amber-500 px-1 py-0.2 rounded font-bold uppercase tracking-widest">
                      TACTICAL ROUTE RADAR
                    </span>
                    <span className="text-[7.5px] text-slate-500">v3.89-L</span>
                  </div>
                  <h2 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                    CST-ERT TRANSIT SERVICE RADAR
                  </h2>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-7 h-7 rounded-md border border-[#2e1d13] bg-[#030201] text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Main scroll contents container Split layout */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

              {/* Section 1: Holographic Route Map & Heatmap overlay */}
              <div className="bg-[#030201] border border-[#2e1d13] rounded-xl p-3 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between z-10 relative">
                  <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-[#c46a1a] tracking-widest uppercase">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Holographic Ley Transit Map</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Heatmap overlay slider option */}
                    {showHeatmap && (
                      <div className="flex items-center gap-1">
                        <span className="text-[7px] text-slate-500 uppercase">RIFT INTENSITY:</span>
                        <input
                          type="range"
                          min="0.5"
                          max="3.0"
                          step="0.1"
                          value={riftIntensityMultiplier}
                          onChange={(e) => setRiftIntensityMultiplier(parseFloat(e.target.value))}
                          className="w-16 accent-[#c46a1a] cursor-pointer h-1 rounded"
                          title="Finetune global rift gravity index"
                        />
                        <span className="text-[7.5px] text-[#c46a1a] font-bold">x{riftIntensityMultiplier}</span>
                      </div>
                    )}

                    <button
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      className={`px-2 py-0.5 rounded border text-[7.5px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                        showHeatmap 
                          ? 'bg-rose-950/40 text-rose-400 border-rose-500/50 shadow-[inset_0_0_4px_rgba(239,68,68,0.15)] animate-pulse'
                          : 'bg-[#0a0705] text-slate-500 border-[#2e1d13] hover:border-slate-800'
                      }`}
                    >
                      HEAT MAP: {showHeatmap ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* SVG Route display Map Canvas */}
                <div className="relative w-full h-[220px] bg-[#020100] border border-[#1b1510] rounded-lg overflow-hidden flex items-center justify-center">
                  
                  {/* Grid overlay for radar feel */}
                  <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #c46a1a 1px, transparent 1px), linear-gradient(to bottom, #c46a1a 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  
                  {/* Radar Sweep Animation Indicator */}
                  <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-r from-transparent via-[#c46a1a]/[0.015] to-[#c46a1a]/[0.035] animate-pulse" />

                  {/* SVG Rendering */}
                  <svg className="w-full h-full absolute inset-0 select-none z-10" viewBox="0 0 540 340">
                    <defs>
                      <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                        <stop offset="60%" stopColor="#f97316" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="highRiskGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Heat Map Overlay Visual Layer */}
                    {showHeatmap && (
                      <g className="transition-opacity duration-500">
                        {/* Abyssal Maw - massive spore gradient */}
                        <circle cx="340" cy="280" r={85 * riftIntensityMultiplier} fill="url(#glowGrad)" />
                        {/* Mortex Gate - heavy decay radius */}
                        <circle cx="180" cy="310" r={75 * riftIntensityMultiplier} fill="url(#glowGrad)" />
                        {/* Keystone Bridge- severe node leak */}
                        <circle cx="440" cy="180" r={50 * riftIntensityMultiplier} fill="url(#glowGrad)" />
                        {/* Corgemont - storm grid high-risk core */}
                        <circle cx="280" cy="90" r={40 * riftIntensityMultiplier} fill="url(#highRiskGrad)" />

                        {/* Additional thematic ripple zones */}
                        <circle cx="230" cy="210" r="16" fill="rgba(196,106,26,0.12)" className="animate-ping" style={{ animationDuration: '3s' }} />
                        <circle cx="390" cy="140" r="24" fill="rgba(239,68,68,0.1)" className="animate-pulse" />
                      </g>
                    )}

                    {/* Rail Line Tracks Path */}
                    {/* Primary Line */}
                    <path 
                      d="M 120 160 L 280 90 L 440 180 L 340 280 L 180 310 Z" 
                      fill="none" 
                      stroke="#221711" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d="M 120 160 L 280 90 L 440 180 L 340 280 L 180 310 Z" 
                      fill="none" 
                      stroke="#5c381c" 
                      strokeWidth="2.5" 
                      strokeDasharray="6,4"
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="animate-pulse"
                    />

                    {/* Secondary Cross Connections */}
                    <line 
                      x1="120" y1="160" x2="340" y2="280" 
                      stroke="#211812" 
                      strokeWidth="3" 
                      strokeDasharray="4,8" 
                    />
                    <line 
                      x1="280" y1="90" x2="180" y2="310" 
                      stroke="#211812" 
                      strokeWidth="3" 
                      strokeDasharray="4,8" 
                    />

                    {/* Connection node markers */}
                    {Object.entries(STATION_DATABASE).map(([name, stat]) => {
                      const isSelected = selectedStationName === name;
                      const hasIncDot = stat.status === 'CRITICAL' || stat.status === 'RIPPLED';
                      return (
                        <g 
                          key={name}
                          onClick={() => setSelectedStationName(name)}
                          onMouseEnter={() => setHoveredNode({
                            name,
                            type: 'STATION',
                            label: stat.city,
                            manager: stat.manager,
                            status: stat.status,
                            x: stat.coordinates.x,
                            y: stat.coordinates.y
                          })}
                          onMouseLeave={() => setHoveredNode(null)}
                          className="cursor-pointer group"
                        >
                          {/* Outer flashing marker when selected */}
                          {isSelected && (
                            <circle 
                              cx={stat.coordinates.x} 
                              cy={stat.coordinates.y} 
                              r="15" 
                              fill="none" 
                              stroke="#c46a1a" 
                              strokeWidth="1" 
                              className="animate-ping"
                              style={{ animationDuration: '2s' }}
                            />
                          )}

                          {/* Corrupted zone overlay indicator */}
                          {corruptedStations.includes(name) && (
                            <>
                              <circle 
                                cx={stat.coordinates.x} 
                                cy={stat.coordinates.y} 
                                r="17" 
                                fill="none" 
                                stroke="#ef4444" 
                                strokeWidth="1.5" 
                                strokeDasharray="3,2"
                                className="animate-spin"
                                style={{ animationDuration: '6s' }}
                              />
                              <circle 
                                cx={stat.coordinates.x} 
                                cy={stat.coordinates.y} 
                                r="17" 
                                fill="none" 
                                stroke="#ef4444" 
                                strokeWidth="1" 
                                className="animate-ping"
                                style={{ animationDuration: '1.5s' }}
                              />
                            </>
                          )}

                          {/* Outer hover halo */}
                          <circle 
                            cx={stat.coordinates.x} 
                            cy={stat.coordinates.y} 
                            r="11" 
                            fill={isSelected ? 'rgba(196,106,26,0.15)' : 'transparent'} 
                            stroke={isSelected ? '#c46a1a' : '#3d2516'} 
                            strokeWidth={isSelected ? '2' : '1.5'} 
                            className="transition-all duration-200 group-hover:stroke-amber-500"
                          />

                          {/* Center Node Spikes */}
                          <circle 
                            cx={stat.coordinates.x} 
                            cy={stat.coordinates.y} 
                            r="5" 
                            fill={hasIncDot ? '#f43f5e' : stat.status === 'WARNING' ? '#f59e0b' : '#34d399'} 
                          />

                          {/* Mini warning tag next to dot if high rift */}
                          {stat.status === 'CRITICAL' && (
                            <rect 
                              x={stat.coordinates.x - 3} 
                              y={stat.coordinates.y - 12} 
                              width="6" 
                              height="6" 
                              fill="#ef4444" 
                              className="animate-bounce"
                            />
                          )}
                        </g>
                      );
                    })}

                    {/* Satellite Sub-Nodes for the currently selected Station */}
                    {Object.entries(STATION_DATABASE).map(([name, stat]) => {
                      const isSelected = selectedStationName === name;
                      if (!isSelected) return null;

                      // Offsets for Depot, Yard, and Junction to display as satellite nodes
                      const ds = { x: stat.coordinates.x - 22, y: stat.coordinates.y - 16 };
                      const ys = { x: stat.coordinates.x + 22, y: stat.coordinates.y - 16 };
                      const js = { x: stat.coordinates.x, y: stat.coordinates.y + 24 };

                      return (
                        <g key={`${name}-satellites`} className="transition-all duration-300">
                          {/* Layline connections connecting the main station to satellites */}
                          <line 
                            x1={stat.coordinates.x} y1={stat.coordinates.y} 
                            x2={ds.x} y2={ds.y} 
                            stroke="#c46a1a" strokeWidth="1" strokeDasharray="2,2" className="opacity-60" 
                          />
                          <line 
                            x1={stat.coordinates.x} y1={stat.coordinates.y} 
                            x2={ys.x} y2={ys.y} 
                            stroke="#c46a1a" strokeWidth="1" strokeDasharray="2,2" className="opacity-60" 
                          />
                          <line 
                            x1={stat.coordinates.x} y1={stat.coordinates.y} 
                            x2={js.x} y2={js.y} 
                            stroke="#c46a1a" strokeWidth="1" strokeDasharray="2,2" className="opacity-60" 
                          />

                          {/* Depot Node (Warehouse icon replacement dot) */}
                          <g 
                            className="cursor-pointer group/node"
                            onMouseEnter={() => setHoveredNode({
                              name,
                              type: 'DEPOT',
                              label: stat.depot,
                              manager: getSubManager(stat.manager, 'DEPOT'),
                              status: stat.status,
                              x: ds.x,
                              y: ds.y
                            })}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => setSelectedStationName(name)}
                          >
                            <circle cx={ds.x} cy={ds.y} r="5" fill="#030201" stroke="#c9b3ff" strokeWidth="1.5" className="group-hover/node:stroke-white transition-all group-hover/node:r-[6.5]" />
                            <circle cx={ds.x} cy={ds.y} r="2" fill="#c9b3ff" />
                          </g>

                          {/* Yard Node (Wrench icon replacement dot) */}
                          <g 
                            className="cursor-pointer group/node"
                            onMouseEnter={() => setHoveredNode({
                              name,
                              type: 'YARD',
                              label: stat.yard,
                              manager: getSubManager(stat.manager, 'YARD'),
                              status: stat.status,
                              x: ys.x,
                              y: ys.y
                            })}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => setSelectedStationName(name)}
                          >
                            <circle cx={ys.x} cy={ys.y} r="5" fill="#030201" stroke="#a89880" strokeWidth="1.5" className="group-hover/node:stroke-white transition-all group-hover/node:r-[6.5]" />
                            <circle cx={ys.x} cy={ys.y} r="2" fill="#a89880" />
                          </g>

                          {/* Junction Node (GitFork icon replacement dot) */}
                          <g 
                            className="cursor-pointer group/node"
                            onMouseEnter={() => setHoveredNode({
                              name,
                              type: 'JUNCTION',
                              label: stat.junction,
                              manager: getSubManager(stat.manager, 'JUNCTION'),
                              status: stat.status,
                              x: js.x,
                              y: js.y
                            })}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => setSelectedStationName(name)}
                          >
                            <circle cx={js.x} cy={js.y} r="5" fill="#030201" stroke="#34d399" strokeWidth="1.5" className="group-hover/node:stroke-white transition-all group-hover/node:r-[6.5]" />
                            <circle cx={js.x} cy={js.y} r="2" fill="#34d399" />
                          </g>
                        </g>
                      );
                    })}

                    {/* Dynamic Moving Trains on Routes layout */}
                    <circle cx="200" cy="125" r="4.5" fill="#f59e0b" className="animate-pulse shadow-glow">
                      <animateMotion dur="8s" repeatCount="indefinite" path="M 120 160 L 280 90 L 440 180" />
                    </circle>
                    <circle cx="390" cy="230" r="4.5" fill="#ffffff">
                      <animateMotion dur="11s" repeatCount="indefinite" path="M 440 180 L 340 280 L 180 310" />
                    </circle>
                  </svg>

                  {/* Hot interactive map overlay tooltips based on state */}
                  {hoveredNode && (
                    <div 
                      className="absolute bg-[#110c08]/95 border border-[#c46a1a] shadow-[0_0_15px_rgba(196,106,26,0.3)] p-2.5 rounded-lg z-30 pointer-events-none text-slate-300 font-mono w-52 space-y-1.5 backdrop-blur-sm"
                      style={{
                        left: `${Math.min(85, Math.max(15, (hoveredNode.x / 540) * 100))}%`,
                        top: `${Math.min(78, Math.max(8, (hoveredNode.y / 340) * 100))}%`,
                        transform: 'translate(-50%, -108%)',
                      }}
                    >
                      <div className="flex items-center gap-1.5 border-b border-[#2e1d13] pb-1 justify-between">
                        <div className="flex items-center gap-1.5">
                          {hoveredNode.type === 'DEPOT' && <Warehouse className="w-3.5 h-3.5 text-[#c9b3ff]" />}
                          {hoveredNode.type === 'YARD' && <Wrench className="w-3.5 h-3.5 text-[#a89880]" />}
                          {hoveredNode.type === 'JUNCTION' && <GitFork className="w-3.5 h-3.5 text-[#34d399]" />}
                          {hoveredNode.type === 'STATION' && <Train className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                          <span className="font-extrabold text-white uppercase text-[8px] tracking-wider">{hoveredNode.type}</span>
                        </div>
                        <span className="text-[6.5px] text-amber-500 font-bold">LIVE SYNC</span>
                      </div>
                      
                      <div className="space-y-1 text-[7.5px] leading-relaxed">
                        <div>
                          <span className="text-slate-500 block text-[6.5px] uppercase">COGNITIVE INDEX:</span>
                          <span className="text-white font-bold truncate block">{hoveredNode.label}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[6.5px] uppercase">STATION MANAGER:</span>
                          <span className="text-[#e4d9ff] font-extrabold block">{hoveredNode.manager}</span>
                        </div>
                        <div className="flex justify-between items-center pt-0.5">
                          <span className="text-slate-500 uppercase text-[6.5px]">THREAT LEVEL:</span>
                          <span className={`px-1 rounded text-[6.5px] font-bold ${hoveredNode.status === 'SAFE' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-rose-950/40 text-rose-400'}`}>
                            {hoveredNode.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mini floating map labels */}
                  <span className="absolute left-[38px] top-[145px] text-[7px] text-[#8b7d6b] cursor-pointer" onClick={() => setSelectedStationName('Jane District')}>Jane District Central [W4]</span>
                  <span className="absolute left-[200px] top-[74px] text-[7px] text-[#8b7d6b] cursor-pointer" onClick={() => setSelectedStationName('Corgemont Primary')}>Corgemont Primary [W7]</span>
                  <span className="absolute left-[370px] top-[195px] text-[7px] text-[#8b7d6b] cursor-pointer" onClick={() => setSelectedStationName('Keystone Bridge')}>Keystone Bridge [W1]</span>
                  <span className="absolute left-[325px] top-[292px] text-[7px] text-[#ef4444] font-bold cursor-pointer" onClick={() => setSelectedStationName('Abyssal Maw')}>Abyssal Maw [W8]</span>
                  <span className="absolute left-[140px] top-[320px] text-[7px] text-rose-400 font-bold cursor-pointer" onClick={() => setSelectedStationName('Mortex Gate')}>Mortex Gate [W3]</span>
                </div>
              </div>

              {/* Section 2: Selected Station Specific Details Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                
                {/* Station Manager & Location Info Card (Cols 1-7) */}
                <div className="md:col-span-7 bg-[#0b0705] border border-[#2e1d13] rounded-xl p-3.5 space-y-3.5">
                  <div className="flex justify-between items-start border-b border-[#21150e] pb-1.5">
                    <div>
                      <span className="text-[7.5px] text-slate-500 uppercase tracking-widest block font-sans">STATION CITY LOCATION:</span>
                      <h4 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider">{activeStation.city}</h4>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded border border-[#ef4444]/30 bg-red-950/20 text-rose-400 font-bold font-mono">
                      WARD-{activeStation.ward}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[8.5px] font-mono">
                    {/* Depot block */}
                    <div className="space-y-1 bg-[#030201] p-2 rounded border border-[#21150e] relative group/tooltip cursor-help hover:border-[#c9b3ff]/30 transition-all duration-200">
                      <div className="flex items-center gap-1.5">
                        <Warehouse className="w-3.5 h-3.5 text-[#c9b3ff] shrink-0" />
                        <span className="text-slate-500 block text-[7px] uppercase font-bold">TRAIN DEPOT</span>
                      </div>
                      <span className="text-[#c9b3ff] font-bold block truncate">{activeStation.depot}</span>
                      
                      {/* Tooltip popover showing manager details */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-[#110c08]/95 border border-[#c46a1a] shadow-[0_0_15px_rgba(196,106,26,0.3)] p-2.5 rounded-lg z-50 w-52 text-[8px] space-y-1.5 text-slate-300 transition-all duration-200">
                        <div className="flex items-center gap-1 border-b border-[#2e1d13] pb-1">
                          <User className="w-2.5 h-2.5 text-[#c46a1a]" />
                          <span className="font-extrabold text-white uppercase text-[8px]">Depot Control Officer</span>
                        </div>
                        <div><span className="text-slate-500">OFFICER:</span> <span className="text-[#e4d9ff] font-extrabold">{getSubManager(activeStation.manager, 'DEPOT')}</span></div>
                        <div><span className="text-slate-500">STATION:</span> <span className="text-white font-semibold">{activeStation.depot}</span></div>
                        <div><span className="text-slate-500">AUTHORITY:</span> <span className="text-amber-500 font-bold">WARD {activeStation.ward} SECTOR</span></div>
                        <div className="border-t border-[#21150e]/50 pt-1 text-[6.5px] text-slate-500 italic">Managed under district jurisdiction.</div>
                      </div>
                    </div>

                    {/* Yard block */}
                    <div className="space-y-1 bg-[#030201] p-2 rounded border border-[#21150e] relative group/tooltip cursor-help hover:border-[#a89880]/30 transition-all duration-200">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-[#a89880] shrink-0" />
                        <span className="text-slate-500 block text-[7px] uppercase font-bold">MAINTENANCE YARD</span>
                      </div>
                      <span className="text-[#a89880] font-bold block truncate">{activeStation.yard}</span>
                      
                      {/* Tooltip popover showing manager details */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-[#110c08]/95 border border-[#c46a1a] shadow-[0_0_15px_rgba(196,106,26,0.3)] p-2.5 rounded-lg z-50 w-52 text-[8px] space-y-1.5 text-slate-300 transition-all duration-200">
                        <div className="flex items-center gap-1 border-b border-[#2e1d13] pb-1">
                          <User className="w-2.5 h-2.5 text-[#c46a1a]" />
                          <span className="font-extrabold text-white uppercase text-[8px]">Yard Crew Chief</span>
                        </div>
                        <div><span className="text-slate-500">ENGINEER:</span> <span className="text-[#e4d9ff] font-extrabold">{getSubManager(activeStation.manager, 'YARD')}</span></div>
                        <div><span className="text-slate-500">STATION:</span> <span className="text-white font-semibold">{activeStation.yard}</span></div>
                        <div><span className="text-slate-500">AUTHORITY:</span> <span className="text-amber-500 font-bold">WARD {activeStation.ward} MAINTENANCE</span></div>
                        <div className="border-t border-[#21150e]/50 pt-1 text-[6.5px] text-slate-500 italic">Heavy Golem fabrication unit.</div>
                      </div>
                    </div>

                    {/* Junction block */}
                    <div className="space-y-1 bg-[#030201] p-2 rounded border border-[#21150e] relative group/tooltip cursor-help hover:border-emerald-500/30 transition-all duration-200">
                      <div className="flex items-center gap-1.5">
                        <GitFork className="w-3.5 h-3.5 text-[#34d399] shrink-0 rotate-90" />
                        <span className="text-slate-500 block text-[7px] uppercase font-bold">JUNCTION TERMINAL</span>
                      </div>
                      <span className="text-white font-bold block truncate">{activeStation.junction}</span>
                      
                      {/* Tooltip popover showing manager details */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-[#110c08]/95 border border-[#c46a1a] shadow-[0_0_15px_rgba(196,106,26,0.3)] p-2.5 rounded-lg z-50 w-52 text-[8px] space-y-1.5 text-slate-300 transition-all duration-200">
                        <div className="flex items-center gap-1 border-b border-[#2e1d13] pb-1">
                          <User className="w-2.5 h-2.5 text-[#c46a1a]" />
                          <span className="font-extrabold text-white uppercase text-[8px]">Junction Chief Dispatcher</span>
                        </div>
                        <div><span className="text-slate-500">DISPATCHER:</span> <span className="text-[#e4d9ff] font-extrabold">{getSubManager(activeStation.manager, 'JUNCTION')}</span></div>
                        <div><span className="text-slate-500">STATION:</span> <span className="text-white font-semibold">{activeStation.junction}</span></div>
                        <div><span className="text-slate-500">AUTHORITY:</span> <span className="text-amber-500 font-bold">WARD {activeStation.ward} GRID CONTROL</span></div>
                        <div className="border-t border-[#21150e]/50 pt-1 text-[6.5px] text-slate-500 italic">Signal crossway routing panel.</div>
                      </div>
                    </div>

                    <div className="space-y-1 bg-[#030201] p-2 rounded border border-[#21150e]">
                      <span className="text-slate-500 block text-[7px] uppercase">STATION MANAGER</span>
                      <div className="flex items-center gap-1.5 text-[#e4d9ff] font-bold font-sans">
                        <User className="w-2.5 h-2.5 text-[#c46a1a] shrink-0" />
                        <span className="truncate">{activeStation.manager}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deployment requirements (Fuel to Deploy & Gas API simulated price) */}
                  <div className="pt-2 border-t border-[#21150e] grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7px] text-slate-500 uppercase">
                        <span>GAS API CONDUIT:</span>
                        <span className={`text-[6px] font-bold ${gasApiStatus === 'ONLINE' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          ● {gasApiStatus}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 bg-[#030201] px-2 py-1.5 rounded border border-[#21150e]">
                        <span className="text-cyan-400 font-extrabold text-xs">{localGasPrice}</span>
                        <span className="text-[6.5px] text-slate-500">GVR / FLOW</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[7px] text-slate-500 block uppercase">FUEL TO DEPLOY:</span>
                      <div className="flex items-center gap-1.5 bg-[#030201] px-2 py-1.5 rounded border border-[#21150e] text-amber-500 font-sans">
                        <Droplets className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-xs font-bold font-mono">{activeStation.fuelNeeded}</span>
                        <span className="text-[7px] text-slate-500 font-mono">LITERS COR-GAS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flood / Rift Anomaly Gauge Screen Panel (Cols 8-12) */}
                <div className="md:col-span-5 bg-[#0b0705] border border-[#2e1d13] rounded-xl p-3.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                      <ShieldAlert className="w-3 h-3 text-[#ef4444]" />
                      <span>Rift Incursion Detect</span>
                    </div>

                    <div className="bg-[#030201] p-2.5 rounded-lg border border-[#c46a1a]/15 text-center space-y-1">
                      <span className="text-[6.5px] text-slate-500 tracking-[0.1em] block font-bold">CALIBRATED RADAR WARNING:</span>
                      <div className={`p-1 text-[8.5px] font-bold rounded border ${threatStatus.style}`}>
                        {threatStatus.label}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    {/* Gauge 1: Flood Level Threat */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[7px] font-mono leading-none">
                        <span className="text-slate-400 uppercase flex items-center gap-0.5">
                          <Waves className="w-2.5 h-2.5 text-cyan-500 shrink-0" /> Flooding Layline level
                        </span>
                        <span className="text-[#c9b3ff] font-bold">{activeStation.floodLevel}%</span>
                      </div>
                      <div className="w-full bg-[#030201] h-1.5 rounded border border-[#21150e] overflow-hidden">
                        <div 
                          className={`h-full rounded transition-all duration-300 ${activeStation.floodLevel > 70 ? 'bg-red-500' : activeStation.floodLevel > 40 ? 'bg-amber-500' : 'bg-cyan-500'}`} 
                          style={{ width: `${activeStation.floodLevel}%` }}
                        />
                      </div>
                    </div>

                    {/* Gauge 2: Rift Incursion Level */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[7px] font-mono leading-none">
                        <span className="text-slate-400 uppercase flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 text-[#c46a1a] shrink-0 animate-pulse" /> Anomalous Incident points
                        </span>
                        <span className="text-[#c46a1a] font-bold">{currentIncursions} COGNITIVES</span>
                      </div>
                      <div className="w-full bg-[#030201] h-1.5 rounded border border-[#21150e] overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-[#c46a1a] h-full rounded transition-all duration-300 shadow-[0_0_6px_rgba(196,106,26,0.3)]" 
                          style={{ width: `${Math.min(100, currentIncursions * 2)}%` }}
                        />
                      </div>
                    </div>

                    {/* Gauge 3: Ley Line Fluctuation Level */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[7px] font-mono leading-none">
                        <span className="text-slate-400 uppercase flex items-center gap-0.5">
                          <Activity className="w-2.5 h-2.5 text-rose-500 shrink-0" /> Ley Line Fluctuation
                        </span>
                        <span className={`${getLeyFluctuation(selectedStationName) >= leyThreshold ? 'text-rose-500 font-extrabold animate-pulse' : 'text-amber-500 font-bold'}`}>
                          {getLeyFluctuation(selectedStationName)}% {getLeyFluctuation(selectedStationName) >= leyThreshold ? '(⚠️ CORRUPTED)' : '(STABLE)'}
                        </span>
                      </div>
                      <div className="w-full bg-[#030201] h-1.5 rounded border border-[#21150e] overflow-hidden">
                        <div 
                          className={`h-full rounded transition-all duration-300 ${
                            getLeyFluctuation(selectedStationName) >= leyThreshold 
                              ? 'bg-rose-600 shadow-[0_0_6px_rgba(239,68,68,0.5)] animate-pulse' 
                              : 'bg-amber-600/85'
                          }`} 
                          style={{ width: `${getLeyFluctuation(selectedStationName)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[6.5px] text-slate-500 leading-normal pt-3 border-t border-[#1a110a] text-center italic font-sans">
                    Warning: Deploying CST-ERT Golem guards with high Abyssal Exposure (ABEX) during high-grade incursion triggers regional ley floods. Check Jane’s Guide index first.
                  </div>
                </div>

              </div>

              {/* Section 2.5: Real-time Ley Line Fluctuation Dashboard & Alerts Core */}
              <div id="leyline-alerts-panel" className={`bg-[#0b0705] border rounded-xl p-3.5 space-y-3 transition-all duration-300 ${
                corruptedStations.length > 0 
                  ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-gradient-to-b from-[#140808] to-[#0a0303]'
                  : 'border-[#2e1d13]'
              }`}>
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-[#21150e] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Activity className={`w-4 h-4 ${corruptedStations.length > 0 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`} />
                      {corruptedStations.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-sans font-bold text-white uppercase tracking-wider">
                        Ley Line Fluctuation Monitoring & Alerts
                      </h4>
                      <p className="text-[7.5px] text-slate-500 font-mono uppercase">
                        Real-time status of district node rifts & corrupted zone mitigation
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#030201] border border-[#21150e]">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[7.5px] font-mono text-slate-400 font-bold">
                      {corruptedStations.length} CORRUPTED ZONES ACTIVE
                    </span>
                  </div>
                </div>

                {/* Grid Split: Interactive tuning controls on left, Active Alerts & Recommendations on right */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Controls column (Col-span-5) */}
                  <div className="md:col-span-5 space-y-3 bg-[#030201] p-3 rounded-lg border border-[#21150e]">
                    <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      📟 COGNITIVE TUNING CONTROLS
                    </span>

                    {/* Control 1: Fluctuation Threshold */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[7px] text-slate-400 uppercase font-mono">
                          Corruption Threshold:
                        </span>
                        <span className="text-rose-400 font-bold text-[8.5px]">{leyThreshold}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        value={leyThreshold}
                        onChange={(e) => setLeyThreshold(parseInt(e.target.value))}
                        className="w-full accent-rose-500 h-1 rounded cursor-pointer"
                        title="Set threshold at which fluctuations trigger corruption warnings"
                      />
                      <p className="text-[6.5px] text-slate-500 italic">
                        Values equal or higher are marked as Corrupted
                      </p>
                    </div>

                    {/* Control 2: Global Ley Line Baseline Activity */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[7px] text-slate-400 uppercase font-mono">
                          Global Ley Baseline:
                        </span>
                        <span className="text-amber-500 font-bold text-[8.5px]">{globalLeyBaseline}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="85"
                        value={globalLeyBaseline}
                        onChange={(e) => setGlobalLeyBaseline(parseInt(e.target.value))}
                        className="w-full accent-[#c46a1a] h-1 rounded cursor-pointer"
                        title="Tweak baseline magnetic fluctuation for all zones"
                      />
                      <p className="text-[6.5px] text-slate-500 italic">
                        Scales threat gravity index across the entire railway grid
                      </p>
                    </div>
                  </div>

                  {/* Alerts and Tactical feed column (Col-span-7) */}
                  <div className="md:col-span-7 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                        🚨 LEY-LINE SECTOR STATUS & TACTICAL DIRECTIVES
                      </span>

                      {/* Tactical Feed Box */}
                      <div className="bg-[#030201] rounded-lg border border-[#21150e] p-2 max-h-[110px] overflow-y-auto custom-scrollbar space-y-1.5 text-[8px]">
                        {corruptedStations.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-4 text-center">
                            <span className="text-emerald-400 font-bold text-[8.5px] flex items-center gap-1.5 uppercase">
                              <Shield className="w-4 h-4 text-emerald-400 animate-pulse" />
                              All Ley lines aligned & stable
                            </span>
                            <span className="text-[6.5px] text-slate-500 uppercase mt-0.5">
                              Fluctuations are below the critical threshold of {leyThreshold}%
                            </span>
                          </div>
                        ) : (
                          corruptedStations.map((name) => {
                            const val = getLeyFluctuation(name);
                            const stat = STATION_DATABASE[name];
                            
                            // Tailor tactical suggestions based on the station specific attributes
                            let tacticalDirective = 'ENGAGE EXTERNAL LEY DIVERTER UNITS IMMEDIATELY';
                            if (name === 'Abyssal Maw') tacticalDirective = 'INITIATE SPORE BARRIER SEAL & INJECT ABEX DEEPLOCK CORES';
                            else if (name === 'Mortex Gate') tacticalDirective = 'SUSPEND ACTIVE GOLEM MANUFACTURING - RETREAT PILOTS TO W4';
                            else if (name === 'Keystone Bridge') tacticalDirective = 'MUTE BRIDGING SIGNALS - DIVERT CORES VIA LOCTITE ALIGNMENTS';
                            else if (name === 'Corgemont Primary') tacticalDirective = 'SHUT DOWN STORM GRID HIGH LEVEL APPARATUS - SHIELD CORES';

                            return (
                              <div key={name} className="p-2 rounded border border-rose-950 bg-rose-950/10 flex items-start gap-2.5 animate-pulse">
                                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <div className="space-y-1 leading-normal">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-[#ef4444] uppercase">
                                      CRITICAL: {name.toUpperCase()}
                                    </span>
                                    <span className="text-slate-500 font-mono text-[7px]">
                                      [{val}% &gt; {leyThreshold}% Threshold]
                                    </span>
                                  </div>
                                  <p className="text-[#bfb5a2] text-[7.5px] font-mono leading-relaxed">
                                    Fluctuation Limit Exceeded (Active Ward-{stat?.ward}). 
                                    <strong className="text-white block font-sans font-bold uppercase mt-1 text-[7.5px] tracking-wider">
                                      DIRECTIVE: {tacticalDirective}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Helper notification tip */}
                    <p className="text-[6.5px] text-slate-500 leading-tight block mt-2 text-center italic">
                      Tactical guidelines generated in compliance with CST-ERT GVR Standard CL-1.1. Tuning parameters updates live-pulse radar coordinates.
                    </p>
                  </div>
                </div>

                {/* Sub-bar: Real-time status list for all five zones */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-2 border-t border-[#1b120c] font-mono text-[7px]" id="leyline-status-bar">
                  {Object.keys(STATION_DATABASE).map((name) => {
                    const fl = getLeyFluctuation(name);
                    const isCorrupted = fl >= leyThreshold;
                    return (
                      <div key={name} className={`px-2 py-1 rounded border flex flex-col justify-between hover:bg-[#110c08] transition-colors cursor-pointer ${
                        selectedStationName === name ? 'bg-[#c46a1a]/5 border-[#c46a1a]' : 'bg-[#030201] border-[#21150e]'
                      }`} onClick={() => setSelectedStationName(name)}>
                        <div className="flex items-center justify-between gap-1 truncate font-bold text-white uppercase text-[7px]">
                          <span className="truncate">{name.split(' ')[0]}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCorrupted ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                        </div>
                        <div className="flex items-baseline justify-between mt-1 text-[7.5px]">
                          <span className={`${isCorrupted ? 'text-rose-400' : 'text-slate-500'}`}>{fl}%</span>
                          <span className={`font-bold text-[6px] ${isCorrupted ? 'text-rose-500' : 'text-emerald-400'}`}>
                            {isCorrupted ? 'CRPT' : 'STBL'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Scheduled departures and arrivals */}
              <div className="bg-[#030201] border border-[#2e1d13] rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-1 text-[8.5px] font-bold text-[#c46a1a] tracking-widest uppercase">
                  <Calendar className="w-3.5 h-3.5 text-[#c46a1a]" />
                  <span>CST DISTRICT SCHEDULED DEPARTURES / ARRIVALS</span>
                </div>

                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-left border-collapse text-[8.5px]">
                    <thead>
                      <tr className="border-b border-[#21150e] text-slate-500 uppercase">
                        <th className="py-1 px-2 font-bold">ROUTE ID</th>
                        <th className="py-1 px-2 font-bold">TRAIN ASSEMBLY / ESCORT COMMAND</th>
                        <th className="py-1 px-2 font-bold">FROM</th>
                        <th className="py-1 px-2 font-bold">TO</th>
                        <th className="py-1 px-2 font-bold">DEPART</th>
                        <th className="py-1 px-2 font-bold">ARRIVE</th>
                        <th className="py-1 px-2 font-bold text-right">COMM STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#17100a]">
                      {SCHEDULE_DATABASE.map((item) => {
                        const isMatchCurrent = item.from === selectedStationName || item.to === selectedStationName;
                        return (
                          <tr 
                            key={item.id}
                            className={`group/tr transition-colors ${
                              isMatchCurrent 
                                ? 'bg-[#c46a1a]/5 hover:bg-[#c46a1a]/10 text-white font-bold' 
                                : 'hover:bg-[#070503] text-slate-400 hover:text-slate-100'
                            }`}
                          >
                            <td className="py-2 px-2 text-[#c46a1a] font-bold">{item.id}</td>
                            <td className="py-2 px-2 uppercase font-sans truncate max-w-[150px]">{item.train}</td>
                            <td className="py-2 px-2 font-semibold">
                              <span 
                                onClick={() => item.from in STATION_DATABASE && setSelectedStationName(item.from)}
                                className="hover:underline hover:text-[#c46a1a] cursor-pointer"
                              >
                                {item.from}
                              </span>
                            </td>
                            <td className="py-2 px-2 font-semibold">
                              <span 
                                onClick={() => item.to in STATION_DATABASE && setSelectedStationName(item.to)}
                                className="hover:underline hover:text-[#c46a1a] cursor-pointer"
                              >
                                {item.to}
                              </span>
                            </td>
                            <td className="py-2 px-2 font-mono text-cyan-400">{item.departure}</td>
                            <td className="py-2 px-2 font-mono text-cyan-400">{item.arrival}</td>
                            <td className="py-2 px-2 text-right">
                              <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-bold uppercase ${
                                item.status === 'ON_TIME' 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                                  : item.status === 'DELAYED'
                                  ? 'bg-amber-950/40 text-amber-500 border border-amber-900/30'
                                  : 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30'
                              }`}>
                                {item.status.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Actions Ticker details */}
            <footer className="p-3 bg-[#070503] border-t border-[#2e1d13] flex justify-between items-center shrink-0 text-[7.5px] text-slate-500">
              <span className="uppercase">Jane District Central Automated Dispatch Station System</span>
              <span className="text-[#c46a1a] font-bold uppercase tracking-wider">● LIVE SIGNAL SYNCED</span>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
