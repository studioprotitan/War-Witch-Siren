import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { Layers, Sparkles, CreditCard, Wallet, ArrowRight, Cpu, Box, RefreshCw, ShieldCheck, Wand2, X, Lock, Flame, Compass, Sliders, Activity, BookOpen, Train, Zap, Shield, Gauge, Grid, Check, Loader2, VolumeX, Volume2 } from 'lucide-react';
import { MeshModel, WalletState, PurchaseHistoryItem } from './types';
import ImageCreationPanel from './components/ImageCreationPanel';
import ThreeDimensionalViewer from './components/ThreeDimensionalViewer';
import WalletConnectPanel from './components/WalletConnectPanel';
import StripeCheckoutModal from './components/StripeCheckoutModal';
import AbexGdexTicker from './components/AbexGdexTicker';
import ForgePilotMtdModal from './components/ForgePilotMtdModal';
import JanesGolemGuide from './components/JanesGolemGuide';
import TrainRouteRadar from './components/TrainRouteRadar';
import HeroLandingPage from './components/HeroLandingPage';
import CineCityPanel from './components/CineCityPanel';
import AudioVisualizerBarChart from './components/AudioVisualizerBarChart';
import ConstitutionViewer from './components/ConstitutionViewer';

const formatUTC = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'UNKNOWN UTC';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
  } catch (e) {
    return 'UNKNOWN UTC';
  }
};

const parsePsiToHue = (psiVal: string): number => {
  if (!psiVal) return 0;
  const cleaned = psiVal.replace(/[^0-9]/g, '');
  if (cleaned) {
    const num = parseInt(cleaned, 10);
    return num % 360;
  }
  let hash = 0;
  for (let i = 0; i < psiVal.length; i++) {
    hash = psiVal.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const triggerAudioVisualEffect = (type: 'pulse' | 'alert' | 'beep' | 'hum' | 'ping') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('reactor-audio-event', { detail: { type } }));
  }
};

const playDecryptionHum = () => {
  try {
    triggerAudioVisualEffect('hum');
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Resume immediately if suspended by browser policy
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(60, ctx.currentTime); // 60 Hz deep electric power grid hum

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(120, ctx.currentTime); // Octave overtone for clear acoustic sense

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(filter);
    gain2.connect(filter);

    filter.connect(ctx.destination);

    const now = ctx.currentTime;

    // Sub-hum envelope: rapid rise, stable sustain, slow organic tail
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.28, now + 0.15);
    gain1.gain.setValueAtTime(0.28, now + 0.7);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    // Overtone humming envelope: offset rise and release
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.14, now + 0.25);
    gain2.gain.setValueAtTime(0.14, now + 0.6);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 2.3);
    osc2.stop(now + 2.3);
  } catch (e) {
    console.warn('Web Audio API not supported or blocked by user interaction restrictions:', e);
  }
};

interface CharacterStats {
  name: string;
  faction: string;
  tier: string;
  atk: string;
  def: string;
  speed: string;
  psi: string;
  skill: string;
  rank: string;
  lowGas: string;
  highGas: string;
  deployGas: string;
  seal: string;
  bio: string;
}

// Lore Profile matcher for Genesis Veres cards database
function getLoreProfile(prompt: string): CharacterStats {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('shade') || lower.includes('ghostface') || lower.includes('vael')) {
    return {
      name: 'Shade Vael',
      faction: 'CST — ERT TEAM',
      tier: 'ULTRA RARE',
      atk: '9,200',
      def: '7,400',
      speed: 'S-TIER',
      psi: '9,500',
      skill: 'Shadow Strike',
      rank: 'Wraith Commander',
      lowGas: '0.0018 GVR',
      highGas: '0.0072 GVR',
      deployGas: '0.0240 GVR',
      seal: '2 × Boundary Stone',
      bio: 'Handpicked from the Top Pilots on Deck by unanimous vote of the Astronomical Society. Reads scatter glider frequencies like scripture then silences.'
    };
  }
  if (lower.includes('nyxi') || lower.includes('glitch') || lower.includes('siren')) {
    return {
      name: 'Nyxi Glitch',
      faction: 'SIREN WITCH CORPS',
      tier: 'RARE',
      atk: '7,100',
      def: '4,200',
      speed: 'A-TIER',
      psi: '8,800',
      skill: 'Signal Shatter',
      rank: 'Tidal Disruptor',
      lowGas: '0.0012 GVR',
      highGas: '0.0052 GVR',
      deployGas: '0.0160 GVR',
      seal: '1 × Boundary Stone',
      bio: 'Born where digital tides meet corrupted lay lines. Nyxi carries the resonance frequency of cracked gateways in her voice.'
    };
  }
  if (lower.includes('kazen') || lower.includes('tengu') || lower.includes('warlord')) {
    return {
      name: 'Kazenōbu',
      faction: 'STEAMFITTERS GUILD',
      tier: 'LEGENDARY',
      atk: '11,500',
      def: '10,200',
      speed: 'S-CEILING',
      psi: '6,400',
      skill: 'Storm Talons',
      rank: 'Golem Warlord',
      lowGas: '0.0035 GVR',
      highGas: '0.0140 GVR',
      deployGas: '0.0520 GVR',
      seal: '3 × Legendary Core',
      bio: 'Forged within the heavy armory crossing at Keystone Bridge. Wear the ancient mask of mountain wind and mechanical steam flight-apparatus.'
    };
  }
  if (lower.includes('auremis') || lower.includes('crowned') || lower.includes('witch')) {
    return {
      name: 'Auremis',
      faction: 'CORGEMONT ALLIANCE',
      tier: 'LEGENDARY',
      atk: '5,500',
      def: '8,500',
      speed: 'S-TIER',
      psi: '13,000',
      skill: 'Crown Broadcast',
      rank: 'Sovereign',
      lowGas: '0.0044 GVR',
      highGas: '0.0175 GVR',
      deployGas: '0.0680 GVR',
      seal: 'Corgemont Stone ×1',
      bio: 'Crowned in signal gold at the center of Corgemont lightning fields. The entire city power grid pulses once whenever she speaks.'
    };
  }
  if (lower.includes('oracle') || lower.includes('ai') || lower.includes('predictive')) {
    return {
      name: 'ORACLE-7',
      faction: 'ASTRONOMICAL INST.',
      tier: 'ULTRA RARE',
      atk: '∞ NET',
      def: '12,000',
      speed: 'Instantaneous',
      psi: '∞ SENSOR',
      skill: 'Holographic Map',
      rank: 'Distributed Mind',
      lowGas: '0.0028 GVR',
      highGas: '0.0110 GVR',
      deployGas: '0.0480 GVR',
      seal: 'Boundary Stone + Core Key',
      bio: 'A distributive, coordinate-mapping AI. Simultaneously manages every security boundary, pilot telemetry feed, and key-auth sensor.'
    };
  }
  if (lower.includes('mortex') || lower.includes('corruption') || lower.includes('ash') || lower.includes('skull')) {
    return {
      name: 'Mortex Gate',
      faction: 'GATEWAY CORRUPTION',
      tier: 'CORRUPTED',
      atk: 'Bio-Decay',
      def: 'Red Threat',
      speed: 'Unstable',
      psi: 'Skull Broadcast',
      skill: 'Coordinates Rewriter',
      rank: 'Corrupt Ash Core',
      lowGas: '0.0050 GVR',
      highGas: '0.0200 GVR',
      deployGas: '0.0900 GVR',
      seal: 'ERT Active Purge',
      bio: 'Gothic stone skull node locked in permanent green-spore decay. Actively hijacks and rewrites coordinates. Approach is forbidden.'
    };
  }
  if (lower.includes('sol') || lower.includes('warden') || lower.includes('temple')) {
    return {
      name: 'Sol Warden',
      faction: 'SUN TEMPLE CORES',
      tier: 'LEGENDARY',
      atk: 'Radiant Glow',
      def: 'Ω Power MAX',
      speed: 'Core Flux',
      psi: '10,500',
      skill: 'Reactor Engravings',
      rank: 'Ancient Keeper',
      lowGas: '+0.0060 GVR',
      highGas: '+0.0240 GVR',
      deployGas: '0.1200 GVR',
      seal: 'Legendary sequences',
      bio: 'Pulsing chibi stone engraved with ancient sun system formulas. Activates reactors and increases standard deployment range by 3x.'
    };
  }
  if (lower.includes('thalvara') || lower.includes('marine') || lower.includes('dragon')) {
    return {
      name: 'Thalvara',
      faction: 'SIREN BIOMECH',
      tier: 'ULTRA RARE',
      atk: '10,800',
      def: '11,200',
      speed: 'S+-TIER',
      psi: '9,800',
      skill: 'Dragon Surge',
      rank: 'Biomech Fusion',
      lowGas: '0.0032 GVR',
      highGas: '0.0128 GVR',
      deployGas: '0.0560 GVR',
      seal: 'Raijin + Boundary',
      bio: 'Organic sea-coral suit bonded directly with marine pilot cells. Drifts seamlessly along dynamic water currents.'
    };
  }
  
  // Default generic profile
  return {
    name: 'Anomalous Remnant',
    faction: 'UNALIGNED REMNANTS',
    tier: 'COMMON',
    atk: '4,500',
    def: '3,800',
    speed: 'B-TIER',
    psi: '2,900',
    skill: 'Ley Alignment',
    rank: 'Unidentified Core',
    lowGas: '0.0010 GVR',
    highGas: '0.0040 GVR',
    deployGas: '0.0120 GVR',
    seal: '1 × Boundary Stone',
    bio: 'An unidentified cognitive memory trace matched against Genesis Veres network frequencies. Secure authorization pending.'
  };
}

const loreCards = [
  {
    id: 'shade',
    name: 'Shade Vael',
    faction: 'CST — ERT TEAM',
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
    tier: 'ULTRA RARE',
    color: '#de4e4e',
    trigger: 'Shade Vael Ghostface Assassin Golem, Wraith Commander ERT Division, shadow strike strike'
  },
  {
    id: 'nyxi',
    name: 'Nyxi Glitch',
    faction: 'SIREN WITCH CORPS',
    avatar: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&auto=format&fit=crop&q=80',
    tier: 'RARE',
    color: '#4ec1de',
    trigger: 'Nyxi Glitch Siren Witch signal disruptor, blue gold costume and crown, crystal core'
  },
  {
    id: 'kazen',
    name: 'Kazenōbu',
    faction: 'STEAMFITTERS GUILD',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    tier: 'LEGENDARY',
    color: '#deaa4e',
    trigger: 'Kazenōbu Tengu Golem Warlord, Steamfitters masks, bronze wings, mechanical skeleton'
  },
  {
    id: 'auremis',
    name: 'Auremis',
    faction: 'CORGEMONT ALLIANCE',
    avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
    tier: 'LEGENDARY',
    color: '#e1c849',
    trigger: 'Auremis the Yellow Crowned Witch of Corgemont, lightning crown broadcast'
  },
  {
    id: 'oracle',
    name: 'ORACLE-7',
    faction: 'ASTRONOMICAL INST.',
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
    tier: 'ULTRA RARE',
    color: '#49cbd6',
    trigger: 'ORACLE-7 Astronomical AI crown headset, laser lenses, predictive holographic mapping'
  },
  {
    id: 'mortex',
    name: 'Mortex Gate',
    faction: 'GATEWAY CORRUPTION',
    avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=80',
    tier: 'CORRUPTED',
    color: '#4ede73',
    trigger: 'Mortex Gate Corrupted Ash Stone, green skull wall active corruption'
  },
  {
    id: 'sol',
    name: 'Sol Warden',
    faction: 'SUN TEMPLE CORES',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80',
    tier: 'LEGENDARY',
    color: '#e18e3a',
    trigger: 'Sol Warden Legendary Core Stone, sun temple gold tribal carving radiant chibi'
  },
  {
    id: 'thalvara',
    name: 'Thalvara',
    faction: 'SIREN BIOMECH',
    avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80',
    tier: 'ULTRA RARE',
    color: '#9c4ede',
    trigger: 'Thalvara Siren Tidal Dragon biomatrix battle armor, sea current cyan scales'
  }
];

const LEY_LINE_FRAGMENTS_POOL = [
  {
    title: "Jane Sector #194 — Steam Chamber Leak Ledger",
    type: "node",
    sector: "JANE DISTRICT",
    description: "Operator logs confirm a localized Siren core residue leakage inside physical valve conduit #08B. Recommends complete geothermal purging of the auxiliary pipes."
  },
  {
    title: "CST Operative Lost Logs — Signal Echo",
    type: "lore",
    sector: "CORGEMONT STATION",
    description: "The SWC Witches did not retreat when the Styx gateway collapsed. High-pitch resonant frequencies continue to mirror on automated sector surveillance lines."
  },
  {
    title: "Pre-Corruption Crystalline Basalt Fragment",
    type: "node",
    sector: "SLAG BASIN",
    description: "Chemical composition analysis reveals silicate matrix combined with a high geothermal carbon envelope and an anomalous local temporal shift of -1.4 seconds."
  },
  {
    title: "Anomalous Ley Line Signature ⬡94X",
    type: "lore",
    sector: "LEYLINE GRID",
    description: "A non-repeating sub-audible physical pulse signature detected in District Sector 8. Pattern perfectly mirrors pre-corruption CST-ERT emergency responder encryption."
  },
  {
    title: "Siren Biomech Hatchery Node Log",
    type: "node",
    sector: "SIREN BIOMECH BASIN",
    description: "Decayed carbon-chitin mechanical hull. Embedded records show manual neural-link calibration files dating back to the pre-Styx exploration era."
  },
  {
    title: "Abex Ward Sovereign Credit Draft",
    type: "lore",
    sector: "ABEX WARD BANK",
    description: "Cryptographic escrow draft authorizing a priority transfer of 100,000 LEY to Steamfitters Guild for secret armor trials on the Siege-Class Golems."
  },
  {
    title: "Scout Droid Telemetry Stream HD",
    type: "node",
    sector: "NORTHERN WASTELAND",
    description: "Radar array records high-altitude atmospheric dust combined with active geothermal lightning storms. Threat level evaluation: Extreme. Avoid direct rail flight."
  },
  {
    title: "Rogue Glitch Goblin Sector Coords",
    type: "lore",
    sector: "JANE SCRAP FIELDS",
    description: "Discovered an encrypted navigational channel detailing a secret scrap metal printyard operated by rogue steamfitters. Magnetospheric readings fluctuate severely here."
  }
];

const playLeyScanBeep = () => {
  try {
    triggerAudioVisualEffect('beep');
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // High-tech sci-fi rising beep
    const time = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, time);
    osc.frequency.exponentialRampToValueAtTime(880, time + 0.3);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(time);
    osc.stop(time + 0.35);
    
    // Close the context safely after sound finishes
    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    }, 500);
  } catch (e) {
    console.warn('Audio feedback failed:', e);
  }
};

const playSonarPing = (progress: number) => {
  try {
    triggerAudioVisualEffect('ping');
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const time = ctx.currentTime;
    
    // Pitch rises dynamically as progress increases
    // 0% progress -> base frequency 280 Hz
    // 100% progress -> base frequency 1150 Hz
    const startFreq = 280 + (progress / 100) * 870; 
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    // Dynamic sonar echo decay simulation
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.8, time + 0.25);
    
    // Upper harmonic transient spike for military-grade sonar feel
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(startFreq * 1.5, time);
    subGain.gain.setValueAtTime(0.02, time);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    
    // Primary sound envelope decay
    gain.gain.setValueAtTime(0.07, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(time);
    osc.stop(time + 0.3);
    
    subOsc.start(time);
    subOsc.stop(time + 0.06);
    
    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    }, 400);
  } catch (e) {
    console.warn('Sonar audio feedback failed:', e);
  }
};

