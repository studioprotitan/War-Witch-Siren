import React, { useState, useEffect } from 'react';
import { X, Cpu, Layers, ShieldCheck, RefreshCw, AlertTriangle, ExternalLink, Flame, Check, Terminal, Play, Lock, Compass, Zap, Coins } from 'lucide-react';
import { MeshModel, WalletState } from '../types';
import { mintOracleToken } from '../services/web3Service';

export interface OracleIntel {
  oracleId: string;
  name: string;
  prompt: string;
  verticesCount: number;
}

interface MtdModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel: MeshModel | null;
  wallet: WalletState;
  onOpenWallet: () => void;
}

export default function ForgePilotMtdModal({
  isOpen,
  onClose,
  activeModel,
  wallet,
  onOpenWallet
}: MtdModalProps) {
  const [step, setStep] = useState<'idle' | 'preflight' | 'signing' | 'broadcasting' | 'complete'>('idle');
  const [mintProgress, setMintProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [ledgerHash, setLedgerHash] = useState<string | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [broadcastingStage, setBroadcastingStage] = useState(0);

  // Compliance state parameters (Rig & HUD Contracts)
  const [activeTab, setActiveTab] = useState<'compliance' | 'ledger'>('compliance');
  const [complianceInjected, setComplianceInjected] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionProgress, setInjectionProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Function to run the rigorous Forge Retargeter compliant injection sequence
  const runRetargeterInjection = () => {
    setIsInjecting(true);
    setInjectionProgress(5);
    setTerminalLogs([
      "🔋 [RIG-HUD] INITIALIZING DETERMINISTIC AVATAR RETARGETING ENGINE...",
      "🔍 [RIG-HUD] LOADING SYSTEM CONFIGS AND SCENE GRAPH SCHEMAS...",
    ]);

    const steps = [
      { p: 18, log: "⚠️ [WARN] RAW MESH ASSIGNMENTS NON-COMPLIANT: MISSING MANDATORY HEADERS PlayerRoot, MeshRoot..." },
      { p: 35, log: "🦴 [BONE] INJECTING CANONICAL 18-NODE MAP (root, hips, spine_01, spine_02, neck, head, upperarm_l...)" },
      { p: 52, log: "📐 [SCALE] ENFORCING GEOMETRY RULES: SCALE RE-SET TO 1.00x, HEIGHT CONST 1.80m, COORD FORWARD +Z" },
      { p: 70, log: "📺 [HUD] ATTACHING HUDRoot ON CANONICAL head NODE... OFFSET Vector3(0, 0.25, 0) INJECTED SUCCESS" },
      { p: 85, log: "🛡️ [HUD-SFX] SIGNAL GROUPS DEPLOYED: HealthBar3D, AbilitySignal, StatusEffects, AggressionWave..." },
      { p: 100, log: "✅ [SUCCESS] BONE ORIENTATIONS CALIBRATED AND SHIELDED. CONSOLIDATION HANDSHAKE COMPLETE!" }
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setInjectionProgress(s.p);
        setTerminalLogs(prev => [...prev, s.log]);
        if (s.p === 100) {
          setTimeout(() => {
            setIsInjecting(false);
            setComplianceInjected(true);
            setActiveTab('ledger'); // Automatically route to ledger tab on completion
          }, 600);
        }
      }, (idx + 1) * 350);
    });
  };

  // Advancing steps of dynamic asynchronous blockchain loading logs
  useEffect(() => {
    let interval: any;
    if (step === 'broadcasting') {
      setBroadcastingStage(0);
      interval = setInterval(() => {
        setBroadcastingStage((prev) => (prev < 4 ? prev + 1 : prev));
      }, 700);
    } else {
      setBroadcastingStage(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  // Derive OracleIntel object & extract oracleId
  const oracleIntel: OracleIntel | null = activeModel
    ? {
        oracleId: String(Math.abs(activeModel.id.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0)) % 900000 + 100000),
        name: activeModel.name,
        prompt: activeModel.prompt,
        verticesCount: activeModel.verticesCount,
      }
    : null;

  // Reset steps on open
  useEffect(() => {
    if (isOpen) {
      setStep('idle');
      setMintProgress(0);
      setStatusMessage('');
      setLedgerHash(null);
      setMintedTokenId(null);
      setActiveTab('compliance');
      setComplianceInjected(false);
      setIsInjecting(false);
      setInjectionProgress(0);
      setTerminalLogs([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartMintProcess = () => {
    if (!activeModel) return;
    if (!wallet.isConnected) {
      onOpenWallet();
      return;
    }

    setStep('preflight');
    setStatusMessage('Syncing contract ABI & Estimating Base Sepolia gas fees...');
    setMintProgress(15);

    setTimeout(() => {
      setStep('signing');
      setStatusMessage('Requested MetaMask wallet ECDSA signature sequence...');
      setMintProgress(45);
    }, 1800);
  };

  const handleConfirmSignature = async () => {
    if (!activeModel || !oracleIntel) return;
    setStep('broadcasting');
    setStatusMessage('Broadcasting transaction to Base Sepolia node 0x8be07421a4022a1008e0c331ddd24a0c451cfd1a...');
    setMintProgress(75);

    try {
      const userAddr = wallet.address || '0x0000000000000000000000000000000000000000';
      const result = await mintOracleToken(userAddr, oracleIntel.oracleId, 1);
      if (result.success && result.txHash) {
        setLedgerHash(result.txHash);
        setMintedTokenId(result.tokenId);
        setStep('complete');
        setMintProgress(100);
        setStatusMessage(result.message);
      } else {
        throw new Error(result.message || 'Signature execution rejected by remote RPC endpoint');
      }
    } catch (err: any) {
      console.error(err);
      setStep('idle');
      setStatusMessage(`Transaction Failed: ${err.message || 'Verification Error'}`);
      setMintProgress(0);
    }
  };

  return (
    <div id="forge-pilot-mtd-modal-workspace" className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl bg-[#0b0907] border border-[#2e2418] rounded-2xl shadow-[0_0_50px_rgba(196,106,26,0.35)] overflow-hidden flex flex-col relative">
        
        {/* HUD Frame borders */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#c46a1a]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#c46a1a]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#c46a1a]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#c46a1a]"></div>

        {/* Header bar */}
        <div className="bg-[#030201] px-5 py-4 flex items-center justify-between border-b border-[#2e2418]">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-[#c46a1a] animate-spin" />
            <h3 className="text-xs font-cinzel font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Tripo3D MTD Engine <span className="text-[7px] font-mono text-[#c46a1a] border border-[#c46a1a]/30 px-1.5 py-0.2 rounded bg-[#c46a1a]/5 animate-pulse">ERC-1155 Mint Connector</span>
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rig & HUD Contract Compliance Tabs */}
        {activeModel && (
          <div className="flex border-b border-[#2e2418]/60 bg-[#050403] px-3 font-mono text-[9px] relative z-10">
            <button
              onClick={() => setActiveTab('compliance')}
              className={`flex-1 py-3 text-center font-bold uppercase transition border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'compliance'
                  ? 'border-[#c46a1a] text-[#f08129]'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Cpu className="w-3 h-3 text-[#c46a1a]" />
              <span>Rig & HUD Compliance</span>
              {complianceInjected ? (
                <span className="text-[6.5px] bg-emerald-500/10 text-emerald-400 px-1 py-0.2 border border-emerald-500/20 rounded font-semibold uppercase font-mono">SECURED</span>
              ) : (
                <span className="text-[6.5px] bg-amber-500/15 text-amber-400 px-1 py-0.2 border border-amber-500/25 rounded font-semibold uppercase font-mono animate-pulse">PENDING CL-1.1</span>
              )}
            </button>
            <button
              onClick={() => {
                if (complianceInjected) {
                  setActiveTab('ledger');
                } else {
                  // Direct block or trigger nice alerts!
                  runRetargeterInjection();
                }
              }}
              className={`flex-1 py-3 text-center font-bold uppercase transition border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'ledger'
                  ? 'border-[#c46a1a] text-[#f08129]'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Web3 Ledger Mint</span>
              {step === 'complete' ? (
                <span className="text-[6.5px] bg-emerald-500/10 text-emerald-400 px-1 py-0.2 border border-emerald-500/20 rounded font-bold uppercase font-mono">ON-CHAIN</span>
              ) : (
                complianceInjected && <span className="text-[6.5px] bg-sky-500/10 text-sky-400 px-1 py-0.2 border border-sky-500/20 rounded font-mono uppercase font-semibold">READY</span>
              )}
            </button>
          </div>
        )}

        {/* Subtle, ultra-immersive Async Loading Screen Overlay */}
        {step === 'broadcasting' && activeModel && oracleIntel && (
          <div className="absolute top-[53px] bottom-0 left-0 right-0 z-40 bg-[#060503]/98 backdrop-blur-md flex flex-col justify-between p-6 text-xs font-mono animate-fade-in">
            {/* Visual Header / Sub-title */}
            <div className="flex justify-between items-center bg-[#130d07] px-3 py-2 border border-[#2e2418] rounded-lg">
              <span className="text-amber-500 font-bold flex items-center gap-1.5 uppercase text-[8.5px] tracking-widest">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                Ledger Syncing Protocol Active
              </span>
              <span className="text-slate-500 text-[8px] font-bold">BLOCK CONFIRMATION COOLDOWN</span>
            </div>

            {/* Core Rotating Transmutation Rings & Pilot Image */}
            <div className="flex flex-col items-center justify-center py-5 relative">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Spinning Rings */}
                <div className="absolute inset-0 border border-dashed border-[#c46a1a]/40 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 border border-sky-500/25 border-t-sky-400 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
                <div className="absolute inset-4 border border-[#c46a1a]/25 border-b-[#c46a1a] rounded-full animate-[spin_2s_linear_infinite]" />
                
                {/* Central Pilot image */}
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-[#c46a1a] shadow-[0_0_15px_rgba(196,106,26,0.65)] bg-black flex items-center justify-center">
                  <img
                    src={activeModel.sourceImageUrl}
                    alt={activeModel.name}
                    className="w-full h-full object-cover scale-105 animate-pulse"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="mt-3.5 text-center space-y-0.5">
                <span className="text-[10px] text-white font-bold tracking-widest uppercase font-cinzel">Syncing {activeModel.name}</span>
                <p className="text-[7.5px] text-slate-500 uppercase tracking-widest">TRANSTRAJECTORY ERC-1155 STRUCTURING</p>
              </div>
            </div>

            {/* Network Topology Visualizer */}
            <div className="flex items-center justify-center gap-1.5 py-1.5 font-mono text-[8.5px] text-[#8e806a] border-t border-b border-[#2e2418]/50 max-w-sm mx-auto w-full">
              <div className="flex flex-col items-center gap-0.5 bg-[#140f09]/40 px-1.5 py-1 rounded border border-[#211a12] w-24 text-center shrink-0">
                <Coins className="w-2.5 h-2.5 text-sky-400 animate-pulse mb-0.5" />
                <span className="text-slate-400 text-[7px]">Local Wallet</span>
                <span className="text-[6.5px] text-slate-500 truncate max-w-[65px]">{wallet.address ? `${wallet.address.slice(0, 5)}...` : '0x000...'}</span>
              </div>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-sky-400/50 to-[#c46a1a]/50 relative min-w-[15px]">
                <span className="absolute left-1/2 -top-0.5 w-1 h-1 bg-sky-400 rounded-full animate-ping" />
              </div>
              <div className="flex flex-col items-center gap-0.5 bg-[#140f09]/40 px-1.5 py-1 rounded border border-[#211a12] w-28 text-center shrink-0">
                <Layers className="w-2.5 h-2.5 text-[#c46a1a] animate-spin mb-0.5" style={{ animationDuration: '4s' }} />
                <span className="text-slate-400 text-[7px]">Base Sepolia Ingress</span>
                <span className="text-[6.5px] text-slate-500">ChainID 84532</span>
              </div>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-[#c46a1a]/50 to-emerald-400/50 relative min-w-[15px]">
                <span className="absolute left-1/2 -top-0.5 w-1 h-1 bg-[#c46a1a] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="flex flex-col items-center gap-0.5 bg-[#140f09]/40 px-1.5 py-1 rounded border border-[#211a12] w-24 text-center shrink-0">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 mb-0.5" />
                <span className="text-slate-400 text-[7px]">Contract Target</span>
                <span className="text-[6.5px] text-slate-500">0x8be...fd1a</span>
              </div>
            </div>

            {/* Stepper progress feed */}
            <div className="space-y-1.5 bg-[#030201] p-3 border border-[#211a12] rounded-lg">
              <div className="text-[7.5px] text-slate-500 flex justify-between font-bold border-b border-[#2e2418]/30 pb-0.5 mb-1">
                <span>CONSOLATION LOG FEED:</span>
                <span className="text-amber-500 flex items-center gap-1 animate-pulse">
                  <RefreshCw className="w-2 h-2 animate-spin" /> RUNNING SYNAPSE BIND
                </span>
              </div>
              
              <div className="space-y-1.5 font-mono text-[8px] leading-relaxed">
                <div className={`flex items-center gap-2 ${broadcastingStage >= 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  <span>{broadcastingStage > 0 ? '[✔]' : '[▶]'}</span>
                  <span className="truncate">Compile request params & generate cryptographic asset seed #{oracleIntel.oracleId}</span>
                </div>
                <div className={`flex items-center gap-2 ${broadcastingStage >= 1 ? 'text-emerald-400' : broadcastingStage === 0 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`}>
                  <span>{broadcastingStage > 1 ? '[✔]' : broadcastingStage === 0 ? '[▶]' : '[ ]'}</span>
                  <span className="truncate">Mempool estimation check: Gas calibration safe (12 GigaGwei)</span>
                </div>
                <div className={`flex items-center gap-2 ${broadcastingStage >= 2 ? 'text-emerald-400' : broadcastingStage === 1 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`}>
                  <span>{broadcastingStage > 2 ? '[✔]' : broadcastingStage === 1 ? '[▶]' : '[ ]'}</span>
                  <span className="truncate">Broadcasting block ledger transaction payload to EVM network</span>
                </div>
                <div className={`flex items-center gap-2 ${broadcastingStage >= 3 ? 'text-emerald-300' : broadcastingStage === 2 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`}>
                  <span>{broadcastingStage > 3 ? '[✔]' : broadcastingStage === 2 ? '[▶]' : '[ ]'}</span>
                  <span className="truncate">Awaiting validator consensus sequence confirmation receipt...</span>
                </div>
              </div>
              
              <div className="pt-1.5 flex justify-between items-center text-[7px] text-slate-500 border-t border-[#120f09] mt-1.5">
                <span>SEPOLIA NODE: rpc.base-sepolia.org</span>
                <span className="text-amber-500/80 animate-pulse">DO NOT SHUT DOWN SYSTEM OR CLOSE CONNECTOR</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal content body */}
        <div className="p-6 space-y-5">
          {!activeModel ? (
            <div className="text-center py-6 space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
              <h4 className="text-sm font-cinzel font-bold text-slate-300">NO RECONSTRUCTED PILOT ON DECK</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                You must process an anomalous memory into a 3D Mesh first using the Node Stone Furnace before deploying via the contract network.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-[#2e2418]/40 hover:bg-[#2e2418]/60 text-slate-300 font-mono text-xs border border-[#2e2418] transition cursor-pointer"
              >
                Close Systems
              </button>
            </div>
          ) : activeTab === 'compliance' ? (
            /* Compliance Inspector Sub-system */
            <div className="space-y-4 font-mono">
              {isInjecting ? (
                /* Terminal scanning visualization of Forge Retargeter active */
                <div className="space-y-4 py-4 animate-fade-in text-xs">
                  <div className="bg-[#050403] p-4 rounded-xl border border-[#2e2418] max-w-md mx-auto space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-[#2e2418]/60 pb-2">
                      <span className="text-amber-500 font-bold flex items-center gap-2 uppercase tracking-wider text-[9px]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> FORGE RETARGETER ACTIVE...
                      </span>
                      <span className="text-slate-500 text-[9px] font-bold">{injectionProgress}% SYSTEM STABILITY</span>
                    </div>
                    
                    {/* Retro terminal scroll */}
                    <div className="h-44 overflow-y-auto bg-black p-3 rounded border border-[#1a150f] space-y-1.5 text-[8.5px] leading-relaxed text-[#a89880] select-text">
                      {terminalLogs.map((log, lIdx) => (
                        <div key={lIdx} className="animate-fade-in font-mono">
                          {log}
                        </div>
                      ))}
                    </div>

                    <div className="w-full bg-[#130f0c] h-1.5 rounded-full overflow-hidden border border-[#2e2418]/50">
                      <div className="bg-gradient-to-r from-[#c46a1a] to-[#a67c2a] h-full rounded-full transition-all duration-300" style={{ width: `${injectionProgress}%` }} />
                    </div>
                  </div>
                </div>
              ) : complianceInjected ? (
                /* Compliant green state */
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-[#050403] p-4 rounded-xl border border-emerald-500/20 space-y-3.5 shadow-2xl">
                    <div className="flex items-center gap-3 border-b border-emerald-500/10 pb-2">
                      <ShieldCheck className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                      <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-sans">Moai CL-1.1 Handshake Sanctioned</h4>
                        <p className="text-[7.5px] text-slate-500 font-semibold uppercase tracking-wider">STATUS: CANONICAL RIG COMPLIANT (MODEL DETERMINISTICALLY SEALED)</p>
                      </div>
                    </div>

                    {/* Technical details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[8.5px] leading-relaxed">
                      {/* Left: Scheme */}
                      <div className="bg-[#0b0805] p-2.5 rounded border border-[#2e2418]/60 space-y-1">
                        <span className="text-amber-504 text-[8px] font-bold uppercase tracking-wider block border-b border-[#2e2418]/40 pb-1 mb-1">📦 CANONICAL SCENE GRAPH</span>
                        <div className="text-slate-400 space-y-0.5">
                          <p className="text-white font-bold">PlayerRoot (Physics Anchor)</p>
                          <p className="pl-2">└── MeshRoot (Render Geometry)</p>
                          <p className="pl-4">└── SkeletonRoot (18 Canonical Joint Stack)</p>
                          <p className="pl-6">└── head bone</p>
                          <p className="pl-8 text-cyan-400">└── HUDRoot (Head Attached Joint)</p>
                        </div>
                      </div>

                      {/* Right: Scale Check */}
                      <div className="bg-[#0b0805] p-2.5 rounded border border-[#2e2418]/60 space-y-1">
                        <span className="text-amber-504 text-[8px] font-bold uppercase tracking-wider block border-b border-[#2e2418]/40 pb-1 mb-1">📏 RIG & HUD TRANSFORM SPEC</span>
                        <div className="text-slate-400 space-y-1">
                          <div className="flex justify-between"><span>Normal Height:</span><span className="text-emerald-400 font-bold">1.80m [STABLE]</span></div>
                          <div className="flex justify-between"><span>Plane feet line:</span><span className="text-emerald-400">Y = 0.00m</span></div>
                          <div className="flex justify-between"><span>Billboard Offset:</span><span className="text-emerald-400">Y = 0.25m [HUDRoot]</span></div>
                          <div className="flex justify-between"><span>Visibility filter:</span><span className="text-cyan-400 font-mono">Dynamic Clamp (0.4-1.0)</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Bone list badges */}
                    <div className="p-2.5 bg-[#0b0805] rounded border border-[#2e2418]/60">
                      <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">18 BONEMAP REGISTERS INDUCTED SUCCESSFULLY:</span>
                      <div className="flex flex-wrap gap-1 bg-[#060403] p-2 rounded">
                        {['root', 'hips', 'spine_01', 'spine_02', 'neck', 'head', 'upperarm_l', 'lowerarm_l', 'hand_l', 'upperarm_r', 'lowerarm_r', 'hand_r'].map(bone => (
                          <span key={bone} className="text-[6px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase font-mono">
                            ⬥ {bone}
                          </span>
                        ))}
                        <span className="text-[6px] font-bold px-1.5 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded uppercase font-mono">+6 ANCHORS</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => setActiveTab('ledger')}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#c46a1a]/80 to-[#a67c2a]/80 hover:from-[#c46a1a] hover:to-[#a67c2a] text-white text-[10px] font-bold tracking-widest uppercase rounded border border-[#c46a1a]/50 shadow-[0_0_15px_rgba(196,106,26,0.25)] hover:shadow-[0_0_25px_rgba(196,106,26,0.5)] transition cursor-pointer"
                    >
                      🛡️ PROCEED TO BASE SECURE LEDGER MINT
                    </button>
                  </div>
                </div>
              ) : (
                /* Non-compliant alerts */
                <div className="space-y-4 animate-fade-in text-[9px] leading-relaxed">
                  <div className="bg-[#050403] p-4 rounded-xl border border-rose-500/25 space-y-3 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-rose-500/15 pb-2">
                      <AlertTriangle className="w-6 h-6 text-rose-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-pulse" />
                      <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-sans">Moai Contract CL-1.1 Integrity Deficit</h4>
                        <p className="text-[7.5px] text-[#ef4444] font-semibold uppercase tracking-wider">SKELETON & DIEGETIC HUD PATHWAYS ARE NOT ENFORCED</p>
                      </div>
                    </div>
                    
                    <p className="text-[#a69882] font-mono leading-relaxed">
                      To deploy {activeModel.name} on deck, your 3D Asset must undergo Retargeter alignment to consolidate dynamic skeleton joint hierarchies with the Head-Attached HUDRoot. Raw unaligned exports will bypass compiler logic.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-1 font-mono text-[8.5px]">
                      <div className="bg-[#0a0504] p-2 rounded border border-rose-900/40 text-rose-400 space-y-1">
                        <p className="font-bold flex items-center justify-between"><span> SKELETON JOINT TRACK</span> <span className="text-rose-500">❌ BLOCKED</span></p>
                        <p className="text-slate-500 text-[8px]">Currently utilizing loose uncompliant Mixamo bone map namespaces.</p>
                      </div>
                      <div className="bg-[#0a0504] p-2 rounded border border-rose-900/40 text-rose-400 space-y-1">
                        <p className="font-bold flex items-center justify-between"><span> 📺 DIEGETIC HUDRoot SEED</span> <span className="text-rose-500">❌ OFFLINE</span></p>
                        <p className="text-slate-500 text-[8px]">No head-attached widget container exists above the head vertex point.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-3.5 space-y-2">
                    <button
                      onClick={runRetargeterInjection}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#c46a1a] to-[#a67c2a] hover:from-[#e07a1f] hover:to-[#c4922e] text-white text-[9px] font-mono font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(196,106,26,0.3)] transition-all animate-pulse hover:animate-none cursor-pointer"
                    >
                      ⚡ RUN FORGE RETARGETER (INJECT RIG & HUD CONTRACTS)
                    </button>
                    <p className="text-[7.5px] text-slate-500 max-w-sm mx-auto leading-relaxed uppercase tracking-wider font-mono">
                      *This resolves scale constraints, binds the 18 bones map, and anchors HUDRoot to comply with Moai law.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Original Web3 Ledger Mint Sub-system */
            <div className="space-y-4">
              {/* Top overview layout: Model profile & Contract parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reconstructed avatar preview */}
                <div className="bg-[#030201] p-3 rounded-xl border border-[#211a12] flex flex-col items-center justify-center text-center relative">
                  <span className="text-[7.5px] font-mono text-slate-500 select-none uppercase tracking-widest absolute top-2.5 left-2.5">3D Model preview</span>
                  <img src={activeModel.sourceImageUrl} alt={activeModel.name} className="w-24 h-24 object-cover mt-2.5 rounded-lg border border-[#2e2418] shadow-md drop-shadow-[0_0_10px_rgba(196,106,26,0.15)]" />
                  <h4 className="text-xs text-white font-bold mt-2 font-sans tracking-wide">{activeModel.name}</h4>
                  <span className="text-[7px] text-[#c46a1a] font-mono mt-0.5 uppercase tracking-widest font-extrabold">{activeModel.verticesCount} vertices • {activeModel.facesCount} faces</span>
                </div>

                {/* Contract specs widget */}
                <div className="bg-[#030201] p-3.5 rounded-xl border border-[#211a12] space-y-2.5 text-xs">
                  <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Base Sepolia parameters</span>
                  <div className="space-y-1.5 font-mono text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contract:</span>
                      <span className="text-amber-500 truncate max-w-[120px]" title="0x8be07421a4022a1008e0c331ddd24a0c451cfd1a">0x8be...fd1a</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Oracle Seed ID:</span>
                      <span className="text-sky-400 font-bold">#{oracleIntel?.oracleId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contract Status:</span>
                      <span className="text-emerald-400 font-sans uppercase font-bold text-[8.5px]">Compliant Standard Certified</span>
                    </div>
                    <div className="flex justify-between text-[#00ff88]">
                      <span className="text-slate-500">Action Link:</span>
                      <span className="font-bold">mintToDeploy() [SECURED]</span>
                    </div>
                    <div className="flex justify-between border-t border-[#120d09] pt-1.5 mt-1">
                      <span className="text-slate-500">Network State:</span>
                      <span className="text-[#00ff88] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" /> Synchronized
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step progression interface */}
              <div className="bg-[#040302] rounded-xl border border-[#211a12] p-4 flex flex-col gap-3 min-h-[145px] justify-center relative overflow-hidden font-mono">
                <span className="text-[7.5px] font-mono text-slate-600 block uppercase tracking-widest absolute top-2.5 left-2.5 font-bold font-sans">Synapse telemetry log</span>
                
                {step === 'idle' && (
                  <div className="text-center py-4 space-y-2.5">
                    <Layers className="w-8 h-8 text-[#c46a1a] mx-auto animate-pulse" />
                    <p className="text-[10px] font-mono text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Confirm synchronization of verified compliant asset specs to the Base Sepolia block ledger. This locks {activeModel.name} as a persistent playable card.
                    </p>
                    <button
                      onClick={handleStartMintProcess}
                      className="px-6 py-2 bg-[#c46a1a]/15 hover:bg-[#c46a1a]/35 text-white text-[9.5px] font-mono font-bold tracking-widest uppercase rounded border border-[#c46a1a]/40 transition shadow-[0_0_8px_rgba(196,106,26,0.15)] cursor-pointer hover:shadow-[0_0_15px_rgba(196,106,26,0.3)]"
                    >
                      {wallet.isConnected ? "INITIATE COGNITIVE MINT FLOW" : "CONNECT WALLET MODULE"}
                    </button>
                  </div>
                )}

                {step !== 'idle' && (
                  <div className="space-y-3.5">
                    {/* Status feedback label */}
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-[#c46a1a] animate-spin shrink-0" />
                      <span className="text-[9.5px] font-mono text-slate-300 font-bold tracking-wide animate-pulse">{statusMessage}</span>
                    </div>

                    {/* Gauge meter bar */}
                    <div className="w-full bg-[#0d0b08] h-1.5 rounded-full overflow-hidden border border-[#2e2418]">
                      <div
                        className="bg-[#c46a1a] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#c46a1a]"
                        style={{ width: `${mintProgress}%` }}
                      />
                    </div>

                    {/* Interactive MetaMask Sign Dialogue */}
                    {step === 'signing' && (
                      <div className="p-3 bg-[#131008] rounded-lg border border-[#c46a1a]/30 space-y-2 text-[10px] font-mono flex flex-col animate-slide-in">
                        <div className="flex justify-between items-center pb-1 border-b border-[#2e2418]">
                          <span className="text-amber-500 font-bold flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-amber-500" /> Web3 Requesting Signature...
                          </span>
                          <span className="text-slate-500 uppercase font-bold text-[8px]">Base Sepolia Chain</span>
                        </div>
                        <p className="text-[9px] text-[#a89880] leading-relaxed">
                          Message: "Mint Genesis Veres pilot token linked to compliant Tripo3D asset {activeModel.id} under Moai scale regulations."
                        </p>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setStep('idle')}
                            className="bg-transparent text-slate-400 hover:text-white px-2.5 py-1 text-[9px] rounded font-bold cursor-pointer"
                          >
                            REJECT
                          </button>
                          <button
                            onClick={handleConfirmSignature}
                            className="bg-[#c46a1a] hover:bg-[#a67c2a] text-white px-3.5 py-1 text-[9px] rounded font-bold transition flex items-center gap-1 shadow-[0_0_6px_#c46a1a] cursor-pointer"
                          >
                            <ShieldCheck className="w-3 h-3 text-white" /> SIGN TRANSACTION
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mining complete block details */}
                    {step === 'complete' && (
                      <div className="p-3 bg-[#0a120e] rounded-lg border border-emerald-500/20 text-[9px] font-mono space-y-2 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 rounded-full bg-emerald-500/10 p-0.5" /> LEDGER BROADCAST SUCCESSFUL
                          </span>
                          <span className="text-slate-500 font-bold">100% Synced</span>
                        </div>
                        <div className="space-y-1 text-slate-400 leading-normal">
                          <p>
                            <span className="text-slate-500 font-semibold font-mono">TOKENS MINTED ID:</span>{' '}
                            <span className="text-[#00ff88] font-bold">#{mintedTokenId} (Compliant Model Stamp)</span>
                          </p>
                          <p className="truncate">
                            <span className="text-slate-500 font-semibold font-mono">TX HASH:</span>{' '}
                            <span className="text-slate-300 font-bold">{ledgerHash}</span>
                          </p>
                        </div>
                        <div className="flex justify-end pt-1">
                          <a
                             href={`https://sepolia.basescan.org/tx/${ledgerHash}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline text-[8.5px]"
                          >
                            VIEW ON SUITE ESCAN <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-5 py-4 bg-[#030201] border-t border-[#2e2418] flex justify-end gap-3.5 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 font-mono text-[10px] font-bold text-slate-500 hover:text-slate-300 bg-transparent transition cursor-pointer"
          >
            DISMISS CONNECTOR
          </button>
          {step === 'complete' && (
            <button
              onClick={onClose}
              className="px-4 py-2 font-mono text-[10px] font-bold bg-[#c46a1a]/15 text-white border border-[#c46a1a]/40 hover:bg-[#c46a1a]/25 rounded transition cursor-pointer"
            >
              FINALIZE SYSTEMS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
