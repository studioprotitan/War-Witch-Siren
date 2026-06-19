import React, { useState, useEffect } from 'react';
import { Image, Wand2, Sparkles, AlertTriangle, Cpu, Loader2, ArrowRight, ShieldAlert, Zap, Globe, Coins } from 'lucide-react';

interface CreatorProps {
  onImageGenerated: (url: string, prompt: string, material?: string, decryptedLore?: string) => void;
  isGenerating: boolean;
  generatedSessions: { url: string; prompt: string; createdAt: string }[];
  walletConnected: boolean;
  onOpenWallet: () => void;
  externalQuery?: string | null;
  onClearExternalQuery?: () => void;
}

export default function ImageCreationPanel({
  onImageGenerated,
  isGenerating: parentGenerating,
  generatedSessions,
  walletConnected,
  onOpenWallet,
  externalQuery,
  onClearExternalQuery
}: CreatorProps) {
  const [userQuery, setUserQuery] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
  // Pipeline local states
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [decryptedData, setDecryptedData] = useState<{
    decryptedLore: string;
    enhancedVisualPrompt: string;
    detectedMaterial: string;
  } | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Sync external selective prompts from carousel
  useEffect(() => {
    if (externalQuery) {
      setUserQuery(externalQuery);
      const matched = presets.find(p => p.trigger === externalQuery);
      if (matched) {
        setSelectedPreset(matched.name);
      } else {
        setSelectedPreset(null);
      }
      if (onClearExternalQuery) {
        onClearExternalQuery();
      }
    }
  }, [externalQuery]);

  const presets = [
    { name: 'Shade Vael — Wraith Commander', trigger: 'Shade Vael Ghostface Assassin Golem, Wraith Commander ERT Division, shadow strike strike' },
    { name: 'Nyxi Glitch — Siren Witch', trigger: 'Nyxi Glitch Siren Witch signal disruptor, blue gold costume and crown, crystal core' },
    { name: 'Kazenōbu — Tengu Golem', trigger: 'Kazenōbu Tengu Golem Warlord, Steamfitters masks, bronze wings, mechanical skeleton' },
    { name: 'Auremis — Yellow Crown Witch', trigger: 'Auremis the Yellow Crowned Witch of Corgemont, lightning crown broadcast' },
    { name: 'ORACLE-7 — AI Network', trigger: 'ORACLE-7 Astronomical AI crown headset, laser lenses, predictive holographic mapping' },
    { name: 'Mortex Gate — Corrupted Ash', trigger: 'Mortex Gate Corrupted Ash Stone, green skull wall active corruption' },
    { name: 'Sol Warden — Legendary Core', trigger: 'Sol Warden Legendary Core Stone, sun temple gold tribal carving radiant chibi' },
    { name: 'Thalvara — Tidal Dragon Armor', trigger: 'Thalvara Siren Tidal Dragon biomatrix battle armor, sea current cyan scales' }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setSelectedPreset(p.name);
    setUserQuery(p.trigger);
  };

  const handleFullPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setErrorText(null);
    setIsDecrypting(true);
    setDecryptedData(null);

    let finalPrompt = userQuery;
    let materialResult = 'metallic_copper';
    let loreResult = '';

    try {
      // 1. Stage I: Synaptic Decryption of Lore Cards Database
      const decryptResponse = await fetch('/api/decrypt-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userQuery }),
      });

      if (!decryptResponse.ok) {
        throw new Error('Synaptic decryptor handshake failed.');
      }

      const decrypted = await decryptResponse.json();
      setDecryptedData(decrypted);
      finalPrompt = decrypted.enhancedVisualPrompt;
      materialResult = decrypted.detectedMaterial;
      loreResult = decrypted.decryptedLore;

      setIsDecrypting(false);
      setIsImageGenerating(true);

      // 2. Stage II: Invoking Gemini Flash Image generator using decrypted prompt
      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, aspectRatio }),
      });

      if (!imageResponse.ok) {
        const errData = await imageResponse.json();
        throw new Error(errData.error || 'Cognitive image extraction failed.');
      }

      const imageData = await imageResponse.json();
      if (imageData.imageUrl) {
        onImageGenerated(imageData.imageUrl, userQuery, materialResult, loreResult);
      } else {
        throw new Error('Image matrix is empty across current channel.');
      }

    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Connecting with ORACLE-7 signal cluster timed out.');
    } finally {
      setIsDecrypting(false);
      setIsImageGenerating(false);
    }
  };

  const isWorking = isDecrypting || isImageGenerating || parentGenerating;

  return (
    <div id="image-creation-workspace" className="bg-[#0b0907] border border-[#2e2418] p-4 rounded-xl flex flex-col h-full select-none gap-3 relative overflow-hidden">
      
      {/* HUD Frame lines */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#c46a1a]/80"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#c46a1a]/80"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#c46a1a]/80"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#c46a1a]/80"></div>

      {/* Title block */}
      <div className="flex items-center justify-between pointer-events-none pb-1.5 border-b border-[#2e2418]">
        <div className="space-y-0.5">
          <span className="text-[8px] font-mono text-[#c46a1a] tracking-[0.25em] font-extrabold uppercase flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#c46a1a] animate-spin" /> SYNAPSE MATCH: STAGE I
          </span>
          <h3 className="text-xs font-cinzel font-bold text-white uppercase tracking-wider">Gemini Memory Decryptor</h3>
        </div>
        <Zap className="w-3.5 h-3.5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse" />
      </div>

      {/* Synaptic Terminal Input Form */}
      <form onSubmit={handleFullPipeline} className="space-y-2.5">
        <div className="space-y-1">
          <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">ANOMALOUS COGNITIVE TRIGGER SIGNAL</label>
          <div className="relative">
            <textarea
              value={userQuery}
              onChange={(e) => {
                setUserQuery(e.target.value);
                setSelectedPreset(null);
              }}
              placeholder="Query memory signature (e.g. Shade Vael walking in Coldstone Station)..."
              disabled={isWorking}
              rows={2}
              className="w-full text-[10px] font-mono bg-[#050403] text-[#e8dfcf] rounded-lg border border-[#2e2418] p-2 outline-none focus:border-[#c46a1a] focus:ring-1 focus:ring-[#c46a1a]/20 placeholder-slate-700 resize-none leading-normal transition-colors"
            />
            {selectedPreset && (
              <span className="absolute bottom-2 right-2 text-[8px] font-mono bg-[#c46a1a]/10 text-[#c46a1a] border border-[#c46a1a]/30 px-1 py-0.2 rounded font-bold uppercase">
                Preset Loaded: {selectedPreset.split(' ')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Configurations */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[7.5px] font-mono text-slate-500 uppercase block tracking-wider">Predictive Core Model</span>
            <div className="text-[9px] font-mono text-slate-300 bg-[#050403] px-2 py-1.5 rounded-md border border-[#211a12]">
              ⚡ Gemini 2.5 Flash
            </div>
          </div>
          <div>
            <span className="text-[7.5px] font-mono text-slate-500 uppercase block tracking-wider">Refract Proportion</span>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              disabled={isWorking}
              className="w-full text-[9px] font-mono bg-[#050403] text-slate-300 rounded-md border border-[#211a12] px-2 py-1.5 outline-none focus:border-[#c46a1a]/50 font-medium cursor-pointer"
            >
              <option value="1:1">1:1 Standard Core</option>
              <option value="3:4">3:4 Vertical Card</option>
              <option value="4:3">4:3 Astral Screen</option>
            </select>
          </div>
        </div>

        {/* Dual action state loader buttons */}
        <button
          type="submit"
          disabled={isWorking || !userQuery.trim()}
          className="w-full py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest transition-all bg-[#c46a1a]/20 hover:bg-[#c46a1a]/40 border border-[#c46a1a]/50 text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(196,106,26,0.1)] relative overflow-hidden group cursor-pointer"
        >
          {isDecrypting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c46a1a]" />
              <span className="text-[#c46a1a] uppercase text-[9px] tracking-widest font-extrabold animate-pulse">DECRYPTING LORE MATRICES...</span>
            </>
          ) : isImageGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span className="text-amber-500 uppercase text-[9px] tracking-widest font-extrabold animate-pulse">VECT-MINT COGNITIVE MATRIX...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5 text-amber-500" />
              <span>DECRYPT & RECONSTRUCT SIGNAL</span>
            </>
          )}
        </button>
      </form>

      {/* Troubleshooting report */}
      {errorText && (
        <div className="p-2.5 bg-red-950/45 border border-red-800/30 rounded-lg text-[9px] font-mono text-red-300 flex items-start gap-1.5 max-w-full overflow-hidden">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-500 animate-bounce" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Live AI Synaptic Log Terminal Feedback */}
      <div className="flex-1 min-h-[105px] border border-[#211a12] rounded-lg bg-[#040302] p-2 flex flex-col overflow-hidden relative">
        <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
          ⚙️ ORACLE-7 Synaptic Log Stream
        </span>
        
        {isWorking ? (
          <div className="flex-1 flex flex-col justify-center items-center font-mono text-[9px] text-[#c46a1a] p-2 gap-1.5">
            <span className="animate-pulse">=======================================</span>
            {isDecrypting && <span className="animate-bounce">⚡ [DECRYPT] SCANNING GENESIS VERES LORE CARD REGISTRY</span>}
            {isImageGenerating && <span className="animate-bounce animate-pulse">🎨 [EXTRACT] RECONSTRUCTING 3D TARGET TEXTURE REFERENCE</span>}
            <span className="text-[8px] text-slate-500">PLEASE WAIT FOR DUAL-STAGE AI ENGINE TRANSCRIPTION</span>
            <span className="animate-pulse">=======================================</span>
          </div>
        ) : decryptedData ? (
          <div className="flex-1 overflow-y-auto space-y-1.5 text-[9px] font-mono pr-1 text-slate-400">
            <div className="flex justify-between border-b border-[#211a12] pb-0.5">
              <span className="text-slate-500">DECRYPTED LORE KEY:</span>
              <span className="text-amber-500 font-bold tracking-wide uppercase">SUCCESS</span>
            </div>
            <p className="text-[#c8b898] leading-relaxed text-[8.5px] italic">
              {decryptedData.decryptedLore}
            </p>
            <div className="grid grid-cols-2 gap-1 text-[8px] pt-1">
              <div>
                <span className="text-slate-500">SHADING CASINGMENT:</span>
                <span className="text-white block font-bold uppercase">{decryptedData.detectedMaterial.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500">SYS AUTH STATUS:</span>
                <span className="text-[#00ff88] block font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" /> LORE ENGAGED
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-2 text-center">
            <Globe className="w-5 h-5 text-[#211a12] mb-1 animate-pulse" />
            <p className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Awaiting memory trigger sync...</p>
          </div>
        )}
      </div>

      {/* Preset selections */}
      <div className="space-y-1">
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">DECODING REGISTRY COGNITIVE SIGNATURES</span>
        <div className="grid grid-cols-2 gap-1 max-h-[85px] overflow-y-auto pr-1">
          {presets.map((p) => (
            <button
              type="button"
              key={p.name}
              onClick={() => handleApplyPreset(p)}
              disabled={isWorking}
              className={`text-[8.5px] font-mono text-left px-2 py-1.5 rounded border transition-all truncate cursor-pointer ${userQuery === p.trigger ? 'bg-[#c46a1a]/15 text-[#e18e3a] border-[#c46a1a]/50 font-bold' : 'bg-[#050403] text-slate-400 border-[#211a12] hover:border-slate-800'}`}
            >
              ⬥ {p.name.split(' — ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* State footer info */}
      <div className="pt-1.5 border-t border-[#2e2418] flex justify-between items-center z-10 text-[7.5px] font-mono">
        <span className="text-slate-500">MINT TERMINAL v0.4.1</span>
        {walletConnected ? (
          <span className="text-[#00ff88] flex items-center gap-1 font-bold uppercase">
            <span className="w-1 h-1 bg-[#00ff88] rounded-full" /> NODE SECURED
          </span>
        ) : (
          <span className="text-slate-600 uppercase">OFFLINE</span>
        )}
      </div>
    </div>
  );
}