const playCriticalNodeDetectedAlert = () => {
  try {
    triggerAudioVisualEffect('alert');
    // Immediate haptic vibration feedback if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 80, 150, 80, 300]);
    }
    
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const time = ctx.currentTime;
    
    // Create an alarming warning pattern (two-tone alternating frequency sequence)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    // Multi-frequency chirping for tactical lookups
    osc1.frequency.setValueAtTime(880, time);
    osc1.frequency.setValueAtTime(660, time + 0.15);
    osc1.frequency.setValueAtTime(880, time + 0.3);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, time);
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.18, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
    
    osc1.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(time);
    osc1.stop(time + 0.5);
    
    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    }, 600);
  } catch (err) {
    console.warn('Critical Node Alert Sound failed:', err);
  }
};

const playCriticalStabilityPulse = () => {
  try {
    triggerAudioVisualEffect('alert');
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const time = ctx.currentTime;
    
    // Low frequency alarm pulse: combines 60Hz and 120Hz for deep critical resonance
    const oscSub = ctx.createOscillator();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(60, time);
    
    const oscGrowl = ctx.createOscillator();
    oscGrowl.type = 'triangle';
    oscGrowl.frequency.setValueAtTime(120, time);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, time);
    filter.Q.setValueAtTime(1.5, time);
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.35, time + 0.05);
    gainNode.gain.setValueAtTime(0.35, time + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
    
    oscSub.connect(filter);
    oscGrowl.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscSub.start(time);
    oscGrowl.start(time);
    
    oscSub.stop(time + 0.6);
    oscGrowl.stop(time + 0.6);
    
    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    }, 700);
  } catch (err) {
    console.warn('Warning audio pulse failed:', err);
  }
};

