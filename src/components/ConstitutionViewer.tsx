import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, ShieldCheck, Cpu, Layers, Globe, 
  Coins, Activity, FileText, Calculator, ChevronRight, 
  Fingerprint, Check, AlertTriangle, Scale, Lock, RefreshCw
} from 'lucide-react';

interface ConstitutionViewerProps {
  onClose?: () => void;
}

export default function ConstitutionViewer({ onClose }: ConstitutionViewerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'triarchy' | 'pipeline' | 'provenance' | 'abex' | 'wealthspring' | 'moai'>('all');
  
  // Moai Scale Calculator State
  const [minCoords, setMinCoords] = useState({ x: -2.0, y: -1.5, z: -3.0 });
  const [maxCoords, setMaxCoords] = useState({ x: 2.0, y: 1.5, z: 3.0 });
  const [calcResult, setCalcResult] = useState(() => calculateMoaiBounds(-2.0, 2.0, -1.5, 1.5, -3.0, 3.0));

  function calculateMoaiBounds(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number) {
    const spanX = (maxX - minX) * 1.5;
    const spanY = (maxY - minY) * 1.5;
    const spanZ = (maxZ - minZ) * 1.5;
    const volume = spanX * spanY * spanZ;
    return {
      spanX: spanX.toFixed(3),
      spanY: spanY.toFixed(3),
      spanZ: spanZ.toFixed(3),
      volume: volume.toFixed(3)
    };
  }

  const handleRecalculate = () => {
    const res = calculateMoaiBounds(
      minCoords.x, maxCoords.x,
      minCoords.y, maxCoords.y,
      minCoords.z, maxCoords.z
    );
    setCalcResult(res);
  };

  const handleRandomizeCoords = () => {
    const minX = parseFloat((Math.random() * -5 - 0.5).toFixed(1));
    const maxX = parseFloat((Math.random() * 5 + 0.5).toFixed(1));
    const minY = parseFloat((Math.random() * -5 - 0.5).toFixed(1));
    const maxY = parseFloat((Math.random() * 5 + 0.5).toFixed(1));
    const minZ = parseFloat((Math.random() * -5 - 0.5).toFixed(1));
    const maxZ = parseFloat((Math.random() * 5 + 0.5).toFixed(1));

    setMinCoords({ x: minX, y: minY, z: minZ });
    setMaxCoords({ x: maxX, y: maxY, z: maxZ });
    setCalcResult(calculateMoaiBounds(minX, maxX, minY, maxY, minZ, maxZ));
  };

  return (
    <div id="constitution-viewer-panel" className="flex-1 flex flex-col bg-[#0b0907] border border-[#2e2418] rounded-xl overflow-hidden h-full">
      {/* Header Panel */}
      <div className="bg-[#050403] px-5 py-3.5 border-b border-[#2e2418] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#c46a1a]/10 border border-[#c46a1a]/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#c46a1a] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-white tracking-[0.2em] uppercase font-sans">
                GENESIS VERSE CONSTITUTION
              </h2>
              <span className="text-[6.5px] font-sans font-extrabold bg-[#1a140f] text-[#c46a1a] border border-[#c46a1a]/30 px-1.5 py-0.5 rounded tracking-widest uppercase">
                PHASE 14 COMPLIANT
              </span>
            </div>
            <p className="text-[8px] text-[#8e806a] uppercase font-mono tracking-wider mt-0.5">
              SEC-CODE: CON-1.0-STYX • SUPREME GOVERNANCE DOCTRINE
            </p>
          </div>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white font-mono text-[9px] px-2 py-1 rounded border border-transparent hover:border-[#2e2418] bg-zinc-950/40 hover:bg-zinc-900/60 transition cursor-pointer"
          >
            ✕ CLOSE VIEWER
          </button>
        )}
      </div>

      {/* Sub-navigation Tabs */}
      <div className="bg-[#080604] border-b border-[#2e2418] px-5 py-1.5 flex items-center gap-2 overflow-x-auto shrink-0 select-none custom-scrollbar">
        <span className="text-slate-500 text-[7px] font-bold uppercase tracking-widest mr-2">ARTICLES:</span>
        {[
          { id: 'all', label: 'FULL TEXT', icon: BookOpen },
          { id: 'triarchy', label: 'I. TRIARCHY', icon: Layers },
          { id: 'pipeline', label: 'II. PIPELINE', icon: ChevronRight },
          { id: 'provenance', label: 'III. PROVENANCE', icon: Fingerprint },
          { id: 'abex', label: 'IV. ABEX-GDEX', icon: Coins },
          { id: 'wealthspring', label: 'V. WEALTHSPRING', icon: Activity },
          { id: 'moai', label: 'VI. MOAI CL-1.1', icon: Calculator }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-2.5 py-1 rounded text-[7.5px] font-mono font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-1 cursor-pointer shrink-0 border ${
                isSelected 
                  ? 'bg-[#c46a1a]/15 text-white border-[#c46a1a]/50 shadow-[0_0_8px_rgba(196,106,26,0.1)]' 
                  : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:border-[#2e2418]'
              }`}
            >
              <Icon className={`w-3 h-3 ${isSelected ? 'text-[#c46a1a]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Constitution Body - Dynamic Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#060403] space-y-5 text-slate-300 select-text leading-relaxed text-[10px]">
        
        {/* Preamble section - Always visible at top of "all" tab or individually */}
        {(activeSubTab === 'all' || activeSubTab === 'triarchy') && (
          <div className="p-4 bg-[#0a0705] border border-[#2e2418] rounded-lg space-y-2.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-[0.025] pointer-events-none select-none">
              <ShieldCheck className="w-24 h-24 text-[#c46a1a]" />
            </div>
            
            <div className="flex items-center gap-2 text-[#c46a1a]">
              <span className="text-[9px] font-bold tracking-[0.2em] font-sans">⬡ PREAMBLE</span>
              <span className="h-[1px] flex-grow bg-gradient-to-r from-[#c46a1a]/40 to-transparent" />
            </div>
            <p className="font-sans text-[9px] italic text-[#a89880] leading-relaxed">
              &ldquo;This Constitution establishes the supreme, immutable governance model of the <strong className="text-white">Genesis Verse operating platform</strong>. It codifies the separation of powers, the roles of core structural subsystems, and the authoritative guidelines for procedural generation, data integrity, and player-facing economic interaction.&rdquo;
            </p>
            <p className="font-sans text-[8.5px] text-slate-400">
              All future development modules, expansions (including the Jane District, Kingman Island, and outer networks), and human/AI collaborator workflows are bound to this Constitution. No single expansion or feature layer owns the platform services; instead, they consume and conform to the contracts established herein.
            </p>
          </div>
        )}

        {/* Tab-driven Content Switcher */}
        <AnimatePresence mode="wait">
          {activeSubTab === 'triarchy' && renderTriarchySection()}
          {activeSubTab === 'pipeline' && renderPipelineSection()}
          {activeSubTab === 'provenance' && renderProvenanceSection()}
          {activeSubTab === 'abex' && renderAbexSection()}
          {activeSubTab === 'wealthspring' && renderWealthSpringSection()}
          {activeSubTab === 'moai' && renderMoaiSection()}
          {activeSubTab === 'all' && (
            <div className="space-y-6">
              {renderTriarchySection()}
              {renderPipelineSection()}
              {renderProvenanceSection()}
              {renderAbexSection()}
              {renderWealthSpringSection()}
              {renderMoaiSection()}
              {renderAmendmentsSection()}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer System Status Signature */}
      <div className="bg-[#040302] border-t border-[#2e2418] px-5 py-2.5 flex items-center justify-between text-[7px] font-mono shrink-0 select-none">
        <span className="text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          GOVERNANCE PLATFORM INTEGRITY: SECURE
        </span>
        <span className="text-[#c46a1a] font-extrabold tracking-wider">
          SOVEREIGN DIRECTIVE ESTABLISHED • VERIFIED BY CLAUDE SSOT
        </span>
      </div>
    </div>
  );

  // 1. ARTICLE I: THE TRI-ARCHITECTURAL DIVISION
  function renderTriarchySection() {
    return (
      <motion.section 
        key="triarchy-sec"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-white">
          <Layers className="w-4 h-4 text-[#c46a1a]" />
          <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono">
            ARTICLE I: THE TRI-ARCHITECTURAL DIVISION
          </h3>
          <span className="h-[1px] flex-grow bg-[#2e2418]" />
        </div>

        <p className="text-[8.5px] text-slate-400">
          The Genesis Verse operates on a strict <strong className="text-white">Tri-Architectural Division</strong> of responsibilities. To prevent authority bleed, resource corruption, and structural drift, the core services are divided into three isolated subsystems with absolute sovereignty over their respective domains.
        </p>

        {/* Tri-architectural Interactive Flow Diagram */}
        <div className="bg-[#040302] border border-[#2e2418] rounded-lg p-4 flex flex-col items-center justify-center space-y-4 relative overflow-hidden select-none">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c46a1a]/40 to-transparent" />
          
          <div className="border border-[#c46a1a]/60 bg-[#16110b] px-3 py-1 rounded text-center text-[#c46a1a] font-bold text-[8px] font-mono tracking-widest shadow-[0_0_10px_rgba(196,106,26,0.15)]">
            👑 THE CONSTITUTION
          </div>

          <div className="w-[1px] h-3 bg-[#2e2418]" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-lg">
            {/* Oracle */}
            <div className="border border-cyan-500/20 bg-cyan-950/5 rounded-lg p-2.5 flex flex-col items-center text-center space-y-1">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-[8.5px] font-bold text-white uppercase font-mono">🧠 THE ORACLE</span>
              <span className="text-[6.5px] text-cyan-400/80 font-mono tracking-widest leading-none">SEMANTIC NERVOUS SYSTEM</span>
              <span className="h-[1px] w-8 bg-cyan-500/20 my-1" />
              <p className="text-[6.5px] text-slate-400 leading-normal">
                Taxonomy, formulas, historical lore & spatial metadata cataloging. Strictly passive.
              </p>
            </div>

            {/* Sentinel */}
            <div className="border border-[#c46a1a]/20 bg-[#c46a1a]/2 rounded-lg p-2.5 flex flex-col items-center text-center space-y-1 relative">
              <div className="absolute -top-1.5 right-2 px-1 bg-[#c46a1a] text-black font-mono text-[4.5px] rounded font-black">SSOT</div>
              <ShieldCheck className="w-4 h-4 text-[#c46a1a] animate-pulse" />
              <span className="text-[8.5px] font-bold text-white uppercase font-mono">🛡️ SENTINEL</span>
              <span className="text-[6.5px] text-amber-500 font-mono tracking-widest leading-none">GOVERNANCE ENGINE</span>
              <span className="h-[1px] w-8 bg-[#c46a1a]/20 my-1" />
              <p className="text-[6.5px] text-slate-400 leading-normal">
                Integrity authentication, anti-cheat surveillance, wallet bindings, transaction verification.
              </p>
            </div>

            {/* WGE */}
            <div className="border border-emerald-500/20 bg-emerald-950/5 rounded-lg p-2.5 flex flex-col items-center text-center space-y-1">
              <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[8.5px] font-bold text-white uppercase font-mono">🌍 THE WGE</span>
              <span className="text-[6.5px] text-emerald-400/80 font-mono tracking-widest leading-none">WORLD SYNTHESIZER</span>
              <span className="h-[1px] w-8 bg-emerald-500/20 my-1" />
              <p className="text-[6.5px] text-slate-400 leading-normal">
                Procedural layout generation, terrain/chunk streaming, geometry, and layline routing.
              </p>
            </div>
          </div>

          <div className="w-full max-w-xs h-[1px] bg-[#2e2418]" />
          <div className="text-[6px] font-mono text-slate-500 tracking-wider">
            CONTRACT LAYER INTEGRATING THE GAMEPLAY ENGINE
          </div>
        </div>

        {/* Detail points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-[#080605] border border-[#1e1913] rounded-lg">
            <span className="text-cyan-400 font-mono font-extrabold text-[7.5px] block tracking-wider mb-1">🧠 ORACLE BOUNDARIES:</span>
            <ul className="list-disc pl-3 text-[7.5px] text-slate-400 space-y-1">
              <li>Owns metadata definitions, catalog schemas (<code className="text-cyan-300 font-mono">MI_</code>, <code className="text-cyan-300 font-mono">TEX_</code>, <code className="text-cyan-300 font-mono">GEO_</code>), and lore boundaries.</li>
              <li><strong className="text-rose-400 uppercase">Prohibition:</strong> Passive only; must never modify active character state vectors or execute transaction ledgers.</li>
            </ul>
          </div>

          <div className="p-3 bg-[#080605] border border-[#1e1913] rounded-lg">
            <span className="text-[#c46a1a] font-mono font-extrabold text-[7.5px] block tracking-wider mb-1">🛡️ SENTINEL BOUNDARIES:</span>
            <ul className="list-disc pl-3 text-[7.5px] text-slate-400 space-y-1">
              <li>Owns anti-cheat systems, cryptographic signatures, wallet pairings, and Operator trust indexes.</li>
              <li><strong className="text-rose-400 uppercase">Prohibition:</strong> Must never invent lore, modify materials, or generate procedural terrain grids.</li>
            </ul>
          </div>

          <div className="p-3 bg-[#080605] border border-[#1e1913] rounded-lg">
            <span className="text-emerald-400 font-mono font-extrabold text-[7.5px] block tracking-wider mb-1">🌍 WGE BOUNDARIES:</span>
            <ul className="list-disc pl-3 text-[7.5px] text-slate-400 space-y-1">
              <li>Owns geometric deformation, layline routing, chunk generation, and terrain synthesizer states.</li>
              <li><strong className="text-rose-400 uppercase">Prohibition:</strong> Must never invent independent lore, persist finance records, or bypass Sentinel verification checks.</li>
            </ul>
          </div>
        </div>
      </motion.section>
    );
  }

  // 2. ARTICLE II: THE CANONICAL PIPELINE
  function renderPipelineSection() {
    const pipelineSteps = [
      { num: '01', title: 'Concept', desc: 'Parametric specs defined' },
      { num: '02', title: 'Forge Network', desc: 'Queued for manufacturing' },
      { num: '03', title: 'Mfg', desc: 'Oracle formulas composited' },
      { num: '04', title: 'MTD Print', desc: 'Passport file printed' },
      { num: '05', title: 'Card Captor', desc: 'Persistent Registry' },
      { num: '06', title: 'Sentinel Val', desc: 'Signatures verified' },
      { num: '07', title: 'Listing', desc: 'ABEX-GDEX Trading' },
    ];

    return (
      <motion.section 
        key="pipeline-sec"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-white">
          <ChevronRight className="w-4 h-4 text-[#c46a1a]" />
          <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono">
            ARTICLE II: THE CANONICAL PIPELINE
          </h3>
          <span className="h-[1px] flex-grow bg-[#2e2418]" />
        </div>

        <p className="text-[8.5px] text-slate-400">
          No manufactured asset, Golem, modification, or tactical card may bypass the immutable production pipeline. Every asset is subject to continuous validation.
        </p>

        {/* Formula display */}
        <div className="bg-[#030201] border border-[#2e2418] rounded p-2.5 font-mono text-center text-[#c46a1a] text-[8px] tracking-wide select-none">
          <code>
            Concept ⟶ Forge Network ⟶ Manufacturing ⟶ MTD Generation ⟶ Card Captor Registration ⟶ Sentinel Validation ⟶ ABEX–GDEX Listing
          </code>
        </div>

        {/* Flow Visualizer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="bg-[#070503] border border-[#1e1812] rounded p-2 text-center flex flex-col justify-between h-20 select-none relative group hover:border-[#c46a1a]/45 transition">
              <div className="flex justify-between items-center">
                <span className="text-[5.5px] font-mono text-slate-600 font-black">{step.num}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[7.5px] font-mono font-bold text-white block truncate uppercase">{step.title}</span>
                <span className="text-[5.5px] text-slate-500 block leading-tight">{step.desc}</span>
              </div>
              <div className="absolute -inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#c46a1a]/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </motion.section>
    );
  }

  // 3. ARTICLE III: CARD CAPTOR & MTD PROVENANCE
  function renderProvenanceSection() {
    return (
      <motion.section 
        key="provenance-sec"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-white">
          <Fingerprint className="w-4 h-4 text-[#c46a1a]" />
          <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono">
            ARTICLE III: CARD CAPTOR & MTD PROVENANCE
          </h3>
          <span className="h-[1px] flex-grow bg-[#2e2418]" />
        </div>

        <p className="text-[8.5px] text-slate-400">
          The core of operator identity and asset trace-security relies on the continuous logging of MTD contracts inside the Card Captor Registry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Captor Registry Card */}
          <div className="bg-[#070503] border border-[#2e2418] rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-500 border-b border-[#2e2418] pb-1.5">
              <Fingerprint className="w-4 h-4" />
              <span className="text-[8px] font-mono font-black uppercase tracking-wider">3.1 THE CARD CAPTOR REGISTRY</span>
            </div>
            <p className="text-[7.5px] text-slate-400">
              The Card Captor is the supreme Operator Registry. Every card represents a persistent operator record, tracking:
            </p>
            <div className="space-y-1 text-[7.5px] font-mono text-slate-400">
              <div className="flex items-center gap-2 bg-[#0d0a07] px-2 py-1 rounded">
                <span className="text-[#c46a1a] font-bold">⬡</span>
                <span>Pilot Identity &amp; Active Clearance Level</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0d0a07] px-2 py-1 rounded">
                <span className="text-[#c46a1a] font-bold">⬡</span>
                <span>Bound Wallet Addresses &amp; Equipment Rosters</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0d0a07] px-2 py-1 rounded">
                <span className="text-[#c46a1a] font-bold">⬡</span>
                <span>Registered Vehicles, Drones, &amp; Custom Golems</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0d0a07] px-2 py-1 rounded">
                <span className="text-[#c46a1a] font-bold">⬡</span>
                <span>Trace Packet diagnostic linkage &amp; Sentinel trust ratings</span>
              </div>
            </div>
          </div>

          {/* MTD v2 Passport */}
          <div className="bg-[#070503] border border-[#2e2418] rounded-lg p-3.5 space-y-2.5 relative">
            <div className="flex items-center gap-2 text-cyan-400 border-b border-[#2e2418] pb-1.5">
              <FileText className="w-4 h-4" />
              <span className="text-[8px] font-mono font-black uppercase tracking-wider">3.2 THE MTD V2 SPECIFICATION</span>
            </div>
            <p className="text-[7.5px] text-slate-400">
              Every fabricated asset is accompanied by an immutable Manufacturing Transfer Document (MTD) v2 passport containing:
            </p>
            <div className="space-y-1.5 text-[7.5px] font-mono">
              <div className="flex justify-between bg-[#040302] border border-[#231b12] px-2 py-1.5 rounded text-[7px]">
                <span className="text-slate-500">FORGE ASSET ID:</span>
                <span className="text-white font-bold">GRID_ASSET_0x9B42...1E4F</span>
              </div>
              <div className="flex justify-between bg-[#040302] border border-[#231b12] px-2 py-1.5 rounded text-[7px]">
                <span className="text-slate-500">ORIGIN:</span>
                <span className="text-white font-bold">SLAG BASIN COREG_MFG-4 • T-2026</span>
              </div>
              <div className="flex justify-between bg-[#040302] border border-[#231b12] px-2 py-1.5 rounded text-[7px]">
                <span className="text-slate-500">MATERIAL SIGNATURES:</span>
                <span className="text-[#c46a1a] font-bold">MI_METALLIC_COPPER • TEX_GLITCH</span>
              </div>
              <div className="flex justify-between bg-[#040302] border border-[#231b12] px-2 py-1.5 rounded text-[7px]">
                <span className="text-slate-500">CRYPTOGRAPHIC SIGN:</span>
                <span className="text-emerald-400 font-bold">SENTINEL_APPROVED_0xFA...924C</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  // 4. ARTICLE IV: ABEX-GDEX MARKET ACCESS
  function renderAbexSection() {
    return (
      <motion.section 
        key="abex-sec"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-white">
          <Coins className="w-4 h-4 text-[#c46a1a]" />
          <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono">
            ARTICLE IV: ABEX–GDEX MARKET ACCESS
          </h3>
          <span className="h-[1px] flex-grow bg-[#2e2418]" />
        </div>

        <p className="text-[8.5px] text-slate-400">
          To secure the in-game economy from market manipulation, spoofing, and wash trading, the <strong className="text-white">ABEX–GDEX Systems</strong> are not open environments.
        </p>

        <div className="p-4 bg-[#140e0a] border border-amber-600/30 rounded-lg space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-[0.03] text-amber-500 pointer-events-none select-none">
            <Lock className="w-16 h-16" />
          </div>

          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[8px] font-mono font-black uppercase tracking-wider">THE BANKER CONSTRAINT GATING ACTION</span>
          </div>

          <p className="text-[7.5px] text-slate-300 leading-relaxed font-sans">
            Access to listing, market-making, liquidity pools, and complex banking operations is strictly locked. Access is exclusively granted to operators who have earned the specialized certification: <strong className="text-white uppercase">MTD Ash Construct: ABEX Banker</strong>. This prevents raw capital from hijacking platform stability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[7px] font-mono pt-1">
            <div className="bg-[#080604] p-2 rounded border border-[#2e2418]">
              <span className="text-amber-500 block font-bold mb-0.5">1. TUTORIAL ASSESSMENTS</span>
              <span className="text-slate-400">Must pass high-fidelity compliance assessments simulating severe systemic crises.</span>
            </div>
            <div className="bg-[#080604] p-2 rounded border border-[#2e2418]">
              <span className="text-amber-500 block font-bold mb-0.5">2. TRUST SURVEILLANCE</span>
              <span className="text-slate-400">Sentinel maintains a live index of account velocity, trades patterns, and listing metrics.</span>
            </div>
            <div className="bg-[#080604] p-2 rounded border border-[#2e2418]">
              <span className="text-amber-500 block font-bold mb-0.5">3. FRAUD DETECTION</span>
              <span className="text-slate-400">Duplicate MTD logs, rapid ownership loops, and replay signature drafts are automatically isolated.</span>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  // 5. ARTICLE V: WEALTHSPRING INTELLIGENCE PROTOCOL
  function renderWealthSpringSection() {
    return (
      <motion.section 
        key="wealthspring-sec"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-white">
          <Activity className="w-4 h-4 text-[#c46a1a]" />
          <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono">
            ARTICLE V: WEALTHSPRING INTELLIGENCE PROTOCOL
          </h3>
          <span className="h-[1px] flex-grow bg-[#2e2418]" />
        </div>

        <p className="text-[8.5px] text-slate-400">
          The WealthSpring subsystem operates as an <strong className="text-white">independent financial intelligence service</strong> and exclusive studio IP. It has been completely isolated from the gameplay progression and player economy loops.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[7.5px] font-mono">
          <div className="border border-[#2e2418] bg-[#050403] rounded-lg p-3 text-center space-y-1">
            <span className="text-white block font-bold uppercase">📊 ZERO ECONOMIC INTERFERENCE</span>
            <span className="text-slate-500 text-[7px] block">ISOLATED PROGRESSION</span>
            <p className="text-slate-400 leading-normal text-[7px] pt-1.5">
              WealthSpring has zero authority over token mints, player crafting, drop tables, or item distribution.
            </p>
          </div>

          <div className="border border-cyan-500/25 bg-[#050403] rounded-lg p-3 text-center space-y-1">
            <span className="text-cyan-400 block font-bold uppercase">📡 TELEMETRY INTERFACE</span>
            <span className="text-slate-500 text-[7px] block">READ-ONLY TELEMETRY</span>
            <p className="text-slate-400 leading-normal text-[7px] pt-1.5">
              Acts as an observation sentinel feeding real-time indexes of coin velocities, transaction volumes, and systemic anomalies.
            </p>
          </div>

          <div className="border border-[#c46a1a]/25 bg-[#050403] rounded-lg p-3 text-center space-y-1">
            <span className="text-amber-500 block font-bold uppercase">🛡️ SENTINEL INTEGRATION</span>
            <span className="text-slate-500 text-[7px] block">GOVERNANCE PARALLEL</span>
            <p className="text-slate-400 leading-normal text-[7px] pt-1.5">
              Feeds telemetry signals straight into Sentinel Command, empowering automated locks on malicious actors or wash traders.
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  // 6. ARTICLE VI: PHYSICAL MEASUREMENT STANDARD (MOAI CL-1.1 COMPLIANCE)
  function renderMoaiSection() {
    return (
      <motion.section 
        key="moai-sec"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-white">
          <Calculator className="w-4 h-4 text-[#c46a1a]" />
          <h3 className="text-[10px] font-bold tracking-widest uppercase font-mono">
            ARTICLE VI: PHYSICAL MEASUREMENT STANDARD (MOAI CL-1.1 COMPLIANCE)
          </h3>
          <span className="h-[1px] flex-grow bg-[#2e2418]" />
        </div>

        <p className="text-[8.5px] text-slate-400">
          All spatial structures, procedural meshes, and boundary wireframes rendered in the Three-Dimensional Viewer or instantiated by the WGE must conform to the <strong className="text-white">Moai CL-1.1 physical guidelines</strong> to prevent cross-view topological tearing.
        </p>

        {/* Math & Interactive Calculator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Formula specs */}
          <div className="bg-[#050403] border border-[#2e2418] rounded-lg p-4 space-y-3 font-mono">
            <div className="text-amber-500 font-bold text-[8px] uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              <span>THE SCALE EQUATIONS</span>
            </div>
            
            <p className="text-[7.5px] text-slate-400 font-sans leading-relaxed">
              Real-world physics metrics require projecting standard grid coordinates using a <strong className="text-white">1.5x scale coefficient</strong>. This maintains architectural safety.
            </p>

            <div className="bg-black/40 border border-[#231b12] p-2 rounded text-[7.5px] text-slate-300 space-y-1.5 select-none">
              <div className="flex justify-between">
                <span>Span X:</span>
                <span className="text-cyan-400 font-bold">Span_X = (X_max - X_min) * 1.5</span>
              </div>
              <div className="flex justify-between">
                <span>Span Y:</span>
                <span className="text-cyan-400 font-bold">Span_Y = (Y_max - Y_min) * 1.5</span>
              </div>
              <div className="flex justify-between">
                <span>Span Z:</span>
                <span className="text-cyan-400 font-bold">Span_Z = (Z_max - Z_min) * 1.5</span>
              </div>
              <div className="h-[1px] bg-[#231b12] my-1" />
              <div className="flex justify-between">
                <span>Total Volume:</span>
                <span className="text-amber-500 font-bold">Volume = Span_X * Span_Y * Span_Z</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator */}
          <div className="bg-[#050403] border border-[#2e2418] rounded-lg p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[#00fffa] font-bold text-[8px] uppercase tracking-wider flex items-center gap-1.5 font-mono mb-1.5">
                <Calculator className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>MOAI CL-1.1 GRID COORDINATE SCALE CONVERTER</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 font-mono">
                  <span className="text-[6.5px] text-slate-500 block">X COORDS (MIN / MAX)</span>
                  <div className="flex gap-1 items-center">
                    <input 
                      type="number" 
                      value={minCoords.x} 
                      step="0.1" 
                      onChange={(e) => setMinCoords(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))} 
                      className="w-1/2 bg-black border border-[#2e2418] p-1 text-[7.5px] text-white text-center rounded focus:outline-none focus:border-[#c46a1a]" 
                    />
                    <input 
                      type="number" 
                      value={maxCoords.x} 
                      step="0.1" 
                      onChange={(e) => setMaxCoords(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))} 
                      className="w-1/2 bg-black border border-[#2e2418] p-1 text-[7.5px] text-white text-center rounded focus:outline-none focus:border-[#c46a1a]" 
                    />
                  </div>
                </div>

                <div className="space-y-1 font-mono">
                  <span className="text-[6.5px] text-slate-500 block">Y COORDS (MIN / MAX)</span>
                  <div className="flex gap-1 items-center">
                    <input 
                      type="number" 
                      value={minCoords.y} 
                      step="0.1" 
                      onChange={(e) => setMinCoords(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))} 
                      className="w-1/2 bg-black border border-[#2e2418] p-1 text-[7.5px] text-white text-center rounded focus:outline-none focus:border-[#c46a1a]" 
                    />
                    <input 
                      type="number" 
                      value={maxCoords.y} 
                      step="0.1" 
                      onChange={(e) => setMaxCoords(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))} 
                      className="w-1/2 bg-black border border-[#2e2418] p-1 text-[7.5px] text-white text-center rounded focus:outline-none focus:border-[#c46a1a]" 
                    />
                  </div>
                </div>

                <div className="space-y-1 font-mono">
                  <span className="text-[6.5px] text-slate-500 block">Z COORDS (MIN / MAX)</span>
                  <div className="flex gap-1 items-center">
                    <input 
                      type="number" 
                      value={minCoords.z} 
                      step="0.1" 
                      onChange={(e) => setMinCoords(prev => ({ ...prev, z: parseFloat(e.target.value) || 0 }))} 
                      className="w-1/2 bg-black border border-[#2e2418] p-1 text-[7.5px] text-white text-center rounded focus:outline-none focus:border-[#c46a1a]" 
                    />
                    <input 
                      type="number" 
                      value={maxCoords.z} 
                      step="0.1" 
                      onChange={(e) => setMaxCoords(prev => ({ ...prev, z: parseFloat(e.target.value) || 0 }))} 
                      className="w-1/2 bg-black border border-[#2e2418] p-1 text-[7.5px] text-white text-center rounded focus:outline-none focus:border-[#c46a1a]" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Render calculations */}
            <div className="flex justify-between gap-1 pt-1 font-mono">
              <div className="bg-black/30 p-1.5 border border-[#1e1812] text-center rounded flex-1">
                <span className="text-[5.5px] text-slate-500 block uppercase">REAL SPAN X</span>
                <span className="text-[8.5px] text-white font-bold">{calcResult.spanX} m</span>
              </div>
              <div className="bg-black/30 p-1.5 border border-[#1e1812] text-center rounded flex-1">
                <span className="text-[5.5px] text-slate-500 block uppercase">REAL SPAN Y</span>
                <span className="text-[8.5px] text-white font-bold">{calcResult.spanY} m</span>
              </div>
              <div className="bg-black/30 p-1.5 border border-[#1e1812] text-center rounded flex-1">
                <span className="text-[5.5px] text-slate-500 block uppercase">REAL SPAN Z</span>
                <span className="text-[8.5px] text-white font-bold">{calcResult.spanZ} m</span>
              </div>
              <div className="bg-amber-600/10 p-1.5 border border-amber-600/30 text-center rounded flex-1.5">
                <span className="text-[5.5px] text-[#c46a1a] block font-bold uppercase">PHYSICAL VOLUME</span>
                <span className="text-[8.5px] text-[#00ff88] font-bold">{calcResult.volume} m³</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRecalculate}
                className="flex-1 py-1 px-2 text-[7px] font-bold font-mono bg-amber-600 hover:bg-amber-500 text-black rounded transition cursor-pointer select-none"
              >
                CALCULATE SCALE
              </button>
              <button
                onClick={handleRandomizeCoords}
                className="p-1 border border-[#2e2418] hover:bg-[#1a140f] rounded transition cursor-pointer"
                title="Randomize coordinates"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

        </div>
      </motion.section>
    );
  }

  // 7. AMENDMENT PROTOCOLS
  function renderAmendmentsSection() {
    return (
      <motion.section 
        key="amendments-sec"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-3 pt-3 border-t border-[#1e1812]"
      >
        <div className="flex items-center gap-2 text-[#8e806a]">
          <BookOpen className="w-4 h-4 text-[#8e806a]" />
          <h3 className="text-[9px] font-bold tracking-widest uppercase font-mono">
            📜 AMENDMENT PROTOCOLS
          </h3>
          <span className="h-[1px] flex-grow bg-[#1e1812]" />
        </div>

        <p className="text-[7.5px] text-slate-400 font-mono leading-relaxed italic pl-2 border-l border-amber-600/30">
          This Constitution can only be modified through explicit directives issued through the Moai Bridge under the direct authorization of the <strong className="text-white">Visual &amp; Canon Commander (studioprotitan/atonyscott)</strong>. No automated subsystem, subagent, or independent compiler may patch, modify, or deprecate these articles without reconciling against the supreme Single Source of Truth (SSOT).
        </p>
      </motion.section>
    );
  }
}
