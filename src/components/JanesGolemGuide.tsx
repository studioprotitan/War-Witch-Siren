import React, { useState } from 'react';
import { Book, Shield, Cpu, Activity, Zap, Compass, Star, Wrench, Terminal, Scroll, AlertCircle } from 'lucide-react';

export default function JanesGolemGuide() {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive ABEX-GDEX Calculator states
  const [abexValue, setAbexValue] = useState<number>(65);
  const [gdexValue, setGdexValue] = useState<number>(75);

  const calculateThreatLevel = (abex: number, gdex: number) => {
    const score = (abex * 0.6) + (gdex * 0.4);
    if (score > 85) return { level: 'APOCALYPTIC', color: 'text-red-400 border-red-500/35 bg-red-500/10' };
    if (score > 70) return { level: 'CATASTROPHIC', color: 'text-purple-400 border-purple-500/35 bg-purple-500/10' };
    if (score > 50) return { level: 'SEVERE ANOMALY', color: 'text-amber-400 border-amber-500/35 bg-amber-500/10' };
    return { level: 'STABLE CORE', color: 'text-emerald-400 border-emerald-500/35 bg-emerald-500/10' };
  };

  const threat = calculateThreatLevel(abexValue, gdexValue);

  return (
    <div className="w-full h-full flex flex-col bg-[#05060a] text-[#e4d9ff] font-sans overflow-hidden">
      
      {/* Document Header */}
      <header className="p-5 border-b border-[#2b233c] bg-[#120f1c]/40 shrink-0 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#c9b3ff] text-[8.5px] font-mono tracking-[0.25em] uppercase font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#7b5cff]" />
              <span>CLASSIFIED HYBRID BRIEFING • HORROR ENGINE FACTORIES • JANE DISTRICT</span>
            </div>
            <h1 className="text-xl md:text-2xl font-sans tracking-wide text-[#f5e6ff] uppercase font-bold">
              Jane’s Golem Manufacturing Guide
            </h1>
            <p className="text-[11px] text-[#a89dc4] max-w-2xl leading-relaxed">
              This intelligence document merges hard engineering truth with mythic infrastructure, compiled for strategic partners, investors, and internal operatives embedded in the Jane District.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 h-fit">
            {['Horror Engine Factories', 'Golem Forge', 'ABEX–GDEX', 'Faction Hierarchy', 'Mint‑to‑Deploy'].map((tag) => (
              <span key={tag} className="text-[7.5px] font-mono tracking-wider font-bold uppercase px-2 py-0.5 rounded border border-[#4b3b6f] bg-[#151320] text-[#c9b3ff]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Column Split */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Interactive panel: Calculator & Navigator Index */}
        <aside className="hidden md:flex w-72 border-r border-[#2b233c] bg-[#07080f]/95 flex-col p-4 shrink-0 overflow-y-auto space-y-4 custom-scrollbar">
          
          {/* Document Section Filter */}
          <div className="space-y-2">
            <span className="text-[8.5px] font-mono font-bold tracking-widest text-[#7b5cff] uppercase block">GUIDE INDEX</span>
            <div className="space-y-1">
              {[
                { id: 'all', label: '📖 FULL CODEX' },
                { id: 'canon', label: '1. CANONICAL POSITION' },
                { id: 'horror', label: '2. HORROR INTEGRATION' },
                { id: 'classes', label: '3. GOLEM CLASSES' },
                { id: 'abex', label: '4. ABEX–GDEX SYSTEM' },
                { id: 'weapons', label: 'A. WEAPONS DIVISION' },
                { id: 'logistics', label: 'B. LOGISTICS PIPELINE' },
                { id: 'protocol', label: 'E. CST‑ERT PROTOCOL' }
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full font-mono text-[9px] text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between font-bold ${
                    activeSection === sec.id
                      ? 'bg-[#7b5cff]/15 border-[#7b5cff] text-white shadow-[0_0_8px_rgba(123,92,255,0.15)]'
                      : 'bg-[#151320]/40 border-transparent text-[#a89dc4] hover:bg-[#151320] hover:text-[#f5e6ff]'
                  }`}
                >
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Calculator widget */}
          <div className="border border-[#3a304f] bg-[#120f1c]/50 rounded-xl p-3.5 space-y-3.5">
            <div className="flex items-center gap-1.5 text-[8.5px] font-mono font-bold text-[#f5e6ff] tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>COGNITIVE WEIGHTING</span>
            </div>
            
            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-mono font-bold">
                  <span className="text-slate-400">ABEX (ABYSSAL RISKS)</span>
                  <span className="text-[#c9b3ff]">{abexValue}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={abexValue}
                  onChange={(e) => setAbexValue(Number(e.target.value))}
                  className="w-full accent-[#7b5cff] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-mono font-bold">
                  <span className="text-slate-400">GDEX (DIFF INDEX)</span>
                  <span className="text-[#c9b3ff]">{gdexValue}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={gdexValue}
                  onChange={(e) => setGdexValue(Number(e.target.value))}
                  className="w-full accent-[#7b5cff] cursor-pointer"
                />
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border flex flex-col gap-0.5 items-center justify-center text-center transition-all ${threat.color}`}>
              <span className="text-[7px] tracking-[0.15em] font-mono font-bold uppercase opacity-80">STABILIZED ESCALATION:</span>
              <span className="text-[10px] font-mono font-extrabold tracking-widest">{threat.level}</span>
            </div>
          </div>
        </aside>

        {/* Right main panel: Scrollable actual documentation pages */}
        <main className="flex-1 bg-[#05060a] p-6 lg:p-8 overflow-y-auto space-y-12 custom-scrollbar">
          
          {/* Mobile Navigator Index Filter bar */}
          <div className="md:hidden bg-[#120f1c] p-2.5 rounded-lg border border-[#3a304f] mb-4">
            <label className="text-[8px] font-mono font-bold tracking-wider text-[#c9b3ff] block mb-1">SELECT VIEWING SECTION:</label>
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full p-1.5 bg-[#05060a] border border-[#4b3b6f] rounded text-[#e4d9ff] font-mono text-[9px] outline-none"
            >
              <option value="all">📖 Full Codex Manual</option>
              <option value="canon">1. Canonical Position</option>
              <option value="horror">2. Horror Engine Factories Integration</option>
              <option value="classes">3. Confirmed Golem Classes</option>
              <option value="abex">4. ABEX–GDEX Weighing System</option>
              <option value="weapons">A. Weapons Division & Upgrades</option>
              <option value="logistics">B. Logistics & Mint-to-Deploy</option>
              <option value="protocol">E. Step-by-Step Golem Creation</option>
            </select>
          </div>

          {/* 1. CANONICAL POSITION */}
          {(activeSection === 'all' || activeSection === 'canon') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#7b5cff] font-mono font-bold">SECTION 1.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">Canonical Position of the Guide</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-4 text-xs text-[#d9cfff] leading-relaxed">
                  <p><strong>Role in the universe:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Backbone reference for the Horror Engine Factories and Jane District industrial mythos.</li>
                    <li>Defines how Golems are conceived, manufactured, stabilized, and deployed into live conflict theatres.</li>
                    <li>Anchors the <strong>ABEX–GDEX</strong> weighting system for rarity, threat, and manufacturing difficulty.</li>
                    <li>Provides investor‑grade clarity on pipelines, risk surfaces, and expansion vectors.</li>
                  </ul>
                  <p><strong>Audience:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Strategic partners and investors evaluating Golem‑based product lines.</li>
                    <li>Internal operatives, factory overseers, and pipeline engineers.</li>
                    <li>Lore custodians responsible for keeping mythic consistency across media.</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 bg-[#120f1c]/30 border-l-4 border-[#7b5cff] px-4 py-3 rounded-r-lg space-y-1">
                  <span className="text-[8px] font-mono font-bold text-[#c9b3ff] tracking-wide block">OPERATING ASSUMPTION</span>
                  <p className="text-[10.5px] italic text-[#d9cfff] leading-normal font-sans">
                    Every Golem is both a financial instrument and a mythic weapon. Manufacturing decisions affect balance sheets, battlefields, and narrative canon simultaneously.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 2. HORROR ENGINE FACTORIES INTEGRATION */}
          {(activeSection === 'all' || activeSection === 'horror') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#7b5cff] font-mono font-bold">SECTION 2.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">Horror Engine Factories Integration</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                <div className="bg-[#151320] p-4 rounded-xl border border-[#3a304f]/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white tracking-wide">
                    <Cpu className="w-4 h-4 text-[#7b5cff]" />
                    <span>2.1 Golem Forge Viewer</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    The Golem Forge is the interactive viewer and control surface where new Golems and Avatar Cards are conceived, parameterized, and pushed into the <strong>Mint‑to‑Deploy</strong> pipeline powered by <strong>Tripo3D</strong>.
                  </p>
                  <ul className="text-[9.5px] text-[#d9cfff] space-y-0.5 mt-2 font-mono">
                    <li>• <span className="text-[#a89dc4]">Forge Inputs:</span> silhouettes, faction tokens, targets</li>
                    <li>• <span className="text-[#a89dc4]">Forge Outputs:</span> 3D assets, rig files, manifests</li>
                    <li>• <span className="text-[#a89dc4]">Rendering:</span> Tripo3D image-to-3D engine</li>
                  </ul>
                </div>

                <div className="bg-[#151320] p-4 rounded-xl border border-[#3a304f]/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white tracking-wide">
                    <Wrench className="w-4 h-4 text-[#7b5cff]" />
                    <span>2.2 Jane’s Real‑Time Guide</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    Embedded in the Forge UI is Jane’s real‑time guide: a contextual overlay that walks operators through each manufacturing phase, from alloy selection to ritual imprinting.
                  </p>
                  <ul className="text-[9.5px] text-[#d9cfff] space-y-0.5 mt-2 font-mono">
                    <li>• Alloy Forging & Siren composites</li>
                    <li>• Chitin Hybridization binding</li>
                    <li>• Power Core Stabilization & imprinting</li>
                  </ul>
                </div>

                <div className="bg-[#151320] p-4 rounded-xl border border-[#3a304f]/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white tracking-wide">
                    <Compass className="w-4 h-4 text-[#7b5cff]" />
                    <span>2.3 Multiplayer Hooks</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    The Guide is wired into <strong>Crypto‑Card‑Clash‑Multiplayer</strong> and open‑world wishlist systems, allowing manufactured Golems to appear as wildcards, boss units, or escort assets in live sessions.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 3. GOLEM CLASSES IN ECOSYSTEM */}
          {(activeSection === 'all' || activeSection === 'classes') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#7b5cff] font-mono font-bold">SECTION 3.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">Confirmed Golem Classes in the Ecosystem</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#120f1c]/45 p-4 rounded-xl border border-[#2b233c] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-bold text-white uppercase tracking-wide">3.1 Siege‑Class Female Heavy Escort Golem</span>
                    <span className="text-[7.5px] px-2 py-0.5 bg-red-950/40 text-red-400 border border-red-900 rounded font-mono">BULLWARK SILHOUETTE</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    Derived from the <strong>Sanctum Bulwark</strong> silhouette, this Golem is a cathedral‑armored escort designed to shield convoys, command nodes, and ritual sites.
                  </p>
                  <p className="text-[10.5px] text-[#d9cfff]"><strong className="text-[#c9b3ff]">Focus:</strong> Layered armor lattices, halo‑array calibration, energy shield resonance tuning.</p>
                </div>

                <div className="bg-[#120f1c]/45 p-4 rounded-xl border border-[#2b233c] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-bold text-white uppercase tracking-wide">3.2 Jousting Golem Mount</span>
                    <span className="text-[7.5px] px-2 py-0.5 bg-purple-950/40 text-[#c9b3ff] border border-[#4b3b6f] rounded font-mono">RAIL RUNNER MOTOR</span>
                  </div>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    An Abyssum‑authentic mount combining relic‑forged alloy with Siren chitin, influenced by CST Rail‑Runner transit‑military aesthetics. Built as a quadruped or hexapod with magnetic hooves.
                  </p>
                </div>

                <div className="bg-[#120f1c]/45 p-4 rounded-xl border border-[#2b233c] space-y-2">
                  <span className="text-[11px] font-sans font-bold text-white uppercase tracking-wide block">3.3 Heavy Escort Vehicle (CTS)</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    A CTS‑pattern armored vehicle built to transport the Heavy Escort Golem and its support crew. Low-profile silhouette, convoy command layout, integrated modular docking cradle.
                  </p>
                </div>

                <div className="bg-[#120f1c]/45 p-4 rounded-xl border border-[#2b233c] space-y-2">
                  <span className="text-[11px] font-sans font-bold text-white uppercase tracking-wide block">3.4 Flatbed Transport for Large Golems</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-relaxed">
                    A warehouse‑gloom flatbed designed for oversized Golems, already staged for FX and Tripo3D rigging under dim industrial lighting structures.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 4. ABEX–GDEX SYSTEM */}
          {(activeSection === 'all' || activeSection === 'abex') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#7b5cff] font-mono font-bold">SECTION 4.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider">ABEX–GDEX Weighting System</h2>
              </div>
              <p className="text-xs text-[#d9cfff] leading-relaxed font-sans max-w-4xl">
                The <strong>ABEX–GDEX</strong> system serves as the quantitative spine of the design guide, assigning core mathematical numeric weights to every Golem class and manufacturing decision.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                  <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">ABEX ELEMENT</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-normal font-sans">
                    Abyssal Exposure measures deep horror density, bio-relic volatility, and timeline contamination risk.
                  </p>
                </div>
                <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                  <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">GDEX DIFFICULTY</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-normal font-sans">
                    Golem Difficulty Index checks total engineering complexity, raw resource expenditure, and reactor heat cycles.
                  </p>
                </div>
                <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                  <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">METRIC INPUTS</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-normal font-sans">
                    Feeds on market stats, active furnace telemetry, battlefield logs, and faction constraints.
                  </p>
                </div>
                <div className="p-3 bg-[#151320] rounded-xl border border-[#2b233c] space-y-1">
                  <span className="text-[8px] font-mono text-[#c9b3ff] tracking-widest block uppercase font-bold">OUTPUTS RESULT</span>
                  <p className="text-[10.5px] text-[#a89dc4] leading-normal font-sans">
                    Updates hierarchy status, algorithmic rarity tier codes, token price bands, and battlefield authorization.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* A. WEAPONS DIVISION */}
          {(activeSection === 'all' || activeSection === 'weapons') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#7b5cff] font-mono font-bold">SECTION A.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider font-bold">Weapons Division & Golem Manufacturing</h2>
              </div>

              <div className="space-y-4 text-xs text-[#d9cfff] leading-relaxed">
                <div>
                  <h3 className="text-[11px] font-sans font-bold text-[#f5e6ff] uppercase tracking-wider mb-1">A.1 Mandate & Scope</h3>
                  <p className="text-[#a89dc4]">
                    The Weapons Division handles loadouts, chassis armature customization, relic augmentation, and all absolute safety containments built around volatile central energy cores.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#120f1c]/25 rounded-xl border border-[#3a304f]/60 space-y-2">
                    <h4 className="font-bold text-white text-[10px] uppercase">A.2 Weaponized Golem Variants</h4>
                    <ul className="space-y-1.5 text-[10px] text-[#a89dc4]">
                      <li>
                        <strong className="text-white">Siege-Class "Cathedral Lance":</strong> Adds forward‑projected kinetic lances and glowing energy halo-beam lines.
                      </li>
                      <li>
                        <strong className="text-white">Jousting Mount "Rail-Joust":</strong> Integrates dynamic chassis kinetic rigs, spine lance triggers, and impact-dampening harnesses.
                      </li>
                      <li>
                        <strong className="text-white">CTS Vehicle "Convoy Bastion":</strong> Mounts multi-directional turreted hardpoints, field shield generators, and target synchronizers.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-[#120f1c]/25 rounded-xl border border-[#3a304f]/60 space-y-2">
                    <h4 className="font-bold text-white text-[10px] uppercase">A.3 Modular Armatures & Lineage</h4>
                    <p className="text-[10px] text-[#a89dc4]">
                      Weapon systems dock through circular armature rings around the spine and hips.
                    </p>
                    <p className="text-[10px] text-[#a89dc4]">
                      <strong>Power Core Lineages</strong> are split strictly between <em>Relic Cores</em> (highly volatile), <em>Transit Cores</em> (CST efficient generators), and <em>Siren Cores</em> (organic, whisper‑reactive chitin links).
                    </p>
                  </div>
                </div>

                <div className="bg-[#151320] border border-[#4b3b6f]/30 p-4 rounded-xl space-y-2">
                  <h3 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">A.5 Hybrid Doctrine, CST Design & Safety</h3>
                  <p className="text-[10.5px] text-[#a89dc4]">
                    The Weapons Division stabilizes designs using the Cinematic Systems Transit (CST) visual vocabulary. Standardizing hazard striping, yellow line indicators, and magnetic rail couplers prevents accidental activation of volatile Relic cores.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center text-[9px] font-mono uppercase mt-2">
                    <div className="p-1 border border-[#3a304f] rounded">CONTAINMENT RINGS REQUIRED</div>
                    <div className="p-1 border border-[#3a304f] rounded">FAIL-SAFE RUNES INSCRIPTED</div>
                    <div className="p-1 border border-[#3a304f] rounded">ABEX EXPOSURE CAPS INSTALLED</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* B. NEXT CHAPTER: LOGISTICS */}
          {(activeSection === 'all' || activeSection === 'logistics') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#7b5cff] font-mono font-bold">SECTION B.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider font-bold">Logistics & Mint‑to‑Deploy (Tripo3D)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#120f1c]/30 p-4 border border-[#2b233c] rounded-xl space-y-1.5">
                  <span className="text-[8.5px] font-mono text-[#c9b3ff] tracking-[0.2em] font-bold block uppercase">B.1 PIPELINE STEPS</span>
                  <ol className="text-[10px] text-[#a89dc4] list-decimal pl-4.5 space-y-1">
                    <li>Concept Silhouette drafting</li>
                    <li>Tripo3D Prototype generation</li>
                    <li>Symmetry & rigging validation</li>
                    <li>Lore & cognitive template binding</li>
                  </ol>
                </div>
                <div className="bg-[#120f1c]/30 p-4 border border-[#2b233c] rounded-xl space-y-1.5">
                  <span className="text-[8.5px] font-mono text-[#c9b3ff] tracking-[0.2em] font-bold block uppercase">B.2 MINT-TO-DEPLOY CONTRACTS</span>
                  <p className="text-[10px] text-[#a89dc4] leading-relaxed">
                    Mtd smart contracts encapsulate ownership keys, dynamic stat upgrades, and live theater operational clearances.
                  </p>
                </div>
                <div className="bg-[#120f1c]/30 p-4 border border-[#2b233c] rounded-xl space-y-1.5">
                  <span className="text-[8.5px] font-mono text-[#c9b3ff] tracking-[0.2em] font-bold block uppercase">B.3 TELEMETRY FEEDBACK</span>
                  <p className="text-[10px] text-[#a89dc4] leading-relaxed">
                    Actual factory fabrication rates feed back into ABEX levels, automatically compensating values for the next blueprint generation run.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* E. STEP-BY-STEP GOLEM CREATION PROTOCOL */}
          {(activeSection === 'all' || activeSection === 'protocol') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3a304f] pb-1.5">
                <span className="text-xs text-[#7b5cff] font-mono font-bold">SECTION E.0</span>
                <h2 className="text-sm font-sans font-extrabold text-[#f5e6ff] uppercase tracking-wider font-bold">Step‑by‑Step Golem Creation Protocol (CST‑ERT Train Escort)</h2>
              </div>
              <div className="bg-[#151320] border-l-4 border-[#7b5cff] p-4 rounded-r-xl space-y-2">
                <p className="text-xs text-[#d9cfff] font-sans leading-relaxed">
                  Below is the verified, sequential, multi-stage protocol optimized for the core <strong>CST-ERT rail system combat escort</strong>:
                </p>
                <div className="space-y-2 mt-4 font-mono text-[9.5px]">
                  {[
                    { s: '1', title: 'Define Escort Doctrine & ABEX–GDEX Balance Band targets for the localized route segment.' },
                    { s: '2', title: 'Draft CST-ERT Silhouette utilizing train hazard striping and coupling adapters.' },
                    { s: '3', title: 'Feed prompt tokens to Tripo3D modeler to render initial mesh geometries.' },
                    { s: '4', title: 'Forge structural core frame, texturing organic Siren composites on top.' },
                    { s: '5', title: 'Anchor Transit-lineage Power Core calibrating dynamic surge output capacity.' },
                    { s: '6', title: 'Equip track-sweeper lances and lateral energy shields along the armature arrays.' },
                    { s: '7', title: 'Run high-order behavioral imprinting to lock route coordinates and priorities.' },
                    { s: '8', title: 'Trigger stability test cycles in simulated bad weather / EMP environments.' },
                    { s: '9', title: 'Seal the factory fabrication log, sign the Mint-to-Deploy lease, and dispatch.' }
                  ].map((step) => (
                    <div key={step.s} className="flex gap-2 items-start text-[#a89dc4] hover:text-[#e4d9ff] transition-all">
                      <span className="text-[#7b5cff] font-extrabold border border-[#7b5cff]/30 bg-[#7b5cff]/10 rounded w-4.5 h-4.5 flex items-center justify-center text-[8.5px] scale-95 shrink-0">{step.s}</span>
                      <span className="leading-tight pt-0.5">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