export default function App() {
  // App primary states
  const [activeTab, setActiveTab] = useState<'reactor' | 'golemGuide' | 'forgeDeploy' | 'cineCity' | 'constitution'>('reactor');

  // Ley Line Scanning States
  const [isScanningLeyLines, setIsScanningLeyLines] = useState(false);
  const [leyScanningStep, setLeyScanningStep] = useState('');
  const [leyScanningProgress, setLeyScanningProgress] = useState(0);
  const [detectedLeyFragments, setDetectedLeyFragments] = useState<{
    id: string;
    title: string;
    type: 'lore' | 'node';
    sector: string;
    description: string;
    timestamp: string;
    generatedCoreIcon?: string;
    coreIconStyle?: string;
  }[]>([]);
  const [lastDetectedFragment, setLastDetectedFragment] = useState<any | null>(null);
  const [isGeneratingCoreIcon, setIsGeneratingCoreIcon] = useState<string | null>(null);
  const [selectedCoreStyle, setSelectedCoreStyle] = useState<string>('aetheric_amber');
  const [showTacticalGrid, setShowTacticalGrid] = useState(false);
  const [leyInterferenceFindings, setLeyInterferenceFindings] = useState<{
    id: string;
    node: string;
    sector: string;
    intensity: number;
    phaseDrift: string;
    status: 'ACTIVE' | 'ISOLATED' | 'CRITICAL';
  }[]>([]);
  const [scanHistory, setScanHistory] = useState<number[]>([45, 52, 49, 61, 55]);
  const [visibleStatuses, setVisibleStatuses] = useState<Record<'ACTIVE' | 'ISOLATED' | 'CRITICAL', boolean>>({
    ACTIVE: true,
    ISOLATED: true,
    CRITICAL: true
  });
  const [isPulseCoreActive, setIsPulseCoreActive] = useState<boolean>(false);
  const [pulseFrequency, setPulseFrequency] = useState<number>(1.0);
  const [isAlertsSilenced, setIsAlertsSilenced] = useState<boolean>(false);

  // Web Audio Pulse Core rhythmic background beat generator
  useEffect(() => {
    if (!isPulseCoreActive) return;

    let intervalId: any = null;
    let audioCtx: AudioContext | null = null;

    const playPulseBeat = () => {
      try {
        triggerAudioVisualEffect('pulse');
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        
        if (!audioCtx || audioCtx.state === 'closed') {
          audioCtx = new AudioCtx();
        }
        
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }

        const now = audioCtx.currentTime;

        // 1. Deep Sub-bass Threshold Pulse (Rich core rumble)
        const subOsc = audioCtx.createOscillator();
        subOsc.type = 'sine';
        // Base frequency of 65Hz (C2)
        subOsc.frequency.setValueAtTime(65, now);
        // Soft pitch envelope swoop for a gorgeous organic industrial heartbeat sound
        subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

        const subGain = audioCtx.createGain();
        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime(0.42, now + 0.015);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        const subFilter = audioCtx.createBiquadFilter();
        subFilter.type = 'lowpass';
        subFilter.frequency.setValueAtTime(120, now);

        subOsc.connect(subFilter);
        subFilter.connect(subGain);
        subGain.connect(audioCtx.destination);

        subOsc.start(now);
        subOsc.stop(now + 0.25);

        // 2. High-frequency analog metallic click/tick overlay for cybernetic tick
        const tickOsc = audioCtx.createOscillator();
        tickOsc.type = 'triangle';
        tickOsc.frequency.setValueAtTime(980, now);

        const tickGain = audioCtx.createGain();
        tickGain.gain.setValueAtTime(0, now);
        tickGain.gain.linearRampToValueAtTime(0.018, now + 0.002);
        tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        const tickFilter = audioCtx.createBiquadFilter();
        tickFilter.type = 'bandpass';
        tickFilter.frequency.setValueAtTime(1000, now);
        tickFilter.Q.setValueAtTime(3, now);

        tickOsc.connect(tickFilter);
        tickFilter.connect(tickGain);
        tickGain.connect(audioCtx.destination);

        tickOsc.start(now);
        tickOsc.stop(now + 0.03);

      } catch (err) {
        console.warn('Pulse Core beat generation failed:', err);
      }
    };

    // Trigger immediate first beat
    playPulseBeat();

    // Set interval based on frequency (Hz) -> Period (ms) = 1000 / frequency
    const periodMs = 1000 / pulseFrequency;
    intervalId = setInterval(playPulseBeat, periodMs);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isPulseCoreActive, pulseFrequency]);

  // Trigger warning audio pulse when Critical Stability banner is visible
  useEffect(() => {
    let warningPulseInterval: NodeJS.Timeout | null = null;
    const isBannerVisible = leyScanningProgress === 100 && (leyInterferenceFindings.filter(f => f.status === 'CRITICAL').length > 3);
    
    if (isBannerVisible && !isAlertsSilenced) {
      // Play first pulse immediately
      playCriticalStabilityPulse();
      
      // Setup loop
      warningPulseInterval = setInterval(() => {
        playCriticalStabilityPulse();
      }, 1500);
    }
    
    return () => {
      if (warningPulseInterval) {
        clearInterval(warningPulseInterval);
      }
    };
  }, [leyScanningProgress, leyInterferenceFindings, isAlertsSilenced]);


  const getGridTealColor = () => {
    if (leyInterferenceFindings.some(f => f.intensity > 90)) {
      return 'rgb(220, 20, 60)';
    }
    if (!isScanningLeyLines) return '#1a9490';
    // Start Teal RGB (hex #1a9490): 26, 148, 144
    const rStart = 26;
    const gStart = 148;
    const bStart = 144;
    
    // Crimson Warning RGB: 220, 20, 60
    const rEnd = 220;
    const gEnd = 20;
    const bEnd = 60;
    
    const ratio = leyScanningProgress / 100;
    const r = Math.round(rStart + (rEnd - rStart) * ratio);
    const g = Math.round(gStart + (gEnd - gStart) * ratio);
    const b = Math.round(bStart + (bEnd - bStart) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const currentTeal = getGridTealColor();
  const hasCriticalNode = leyInterferenceFindings.some(f => f.intensity > 90);
  const criticalCount = leyInterferenceFindings.filter(f => f.status === 'CRITICAL').length;

  const handleTriggerLeyScan = () => {
    if (isScanningLeyLines) return;
    setIsScanningLeyLines(true);
    setLeyScanningProgress(0);
    setLeyScanningStep('EMITTING RESONANCE PULSES...');
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setLeyScanningProgress(100);
        
        // Pick a random fragment from LEY_LINE_FRAGMENTS_POOL
        const randomIndex = Math.floor(Math.random() * LEY_LINE_FRAGMENTS_POOL.length);
        const originalFragment = LEY_LINE_FRAGMENTS_POOL[randomIndex];
        
        const newFragment = {
          id: `LC-${Math.floor(100000 + Math.random() * 900000)}`,
          title: originalFragment.title,
          type: originalFragment.type as 'lore' | 'node',
          sector: originalFragment.sector,
          description: originalFragment.description,
          timestamp: new Date().toISOString()
        };
        
        // Generate detailed interference findings representing specific layout nodes
        const sectors = ['JANE DISTRICT', 'CORGEMONT STATION', 'SLAG BASIN', 'LEYLINE GRID', 'SOUTHERN RAIL'];
        const nodes = ['LEY-A1 (NW)', 'LEY-A2 (NE)', 'CORE HYPER-CELL', 'LEY-B1 (SW)', 'LEY-B2 (SE)'];
        
        const generatedFindings = nodes.map((nodeName, idx) => {
          const intensity = Math.floor(Math.random() * 55) + 40; // 40 - 95%
          const driftVal = Math.random() * 2.8 - 1.4;
          const drift = driftVal.toFixed(2);
          const statusVal = intensity > 80 ? 'CRITICAL' : 'ACTIVE';
          return {
            id: `LF-0${idx + 1}-${Math.floor(100 + Math.random() * 900)}`,
            node: nodeName,
            sector: sectors[idx % sectors.length],
            intensity,
            phaseDrift: `${driftVal > 0 ? '+' : ''}${drift}s`,
            status: statusVal as 'ACTIVE' | 'ISOLATED' | 'CRITICAL'
          };
        });
        
        setLeyInterferenceFindings(generatedFindings);
        const avg = Math.round(generatedFindings.reduce((sum, f) => sum + f.intensity, 0) / generatedFindings.length);
        setScanHistory(prev => {
          const next = [...prev, avg];
          if (next.length > 5) return next.slice(next.length - 5);
          return next;
        });
        setDetectedLeyFragments(prev => [newFragment, ...prev]);
        setLastDetectedFragment(newFragment);
        setIsScanningLeyLines(false);
        
        const containsCriticalNode = generatedFindings.some(f => f.status === 'CRITICAL');
        if (containsCriticalNode) {
          if (!isAlertsSilenced) {
            playCriticalNodeDetectedAlert();
          }
        } else {
          playLeyScanBeep();
        }
      } else {
        setLeyScanningProgress(currentProgress);
        playSonarPing(currentProgress);
        // Dynamically update scanning status based on progress
        if (currentProgress < 20) {
          setLeyScanningStep('EMITTING RESONANCE PULSES...');
        } else if (currentProgress < 45) {
          setLeyScanningStep('ALIGNING SECTOR SATELLITES...');
        } else if (currentProgress < 65) {
          setLeyScanningStep('HARMONIZING COGNITIVE INTERFACE...');
        } else if (currentProgress < 85) {
          setLeyScanningStep('CORRELATING DATABASE MATRIX...');
        } else {
          setLeyScanningStep('EXTRACTING SIGNAL SHARD...');
        }
      }
    }, 150);
  };

  const handleGenerateCoreIcon = async (fragmentId: string, fragmentTitle: string, stylePreset: string) => {
    setIsGeneratingCoreIcon(fragmentId);
    try {
      const styles: Record<string, { prompt: string; material: string }> = {
        aetheric_amber: {
          prompt: "glowing amber energy thermal core, polished brass hardware, elegant technical engineering blueprints illustration, glowing runic overlays, dark high contrast background",
          material: "metallic_copper"
        },
        abyssal_teal: {
          prompt: "deep oceanic cyan-teal crystalline energy matrix, glowing marine circuitry, digital HUD blueprint graphic design, dark obsidian high contrast background",
          material: "ethereal_glass"
        },
        cryo_blue: {
          prompt: "frost crystalline neon blue sub-zero core, glowing cryogenic tubes, sub-audible physical pulse visualizer aesthetic, technical blueprint layout, black background",
          material: "ethereal_glass"
        },
        necro_green: {
          prompt: "corrupted radioactive neon-green core stone, hazardous ash-stone matrix, green glowing skull-faced cybernetic design, 3D technical blueprint layout, dark basalt grid background",
          material: "volcanic_stone"
        },
        magma_crimson: {
          prompt: "geothermal magma red hot glowing core, sun templar tribal engravings, liquid gold thermal pipes, detailed high energy blueprint illustration, dark lava-ash high contrast background",
          material: "volcanic_stone"
        }
      };

      const styleObj = styles[stylePreset] || styles.aetheric_amber;
      const basePrompt = `Stylized blueprint schematic panel of a tactical Node Stone Core: [${fragmentTitle}]. Featuring ${styleObj.prompt}, orthographic front asset render model, isolated centered graphics, sci-fi vector outline design.`;

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: basePrompt, aspectRatio: '1:1' }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      if (data.imageUrl) {
        setDetectedLeyFragments(prev => prev.map(f => {
          if (f.id === fragmentId) {
            return { ...f, generatedCoreIcon: data.imageUrl, coreIconStyle: stylePreset };
          }
          return f;
        }));

        setLastDetectedFragment((prev: any) => {
          if (prev && prev.id === fragmentId) {
            return { ...prev, generatedCoreIcon: data.imageUrl, coreIconStyle: stylePreset };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Failed to generate Node Core schematic:', error);
    } finally {
      setIsGeneratingCoreIcon(null);
    }
  };

  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<MeshModel | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  
  // Carousel input trigger state & Web3 Modal status
  const [externalCarouselPrompt, setExternalCarouselPrompt] = useState<string | null>(null);
  const [isMtdModalOpen, setIsMtdModalOpen] = useState(false);
  const [isRouteRadarOpen, setIsRouteRadarOpen] = useState(false);
  const [isFactionLegendOpen, setIsFactionLegendOpen] = useState(false);
  
  // Dual-state memory storage
  const [selectedMaterial, setSelectedMaterial] = useState<string>('metallic_copper');
  const [selectedLore, setSelectedLore] = useState<string>('');

  // Wallet state
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    provider: null
  });
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Billing states
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [unlockedTier, setUnlockedTier] = useState<string | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);

  // Simulation overlay state (Stripe Test Simulator)
  const [showStripeSimulator, setShowStripeSimulator] = useState(false);
  const [simulatedSessionId, setSimulatedSessionId] = useState<string | null>(null);
  const [simulatedPlanName, setSimulatedPlanName] = useState('');
  const [simulatedPriceCents, setSimulatedPriceCents] = useState(0);

  // 3D reconstruction states
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructionProgress, setReconstructionProgress] = useState(0);
  const [reconstructionStep, setReconstructionStep] = useState('');

  // History session models
  const [generatedSessions, setGeneratedSessions] = useState<{
    url: string;
    prompt: string;
    createdAt: string;
    material?: string;
    lore?: string;
    lores?: string[];
    activeLoreIndex?: number;
  }[]>([]);

  const handleCycleLore = (sessionIndex: number, direction: number) => {
    setGeneratedSessions((prev) =>
      prev.map((session, index) => {
        if (index === sessionIndex) {
          const lores = session.lores || [session.lore || ''];
          let newIndex = (session.activeLoreIndex ?? 0) + direction;
          
          if (newIndex < 0) {
            newIndex = lores.length - 1;
          } else if (newIndex >= lores.length) {
            newIndex = 0;
          }
          
          const newLore = lores[newIndex];
          
          if (session.url === selectedImage) {
            setSelectedLore(newLore);
          }
          
          return {
            ...session,
            lore: newLore,
            activeLoreIndex: newIndex
          };
        }
        return session;
      })
    );
  };

  const [isSyncingSeed, setIsSyncingSeed] = useState(false);

  const handleSyncRandomSeed = async () => {
    if (!selectedPrompt) return;
    setIsSyncingSeed(true);
    try {
      const response = await fetch('/api/transform-lore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: selectedPrompt,
          currentLore: selectedLore || activeProfile.bio
        })
      });
      const data = await response.json();
      if (data.lore) {
        setSelectedLore(data.lore);
        
        // Also update generatedSessions log history so it persists
        setGeneratedSessions((prev) =>
          prev.map((session) => {
            if (session.url === selectedImage) {
              const currentLores = session.lores || [session.lore || activeProfile.bio];
              const updatedLores = [...currentLores, data.lore];
              return {
                ...session,
                lore: data.lore,
                lores: updatedLores,
                activeLoreIndex: updatedLores.length - 1
              };
            }
            return session;
          })
        );
      }
    } catch (err) {
      console.error('Failed to sync random seed lore:', err);
    } finally {
      setIsSyncingSeed(false);
    }
  };

  // Monitor url parameters query parameters (Stripe Checkout Redirect mimics)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get('session_id');
    const tier = params.get('tier');
    
    if (session_id && tier) {
      setUnlockedTier(tier.toLowerCase());
      
      const newInvoice: PurchaseHistoryItem = {
        id: session_id,
        amount: tier.toLowerCase() === 'premium' ? 4900 : 1900,
        status: 'succeeded',
        createdAt: new Date().toISOString(),
        description: `ABYSSUM Forge Synapse Upgrade - ${tier.toUpperCase()}`
      };
      setPurchaseHistory(prev => [newInvoice, ...prev]);
      
      // Clean URL params elegantly
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Web3 Connection triggers
  const handleConnectWallet = (provider: 'metamask' | 'coinbase' | 'walletconnect') => {
    const hex = '0123456789abcdef';
    let mockAddr = '0x';
    for (let i = 0; i < 40; i++) {
      mockAddr += hex[Math.floor(Math.random() * 16)];
    }
    const shortAddr = mockAddr.substring(0, 6) + '...' + mockAddr.substring(mockAddr.length - 4);
    
    setWallet({
      isConnected: true,
      address: shortAddr,
      balance: (Math.random() * 4 + 0.1).toFixed(3),
      provider
    });
  };

  const handleDisconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: null,
      provider: null
    });
  };

  // Image generated trigger handler with full material and lore support
  const handleRefImageGenerated = (url: string, prompt: string, material?: string, decryptedLore?: string) => {
    setSelectedImage(url);
    setSelectedPrompt(prompt);
    
    const lower = prompt.toLowerCase();
    let detectedMat = material || 'metallic_copper';
    
    // Safety auto-override keywords
    if (lower.includes('shade') || lower.includes('ghostface') || lower.includes('kazen')) detectedMat = 'metallic_copper';
    else if (lower.includes('nyxi') || lower.includes('witch') || lower.includes('siren') || lower.includes('thalvara')) detectedMat = 'ethereal_glass';
    else if (lower.includes('mortex') || lower.includes('skull') || lower.includes('corrupted') || lower.includes('sol')) detectedMat = 'volcanic_stone';

    setSelectedMaterial(detectedMat);
    const initialLore = decryptedLore || getLoreProfile(prompt).bio;
    setSelectedLore(initialLore);
    
    setGeneratedSessions(prev => [
      {
        url,
        prompt,
        createdAt: new Date().toISOString(),
        material: detectedMat,
        lore: initialLore,
        lores: [initialLore],
        activeLoreIndex: 0
      },
      ...prev
    ]);
    playDecryptionHum();
  };

  // Stripe Checkout Flow
  const handleTriggerStripeCheckout = async (tierName: string, priceCents: number) => {
    setIsProcessingStripe(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: tierName === 'PREMIUM' ? 'Styx Gateway Synapse' : 'Standard Node Access',
          priceAmount: priceCents,
          tier: tierName.toLowerCase()
        })
      });

      if (!response.ok) {
        throw new Error('Endpoint creation failed on server');
      }

      const data = await response.json();
      
      if (data.isMock) {
        setSimulatedSessionId(data.id);
        setSimulatedPlanName(tierName);
        setSimulatedPriceCents(priceCents);
        setIsBillingOpen(false);
        setShowStripeSimulator(true);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert('Failed connecting with payments gateway server. Running simulator instead.');
    } finally {
      setIsProcessingStripe(false);
    }
  };

  // Triggering simulated Tripo 3D generation using thematic industrial-gothic stages
  const handleTriggerReconstruction = () => {
    if (!selectedImage) return;

    setIsReconstructing(true);
    setReconstructionProgress(0);
    setReconstructionStep('Syncing Node Stone Core signal...');

    const interval = setInterval(() => {
      setReconstructionProgress(prev => {
        const next = prev + Math.floor(Math.random() * 12) + 4;
        
        if (next >= 100) {
          clearInterval(interval);
          setIsReconstructing(false);
          
          const modelId = 'mesh_' + Math.random().toString(36).substring(2, 9);
          const profile = getLoreProfile(selectedPrompt);
          const modelName = profile.name;
          
          const newModel: MeshModel = {
            id: modelId,
            name: modelName,
            prompt: selectedPrompt,
            sourceImageUrl: selectedImage,
            status: 'completed',
            progress: 100,
            verticesCount: Math.floor(Math.random() * 6500) + 1200,
            facesCount: Math.floor(Math.random() * 12000) + 2400,
            createdAt: new Date().toISOString(),
            autoRotate: true,
            rotationSpeed: 1.2,
            viewMode: 'solid',
            colorTheme: '#c46a1a'
          };
          
          // Inject selected material straight into 3D viewer model state!
          (newModel as any).detectedMaterial = selectedMaterial;
          
          setActiveModel(newModel);
          return 100;
        }

        if (next < 30) {
          setReconstructionStep('Aligning Ley line frequencies...');
        } else if (next < 55) {
          setReconstructionStep('Melting Cenote ores & bone ash alloy...');
        } else if (next < 75) {
          setReconstructionStep('Weaving mechanical-organic copper nerve-lines...');
        } else {
          setReconstructionStep('Stabilizing Core signal & UV wrapping...');
        }

        return next;
      });
    }, 320);
  };

  // Process Mock Checkout Payment form
  const handleCompleteSimulatedPayment = () => {
    if (!simulatedSessionId || !simulatedPlanName) return;

    setIsProcessingStripe(true);
    setTimeout(() => {
      setUnlockedTier(simulatedPlanName.toLowerCase());
      
      const session_id = simulatedSessionId;
      const newInvoice: PurchaseHistoryItem = {
        id: session_id,
        amount: simulatedPriceCents,
        status: 'succeeded',
        createdAt: new Date().toISOString(),
        description: `ABYSSUM Forge Synapse - ${simulatedPlanName.toUpperCase()} (Sandbox Mode)`
      };
      setPurchaseHistory(prev => [newInvoice, ...prev]);
      
      setIsProcessingStripe(false);
      setShowStripeSimulator(false);
    }, 2000);
  };

  const activeProfile = getLoreProfile(selectedPrompt);

  if (!hasEntered) {
    return <HeroLandingPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="h-screen w-screen bg-[#070503] text-[#c8b898] flex flex-col font-mono overflow-hidden relative selection:bg-[#c46a1a]/20 selection:text-[#c46a1a]">
      
      {/* Visual background grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat z-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}></div>

      {/* Upper Navigation Header - Static Height */}
      <header className="h-[54px] px-5 bg-[#030201]/95 border-b border-[#2e2418] flex items-center justify-between z-20 shadow-md shrink-0 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#c46a1a]/10 border border-[#c46a1a]/35 flex items-center justify-center shadow-[0_0_8px_rgba(196,106,26,0.25)]">
            <Flame className="w-4 h-4 text-[#c46a1a] animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold text-white tracking-[0.2em] uppercase font-sans">
                ABYSSUM COGNITIVE REACTOR
              </h1>
              <span className="text-[7.5px] font-sans font-bold bg-[#140e0a] border border-[#3e2c1a] text-[#b0a090] px-1.5 py-0.2 rounded uppercase tracking-widest">
                SOUTHERN DIVISION
              </span>
            </div>
            <p className="text-[8.5px] text-[#8b7d6b] leading-none uppercase tracking-wide font-sans">
              In-Universe Deck Engine • Genesis Veres Decryption Node
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={() => setIsRouteRadarOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e2933d]/10 hover:bg-[#e2933d]/20 text-[#e2933d] border border-[#e2933d]/40 text-[9.5px] font-bold transition cursor-pointer relative"
            title="Open CST-ERT tactical route map and heatmap radar"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse absolute -top-0.5 -right-0.5 shadow-[0_0_8px_#f43f5e]" />
            <Train className="w-3.5 h-3.5 text-amber-500" />
            CST ROUTE RADAR
          </button>

          {unlockedTier ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-[9px] font-bold shadow-[inset_0_0_4px_rgba(0,192,100,0.05)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>SYNC STATUS: {unlockedTier.toUpperCase()}</span>
            </div>
          ) : (
            <button
              onClick={() => setIsBillingOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#c46a1a]/15 hover:bg-[#c46a1a]/25 text-[#c46a1a] border border-[#c46a1a]/40 text-[9.5px] font-bold transition cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" /> UPGRADE CHANNEL
            </button>
          )}

          <button
            onClick={() => setIsWalletOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9.5px] font-bold tracking-wider transition border cursor-pointer ${wallet.isConnected ? 'bg-[#c46a1a]/5 hover:bg-[#c46a1a]/15 text-[#c46a1a] border-[#c46a1a]/30' : 'bg-[#030201] text-slate-400 border-[#2e2418] hover:text-white'}`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#c46a1a]" />
            <span>{wallet.isConnected ? wallet.address : "CONNECT NODE"}</span>
          </button>
        </div>
      </header> 

      {/* Real-time stock stock and gas prices ticker */}
      <AbexGdexTicker />

      {/* Modern, Premium Industrial Tab Selection Bar */}
      <div className="bg-[#030201]/90 border-b border-[#2e2418] px-5 py-2 flex items-center gap-4 shrink-0 relative z-20 text-[10px] font-mono">
        <span className="text-slate-500 uppercase tracking-widest text-[8px] font-bold">SELECT CONDUIT MODULE:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('reactor')}
            className={`px-3 py-1 rounded border uppercase tracking-wider text-[8px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reactor'
                ? 'bg-[#c46a1a]/15 text-white border-[#c46a1a]'
                : 'bg-[#070503] text-slate-400 border-[#2e2418] hover:text-white hover:border-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'reactor' ? 'bg-[#c46a1a] animate-pulse' : 'bg-slate-600'}`} />
            REACTOR FIELD WORKSPACE
          </button>
          <button
            onClick={() => setActiveTab('golemGuide')}
            className={`px-3 py-1 rounded border uppercase tracking-wider text-[8px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'golemGuide'
                ? 'bg-[#7b5cff]/15 text-[#e4d9ff] border-[#7b5cff]'
                : 'bg-[#070503] text-slate-400 border-[#2e2418] hover:text-white hover:border-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'golemGuide' ? 'bg-[#7b5cff] animate-pulse' : 'bg-slate-600'}`} />
            JANES GOLEM MFG
          </button>
          <button
            onClick={() => setActiveTab('forgeDeploy')}
            className={`px-3 py-1 rounded border uppercase tracking-wider text-[8px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'forgeDeploy'
                ? 'bg-[#00d4ff]/15 text-[#00d4ff] border-[#00d4ff]'
                : 'bg-[#070503] text-slate-400 border-[#2e2418] hover:text-white hover:border-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'forgeDeploy' ? 'bg-[#00d4ff] animate-pulse' : 'bg-slate-600'}`} />
            FORGE DEPLOY
          </button>
          <button
            onClick={() => setActiveTab('cineCity')}
            className={`px-3 py-1 rounded border uppercase tracking-wider text-[8px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cineCity'
                ? 'bg-[#ffe400]/15 text-[#ffe400] border-[#ffe400]'
                : 'bg-[#070503] text-slate-400 border-[#2e2418] hover:text-white hover:border-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'cineCity' ? 'bg-[#ffe400] animate-pulse' : 'bg-slate-600'}`} />
            CINE CITY
          </button>
          <button
            onClick={() => setActiveTab('constitution')}
            className={`px-3 py-1 rounded border uppercase tracking-wider text-[8px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'constitution'
                ? 'bg-[#1a9490]/15 text-[#00fffa] border-[#1a9490]'
                : 'bg-[#070503] text-slate-400 border-[#2e2418] hover:text-white hover:border-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'constitution' ? 'bg-[#00fffa] animate-pulse' : 'bg-slate-600'}`} />
            CONSTITUTION
          </button>
        </div>
      </div>

      {activeTab === 'reactor' && (
        /* Main Workspace Frame - Non Scrolling Screen Height */
        <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden relative z-10 h-[calc(100vh-54px-26px-125px)]">
        
        {/* Left column (Cols 1-4): Gemini Enigmatic Decryptor & logs */}
        <section className="lg:col-span-4 flex flex-col gap-4 overflow-hidden h-full">
          {/* Top Panel: Gemini Decryptor component */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ImageCreationPanel
              onImageGenerated={handleRefImageGenerated}
              isGenerating={isReconstructing}
              generatedSessions={generatedSessions}
              walletConnected={wallet.isConnected}
              onOpenWallet={() => setIsWalletOpen(true)}
              externalQuery={externalCarouselPrompt}
              onClearExternalQuery={() => setExternalCarouselPrompt(null)}
            />
          </div>

          {/* Bottom Panel: Prompt History list */}
          <div className="bg-[#0b0907] border border-[#2e2418] rounded-xl p-3 h-[180px] flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">
                ⬥ DECRYPTED ANOMALOUS MEMORY LOGS
              </span>
              <button
                onClick={() => setIsFactionLegendOpen(!isFactionLegendOpen)}
                className="text-[6.5px] font-mono text-amber-500 hover:text-amber-400 bg-[#1a140d] border border-[#a67c2a]/45 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition active:scale-95 select-none"
              >
                <span>{isFactionLegendOpen ? '✕ CLOSE KEY' : '⬥ FACTION KEY'}</span>
              </button>
            </div>

            {isFactionLegendOpen ? (
              <div className="flex-1 bg-[#040302]/98 border border-[#c46a1a]/30 rounded p-2 overflow-y-auto custom-scrollbar select-none z-10">
                <div className="text-[6.5px] font-mono text-[#a67c2a]/90 tracking-widest font-bold uppercase mb-1.5 flex items-center justify-between">
                  <span>⬥ LORE COGNITIVE MATRIX REGISTER</span>
                  <span className="text-slate-500 text-[6px] font-normal">9 SIGNATURES ONLINE</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { acronym: 'CST', desc: 'Cognitive Security Terminal', label: 'Tactical base-matrix', color: '#de4e4e' },
                    { acronym: 'ERT', desc: 'Emergency Response Team', label: 'Combat recovery corps', color: '#de4e4e' },
                    { acronym: 'SWC', desc: 'Siren Witch Corps', label: 'Ethereal spell-casters', color: '#4ec1de' },
                    { acronym: 'SFG', desc: 'Steamfitters Guild', label: 'Industrial bio-smiths', color: '#deaa4e' },
                    { acronym: 'COR', desc: 'Cergemont Alliance', label: 'Luminous sky weavers', color: '#e1c849' },
                    { acronym: 'AST', desc: 'Astronomical Inst.', label: 'Deep cosmos recorders', color: '#49cbd6' },
                    { acronym: 'GWC', desc: 'Gateway Corruption', label: 'Decaying viral vectors', color: '#4ede73' },
                    { acronym: 'STC', desc: 'Sun Temple Cores', label: 'Solar matrix guides', color: '#e18e3a' },
                    { acronym: 'SBM', desc: 'Siren Biomech', label: 'Sub-sea hybrid pilots', color: '#9c4ede' }
                  ].map((f) => (
                    <div key={f.acronym} className="flex gap-1 items-start bg-[#0b0907] border border-[#2e2418] p-1 rounded hover:border-[#c46a1a]/45 transition duration-200">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: f.color }} />
                      <div className="flex-1 min-w-0 text-[7px] font-mono leading-tight">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white uppercase">{f.acronym}</span>
                          <span className="text-[6px] text-[#8e806a]">|</span>
                          <span className="text-[5.5px] text-slate-500 truncate">{f.label}</span>
                        </div>
                        <p className="text-slate-300 text-[6.5px] truncate font-sans font-medium mt-0.2">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {generatedSessions.length > 0 ? (
                  <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {generatedSessions.map((item, i) => {
                        const isSelected = selectedImage === item.url;
                        const itemLores = item.lores || [item.lore || ''];
                        const multiLore = itemLores.length > 1;
                        const materialLabels: Record<string, string> = {
                          metallic_copper: 'Metallic Copper',
                          volcanic_stone: 'Volcanic Stone',
                          ethereal_glass: 'Ethereal Glass'
                        };

                        return (
                          <motion.div
                            key={item.url || i}
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            onClick={() => {
                              setSelectedImage(item.url);
                              setSelectedPrompt(item.prompt);
                              if (item.material) setSelectedMaterial(item.material);
                              if (item.lore) setSelectedLore(item.lore);
                            }}
                            className={`w-full flex flex-col gap-1.5 p-1.5 rounded border transition-all duration-300 text-left cursor-pointer group/item ${isSelected ? 'bg-[#030201] border-[#c46a1a]/40 shadow-[inset_0_0_6px_rgba(196,106,26,0.05)]' : 'bg-[#070503] border-[#2e2418] hover:border-slate-800'}`}
                          >
                            <div className="flex gap-2.5">
                              <img src={item.url} alt={item.prompt} referrerPolicy="no-referrer" className="w-8 h-8 object-cover rounded border border-[#2e2418] shrink-0" />
                              <div className="flex-1 min-w-0 text-[9px]">
                                <p className="text-white truncate font-bold uppercase tracking-wider">{item.prompt}</p>
                                <span className="text-[7.5px] text-[#8b7d6b] block">
                                  SYNC_RATE: 100% • {formatUTC(item.createdAt)}
                                </span>
                              </div>
                            </div>

                            {/* Decrypted lore history tracker & cycle control */}
                            {itemLores.length > 0 && (
                              <div 
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-between bg-[#140e08]/90 border border-[#2e2418] px-2 py-1 rounded text-[7.5px] font-mono mt-0.5"
                              >
                                <span className="text-[7px] text-[#8e806a] font-bold uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                  REVISIONS: {itemLores.length} (v{(item.activeLoreIndex ?? 0) + 1})
                                </span>
                                {multiLore && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleCycleLore(i, -1)}
                                      className="w-4 h-4 rounded border border-[#2e2418] bg-[#030201] text-[6.5px] flex items-center justify-center hover:bg-[#c46a1a]/15 hover:border-[#c46a1a]/40 active:scale-95 transition text-[#a89880] cursor-pointer"
                                      title="Previous Revision"
                                    >
                                      ◀
                                    </button>
                                    <button
                                      onClick={() => handleCycleLore(i, 1)}
                                      className="w-4 h-4 rounded border border-[#2e2418] bg-[#030201] text-[6.5px] flex items-center justify-center hover:bg-[#c46a1a]/15 hover:border-[#c46a1a]/40 active:scale-95 transition text-[#a89880] cursor-pointer"
                                      title="Next Revision"
                                    >
                                      ▶
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Expanded detailed preview on hover */}
                            <div className="max-h-0 opacity-0 overflow-hidden group-hover/item:max-h-[350px] group-hover/item:opacity-100 group-hover/item:mt-1.5 transition-all duration-300 ease-in-out border-t border-[#2e2418] pt-1.5 text-[7.5px] font-mono text-[#a89880] space-y-1.5">
                              <div>
                                <span className="text-[#c46a1a] uppercase font-bold text-[6.5px] block tracking-wide mb-0.5">FULL PROMPT STREAM:</span>
                                <span className="text-white font-sans text-[7.5px] leading-relaxed block bg-[#030201] p-1 rounded border border-[#2e2418]/60 break-words whitespace-normal font-medium max-h-[50px] overflow-y-auto pr-0.5 custom-scrollbar">{item.prompt}</span>
                              </div>
                              <div className="flex justify-between items-center bg-[#0d0b08] p-1 rounded border border-[#2e2418]">
                                <span className="text-[#c46a1a] uppercase font-bold text-[6.5px] tracking-wide">MATERIAL COATING:</span>
                                <span className="text-white text-[7px] font-semibold">{materialLabels[item.material || ''] || 'Metallic Copper'}</span>
                              </div>
                              <div>
                                <span className="text-[#c46a1a] uppercase font-bold text-[6.5px] block tracking-wide mb-0.5">DECRYPTED LORE SEED:</span>
                                <div className="text-[#a89880] italic leading-normal bg-[#030201] p-1 rounded border border-[#2e2418] text-[7.0px] font-sans break-words whitespace-normal max-h-[80px] overflow-y-auto pr-0.5 custom-scrollbar">
                                  {item.lore || 'No narrative simulated.'}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex-1 border border-dashed border-[#231b12] rounded flex flex-col items-center justify-center p-3 text-center bg-[#030201]/40">
                    <Box className="w-5 h-5 text-[#2e2418] mb-1 animate-pulse" />
                    <p className="text-[8px] text-[#8b7d6b] uppercase tracking-wider">No decrypted records registered.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
 
        {/* Center column (Cols 5-8): Core Card Reactor & Transmutation */}
        <section className="lg:col-span-4 flex flex-col bg-[#0b0907] border border-[#2e2418] rounded-xl p-4 gap-3.5 overflow-hidden h-full">
          <div className="flex items-center justify-between pb-1 inline-flex w-full">
            <div className="space-y-0.5">
              <span className="text-[8px] text-[#c46a1a] tracking-[0.25em] uppercase flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-[#c46a1a]" /> TRANSMUTATOR: STAGE II
              </span>
              <h3 className="text-xs font-cinzel font-bold text-white uppercase tracking-wider">Node Stone Transmutator</h3>
            </div>
            <Activity className="w-3 h-3 text-amber-500 hover:scale-110 transition animate-pulse" />
          </div>

          {selectedImage ? (
            <div className="flex-1 flex flex-col gap-3 overflow-hidden min-h-0">
              {/* Image Control Toolbar */}
              <div className="flex justify-between items-center bg-[#0d0b08] border border-[#211a12] px-3 py-1.5 rounded-lg text-[7.5px] font-mono shrink-0">
                <span className="text-[#a89880] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a9490] animate-pulse" />
                  ANALYSIS SCREEN V_2.0
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTacticalGrid(prev => !prev)}
                    className={`px-2 py-1 rounded border text-[7px] font-mono font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      showTacticalGrid
                        ? 'bg-[#1a9490]/25 text-[#00f0ff] border-[#1a9490]/70 shadow-[0_0_8px_rgba(26,148,144,0.3)] font-black'
                        : 'bg-[#030201] text-slate-500 border-[#2e2418] hover:text-slate-300 hover:border-slate-800'
                    }`}
                  >
                    <Grid className="w-3 h-3 text-[#1a9490]" />
                    <span>TACTICAL GRID: {showTacticalGrid ? 'ACTIVE' : 'OFFLINE'}</span>
                  </button>
                </div>
              </div>

              {/* Image Preview Container */}
              <div className="flex-1 bg-[#040302] rounded-lg overflow-hidden border border-[#211a12] flex items-center justify-center relative min-h-0">
                <img src={selectedImage} referrerPolicy="no-referrer" id="tripo-reference-image" alt="Decrypted Core signature" className="w-full h-full object-contain p-2.5 drop-shadow-[0_0_12px_rgba(196,106,26,0.15)] z-10" />
                
                {/* 3D Grid pattern for tech layout background */}
                <div className="absolute inset-0 opacity-[0.012] pointer-events-none" style={{ backgroundImage: "radial-gradient(#c46a1a 1px, transparent 1px)", backgroundSize: "14px 14px" }}></div>

                {/* Ley Line Resonance Visualizer Overlay with dynamic CSS hue filter rotation */}
                <div 
                  className="absolute inset-0 z-15 pointer-events-none mix-blend-screen overflow-hidden flex items-center justify-center animate-ley-color-shift"
                  style={{ '--psi-hue': `${parsePsiToHue(activeProfile?.psi || '0')}deg` } as React.CSSProperties}
                >
                  <svg className="absolute inset-0 w-full h-full opacity-65" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path 
                      d="M 0 50 Q 25 30 50 50 T 100 50" 
                      fill="none" 
                      stroke="#c46a1a" 
                      strokeWidth="0.4" 
                      className="animate-ley-wave-1"
                    />
                    <path 
                      d="M 0 50 Q 25 70 50 50 T 100 50" 
                      fill="none" 
                      stroke="#e2933d" 
                      strokeWidth="0.25" 
                      className="animate-ley-wave-2"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="28" 
                      fill="none" 
                      stroke="#c46a1a" 
                      strokeWidth="0.2" 
                      strokeDasharray="3 3"
                      className="animate-ley-pulse-ring"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="14" 
                      fill="none" 
                      stroke="#a67c2a" 
                      strokeWidth="0.35" 
                      className="animate-ley-pulse-ring-fast"
                    />
                  </svg>

                  {/* High Quality HUD visual overlay labels */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-[#050403]/90 border border-[#c46a1a]/45 px-2 py-0.5 rounded text-[6.5px] font-mono text-[#c46a1a] shadow-lg select-none">
                    <span className="w-1 h-1 rounded-full bg-[#c46a1a] animate-ping" />
                    <span className="font-bold tracking-wider">LEY RES_PSI: {activeProfile?.psi || '0'}</span>
                  </div>
                </div>

                {/* Active scanner beam sweep line & warning tint */}
                {isScanningLeyLines && (
                  <div className="absolute inset-x-0 h-1 bg-[#c46a1a] shadow-[0_0_12px_#c46a1a] z-30 pointer-events-none animate-ley-scanner-sweep" />
                )}
                {isScanningLeyLines && (
                  <div className="absolute inset-0 bg-[#c46a1a]/5 z-25 pointer-events-none flex flex-col items-center justify-center select-none">
                    <span className="text-[10px] font-mono text-[#c46a1a] tracking-[0.3em] font-extrabold drop-shadow-[0_0_5px_rgba(196,106,26,0.6)] animate-pulse uppercase">
                      ACTIVE LEY LINE SCAN
                    </span>
                  </div>
                )}

                {/* Tactical grid overlay */}
                {showTacticalGrid && (
                  <div className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden rounded-lg">
                    {/* Screen-wide red pulse effect when more than 4 nodes are in a 'CRITICAL' state */}
                    {criticalCount > 4 && (
                      <div className="absolute inset-0 bg-red-650/20 animate-grid-critical z-10" style={{ mixBlendMode: 'color-burn' }} />
                    )}
                    {/* SVG Grid Overlay */}
                    <svg className={`absolute inset-0 w-full h-full ${hasCriticalNode ? 'animate-grid-critical' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Outer Tactical Corner Bracket Guides */}
                      <path d="M 4 8 H 8 V 4" fill="none" stroke={currentTeal} strokeWidth="0.5" className="opacity-80" style={{ transition: 'stroke 0.3s ease' }} />
                      <path d="M 96 8 H 92 V 4" fill="none" stroke={currentTeal} strokeWidth="0.5" className="opacity-80" style={{ transition: 'stroke 0.3s ease' }} />
                      <path d="M 4 92 H 8 V 96" fill="none" stroke={currentTeal} strokeWidth="0.5" className="opacity-80" style={{ transition: 'stroke 0.3s ease' }} />
                      <path d="M 96 92 H 92 V 96" fill="none" stroke={currentTeal} strokeWidth="0.5" className="opacity-80" style={{ transition: 'stroke 0.3s ease' }} />

                      {/* Grid Lines with Signal Flicker in Southern Rail Division when scanner is active */}
                      <g className={hasCriticalNode ? 'animate-grid-critical' : (isScanningLeyLines ? 'animate-grid-flicker' : '')}>
                        {/* Grid Lines - Horizontal */}
                        <line x1="10" y1="30" x2="90" y2="30" stroke={currentTeal} strokeWidth="0.15" strokeOpacity="0.45" style={{ transition: 'stroke 0.3s ease' }} />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="#c46a1a" strokeWidth="0.25" strokeDasharray="1 1" strokeOpacity="0.75" />
                        <line x1="10" y1="70" x2="90" y2="70" stroke={currentTeal} strokeWidth="0.15" strokeOpacity="0.45" style={{ transition: 'stroke 0.3s ease' }} />

                        {/* Grid Lines - Vertical */}
                        <line x1="25" y1="10" x2="25" y2="90" stroke={currentTeal} strokeWidth="0.15" strokeOpacity="0.45" style={{ transition: 'stroke 0.3s ease' }} />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="#c46a1a" strokeWidth="0.25" strokeDasharray="1 1" strokeOpacity="0.75" />
                        <line x1="75" y1="10" x2="75" y2="90" stroke={currentTeal} strokeWidth="0.15" strokeOpacity="0.45" style={{ transition: 'stroke 0.3s ease' }} />
                      </g>

                      {/* Dynamic Scan sweep line inside the grid */}
                      <line x1="10" y1="1" x2="90" y2="1" stroke="#00f0ff" strokeWidth="0.35" className="animate-ley-scanner-sweep" strokeOpacity="0.75" />

                      {/* Projected Ley Line Intersections & Target nodes */}
                      {[
                        { cx: 25, cy: 30, name: 'LEY-A1 (NW)' },
                        { cx: 75, cy: 30, name: 'LEY-A2 (NE)' },
                        { cx: 50, cy: 50, name: 'CORE HYPER-CELL' },
                        { cx: 25, cy: 70, name: 'LEY-B1 (SW)' },
                        { cx: 75, cy: 70, name: 'LEY-B2 (SE)' },
                      ].map((n, idx) => {
                        const finding = leyInterferenceFindings.find(f => f.node === n.name);
                        const status = finding ? finding.status : 'ACTIVE';
                        const isVisible = visibleStatuses[status];
                        
                        if (!isVisible) return null;
                        
                        const color = status === 'CRITICAL' ? '#ef4444' : (status === 'ISOLATED' ? '#10b981' : '#ff8400');
                        
                        return (
                          <g key={idx} className="origin-center transition-all duration-300">
                            {/* Pulsing Intersect rings */}
                            <circle 
                              cx={n.cx} 
                              cy={n.cy} 
                              r="3.5" 
                              fill="none" 
                              stroke={color} 
                              strokeWidth="0.25" 
                              className="animate-intersection-pulse"
                              style={{ transition: 'stroke 0.3s ease' }}
                            />
                            <circle 
                              cx={n.cx} 
                              cy={n.cy} 
                              r="1.2" 
                              fill={color} 
                              className="animate-pulse"
                              style={{ transition: 'fill 0.3s ease' }}
                            />
                            
                            {/* Target box crosshair lines surrounding nodes */}
                            <rect 
                              x={n.cx - 2} 
                              y={n.cy - 2} 
                              width="4" 
                              height="4" 
                              fill="none" 
                              stroke={color} 
                              strokeWidth="0.1" 
                              strokeDasharray="0.5 0.5"
                              className="opacity-60"
                              style={{ transition: 'stroke 0.3s ease' }}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Interactive Legend Overlay */}
                    <div className="absolute top-2.5 right-2.5 z-40 pointer-events-auto bg-[#070503]/95 border border-[#302518] rounded-md p-1.5 flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.85)] w-[100px] font-mono text-[5.5px]">
                      <div className="flex items-center justify-between border-b border-[#211a12] pb-1 mb-1 text-[#c46a1a] font-bold uppercase tracking-wider select-none">
                        <span>LEGEND</span>
                        <Sliders className="w-2 h-2 text-[#c46a1a]" />
                      </div>
                      <div className="space-y-1">
                        {[
                          { id: 'ACTIVE' as const, name: 'Active', desc: 'Stable Signal', color: '#ff8400', activeBg: 'bg-amber-950/40' },
                          { id: 'ISOLATED' as const, name: 'Isolated', desc: 'Secure / Purged', color: '#10b981', activeBg: 'bg-emerald-950/40' },
                          { id: 'CRITICAL' as const, name: 'Critical', desc: 'Threat / Alert', color: '#ef4444', activeBg: 'bg-red-950/40' }
                        ].map((item) => {
                          const isVisible = visibleStatuses[item.id];
                          return (
                            <button
                              key={item.id}
                              onClick={() => setVisibleStatuses(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                              className={`w-full flex items-center justify-between p-0.5 px-1 rounded border border-solid text-left cursor-pointer transition select-none ${
                                isVisible 
                                  ? `${item.activeBg} text-white border-[#c46a1a]/30` 
                                  : 'bg-[#030201]/60 text-slate-500 border-zinc-800/40'
                              }`}
                            >
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="w-1 h-1 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: item.color }} />
                                <div className="leading-none truncate">
                                  <span className="font-bold block text-[5px] uppercase">{item.name}</span>
                                </div>
                              </div>
                              <div className={`w-2.5 h-2.5 rounded flex items-center justify-center shrink-0 border ${
                                isVisible ? 'border-[#c46a1a]/50 bg-[#120a04]' : 'border-zinc-800'
                              }`}>
                                {isVisible && <Check className="w-2 h-2 text-[#ff8400]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Labels with HTML text overlays for perfect rendering and accessibility */}
                    <div className="absolute inset-0 text-white font-mono text-[6.5px] pointer-events-none">
                      {([
                        { name: 'LEY-A1 (NW)', style: { left: '26%', top: '27.5%' } },
                        { name: 'LEY-A2 (NE)', style: { left: '76%', top: '27.5%' } },
                        { name: 'CORE HYPER-CELL', style: { left: '51%', top: '47.5%' } },
                        { name: 'LEY-B1 (SW)', style: { left: '26%', top: '67.5%' } },
                        { name: 'LEY-B2 (SE)', style: { left: '76%', top: '67.5%' } },
                      ] as { name: string; style: React.CSSProperties }[]).map((l, idx) => {
                        const finding = leyInterferenceFindings.find(f => f.node === l.name);
                        const status = finding ? finding.status : 'ACTIVE';
                        const isVisible = visibleStatuses[status];
                        
                        if (!isVisible) return null;
                        
                        const color = status === 'CRITICAL' ? '#ef4444' : (status === 'ISOLATED' ? '#10b981' : '#ff8400');
                        
                        return (
                          <div 
                            key={idx} 
                            className="absolute bg-[#030201]/95 px-1 py-0.2 border border-[#211a12] rounded flex items-center gap-1 opacity-95 transition-all duration-300 transform -translate-y-1/2 scale-75 md:scale-100"
                            style={l.style}
                          >
                            <span 
                              className="w-1 h-1 rounded-full animate-pulse" 
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-bold whitespace-nowrap" style={{ color }}>{l.name}</span>
                          </div>
                        );
                      })}

                      {/* Grid Coordinates (Legend labels around border edges) */}
                      <div className="absolute top-1 left-[25%] -translate-x-1/2 text-slate-500 px-1 py-0.2 bg-black/60 rounded">X-25</div>
                      <div className="absolute top-1 left-[50%] -translate-x-1/2 text-[#c46a1a] px-1 py-0.2 bg-black/60 rounded font-bold">X-50 (CTR)</div>
                      <div className="absolute top-1 left-[75%] -translate-x-1/2 text-slate-500 px-1 py-0.2 bg-black/60 rounded">X-75</div>

                      <div className="absolute left-1 top-[30%] -translate-y-1/2 text-slate-500 px-1 py-0.2 bg-black/60 rounded">Y-30</div>
                      <div className="absolute left-1 top-[50%] -translate-y-1/2 text-[#c46a1a] px-1 py-0.2 bg-black/60 rounded font-bold">Y-50</div>
                      <div className="absolute left-1 top-[70%] -translate-y-1/2 text-slate-500 px-1 py-0.2 bg-black/60 rounded">Y-70</div>

                      {/* Southern Rail Division Signal Status Legend */}
                      <div className="absolute bottom-1 right-2 bg-[#030201]/95 px-1.5 py-0.5 border border-[#211a12] rounded flex items-center gap-1.5 opacity-85 backdrop-blur shadow-[0_0_8px_rgba(0,0,0,0.8)]">
                        <span 
                          className={`w-1.5 h-1.5 rounded-full ${isScanningLeyLines ? 'animate-ping' : ''}`} 
                          style={{ backgroundColor: isScanningLeyLines ? 'rgb(220, 20, 60)' : currentTeal, transition: 'background-color 0.3s ease' }}
                        />
                        <span className="text-[5.5px] text-[#a89880] tracking-wider uppercase font-extrabold select-none">
                          {isScanningLeyLines ? 'SOUTHERN RAIL INTERFERENCE: MODIFIED' : 'SOUTHERN RAIL SIGNAL: ACTIVE'}
                        </span>
                      </div>
                    </div>

                    {/* Scan Summary Panel */}
                    {leyScanningProgress === 100 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-2 md:inset-4 z-30 pointer-events-auto bg-[#0a0705]/98 border border-[#c46a1a] rounded-lg p-3 flex flex-col shadow-[0_0_25px_rgba(196,106,26,0.4)]"
                      >
                        {/* Panel Header */}
                        <div className="flex items-center justify-between border-b border-[#211a12] pb-1.5 mb-2 shrink-0">
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1a9490] animate-pulse" />
                            <span className="text-[7.5px] font-black text-[#1a9490] tracking-wider uppercase">
                              Leyline Diagnostic Report v1.1
                            </span>
                            <span className="text-[6px] text-slate-500 hidden md:inline ml-1 font-normal">
                              REF: LYS-94X-COIL
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Silence Alerts Toggle */}
                            <button
                              onClick={() => {
                                setIsAlertsSilenced(prev => !prev);
                                // Play a soft tick sound to confirm toggle
                                try {
                                  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                                  if (AudioCtx) {
                                    const ctx = new AudioCtx();
                                    const osc = ctx.createOscillator();
                                    const g = ctx.createGain();
                                    osc.type = 'sine';
                                    osc.frequency.setValueAtTime(600, ctx.currentTime);
                                    g.gain.setValueAtTime(0, ctx.currentTime);
                                    g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
                                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                                    osc.connect(g);
                                    g.connect(ctx.destination);
                                    osc.start();
                                    osc.stop(ctx.currentTime + 0.1);
                                    setTimeout(() => ctx.close().catch(() => {}), 150);
                                  }
                                } catch (e) {}
                              }}
                              className={`text-[6px] font-mono font-bold border rounded px-1.5 py-0.5 transition flex items-center gap-1 cursor-pointer select-none ${
                                isAlertsSilenced 
                                  ? 'bg-red-950/40 text-red-400 border-red-500/40 hover:bg-red-950/60 hover:text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.15)]' 
                                  : 'bg-[#040302] text-slate-400 border-[#211a12] hover:bg-neutral-900 hover:text-slate-200'
                              }`}
                              title={isAlertsSilenced ? "Click to enable critical diagnostic sirens" : "Click to silence critical diagnostic sirens independently of pulse hums"}
                              id="silence-alerts-toggle-header"
                            >
                              {isAlertsSilenced ? (
                                <>
                                  <VolumeX className="w-2.5 h-2.5 text-red-500 shrink-0" />
                                  <span className="leading-none">SIREN: MUTED</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-2.5 h-2.5 text-[#1baba4] shrink-0 animate-pulse" />
                                  <span className="leading-none">SIREN: ACTIVE</span>
                                </>
                              )}
                            </button>

                            <button 
                              onClick={() => {
                                const updated = leyInterferenceFindings.map((f, idx) => ({
                                  ...f,
                                  intensity: idx < 5 ? 95 : 35, // 5 critical nodes (>4)
                                  status: idx < 5 ? 'CRITICAL' as const : 'ACTIVE' as const
                                }));
                                setLeyInterferenceFindings(updated);
                                const avgOverload = Math.round(updated.reduce((sum, x) => sum + x.intensity, 0) / updated.length);
                                setScanHistory(prev => {
                                  const next = [...prev];
                                  if (next.length > 0) next[next.length - 1] = avgOverload;
                                  return next;
                                });
                                if (!isAlertsSilenced) {
                                  playCriticalNodeDetectedAlert();
                                }
                              }}
                              className="text-[6px] font-mono text-red-500 hover:text-red-400 font-bold border border-red-500/40 hover:border-red-500 px-1.5 py-0.5 rounded transition-colors bg-black/40 cursor-pointer"
                              title="Force all 5 critical nodes to trigger screen-wide warning"
                            >
                              SIMULATE MELTDOWN
                            </button>
                            <button 
                              onClick={() => {
                                const updated = leyInterferenceFindings.map(f => ({
                                  ...f,
                                  intensity: Math.floor(Math.random() * 5) + 3,
                                  status: 'ISOLATED' as const
                                }));
                                setLeyInterferenceFindings(updated);
                                const avgPurged = Math.round(updated.reduce((sum, x) => sum + x.intensity, 0) / updated.length);
                                setScanHistory(prev => {
                                  const next = [...prev];
                                  if (next.length > 0) next[next.length - 1] = avgPurged;
                                  return next;
                                });
                                playLeyScanBeep();
                              }}
                              className="text-[6px] font-mono text-[#1a9490] hover:text-[#00fffa] font-bold border border-[#1a9490]/40 hover:border-[#1a9490]/80 px-1.5 py-0.5 rounded transition-colors bg-black/40 cursor-pointer"
                              title="Suppress all detected interference nodes"
                            >
                              INITIALIZE COIL PURGE
                            </button>
                            <button 
                              onClick={() => setLeyScanningProgress(0)}
                              className="text-[8px] text-[#ff8400] hover:text-red-500 font-extrabold px-1.5 py-0.5 bg-black/40 hover:bg-neutral-900 border border-[#211a12] rounded transition-colors cursor-pointer"
                              title="Dismiss summary panel"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Warning Critical Stability Banner */}
                        {criticalCount > 3 && (
                          <div className="mb-2 bg-red-950/65 border border-red-500/80 rounded p-2 flex items-center justify-between gap-2 animate-pulse shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                            <div className="flex items-center gap-2">
                              <Flame className="w-4 h-4 text-red-500 shrink-0" />
                              <div className="font-mono text-left">
                                <span className="text-[7.5px] font-black text-red-400 tracking-wider block">
                                  WARNING: CRITICAL STABILITY DETECTED
                                </span>
                                <span className="text-[5.5px] text-red-350 block leading-tight">
                                  Severe electro-magnetic feedback across {criticalCount} major grid alignments. Disruption imminent.
                                </span>
                              </div>
                            </div>
                            <span className="text-[6.5px] font-extrabold text-white bg-red-600 px-1.5 py-0.5 rounded border border-red-400 font-mono select-none">
                              DANGER LEVEL: HIGH ({criticalCount} NODES)
                            </span>
                          </div>
                        )}

                        {/* Summary Stats Grid & Telemetry Chart */}
                        {(() => {
                          const d3Width = 240;
                          const d3Height = 45;
                          const d3Padding = { top: 6, right: 12, bottom: 12, left: 24 };

                          const d3XScale = d3.scaleLinear()
                            .domain([0, 4])
                            .range([d3Padding.left, d3Width - d3Padding.right]);

                          const d3YScale = d3.scaleLinear()
                            .domain([0, 100])
                            .range([d3Height - d3Padding.bottom, d3Padding.top]);

                          const d3LineGen = d3.line<number>()
                            .x((_, idx) => d3XScale(idx))
                            .y((val) => d3YScale(val))
                            .curve(d3.curveMonotoneX);

                          const d3AreaGen = d3.area<number>()
                            .x((_, idx) => d3XScale(idx))
                            .y0(d3Height - d3Padding.bottom)
                            .y1((val) => d3YScale(val))
                            .curve(d3.curveMonotoneX);

                          const d3LinePath = d3LineGen(scanHistory) || '';
                          const d3AreaPath = d3AreaGen(scanHistory) || '';

                          const isLastScanCritical = scanHistory[scanHistory.length - 1] > 75;
                          const themeColor = isLastScanCritical ? '#ef4444' : '#1a9490';
                          const areaGradientId = isLastScanCritical ? 'd3AreaGlowCritical' : 'd3AreaGlow';

                          return (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 shrink-0">
                              {/* D3 Scan History Trend Line Chart */}
                              <div className="md:col-span-2 bg-[#090706] border border-[#211a12] rounded p-1.5 flex flex-col font-mono relative">
                                <div className="flex items-center justify-between text-[6px] text-[#8e806a] uppercase tracking-widest font-bold border-b border-[#211a12] pb-1 mb-1 select-none">
                                  <span>⬥ Telemetry: Leyline Intensity Trend</span>
                                  <span className="text-[5px] text-[#00fffa] font-extrabold animate-pulse">Stability Graph (t-4 → NOW)</span>
                                </div>
                                <div className="flex-1 min-h-[46px] w-[240px] max-w-full mx-auto flex items-center justify-center">
                                  <svg className="w-full h-full" viewBox={`0 0 ${d3Width} ${d3Height}`} preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                      <linearGradient id="d3AreaGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1a9490" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#1a9490" stopOpacity="0.0" />
                                      </linearGradient>
                                      <linearGradient id="d3AreaGlowCritical" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                                      </linearGradient>
                                    </defs>
                                    
                                    {/* D3 horizontal levels */}
                                    {[0, 50, 100].map((level) => {
                                      const yVal = d3YScale(level);
                                      return (
                                        <g key={level}>
                                          <line
                                            x1={d3Padding.left}
                                            y1={yVal}
                                            x2={d3Width - d3Padding.right}
                                            y2={yVal}
                                            stroke="#1e1812"
                                            strokeWidth="0.5"
                                            strokeDasharray="1 2"
                                          />
                                          <text
                                            x={d3Padding.left - 4}
                                            y={yVal + 1.5}
                                            textAnchor="end"
                                            fill="#8e806a"
                                            className="text-[4.5px] font-mono leading-none select-none opacity-85"
                                          >
                                            {level}%
                                          </text>
                                        </g>
                                      );
                                    })}

                                    {/* D3 horizontal time points */}
                                    {scanHistory.map((_, idx) => {
                                      const xVal = d3XScale(idx);
                                      return (
                                        <g key={idx}>
                                          <line
                                            x1={xVal}
                                            y1={d3Padding.top}
                                            x2={xVal}
                                            y2={d3Height - d3Padding.bottom}
                                            stroke="#1e1812"
                                            strokeWidth="0.5"
                                            strokeDasharray="1 2"
                                          />
                                          <text
                                            x={xVal}
                                            y={d3Height - d3Padding.bottom + 7}
                                            textAnchor="middle"
                                            fill="#8e806a"
                                            className="text-[4px] font-mono leading-none select-none"
                                          >
                                            {idx === 4 ? 'NOW' : `T-${4 - idx}`}
                                          </text>
                                        </g>
                                      );
                                    })}

                                    {/* Glowing Area path */}
                                    <path
                                      d={d3AreaPath}
                                      fill={`url(#${areaGradientId})`}
                                      className="transition-all duration-300"
                                    />

                                    {/* Trend line path */}
                                    <path
                                      d={d3LinePath}
                                      fill="none"
                                      stroke={themeColor}
                                      strokeWidth="1.2"
                                      className="transition-all duration-300"
                                    />

                                    {/* Individual Data Circles */}
                                    {scanHistory.map((val, idx) => {
                                      const cx = d3XScale(idx);
                                      const cy = d3YScale(val);
                                      const isCritical = val > 75;
                                      return (
                                        <g key={idx} className="group/node text-[5px] font-mono">
                                          <circle
                                            cx={cx}
                                            cy={cy}
                                            r="1.5"
                                            fill="#070503"
                                            stroke={isCritical ? '#ef4444' : '#1a9490'}
                                            strokeWidth="1"
                                            className="transition-all duration-300"
                                          />
                                          <text
                                            x={cx}
                                            y={cy - 3}
                                            textAnchor="middle"
                                            fill={isCritical ? '#ef4444' : '#00fffa'}
                                            className="text-[5px] font-bold select-none opacity-90 transition-opacity"
                                          >
                                            {val}%
                                          </text>
                                        </g>
                                      );
                                    })}
                                  </svg>
                                </div>
                              </div>

                              {/* Original Summary Stats Grid */}
                              <div className="md:col-span-1 grid grid-cols-1 gap-1.5 p-1.5 bg-[#0e0a08]/85 border border-[#211a12] rounded font-mono text-[7px]">
                                <div className="flex flex-col justify-center">
                                  <span className="text-slate-500 uppercase block text-[5px] tracking-wider leading-tight">Total Anomalies</span>
                                  <span className="text-white font-bold block mt-0.5">
                                    {leyInterferenceFindings.length} Vectors Detected
                                  </span>
                                </div>
                                <div className="flex flex-col justify-center border-t border-[#211a12]/30 pt-1">
                                  <span className="text-slate-500 uppercase block text-[5px] tracking-wider leading-tight">Avg Signal Drift</span>
                                  <span className="text-amber-500 font-bold block mt-0.5">
                                    {(leyInterferenceFindings.reduce((acc, f) => acc + parseFloat(f.phaseDrift), 0) / (leyInterferenceFindings.length || 1)).toFixed(2)}s Amplitude
                                  </span>
                                </div>
                                <div className="flex flex-col justify-center border-t border-[#211a12]/30 pt-1">
                                  <span className="text-slate-500 uppercase block text-[5px] tracking-wider leading-tight">Threat Assessment</span>
                                  <span className="text-red-500 font-extrabold animate-pulse block mt-0.5">
                                    {leyInterferenceFindings.some(f => f.status === 'CRITICAL') ? 'CRITICAL INSTABILITY' : 'SUPPRESSED'}
                                  </span>
                                </div>
                              </div>

                              {/* Real-time D3 Audio Visualizer */}
                              <div className="md:col-span-1">
                                <AudioVisualizerBarChart 
                                  isPulseCoreActive={isPulseCoreActive}
                                  pulseFrequency={pulseFrequency}
                                />
                              </div>
                            </div>
                          );
                        })()}

                        {/* Interactive Data Table */}
                        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 custom-scrollbar pointer-events-auto select-none rounded border border-[#211a12]/50">
                          <table className="w-full text-left font-mono text-[6px] md:text-[6.5px] border-collapse">
                            <thead>
                              <tr className="border-b border-[#211a12] text-[#a89880]/60 uppercase tracking-wider bg-[#060403] sticky top-0 z-10">
                                <th className="p-1 font-bold">NODE ID</th>
                                <th className="p-1 font-bold">LOCATION & SECTOR</th>
                                <th className="p-1 font-bold text-center">INTENSITY</th>
                                <th className="p-1 font-bold">DRIFT</th>
                                <th className="p-1 font-bold col-span-1">STATUS</th>
                                <th className="p-1 font-bold text-right">MITIGATION</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#211a12]/40 bg-zinc-950/60">
                              {leyInterferenceFindings.filter(f => visibleStatuses[f.status]).length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="p-4 text-center text-slate-500 italic text-[7px]" id="no-matching-anomalies">
                                    No anomalies matching the active legend status filters.
                                  </td>
                                </tr>
                              ) : (
                                leyInterferenceFindings
                                  .filter(finding => visibleStatuses[finding.status])
                                  .map((finding) => (
                                <tr 
                                  key={finding.id} 
                                  className="group hover:bg-[#c46a1a]/5 transition-colors"
                                >
                                  <td className="p-1 font-bold text-white group-hover:text-[#00fffa] transition-colors">{finding.id}</td>
                                  <td className="p-1 text-slate-300">
                                    <div className="font-extrabold text-[6.5px] text-zinc-100">{finding.node}</div>
                                    <div className="text-[5.5px] text-zinc-500 uppercase">{finding.sector}</div>
                                  </td>
                                  <td className="p-1 text-center font-bold">
                                    <div className="flex items-center justify-center gap-1">
                                      <div className="w-12 bg-[#090706] border border-[#211a12] h-1 rounded-full overflow-hidden inline-block align-middle">
                                        <div 
                                          className={`h-full rounded-full ${
                                            finding.status === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : 
                                            finding.status === 'ISOLATED' ? 'bg-emerald-500' : 'bg-amber-500 shadow-[0_0_4px_#f59e0b]'
                                          }`} 
                                          style={{ width: `${finding.intensity}%`, transition: 'width 0.5s ease' }}
                                        />
                                      </div>
                                      <span className={`${
                                        finding.status === 'CRITICAL' ? 'text-red-400 font-extrabold' : 
                                        finding.status === 'ISOLATED' ? 'text-emerald-400' : 'text-amber-400 font-bold'
                                      }`}>
                                        {finding.intensity}%
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-1 text-slate-400 font-bold">{finding.phaseDrift}</td>
                                  <td className="p-1">
                                    <span className={`px-1 py-0.2 rounded text-[5px] font-extrabold inline-block text-center min-w-[42px] uppercase ${
                                      finding.status === 'CRITICAL' ? 'bg-red-950/80 text-red-400 border border-red-850' : 
                                      finding.status === 'ISOLATED' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-850' : 
                                      'bg-amber-950/80 text-amber-400 border border-amber-850'
                                    }`}>
                                      {finding.status}
                                    </span>
                                  </td>
                                  <td className="p-1 text-right">
                                    {finding.status !== 'ISOLATED' ? (
                                      <button
                                        onClick={() => {
                                          const updated = leyInterferenceFindings.map(f => 
                                            f.id === finding.id ? { ...f, status: 'ISOLATED' as const, intensity: 6 } : f
                                          );
                                          setLeyInterferenceFindings(updated);
                                          const avgIsolate = Math.round(updated.reduce((sum, x) => sum + x.intensity, 0) / updated.length);
                                          setScanHistory(prev => {
                                            const next = [...prev];
                                            if (next.length > 0) next[next.length - 1] = avgIsolate;
                                            return next;
                                          });
                                          playLeyScanBeep();
                                        }}
                                        className="bg-[#1a9490]/15 hover:bg-[#1a9490]/90 text-[#00fffa] hover:text-black border border-[#1a9490]/40 hover:border-[#00fffa] px-1.5 py-0.2 text-[5.5px] font-bold rounded transition-all cursor-pointer"
                                      >
                                        ISOLATE
                                      </button>
                                    ) : (
                                      <span className="text-[#00fffa] font-extrabold italic text-[5.5px] inline-flex items-center gap-0.5 select-none leading-none">
                                        <Check className="w-1.5 h-1.5" /> SECURE
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                            </tbody>
                          </table>
                        </div>

                        {/* Footer details */}
                        <div className="mt-2 pt-1.5 border-t border-[#211a12] flex items-center justify-between text-[5.5px] font-mono text-zinc-500 shrink-0">
                          <span>SYSTEM METRIC: SOUTHERN_RAIL_COEFFICIENT=1.5x</span>
                          <span className="animate-pulse text-[#1a9490]">SCAN STATUS COMPLETE: ACTIVE HARMONIZATION OK</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Reconstruction progress blur screen */}
                {isReconstructing && (
                  <div className="absolute inset-0 bg-[#040302]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-20 overflow-y-auto">
                    <RefreshCw className="w-7 h-7 text-[#c46a1a] animate-spin mb-2 shrink-0 drop-shadow-[0_0_8px_#c46a1a]" />
                    <p className="text-[10px] font-bold text-white tracking-widest uppercase mb-1">
                      {reconstructionProgress}% RECONSTRUCTING SHADER ALLOY
                    </p>
                    <p className="text-[8px] text-slate-400 animate-pulse truncate max-w-full italic mb-1">
                      {reconstructionStep}
                    </p>
                    <div className="w-full max-w-[160px] bg-[#0d0b08] h-1 rounded-full overflow-hidden border border-[#2e2418] shrink-0">
                      <div
                        className="bg-[#c46a1a] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#c46a1a]"
                        style={{ width: `${reconstructionProgress}%` }}
                      />
                    </div>

                    {/* Reconstruction History Milestone Timeline */}
                    <div className="mt-4 w-full max-w-[210px] border-t border-[#2e2418]/60 pt-3.5 space-y-2 text-left">
                      <p className="text-[7.5px] font-bold text-[#c46a1a] uppercase tracking-widest flex items-center gap-1 font-sans">
                        <Sliders className="w-2.5 h-2.5 shrink-0" /> RECONSTRUCTION HISTORY
                      </p>
                      
                      <div className="space-y-1.5 pl-1.5">
                        {[
                          { id: 'core', label: 'Core detected', desc: 'Syncing Node Stone Core signal', threshold: 0 },
                          { id: 'ley', label: 'Ley line frequencies aligned', desc: 'Resonance synchronization complete', threshold: 25 },
                          { id: 'alloy', label: 'Alloy binding', desc: 'Melting Cenote ores & bone ash alloy', threshold: 50 },
                          { id: 'weave', label: 'Weaving nerve-lines', desc: 'Synthesizing organic copper structures', threshold: 70 },
                          { id: 'tessell', label: 'Tessellation complete', desc: 'Generating 3D polygonal shell', threshold: 90 },
                        ].map((milestone, idx, arr) => {
                          const isCompleted = reconstructionProgress > milestone.threshold;
                          const isActive = reconstructionProgress <= milestone.threshold && (idx === 0 || reconstructionProgress > arr[idx - 1].threshold);
                          
                          return (
                            <div key={milestone.id} className="flex items-start gap-2.5 text-[7px] leading-snug transition-all duration-300 relative">
                              {/* Left track line */}
                              {idx < arr.length - 1 && (
                                <div className={`absolute left-[3.5px] top-[9px] w-[1px] h-[14px] ${
                                  isCompleted ? 'bg-emerald-500/35' : 'bg-[#211a12]'
                                }`} />
                              )}
                              
                              <div className="flex items-center justify-center mt-[2px] shrink-0 relative z-10">
                                <div className={`w-2 h-2 rounded-full border flex items-center justify-center ${
                                  isCompleted 
                                    ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.3)]' 
                                    : isActive 
                                      ? 'bg-amber-500/10 border-[#c46a1a] animate-pulse shadow-[0_0_6px_rgba(196,106,26,0.5)]' 
                                      : 'bg-transparent border-[#211a12]'
                                }`}>
                                  {isCompleted && <div className="w-1 h-1 rounded-full bg-emerald-400" />}
                                  {isActive && <div className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-1.5">
                                  <p className={`font-mono font-black ${
                                    isCompleted 
                                      ? 'text-emerald-400/85 line-through decoration-emerald-500/30' 
                                      : isActive 
                                        ? 'text-amber-400' 
                                        : 'text-[#443729]'
                                  }`}>
                                    {milestone.label}
                                  </p>
                                  {isCompleted && (
                                    <span className="text-[6px] font-mono text-emerald-500 font-extrabold uppercase shrink-0">
                                      DONE
                                    </span>
                                  )}
                                  {isActive && (
                                    <span className="text-[6px] font-mono text-amber-500 font-extrabold uppercase shrink-0 animate-pulse">
                                      ACTIVE
                                    </span>
                                  )}
                                </div>
                                {isActive && (
                                  <p className="text-[6.5px] text-[#8b7d6b] font-sans truncate leading-none mt-0.5">
                                    {milestone.desc}...
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Diegetic Lore Card Metrics (Genesis Veres HUD details) */}
              <div className="bg-[#040302] border border-[#211a12] rounded-lg p-2.5 space-y-2 shrink-0">
                <div className="flex justify-between items-center border-b border-[#211a12] pb-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-white font-bold tracking-wide uppercase font-sans">
                      {activeProfile.name}
                    </span>
                    <span className="text-[7.5px] text-slate-500 block uppercase font-mono tracking-wider">
                      {activeProfile.faction}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#c46a1a]/10 text-white border border-[#c46a1a]/30 font-bold tracking-wider">
                      {activeProfile.tier}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[8px] font-mono">
                  {/* ATTACK POWER WITH TOOLTIP */}
                  <div className="flex justify-between items-center group relative cursor-help py-0.5">
                    <span className="text-slate-500 border-b border-dotted border-slate-500/40 uppercase">ATTACK POWER:</span>
                    <span className="text-red-400 font-bold">{activeProfile.atk}</span>
                    
                    {/* Tooltip Popup */}
                    <div className="absolute bottom-full left-0 mb-2 w-52 p-2 rounded-lg bg-[#0e0c0a] border border-red-500/35 text-[#d0c6b6] text-[7.5px] leading-relaxed shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 font-sans">
                      <div className="flex items-center gap-1 border-b border-red-500/20 pb-1 mb-1 text-red-400 font-bold uppercase font-mono">
                        <Zap className="w-2.5 h-2.5 text-red-400" /> Atk Mesh Impact
                      </div>
                      <span className="block leading-normal">
                        Governs the **procedural vertex spike density** and geometric facet sharpness. Higher attack profiles increase crystalline ridges and tessellation count across the hull.
                      </span>
                      <div className="absolute left-4 top-full w-2 h-2 bg-[#0e0c0a] border-r border-b border-red-500/35 rotate-45 -translate-y-1" />
                    </div>
                  </div>

                  {/* DEF RESISTANCE WITH TOOLTIP */}
                  <div className="flex justify-between items-center group relative cursor-help py-0.5">
                    <span className="text-slate-500 border-b border-dotted border-slate-500/40 uppercase">DEF RESISTANCE:</span>
                    <span className="text-blue-400 font-bold">{activeProfile.def}</span>
                    
                    {/* Tooltip Popup */}
                    <div className="absolute bottom-full right-0 mb-2 w-52 p-2 rounded-lg bg-[#0e0c0a] border border-blue-500/35 text-[#d0c6b6] text-[7.5px] leading-relaxed shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 font-sans">
                      <div className="flex items-center gap-1 border-b border-blue-500/20 pb-1 mb-1 text-blue-400 font-bold uppercase font-mono">
                        <Shield className="w-2.5 h-2.5 text-blue-400" /> Def Mesh Impact
                      </div>
                      <span className="block leading-normal">
                        Controls the **structural boundary envelope limit** and vertex coordinate extrema. A higher defense value scales and thickens the master physical bounding box.
                      </span>
                      <div className="absolute right-4 top-full w-2 h-2 bg-[#0e0c0a] border-r border-b border-blue-500/35 rotate-45 -translate-y-1" />
                    </div>
                  </div>

                  {/* SPEED PROFILE WITH TOOLTIP */}
                  <div className="flex justify-between items-center group relative cursor-help py-0.5">
                    <span className="text-slate-500 border-b border-dotted border-slate-500/40 uppercase">SPEED PROFILE:</span>
                    <span className="text-emerald-400 font-bold">{activeProfile.speed}</span>
                    
                    {/* Tooltip Popup */}
                    <div className="absolute bottom-full left-0 mb-2 w-52 p-2 rounded-lg bg-[#0e0c0a] border border-emerald-500/35 text-[#d0c6b6] text-[7.5px] leading-relaxed shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 font-sans">
                      <div className="flex items-center gap-1 border-b border-emerald-500/20 pb-1 mb-1 text-emerald-400 font-bold uppercase font-mono">
                        <Gauge className="w-2.5 h-2.5 text-emerald-400" /> Speed Mesh Impact
                      </div>
                      <span className="block leading-normal">
                        Influences **kinematic viewport rotation multiplier** and vertex wave cycle oscillation speed. Elevated speed accelerates dynamic viewport physics.
                      </span>
                      <div className="absolute left-4 top-full w-2 h-2 bg-[#0e0c0a] border-r border-b border-emerald-500/35 rotate-45 -translate-y-1" />
                    </div>
                  </div>

                  {/* PSI SENSITIVITY WITH TOOLTIP */}
                  <div className="flex justify-between items-center group relative cursor-help py-0.5">
                    <span className="text-slate-500 border-b border-dotted border-slate-500/40 uppercase">PSI SENSITIVITY:</span>
                    <span className="text-purple-400 font-bold">{activeProfile.psi}</span>
                    
                    {/* Tooltip Popup */}
                    <div className="absolute bottom-full right-0 mb-2 w-52 p-2 rounded-lg bg-[#0e0c0a] border border-purple-500/35 text-[#d0c6b6] text-[7.5px] leading-relaxed shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 font-sans">
                      <div className="flex items-center gap-1 border-b border-purple-500/20 pb-1 mb-1 text-purple-400 font-bold uppercase font-mono">
                        <Activity className="w-2.5 h-2.5 text-purple-500" /> Psi Mesh Impact
                      </div>
                      <span className="block leading-normal">
                        Drives **emission fissure glow intensity**, dynamic color shifting, and core noise waves. Intense Psi results in vivid spectral color cascades on shaders.
                      </span>
                      <div className="absolute right-4 top-full w-2 h-2 bg-[#0e0c0a] border-r border-b border-purple-500/35 rotate-45 -translate-y-1" />
                    </div>
                  </div>

                  <div className="flex justify-between col-span-2 border-t border-[#120d09] pt-1">
                    <span className="text-slate-500">PASSIVE HANDSHAKE:</span>
                    <span className="text-amber-500 font-bold">{activeProfile.skill}</span>
                  </div>
                </div>

                {/* Lore text narration with Sync Random Seed */}
                <div className="space-y-1.5 pt-1.5 border-t border-[#120d09]">
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-500 uppercase tracking-widest">
                    <span>COGNITIVE BIO-NARRATION</span>
                    <button
                      onClick={handleSyncRandomSeed}
                      disabled={isSyncingSeed}
                      className="flex items-center gap-1 text-[7.5px] tracking-wider text-[#c46a1a] border border-[#c46a1a]/30 rounded bg-[#c46a1a]/5 hover:bg-[#c46a1a]/15 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer px-1.5 py-0.5 uppercase font-semibold"
                    >
                      <RefreshCw className={`w-2 h-2 text-[#c46a1a] ${isSyncingSeed ? 'animate-spin' : ''}`} />
                      <span>{isSyncingSeed ? 'SYNCING...' : 'SYNC RANDOM SEED'}</span>
                    </button>
                  </div>
                  <div className="border-l-2 border-[#c46a1a] pl-2 font-mono text-[8px] text-[#a89880] italic leading-normal min-h-[30px] flex items-center relative">
                    {isSyncingSeed ? (
                      <span className="text-slate-500 animate-pulse uppercase tracking-wider text-[7px]">Rerouting Leylines... Decrypting core alternative lore timeline...</span>
                    ) : (
                      selectedLore ? selectedLore : activeProfile.bio
                    )}
                  </div>
                </div>

                {/* Live Gas deploy pricing log */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#120d09] text-[7.5px] font-mono">
                  <div>
                    <span className="text-slate-500 block">LOW (1.6 KM)</span>
                    <span className="text-cyan-400 font-semibold">{activeProfile.lowGas}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">HIGH STREAM</span>
                    <span className="text-indigo-400 font-semibold">{activeProfile.highGas}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SEAL REQUIRED</span>
                    <span className="text-amber-400 font-semibold truncate block">{activeProfile.seal}</span>
                  </div>
                </div>
              </div>

              {/* Transmutation Execute CTA */}
              <button
                onClick={handleTriggerReconstruction}
                disabled={isReconstructing}
                className="w-full py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition bg-[#c46a1a]/15 text-white hover:bg-[#c46a1a]/30 border border-[#c46a1a]/40 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(196,106,26,0.1)] shrink-0"
              >
                <Layers className="w-3.5 h-3.5 text-[#c46a1a]" />
                <span>PROCESS IN THE REACTOR FURNACE</span>
              </button>

              {/* Pulse Core Resonator Engine Widget */}
              <div className="bg-[#040302] border border-[#211a12] rounded-lg p-2.5 space-y-2 shrink-0 flex flex-col relative overflow-hidden" id="pulse-core-container">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[7.5px] text-slate-500 font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                    <Activity className={`w-3 h-3 text-[#1a9490] ${isPulseCoreActive ? 'animate-pulse' : ''}`} />
                    ⬡ PULSE CORE RESONATOR
                  </span>
                  {(() => {
                    const dampingLevel = isPulseCoreActive ? Math.round((2.5 - pulseFrequency) * 40) : 100;
                    const isDanger = dampingLevel > 90;
                    return (
                      <span className={`text-[7px] font-mono font-extrabold uppercase px-1 py-0.2 rounded border relative group cursor-help transition-all duration-200 ${
                        isDanger
                          ? 'text-red-500 bg-red-950/20 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.25)] hover:border-red-400'
                          : isPulseCoreActive 
                            ? 'text-[#1a9490] bg-[#1a9490]/10 border-[#1a9490]/35 shadow-[0_0_8px_rgba(26,148,144,0.15)] hover:border-[#1a9490]' 
                            : 'text-slate-500 bg-zinc-950 border-zinc-800 hover:border-slate-700'
                      }`} id="pulse-core-status-pill">
                        {isPulseCoreActive ? 'ACTIVE [ENGINE_ON]' : 'OFFLINE [MUTE]'}

                        {/* Dynamic Tooltip on Hover */}
                        <span className="pointer-events-none absolute top-full right-0 mt-1.5 hidden group-hover:flex flex-col items-end z-50">
                          <span className="w-1.5 h-1.5 bg-[#090706] border-l border-t border-[#211a12] rotate-45 mr-2.5 -mb-[4px] z-50" />
                          <span className="bg-[#090706] border border-[#211a12] text-slate-400 text-[6px] font-mono p-1.5 rounded shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap flex flex-col gap-0.5 min-w-[120px] select-none text-left">
                            <span className="text-[#8e806a] font-bold text-[5.5px] tracking-wider uppercase">⬥ DAMPING STATUS</span>
                            <div className="flex justify-between items-center gap-3">
                              <span className="text-slate-500">RESONANCE DAMPING:</span>
                              <span className={`${isDanger ? 'text-red-500' : 'text-[#00f0ff]'} font-extrabold`}>
                                {dampingLevel}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                              <span className="text-slate-500">ATTENUATION RATIO:</span>
                              <span className="text-amber-500 font-extrabold">
                                {isPulseCoreActive ? `${(pulseFrequency * 0.5).toFixed(2)}x` : '0.00x'}
                              </span>
                            </div>
                          </span>
                        </span>
                      </span>
                    );
                  })()}
                </div>
                
                <p className="text-[6.5px] text-[#8e806a] leading-normal font-mono select-none">
                  Synthesize a real-time, low-frequency atmospheric rumble and cybernetic ticker to anchor cosmic telemetry.
                </p>

                <div className="flex gap-2 items-center">
                  {/* Master Toggle */}
                  <button
                    onClick={() => setIsPulseCoreActive(prev => !prev)}
                    className={`flex-1 py-1.5 rounded-md text-[7.5px] font-mono font-bold tracking-widest uppercase transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 border ${
                      isPulseCoreActive
                        ? 'bg-[#1a9490]/15 hover:bg-[#1a9490]/25 text-[#00f0ff] border-[#1a9490]/50 shadow-[inset_0_0_8px_rgba(0,240,255,0.05)]'
                        : 'bg-zinc-950 hover:bg-zinc-900 text-slate-400 border-zinc-850'
                    }`}
                    id="pulse-core-toggle-button"
                  >
                    <Sliders className={`w-3 h-3 ${isPulseCoreActive ? 'text-[#00f0ff]' : 'text-slate-500'}`} />
                    <span>{isPulseCoreActive ? 'HALT CORE PULSE' : 'ENGAGE PULSE CORE'}</span>
                  </button>

                  {/* Pulsing Visual Oracle Dot */}
                  {isPulseCoreActive && (
                    <div className="w-4 h-4 shrink-0 flex items-center justify-center relative">
                      <span className="absolute w-3 h-3 rounded-full bg-[#1a9490]/30 animate-ping" style={{ animationDuration: `${1 / pulseFrequency}s` }} />
                      <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Frequency Selectors Grid */}
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {[
                    { freq: 0.5, label: '0.5 Hz', bpm: '30 BPM', desc: 'Somatic Sub' },
                    { freq: 1.0, label: '1.0 Hz', bpm: '60 BPM', desc: 'Ambient Sec' },
                    { freq: 1.5, label: '1.5 Hz', bpm: '90 BPM', desc: 'Sync Active' },
                    { freq: 2.0, label: '2.0 Hz', bpm: '120 BPM', desc: 'Overclock' },
                  ].map((preset) => {
                    const isSelected = pulseFrequency === preset.freq;
                    return (
                      <button
                        key={preset.freq}
                        onClick={() => {
                          setPulseFrequency(preset.freq);
                          if (!isPulseCoreActive) {
                            setIsPulseCoreActive(true);
                          }
                        }}
                        className={`p-1 rounded border text-center transition duration-200 cursor-pointer select-none flex flex-col justify-between h-9 ${
                          isSelected
                            ? 'bg-[#1a9490]/12 text-[#00f0ff] border-[#1a9490] shadow-[0_0_10px_rgba(26,148,144,0.18)]'
                            : 'bg-zinc-950/40 hover:bg-zinc-900/40 text-slate-400 border-zinc-850/60'
                        }`}
                        title={`${preset.label} (${preset.bpm}) - ${preset.desc}`}
                        id={`pulse-freq-${preset.freq}`}
                      >
                        <span className="text-[7.5px] font-black leading-none uppercase tracking-tight block">
                          {preset.label}
                        </span>
                        <div className="space-y-0 text-left">
                          <span className={`text-[4.5px] uppercase font-bold tracking-widest block leading-none ${isSelected ? 'text-[#00f0ff]/80' : 'text-slate-500'}`}>
                            {preset.bpm}
                          </span>
                          <span className="text-[4px] block font-light leading-none truncate text-[#8e806a]">
                            {preset.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ley Line Telemetry Scanner Widget */}
              <div className="bg-[#040302] border border-[#211a12] rounded-lg p-2.5 space-y-2 shrink-0 flex flex-col justify-between">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[7.5px] text-slate-500 font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                    <Compass className={`w-3 h-3 text-[#c46a1a] ${isScanningLeyLines ? 'animate-spin' : ''}`} />
                    ⬡ LEY LINE TELEMETRY SCANNER
                  </span>
                  <span className="text-[7px] text-[#c46a1a] font-mono font-extrabold uppercase bg-[#c46a1a]/10 px-1 py-0.2 rounded border border-[#c46a1a]/20">
                    STATUS: {isScanningLeyLines ? 'SCANNING...' : 'READY'}
                  </span>
                </div>

                {isScanningLeyLines ? (
                  <div className="space-y-1.5 py-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono">
                      <span className="text-[#c46a1a] font-semibold animate-pulse">{leyScanningStep}</span>
                      <span className="text-white font-bold">{leyScanningProgress}%</span>
                    </div>
                    <div className="w-full bg-[#120d09] h-1 rounded-full overflow-hidden border border-[#2e2418]">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-100"
                        style={{ width: `${leyScanningProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleTriggerLeyScan}
                      disabled={isScanningLeyLines}
                      className="flex-1 py-1.5 rounded-md text-[7.5px] font-mono font-bold tracking-widest uppercase transition bg-amber-950/20 hover:bg-amber-950/40 border border-[#c46a1a]/30 text-amber-400 flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Compass className="w-3 h-3 text-[#c46a1a]" />
                      <span>INITIATE LEY LINE SCAN</span>
                    </button>
                    {detectedLeyFragments.length > 0 && (
                      <button
                        onClick={() => {
                          setLastDetectedFragment(null);
                          setDetectedLeyFragments([]);
                        }}
                        className="px-2 py-1.5 rounded-md text-[7.5px] font-mono text-slate-500 border border-[#2e2418] hover:border-red-900/50 hover:text-red-400 transition cursor-pointer active:scale-95"
                        title="Clear Scanned History"
                      >
                        CLEAR
                      </button>
                    )}
                  </div>
                )}

                {/* Display Last Scanned Result */}
                {lastDetectedFragment && !isScanningLeyLines && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 bg-[#120d09]/85 border border-[#c46a1a]/30 rounded-md space-y-1 relative"
                  >
                    <div className="flex justify-between items-center text-[7px] font-mono">
                      <span className={`font-bold uppercase tracking-wide px-1 py-0.2 rounded text-[6px] ${
                        lastDetectedFragment.type === 'node' ? 'bg-indigo-950/45 text-indigo-400 border border-indigo-900/30' : 'bg-amber-950/45 text-amber-500 border border-amber-900/30'
                      }`}>
                        [{lastDetectedFragment.type === 'node' ? 'DATA NODE DETECTED' : 'LORE FRAGMENT DETECTED'}]
                      </span>
                      <span className="text-slate-500 font-bold">{lastDetectedFragment.sector}</span>
                    </div>
                    <h5 className="text-[8px] font-bold text-white uppercase tracking-wider">{lastDetectedFragment.title}</h5>
                    <p className="text-[7.5px] text-[#a89880] leading-relaxed italic border-l-2 border-amber-600/35 pl-2">
                      {lastDetectedFragment.description}
                    </p>

                    {/* Core Icon Generator Interface */}
                    <div className="border-t border-[#231b12] pt-1.5 mt-1 text-[7.5px] font-mono space-y-1.5">
                      {lastDetectedFragment.generatedCoreIcon ? (
                        <div className="bg-[#050403] border border-[#231b12] p-1.5 rounded space-y-1.5">
                          <div className="flex items-center justify-between text-[6.5px] text-slate-500">
                            <span>[COGNITIVE SCHEMATIC SYNCED]</span>
                            <span className="text-emerald-500 uppercase font-bold text-[6px]">● ONLINE</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-12 h-12 rounded border border-[#c46a1a]/40 overflow-hidden shrink-0 relative bg-black flex items-center justify-center">
                              <img 
                                src={lastDetectedFragment.generatedCoreIcon} 
                                alt="Node Stone Core Custom Schematic preview" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-[#c46a1a]/5 pointer-events-none" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="text-[7px]">
                                <span className="text-[#a89880] block text-[6px] uppercase tracking-wider">Style Core Profile:</span>
                                <span className="text-[#c46a1a] font-bold uppercase">{lastDetectedFragment.coreIconStyle?.replace('_', ' ')}</span>
                              </div>
                              <button
                                onClick={() => {
                                  const mappedMaterial = 
                                    lastDetectedFragment.coreIconStyle === 'necro_green' ? 'volcanic_stone' : 
                                    (lastDetectedFragment.coreIconStyle === 'aetheric_amber' || lastDetectedFragment.coreIconStyle === 'magma_crimson' ? 'metallic_copper' : 'ethereal_glass');
                                  handleRefImageGenerated(
                                    lastDetectedFragment.generatedCoreIcon,
                                    `Node Stone Core: [${lastDetectedFragment.title}]`,
                                    mappedMaterial,
                                    lastDetectedFragment.description
                                  );
                                }}
                                className="w-full py-1 px-1.5 rounded bg-amber-600 hover:bg-amber-500 text-[#0c0906] font-bold text-[6.5px] uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer transition active:scale-95"
                              >
                                <Wand2 className="w-2.5 h-2.5 text-[#0c0906]" />
                                <span>LOAD INTO TRANSMUTATOR</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#050403] border border-[#231b12] p-1.5 rounded space-y-1.5">
                          <div className="flex items-center gap-1 text-[7px] text-[#c46a1a] uppercase font-black">
                            <Sparkles className="w-2.5 h-2.5 text-[#c46a1a]" />
                            <span>COGNITIVE ICON SCHEMATIC GENERATOR</span>
                          </div>
                          <p className="text-[6.5px] text-slate-500 leading-normal">
                            Direct ORACLE-7 synthetic engines to produce a stylized, high-fidelity neural schematic diagram matching this fragment's resonance profile.
                          </p>
                          
                          {/* Style Presets Core Radio select */}
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
                            {[
                              { id: 'aetheric_amber', name: 'Amber Core', color: '#c46a1a' },
                              { id: 'abyssal_teal', name: 'Tidal Cyan', color: '#1a9490' },
                              { id: 'cryo_blue', name: 'Glacier Blue', color: '#3195f1' },
                              { id: 'necro_green', name: 'Necro Green', color: '#22c55e' },
                              { id: 'magma_crimson', name: 'Magma Red', color: '#ef4444' }
                            ].map((item) => {
                              const isSelected = selectedCoreStyle === item.id;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => setSelectedCoreStyle(item.id)}
                                  className={`px-1 py-0.5 rounded text-[5.5px] uppercase font-bold tracking-tight text-left flex items-center gap-1 border cursor-pointer select-none transition-all ${
                                    isSelected 
                                      ? 'bg-[#120d09] text-white shadow-sm' 
                                      : 'bg-[#090705] text-slate-500'
                                  }`}
                                  style={{ borderColor: isSelected ? item.color : '#231b12' }}
                                >
                                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                  <span className="truncate">{item.name}</span>
                                </button>
                              );
                            })}
                          </div>

                          {isGeneratingCoreIcon === lastDetectedFragment.id ? (
                            <div className="space-y-1 pt-0.5">
                              <div className="flex justify-between items-center text-[6px] text-amber-500 animate-pulse font-mono uppercase">
                                <span>SYNTHESIZING MATRIX V_2.0...</span>
                                <Loader2 className="w-2 h-2 animate-spin text-amber-500" />
                              </div>
                              <div className="h-1 w-full bg-[#1c140e] rounded-full overflow-hidden relative">
                                <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 w-2/3 animate-pulse rounded-full" style={{ animationDuration: '0.8s' }} />
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleGenerateCoreIcon(lastDetectedFragment.id, lastDetectedFragment.title, selectedCoreStyle)}
                              className="w-full py-1 rounded border border-[#c46a1a]/40 hover:border-[#c46a1a] bg-[#1a0e05]/50 text-[#c46a1a] hover:text-white font-bold tracking-wider uppercase text-[6.5px] flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 mt-1"
                            >
                              <Wand2 className="w-2.5 h-2.5 shrink-0" />
                              <span>SYNTHESIZE CORE ICON</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setLastDetectedFragment(null)}
                      className="absolute top-1 right-2 text-slate-500 hover:text-white font-mono text-[7px] p-1"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {/* Session scan inventory - Collapsible list */}
                {detectedLeyFragments.length > 0 && (
                  <div className="border-t border-[#120d09] pt-1.5 mt-1">
                    <details className="group/details">
                      <summary className="list-none flex justify-between items-center text-[7px] font-mono text-slate-500 cursor-pointer hover:text-white select-none">
                        <span className="uppercase font-bold tracking-widest">
                          VIEW DISCOVERY LOGS ({detectedLeyFragments.length})
                        </span>
                        <span className="text-[#c46a1a] transition-transform duration-200 group-open/details:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="mt-1.5 space-y-1.5 max-h-[80px] overflow-y-auto pr-1 custom-scrollbar">
                        {detectedLeyFragments.map((frag, idx) => (
                          <div 
                            key={frag.id} 
                            onClick={() => setLastDetectedFragment(frag)}
                            className={`p-1.5 rounded border border-[#211a12] bg-[#0c0906] cursor-pointer hover:border-[#c46a1a]/40 transition text-[7px] font-mono ${
                              lastDetectedFragment?.id === frag.id ? 'border-[#c46a1a]/60 bg-[#16110b]' : ''
                            }`}
                          >
                            <div className="flex justify-between items-baseline mb-0.5">
                              <span className={`font-black text-[6px] ${frag.type === 'node' ? 'text-indigo-400' : 'text-amber-500'}`}>
                                {frag.id} | {frag.type.toUpperCase()}
                              </span>
                              <span className="text-[5.5px] text-[#8e806a]">{frag.sector}</span>
                            </div>
                            <p className="text-white font-bold truncate">{frag.title}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#2e2418] rounded-xl bg-[#030201]/40">
              <BookOpen className="w-8 h-8 text-[#2e2418] animate-bounce mb-2" />
              <h4 className="text-xs font-cinzel text-slate-400 tracking-wider">REPLICATOR DECK INACTIVE</h4>
              <p className="text-[10px] font-mono text-[#8b7d6b] max-w-xs mt-1.5 leading-relaxed">
                Provide or load a cognitive memory signature in Section I. The predictive AI decrypter will align custom material formulas into the reactor pipeline.
              </p>
            </div>
          )}
        </section>

        {/* Right column (Cols 9-12): Geothermal 3D Mesh Engine */}
        <section className="lg:col-span-4 h-full overflow-hidden">
          <ThreeDimensionalViewer 
            model={activeModel} 
            onTriggerMtd={() => setIsMtdModalOpen(true)} 
            psiSensitivity={activeProfile?.psi || '0'} 
          />
        </section>

      </main>
      )}

      {activeTab === 'golemGuide' && (
        <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
          <JanesGolemGuide 
            wallet={wallet}
            onOpenWallet={() => setIsWalletOpen(true)}
            onConnectWallet={handleConnectWallet}
            onDisconnectWallet={handleDisconnectWallet}
            onTriggerStripeCheckout={handleTriggerStripeCheckout}
            purchaseHistory={purchaseHistory}
            onAddPurchase={(item) => {
              setPurchaseHistory(prev => [item, ...prev]);
            }}
          />
        </main>
      )}

      {activeTab === 'forgeDeploy' && (
        <main className="flex-1 overflow-hidden relative z-10 flex flex-col bg-[#020408]">
          <iframe 
            src="/CST_Character_Viewer_Controller.html" 
            className="w-full h-full border-none flex-grow"
            title="Forge Deploy — Character Viewer"
            allow="accelerometer; gyroscope; magnetometer"
          />
        </main>
      )}

      {activeTab === 'cineCity' && (
        <main className="flex-1 overflow-hidden relative z-10 flex flex-col bg-[#020408] p-4">
          <CineCityPanel />
        </main>
      )}

      {activeTab === 'constitution' && (
        <main className="flex-1 overflow-hidden relative z-10 flex flex-col p-4 bg-[#070503]">
          <ConstitutionViewer />
        </main>
      )}

      {/* Stripe Interactive Checkout Sandbox Simulator Modal */}
      {showStripeSimulator && (
        <div id="stripe-checkout-sandbox-simulator" className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md bg-[#0d0b08] border border-[#2e2418] rounded-2xl shadow-[0_0_40px_rgba(196,106,26,0.3)] overflow-hidden flex flex-col">
            <div className="bg-[#080604] px-5 py-3 flex items-center justify-between text-white border-b border-[#2e2418]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#c46a1a] animate-pulse" />
                <span className="text-[9.5px] font-bold tracking-widest uppercase text-[#c46a1a]">FORGE PATHWAY SYNAPSE</span>
              </div>
              <button onClick={() => setShowStripeSimulator(false)} className="text-slate-400 hover:text-white transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-left">
              <div className="bg-[#030201] p-4 rounded-xl border border-[#c46a1a]/20 space-y-1 text-center">
                <span className="text-[8px] text-[#c46a1a] tracking-[0.2em] uppercase block">SECURE DIRECT handshaking</span>
                <h4 className="text-xs text-white uppercase mt-0.5 tracking-wider">SYNAPSE LAYER: {simulatedPlanName}</h4>
                <p className="text-xl text-[#c46a1a] font-extrabold">${(simulatedPriceCents / 100).toFixed(2)} USD</p>
              </div>

              <div className="space-y-2.5 font-mono text-[9px]">
                <div className="space-y-0.5">
                  <label className="text-slate-500 uppercase tracking-wider block font-bold">Holder Identity / Pilot Signature</label>
                  <input
                    type="text"
                    defaultValue="Tony Scott"
                    className="w-full p-2 bg-[#050403] border border-[#2e2418] rounded text-[#c8b898] outline-none"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-slate-500 uppercase tracking-wider block font-bold">Stripe Handshake Card Key</label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="4242 •••• •••• 4242"
                      disabled
                      className="w-full p-2 bg-[#050403] border border-[#2e2418] rounded text-slate-400"
                    />
                    <span className="absolute right-2 top-1.5 text-[8px] bg-[#c46a1a]/10 text-[#c46a1a] border border-[#c46a1a]/30 px-1.5 py-0.5 rounded font-bold uppercase">
                      SANDBOX
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500 uppercase tracking-wider block font-bold">EXP DATE</label>
                    <input
                      type="text"
                      defaultValue="12 / 29"
                      className="w-full p-2 bg-[#050403] border border-[#2e2418] rounded text-center text-[#c8b898] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 uppercase tracking-wider block font-bold">CVC CODE</label>
                    <input
                      type="text"
                      defaultValue="042"
                      className="w-full p-2 bg-[#050403] border border-[#2e2418] rounded text-center text-[#c8b898] outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCompleteSimulatedPayment}
                disabled={isProcessingStripe}
                className="w-full py-2.5 bg-[#c46a1a] hover:bg-[#a67c2a] text-white text-[9.5px] font-bold tracking-widest uppercase rounded transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(196,106,26,0.2)] cursor-pointer"
              >
                {isProcessingStripe ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" /> COG-HANDSHAKING...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-white" /> CONFIRM SECURE DEPOSIT
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Purchase pricing models modal */}
      <StripeCheckoutModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        unlockedTier={unlockedTier}
        history={purchaseHistory}
        onTriggerCheckout={handleTriggerStripeCheckout}
        isProcessing={isProcessingStripe}
      />

      {/* Web3 Slide-over Panel drawer */}
      <WalletConnectPanel
        wallet={wallet}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      {/* Tripo3D Base Sepolia Mint to Deploy (MTD) interactive workflow modal */}
      <ForgePilotMtdModal
        isOpen={isMtdModalOpen}
        onClose={() => setIsMtdModalOpen(false)}
        activeModel={activeModel}
        wallet={wallet}
        onOpenWallet={() => setIsWalletOpen(true)}
      />

      {/* Pop out Train Route and Tactical Radar panel */}
      <TrainRouteRadar
        isOpen={isRouteRadarOpen}
        onClose={() => setIsRouteRadarOpen(false)}
      />

      {/* Core Lore card Infinite Carousel Footer */}
      <footer id="codex-rail" className="h-[125px] min-h-[125px] bg-[#050403] border-t border-[#2e2418] relative z-20 flex flex-col justify-center overflow-hidden shrink-0 select-none">
        <div className="px-5 py-1 border-b border-[#211a12] flex items-center justify-between text-[7.5px] tracking-widest text-[#a67c2a] font-bold uppercase">
          <span>⬥ LORE CARD INFINITE SYNAPSE CAROUSEL (HOVER TO SUSPEND • CLICK COGNITIVE SLOT TO DECRYPT SEED)</span>
          <span className="text-slate-500 font-mono text-[7px]">{loreCards.length} ANOMALOUS INTERFACES ONLINE</span>
        </div>
        
        {/* Infinite Carousel Track */}
        <div className="flex-1 flex items-center overflow-hidden relative">
          <div id="carousel-track" className="flex gap-4 animate-carousel whitespace-nowrap py-2 px-5">
            {/* Double map to guarantee pixel width for continuous circular slide */}
            {[...loreCards, ...loreCards].map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                onClick={() => {
                  setExternalCarouselPrompt(card.trigger);
                }}
                className="inline-flex items-center gap-3 bg-[#0d0b08] border border-[#2e2418] hover:border-[#c46a1a] p-2 pr-4 rounded-lg cursor-pointer transform hover:scale-105 shadow-md shadow-black/80 hover:shadow-[0_0_12px_rgba(196,106,26,0.15)] transition-all duration-300 group min-w-[215px] max-w-[215px]"
              >
                {/* Visual token thumbnail placeholder */}
                <div className="w-9 h-9 rounded-md overflow-hidden border border-[#2e2418] shrink-0 relative bg-black flex items-center justify-center">
                  <img src={card.avatar} referrerPolicy="no-referrer" alt={card.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-[#0d0b08]/20" />
                </div>
                
                {/* Mini details card */}
                <div className="flex-1 min-w-0 flex flex-col text-[8px] leading-tight">
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-white font-extrabold uppercase truncate group-hover:text-[#c46a1a] transition-colors font-sans">
                      {card.name}
                    </span>
                    <span 
                      className="text-[6.5px] px-1 rounded-sm border shrink-0 font-extrabold uppercase font-sans"
                      style={{ color: card.color, borderColor: `${card.color}40`, backgroundColor: `${card.color}10` }}
                    >
                      {card.tier.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-[7px] mt-0.5 truncate uppercase">
                    {card.faction}
                  </span>
                  <span className="text-amber-500 text-[6.5px] font-mono font-bold mt-1.5 hidden group-hover:inline-block animate-pulse font-sans">
                    ⬥ LOAD SEED INDEX
                  </span>
                  <span className="text-slate-600 font-sans text-[7px] mt-1 group-hover:hidden truncate italic">
                    {card.trigger.substring(0, 30)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Global CSS Injector for Ley Line Resonance Animations */}
      <style>{`
        @keyframes leyWave1 {
          0% {
            transform: translateY(-4px) scaleY(1);
          }
          50% {
            transform: translateY(4px) scaleY(1.3);
          }
          100% {
            transform: translateY(-4px) scaleY(1);
          }
        }
        @keyframes leyWave2 {
          0% {
            transform: translateY(2px) scaleY(1.2);
          }
          50% {
            transform: translateY(-2px) scaleY(0.85);
          }
          100% {
            transform: translateY(2px) scaleY(1.2);
          }
        }
        @keyframes leyPulseRing {
          0% {
            transform: scale(0.85);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.75;
          }
          100% {
            transform: scale(0.85);
            opacity: 0.35;
          }
        }
        @keyframes leyPulseRingFast {
          0% {
            transform: scale(0.65);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.85;
          }
          100% {
            transform: scale(0.65);
            opacity: 0.25;
          }
        }
        @keyframes leyLineResonanceShift {
          0%, 100% {
            filter: hue-rotate(var(--psi-hue, 0deg)) saturate(2.4) brightness(1.1);
          }
          50% {
            filter: hue-rotate(calc(var(--psi-hue, 0deg) + 120deg)) saturate(3.8) brightness(1.3);
          }
        }
        .animate-ley-wave-1 {
          animation: leyWave1 5.5s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-ley-wave-2 {
          animation: leyWave2 3.8s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-ley-pulse-ring {
          animation: leyPulseRing 4.6s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-ley-pulse-ring-fast {
          animation: leyPulseRingFast 2.8s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-ley-color-shift {
          animation: leyLineResonanceShift 7.5s linear infinite;
        }
        @keyframes leyScannerSweep {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0%;
          }
        }
        .animate-ley-scanner-sweep {
          position: absolute;
          animation: leyScannerSweep 3s ease-in-out infinite;
        }
        @keyframes intersectionPulse {
          0% {
            r: 2px;
            opacity: 0.3;
          }
          50% {
            r: 6px;
            opacity: 0.95;
            stroke-width: 0.4px;
          }
          100% {
            r: 2px;
            opacity: 0.3;
          }
        }
        .animate-intersection-pulse {
          animation: intersectionPulse 2.1s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes gridFlicker {
          0%, 100% { opacity: 1; }
          23% { opacity: 1; }
          24% { opacity: 0.3; }
          26% { opacity: 0.8; }
          27% { opacity: 0.15; }
          28% { opacity: 0.95; }
          50% { opacity: 0.95; }
          51% { opacity: 0.4; }
          53% { opacity: 0.9; }
          72% { opacity: 0.9; }
          73% { opacity: 0.2; }
          75% { opacity: 1; }
        }
        .animate-grid-flicker {
          animation: gridFlicker 1.5s infinite;
        }
        @keyframes gridCriticalStrobe {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0px 0px 3px rgba(220, 20, 60, 0.95));
          }
          50% {
            opacity: 0.15;
            filter: drop-shadow(0px 0px 1px rgba(220, 20, 60, 0.15));
          }
        }
        .animate-grid-critical {
          animation: gridCriticalStrobe 0.15s infinite;
        }
      `}</style>

    </div>
  );
}
