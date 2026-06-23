import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Flame, ArrowRight, ShieldCheck, Cpu, Database, Award, Volume2, VolumeX } from 'lucide-react';

interface HeroLandingPageProps {
  onEnter: () => void;
}

export default function HeroLandingPage({ onEnter }: HeroLandingPageProps) {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startAmbience = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Disconnect and stop any playing oscillators first
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      oscillatorsRef.current = [];

      // Main atmospheric master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 1.8); // 1.8s power-on loop fade
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Dark machinery lowpass filter
      const biquadFilter = ctx.createBiquadFilter();
      biquadFilter.type = 'lowpass';
      biquadFilter.frequency.setValueAtTime(320, ctx.currentTime);
      biquadFilter.Q.setValueAtTime(2.2, ctx.currentTime);
      biquadFilter.connect(masterGain);

      // Low Machinery Base Drone: 55Hz (A1 frequency)
      const oscBase = ctx.createOscillator();
      oscBase.type = 'triangle';
      oscBase.frequency.value = 55;
      const gainBase = ctx.createGain();
      gainBase.gain.value = 0.55;
      oscBase.connect(gainBase);
      gainBase.connect(biquadFilter);
      oscBase.start();
      oscillatorsRef.current.push(oscBase);

      // System Heartbeat Second Octave: 110Hz (A2 frequency)
      const oscOctave = ctx.createOscillator();
      oscOctave.type = 'sine';
      oscOctave.frequency.value = 110;
      const gainOctave = ctx.createGain();
      gainOctave.gain.value = 0.35;
      oscOctave.connect(gainOctave);
      gainOctave.connect(biquadFilter);
      oscOctave.start();
      oscillatorsRef.current.push(oscOctave);

      // Eerie Ley Line Resonance: 165Hz (Perfect E3 fifth) with organic LFO breath
      const oscFifth = ctx.createOscillator();
      oscFifth.type = 'sine';
      oscFifth.frequency.value = 165;
      const gainFifth = ctx.createGain();
      gainFifth.gain.value = 0.18;
      oscFifth.connect(gainFifth);
      gainFifth.connect(biquadFilter);
      oscFifth.start();
      oscillatorsRef.current.push(oscFifth);

      // Deep Sub-frequency Vibration: 27.5Hz (A0 sub-bass)
      const oscSub = ctx.createOscillator();
      oscSub.type = 'sine';
      oscSub.frequency.value = 27.5;
      const gainSub = ctx.createGain();
      gainSub.gain.value = 0.45;
      oscSub.connect(gainSub);
      gainSub.connect(biquadFilter);
      oscSub.start();
      oscillatorsRef.current.push(oscSub);

      // Modulating LFO 1: drifts the eerie Perfect Fifth gain dynamically (Period 15s)
      const lfo1 = ctx.createOscillator();
      lfo1.frequency.value = 0.065;
      const lfo1Gain = ctx.createGain();
      lfo1Gain.gain.value = 0.12;
      lfo1.connect(lfo1Gain);
      lfo1Gain.connect(gainFifth.gain);
      lfo1.start();
      oscillatorsRef.current.push(lfo1);

      // Modulating LFO 2: modulates filter threshold to replicate "exhaust machine respiration"
      const lfo2 = ctx.createOscillator();
      lfo2.frequency.value = 0.14;
      const lfo2Gain = ctx.createGain();
      lfo2Gain.gain.value = 140;
      lfo2.connect(lfo2Gain);
      lfo2Gain.connect(biquadFilter.frequency);
      lfo2.start();
      oscillatorsRef.current.push(lfo2);

      setIsAudioActive(true);
    } catch (err) {
      console.warn("Failed to activate immersive Abyssum sounds:", err);
    }
  };

  const stopAmbience = (fadeOutTime: number = 0.6) => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeOutTime);
      } catch (e) {}
    }
    setTimeout(() => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      oscillatorsRef.current = [];
      setIsAudioActive(false);
    }, fadeOutTime * 1000);
  };

  const toggleAmbience = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isAudioActive) {
      stopAmbience(0.4);
    } else {
      startAmbience();
    }
  };

  const playEnterForgeSoundscape = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioCtxRef.current || new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Ethereal sacred and space-harmonized pentatonic frequency profiles
      const scalePreset1 = [432, 576, 648, 720, 864, 1152]; // Cosmic A=432 scale
      const scalePreset2 = [528, 639, 741, 852, 963, 1056]; // Solfeggio Scale
      const scalePreset3 = [440, 554, 659, 739, 880, 1109]; // Shimmering A major pentatonic

      const scaleChoices = [scalePreset1, scalePreset2, scalePreset3];
      // Randomly select one scale preset for dynamic variation on every single click
      const selectedScale = scaleChoices[Math.floor(Math.random() * scaleChoices.length)];

      // Master output filter & high-fidelity spacial atmosphere gain
      const masterFilter = ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(2200, now);
      masterFilter.frequency.exponentialRampToValueAtTime(1200, now + 3.0);
      masterFilter.Q.setValueAtTime(1.5, now);

      const delayNode = ctx.createDelay();
      delayNode.delayTime.value = 0.22; // custom delay line spacing
      const delayGain = ctx.createGain();
      delayGain.gain.value = 0.45; // echo loop gain
      
      // Connect delay feedback loop
      delayNode.connect(delayGain);
      delayGain.connect(delayNode);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      masterGain.gain.setValueAtTime(0.35, now + 1.2);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

      // Connect master chain
      masterFilter.connect(masterGain);
      masterGain.connect(ctx.destination);
      
      delayNode.connect(masterFilter);
      delayGain.connect(masterFilter);

      // Create an cascading arpeggiated cluster of 5 ethereal bell nodes
      const numberOfBells = 5;
      for (let i = 0; i < numberOfBells; i++) {
        const bellTime = now + (i * 0.12); // Staggered arpeggiation delay
        const pitchIdx = (Math.floor(Math.random() * selectedScale.length) + i) % selectedScale.length;
        const baseFreq = selectedScale[pitchIdx];

        // Core bell body
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, bellTime);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.005, bellTime + 0.5);

        // Glassy chime FM modulator
        const mod = ctx.createOscillator();
        mod.type = 'sine';
        mod.frequency.setValueAtTime(baseFreq * 2.0, bellTime);
        
        const modGain = ctx.createGain();
        modGain.gain.setValueAtTime(50, bellTime);
        modGain.gain.exponentialRampToValueAtTime(0.1, bellTime + 0.4);

        // Connect modulator to oscillator frequency
        mod.connect(modGain);
        modGain.connect(osc.frequency);

        const bellGain = ctx.createGain();
        bellGain.gain.setValueAtTime(0, bellTime);
        bellGain.gain.linearRampToValueAtTime(0.12, bellTime + 0.03); // quick spatial attack
        bellGain.gain.exponentialRampToValueAtTime(0.001, bellTime + 1.8); // dreamy long decay

        osc.connect(bellGain);
        bellGain.connect(masterFilter);
        bellGain.connect(delayNode); // feed directly into echo channel

        // Scheduled cycles
        mod.start(bellTime);
        mod.stop(bellTime + 1.8);
        osc.start(bellTime);
        osc.stop(bellTime + 1.8);
      }

      // Warm atmospheric foundational pad glide block
      const padOsc = ctx.createOscillator();
      padOsc.type = 'triangle';
      padOsc.frequency.setValueAtTime(144, now); // Rich D3 root tone
      padOsc.frequency.linearRampToValueAtTime(162, now + 2.5); // slide smoothly upwards to E3

      const padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(250, now);
      padFilter.frequency.linearRampToValueAtTime(450, now + 1.5);
      padFilter.Q.value = 3;

      const padGain = ctx.createGain();
      padGain.gain.setValueAtTime(0, now);
      padGain.gain.linearRampToValueAtTime(0.18, now + 0.6);
      padGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      padOsc.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(ctx.destination);

      padOsc.start(now);
      padOsc.stop(now + 3.0);

    } catch (err) {
      console.warn("Could not fire system enter auditory sweep:", err);
    }
  };

  const handleEnterClick = () => {
    if (isAssembling) return;
    setIsAssembling(true);
    playEnterForgeSoundscape();
    stopAmbience(0.5);

    // Simulated progress ticks simulating asynchronous worlds generating
    let currentVal = 0;
    const tracker = setInterval(() => {
      currentVal += Math.floor(Math.random() * 10) + 7;
      if (currentVal >= 100) {
        currentVal = 100;
        clearInterval(tracker);
        setTimeout(() => {
          onEnter();
        }, 320);
      }
      setAssemblyProgress(currentVal);
    }, 110);
  };

  useEffect(() => {
    // Attempt automatic playback of resonators when first key event or hover click occurs
    const handleFirstInteraction = () => {
      if (!isAudioActive && !isAssembling) {
        startAmbience();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      // Clean up soundwaves
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close().catch(() => {});
        } catch (e) {}
      }
    };
  }, [isAudioActive]);

  return (
    <div className="min-h-screen w-full bg-[#050403] text-[#c8b898] flex flex-col justify-between items-center relative overflow-hidden font-mono p-6 selection:bg-[#c46a1a]/20 selection:text-[#c46a1a]">
      {/* Dynamic scanlines & grain overlays */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.045] bg-repeat z-30" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` 
        }} 
      />
      
      {/* Decorative ambient background grid & lighting shadow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,106,26,0.1)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c46a1a]/30 to-transparent" />

      {/* Header element */}
      <header className="w-full max-w-6xl flex justify-between items-center border-b border-[#2e2418]/60 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#c46a1a]/10 border border-[#c46a1a]/30 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-[#c46a1a]" />
          </div>
          <span className="text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-white">
            ABYSSUM INTERACTIVE
          </span>
        </div>
        <div className="text-[7.5px] text-slate-500 flex items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5 uppercase font-sans">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYNAPSE SYSTEM ONLINE
          </span>
          <button 
            type="button"
            onClick={toggleAmbience}
            className={`font-mono text-[6.5px] px-1.5 py-0.5 rounded border flex items-center gap-1 cursor-pointer select-none transition-all active:scale-95 ${
              isAudioActive 
                ? 'text-amber-500 border-amber-500/40 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.1)]' 
                : 'text-slate-500 border-slate-700 bg-transparent hover:border-slate-500'
            }`}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-2.5 h-2.5 animate-pulse" />
                <span>AMBIENCE ACTIVE</span>
              </>
            ) : (
              <>
                <VolumeX className="w-2.5 h-2.5" />
                <span>SOUNDS MUTED (ACTIVATE)</span>
              </>
            )}
          </button>
          <span className="font-sans hidden sm:inline">SYS_VER: 1.4.0</span>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 my-8 relative z-10">
        
        {/* Left Side: Lore and Forge CTA Details */}
        <div className="flex-1 space-y-6 text-left max-w-xl">
          <div className="space-y-1">
            <span className="text-[9px] text-[#c46a1a] tracking-[0.3em] uppercase block font-sans font-bold">
              GENESIS VERSE MULTIVERSE
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-widest uppercase font-cinzel leading-none select-none">
              GENESIS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c46a1a] to-[#a67c2a] font-cinzel-deco">
                VERSE
              </span>
            </h1>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Welcome to the Southern Division's Abyssum Cognitive Reactor deck. 
            Re-crystallize anomalous memory traces from the Train Route Radar, 
            assemble elite biomechanical clay-golems under Jane's Golem MFG, 
            and deploy high-fidelity 3D assets to the tactical CST-ERT sector viewer.
          </p>

          {/* Feature Highlights bento block */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-[#130f0a]/80 rounded-lg border border-[#2e2418]/60 space-y-1 hover:border-[#c46a1a]/30 transition group">
              <div className="flex items-center gap-1.5 text-[#c46a1a]">
                <Cpu className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold tracking-wider uppercase font-sans">COGNITIVE REACTOR</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">Transmute memory profiles into custom materials and 3D templates.</p>
            </div>

            <div className="p-3 bg-[#130f0a]/80 rounded-lg border border-[#2e2418]/60 space-y-1 hover:border-[#c46a1a]/30 transition group">
              <div className="flex items-center gap-1.5 text-[#a67c2a]">
                <Database className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold tracking-wider uppercase font-sans">BLUEPRINT VAULT</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">Design customizable golems with specialized active cyber-parts.</p>
            </div>
          </div>

          {/* Interactive ENTER THE FORGE element */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              onClick={handleEnterClick}
              className="px-8 py-4 bg-gradient-to-r from-[#c46a1a] to-[#a67c2a] hover:from-[#d3741f] hover:to-[#b88c32] text-white font-sans font-extrabold tracking-[0.25em] text-xs uppercase rounded-xl border border-[#ffd8a8]/20 flex items-center justify-center gap-3 cursor-pointer transform hover:scale-[1.02] shadow-[0_0_30px_rgba(196,106,26,0.35)] hover:shadow-[0_0_40px_rgba(196,106,26,0.5)] transition-all duration-300"
            >
              <span>ENTER THE FORGE</span>
              <ArrowRight className="w-4 h-4 animate-bounce-right" />
            </button>

            <div className="flex items-center justify-center px-4 py-2 border border-[#2e2418]/60 rounded-xl bg-[#090705] text-[9.5px] text-slate-500 font-mono gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c46a1a]" />
              <span>COGNITIVE LOCK CLEARED</span>
            </div>
          </div>
        </div>

        {/* Right Side: Hero Visual Frame showing the new Hero Landing image */}
        <div className="flex-1 flex justify-center items-center w-full max-w-sm lg:max-w-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full relative group"
          >
            {/* Glowing outer framing accents */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#c46a1a]/40 to-[#a67c2a]/40 rounded-2xl blur-lg group-hover:opacity-100 opacity-75 transition-opacity duration-1000" />
            
            <div className="relative bg-[#0d0a07] border-2 border-[#c46a1a]/40 p-2.5 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
              {/* Corner brackets overlay */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#c46a1a] pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#c46a1a] pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#c46a1a] pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#c46a1a] pointer-events-none" />
              
              {/* Top info strip */}
              <div className="flex justify-between items-center text-[7px] text-[#c46a1a]/80 font-bold px-2 py-1 border-b border-[#2e2418]/60 mb-2 font-mono uppercase tracking-widest">
                <span>SYSTEM GRAPHIC // PREVIEW</span>
                <span>ID: GVR-H1</span>
              </div>

              {/* Real high quality asset view */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/40 border border-[#2e2418]/70">
                <img 
                  src="/genesis-verse-hero-page-a.png" 
                  referrerPolicy="no-referrer"
                  alt="Genesis Verse Hero Art" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  onError={(e) => {
                    // Fallback to high tech rendering if image display fails in sandbox
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-view');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                
                {/* Visual Fallback Container if image was just created/missing */}
                <div className="fallback-view hidden absolute inset-0 flex flex-col justify-center items-center p-6 text-center bg-gradient-to-b from-[#1c130c] to-[#040302]">
                  <Award className="w-12 h-12 text-[#c46a1a] mb-3 animate-pulse" />
                  <span className="text-[10px] text-[#c46a1a] tracking-widest uppercase font-bold">GENESIS MATRIX ENGRAVED</span>
                  <p className="text-[8px] text-slate-500 mt-2 max-w-[220px]">
                    Spatial layout and high-fidelity matrix render mapped onto physical Abyssum Forge node.
                  </p>
                </div>

                {/* Cybernetic holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none" />
              </div>

              {/* Bottom detail row */}
              <div className="mt-3 text-[8px] text-slate-400 font-mono px-1 flex justify-between items-center bg-[#070503] p-2 rounded-lg border border-[#2e2418]/60">
                <span className="uppercase text-[#a89880]">SOUTHERN REGION RADAR GRID</span>
                <span className="font-bold text-white uppercase tracking-wider">ACTIVE LEYLINES</span>
              </div>
            </div>
          </motion.div>
        </div>

      </main>

      {/* Corporate copyright details and status */}
      <footer className="w-full max-w-6xl border-t border-[#2e2418]/60 pt-4 flex flex-col sm:flex-row justify-between items-center text-[8px] text-slate-500 gap-2 relative z-10 font-sans">
        <span>© 2026 ABYSSUM MACHINERY CO. ALL INDUSTRIAL SECRETS CONSERVED.</span>
        <div className="flex gap-6">
          <span className="uppercase">FORGE SYSTEM AUTHORITY APPROVED</span>
          <span className="uppercase text-[#c46a1a] font-bold font-mono">SEPOLIA TESTNET LINKED</span>
        </div>
      </footer>

      {/* Dynamic Asynchronous Worlds loading overlay screen */}
      {isAssembling && (
        <div className="absolute inset-0 bg-[#050403] z-[100] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
          <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,106,26,0.06)_0%,transparent_65%)] pointer-events-none" />
          
          <div className="max-w-md w-full space-y-6 relative">
            <div className="flex justify-center mb-2">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-12 h-12 rounded-full border border-dashed border-[#c46a1a]/30 animate-spin" />
                <span className="absolute w-8 h-8 rounded-full border border-[#c46a1a] animate-ping" />
                <div className="w-10 h-10 rounded-lg bg-[#c46a1a]/15 border border-[#c46a1a] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#c46a1a] animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[8px] text-[#c46a1a] tracking-[0.3em] font-sans font-bold uppercase block">
                INJECTING COGNITIVE FREQUENCY
              </span>
              <h2 className="text-xs font-extrabold tracking-widest text-white uppercase">
                RESOLVING SEGMENT WORLDLINES
              </h2>
            </div>

            {/* Asynchronous Loader Loading bar container */}
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-[#130f0a] border border-[#2e2418] rounded-full overflow-hidden p-[0.5px]">
                <div 
                  className="h-full bg-gradient-to-r from-[#c46a1a] to-[#e2933d] rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${assemblyProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[7px] text-[#8e806a] font-mono uppercase tracking-wider">
                <span>INDEXING LEY RESONATORS: {assemblyProgress}%</span>
                <span>STATUS: {assemblyProgress < 35 ? 'SYNAPSE_INIT' : assemblyProgress < 75 ? 'MESHING_GOLEMS' : 'COGNITIVE_LOCK_OK'}</span>
              </div>
            </div>

            <div className="bg-[#0b0907] border border-[#2e2418] p-3 rounded text-left space-y-1 max-h-[140px] overflow-hidden">
              <div className="flex justify-between items-center border-b border-[#2e2418]/60 pb-1 text-[6.5px] text-[#8e806a] uppercase">
                <span>SYSTEM PROCESS BOOT</span>
                <span>UTC RECORD</span>
              </div>
              <div className="text-[6.5px] text-slate-500 font-mono space-y-0.5 pt-1">
                <p className="text-slate-400">⬥ [0.00s] INITIALIZING AUDIO CONTEXT CHANNELS (OK)</p>
                {assemblyProgress >= 20 && <p className="text-slate-400">⬥ [0.24s] STREAMING TRAIN ROUTE RADAR FREQUENCIES (OK)</p>}
                {assemblyProgress >= 50 && <p className="text-[#c46a1a]">⬥ [0.55s] LINKING ANOMALOUS MEMORY LORE TO JANE'S GOLEM MFG (OK)</p>}
                {assemblyProgress >= 80 && <p className="text-emerald-500">⬥ [0.88s] DEPLOYING HIGH-FIDELITY CST SECTOR MODEL VIEWPORT (SUCCESS)</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Bounce Animation helper */}
      <style>{`
        @keyframes bounce-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-right {
          animation: bounce-right 1s infinite;
        }
      `}</style>
    </div>
  );
}
