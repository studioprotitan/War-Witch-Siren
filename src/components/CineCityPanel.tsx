import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Film, 
  Sliders, 
  Video, 
  Eye, 
  RefreshCw, 
  Compass, 
  Tv, 
  Sparkles, 
  Play, 
  Square, 
  Maximize2, 
  Volume2, 
  Download, 
  Layers,
  ChevronRight,
  User,
  Activity,
  Radio
} from 'lucide-react';

interface CinematicScene {
  id: string;
  title: string;
  operative: string;
  duration: string;
  fps: number;
  grade: string;
  aspectRatio: string;
  location: string;
  description: string;
  imgUrl: string;
}

export default function CineCityPanel() {
  const [selectedScene, setSelectedScene] = useState<string>('scene-1');
  const [activeCamera, setActiveCamera] = useState<string>('drone-tracking');
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [colorGrade, setColorGrade] = useState<string>('geothermal-amber');
  const [focalLength, setFocalLength] = useState<number>(35);
  const [exposure, setExposure] = useState<number>(0.8);
  const [shutterSpeed, setShutterSpeed] = useState<string>('1/48s');
  const [noiseIntensity, setNoiseIntensity] = useState<number>(15);
  const [hudCoordinates, setHudCoordinates] = useState({ lat: '35.6895° N', lon: '139.6917° E', alt: '1,540m' });
  const [activeFidelity, setActiveFidelity] = useState<'HD' | 'UHD' | '8K'>('UHD');
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-clear toast helper
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Simulated coordinate fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      const offsetLat = (Math.random() - 0.5) * 0.001;
      const offsetLon = (Math.random() - 0.5) * 0.001;
      const parsedLat = 35.6895 + offsetLat;
      const parsedLon = 139.6917 + offsetLon;
      
      setHudCoordinates({
        lat: `${parsedLat.toFixed(4)}° N`,
        lon: `${parsedLon.toFixed(4)}° E`,
        alt: `${(1540 + Math.floor((Math.random() - 0.5) * 10)).toLocaleString()}m`
      });

      if (isRecording) {
        setPlaybackTime(prev => (prev >= 100 ? 0 : prev + 1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  const scenes: CinematicScene[] = [
    {
      id: 'scene-1',
      title: 'Kazenobu: Steamfitter\'s Blade',
      operative: 'OPERATIVE KAZENÖBU',
      duration: '45.2s',
      fps: 60,
      grade: 'Cyberpunk Neon',
      aspectRatio: '2.39:1 Anamorphic',
      location: 'SECTOR-B CHASM FLUID RESERVES',
      description: 'Tactical analysis of thermite forged katana swings under heavy ash and layout steam filters.',
      imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'scene-2',
      title: 'Nyxi Glitch: Siren Witch Dance',
      operative: 'OPERATIVE NYXI GLITCH',
      duration: '32.1s',
      fps: 50,
      grade: 'Leyline Emerald',
      aspectRatio: '16:9 Cinema Wide',
      location: 'CENOTE SACRUM DECANTED CORES',
      description: 'Chronoscopic recordings of multi-spatial frequency emission. Bio-matter alignment matches.',
      imgUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'scene-3',
      title: 'Auremis: Solar Core Sentinel',
      operative: 'OPERATIVE AUREMIS',
      duration: '58.0s',
      fps: 24,
      grade: 'Amber Fallback',
      aspectRatio: '2.40:1 Ultra-Wide',
      location: 'SOLAR CROWN CORONA CAPTURE',
      description: 'Extreme thermal inspection of the Yellow Crowned Witness. Heavy magnetic ripple distortion.',
      imgUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'scene-4',
      title: 'Oracle-7: Astro AI Sieve',
      operative: 'OPERATIVE ORACLE-7',
      duration: '22.4s',
      fps: 120,
      grade: 'Monochrome Infrared',
      aspectRatio: '1.85:1 Flat',
      location: 'COGNITIVE CLOUD NET RECEPTACLE',
      description: 'Digital packet transformation rendering inside synthetic brain cavity arrays with zero trace.',
      imgUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const currentScene = scenes.find(s => s.id === selectedScene) || scenes[0];

  return (
    <div className="flex-1 bg-[#040302] border border-[#2e2418] text-slate-300 flex flex-col h-[calc(100vh-140px)] overflow-hidden font-mono text-xs select-none">
      
      {/* Upper Status Banner */}
      <div className="bg-[#0c0906] border-b border-[#2e2418] px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Film className="w-4.5 h-4.5 text-[#c46a1a] drop-shadow-[0_0_6px_#c46a1a]" />
          <div>
            <h1 className="text-[10px] font-black text-white uppercase tracking-wider">
              CINE CITY — CINEMATIC WORKSPACE
            </h1>
            <p className="text-[7.5px] text-slate-500 font-sans tracking-wide leading-none mt-0.5">
              IN-VERSE SENSOR SEQUENCER & ACTIVE CAMERA RIG CODES
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-[#171109] border border-[#a67c2a]/30 px-2.5 py-0.5 rounded text-[8px]">
            <Radio className={`w-3 h-3 ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
            <span className="font-bold text-slate-400">STATUS:</span>
            <span className={isRecording ? 'text-red-400 font-black' : 'text-slate-500'}>
              {isRecording ? 'REC FEED LIVE' : 'FEED PAUSED'}
            </span>
          </div>

          <div className="flex bg-[#070503] border border-[#1f170f] rounded overflow-hidden">
            {(['HD', 'UHD', '8K'] as const).map(fid => (
              <button
                key={fid}
                onClick={() => setActiveFidelity(fid)}
                className={`px-2 py-0.5 text-[8px] font-bold border-r last:border-r-0 border-[#1f170f] cursor-pointer transition ${
                  activeFidelity === fid 
                    ? 'bg-[#c46a1a]/20 text-[#c46a1a] font-extrabold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {fid}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        
        {/* Left Column: Cam Controller & FX (Cols 1-3) */}
        <div className="lg:col-span-3 border-r border-[#2e2418] bg-[#080604] p-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
          
          {/* Virtual Camera Selector */}
          <div className="bg-[#0d0b08] border border-[#1f170f] rounded p-2.5">
            <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block mb-2 flex items-center gap-1">
              <Camera className="w-3 h-3" /> // MULTI-CAM CHANNELS
            </span>
            <div className="space-y-1">
              {[
                { id: 'drone-tracking', label: 'CAM-01: Drone Tracker', desc: 'Auto tracking orbit system' },
                { id: 'focal-vertigo', label: 'CAM-02: Focal Vertigo', desc: 'Dynamic stretch & tilt' },
                { id: 'panoramic-lay', label: 'CAM-03: Leyline Panorama', desc: 'Widescreen landscape lens' },
                { id: 'extreme-closeup', label: 'CAM-04: Close-up Micro', desc: 'Precision vertex macro' }
              ].map(cam => (
                <button
                  key={cam.id}
                  onClick={() => setActiveCamera(cam.id)}
                  className={`w-full text-left p-1.5 rounded border transition-all text-[8px] cursor-pointer ${
                    activeCamera === cam.id
                      ? 'bg-[#c46a1a]/15 text-[#c46a1a] border-[#c46a1a]'
                      : 'bg-[#030201] border-[#1c160e] text-slate-400 hover:text-white hover:border-[#382b1c]'
                  }`}
                >
                  <p className="font-extrabold leading-none">{cam.label}</p>
                  <p className="text-[7px] text-slate-500 font-sans mt-0.5 leading-none">{cam.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color Grade Filters */}
          <div className="bg-[#0d0b08] border border-[#1f170f] rounded p-2.5">
            <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> // SPECTRAL LUT GRADES
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'geothermal-amber', label: 'Amber Abyss', classValue: 'sepia contrast-115 text-amber-300' },
                { id: 'neon-cyberpunk', label: 'Cyber Neon', classValue: 'hue-rotate-60 saturate-150 text-pink-400' },
                { id: 'emerald-flow', label: 'Leyline Jade', classValue: 'hue-rotate-130 saturate-125 text-emerald-400' },
                { id: 'high-contrast-noir', label: 'Carbon Noir', classValue: 'grayscale contrast-125 brightness-90 text-white' }
              ].map(grade => (
                <button
                  key={grade.id}
                  onClick={() => setColorGrade(grade.id)}
                  className={`p-1 text-center rounded border text-[8px] cursor-pointer transition ${
                    colorGrade === grade.id 
                      ? 'bg-[#c46a1a]/15 text-[#c46a1a] border-[#c46a1a] font-bold'
                      : 'bg-[#030201] border-[#1c160e] text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {grade.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lens adjustments */}
          <div className="bg-[#0d0b08] border border-[#1f170f] rounded p-2.5 space-y-2.5">
            <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block flex items-center gap-1">
              <Sliders className="w-3 h-3" /> // OPTICS SEQUENCER
            </span>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[7.5px] text-slate-400">
                <span>FOCAL LENGTH</span>
                <span className="text-white font-extrabold">{focalLength}mm</span>
              </div>
              <input 
                type="range" 
                min="18" 
                max="135" 
                value={focalLength} 
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full accent-[#c46a1a] h-1 bg-[#1a140d]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[7.5px] text-slate-400">
                <span>SENSOR EXPOSURE</span>
                <span className="text-white font-extrabold">EV {exposure.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="-2" 
                max="2" 
                step="0.1"
                value={exposure} 
                onChange={(e) => setExposure(Number(e.target.value))}
                className="w-full accent-[#c46a1a] h-1 bg-[#1a140d]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[7.5px] text-slate-400">
                <span>GRAIN RATIO</span>
                <span className="text-white font-extrabold">{noiseIntensity} ISO</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={noiseIntensity} 
                onChange={(e) => setNoiseIntensity(Number(e.target.value))}
                className="w-full accent-[#c46a1a] h-1 bg-[#1a140d]"
              />
            </div>

            {/* Shutter Speeds selector */}
            <div className="pt-1 select-none">
              <p className="text-[7px] text-slate-500 mb-1 leading-none font-bold">SHUTTER ANGLE</p>
              <div className="grid grid-cols-4 gap-1">
                {['1/24s', '1/48s', '1/96s', '1/240s'].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setShutterSpeed(speed)}
                    className={`p-0.5 text-[7px] font-mono rounded border cursor-pointer text-center ${
                      shutterSpeed === speed 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 font-black' 
                        : 'border-[#1f170f] text-slate-500'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Center Column: Live Camera Video Mock Frame (Cols 4-9) */}
        <div className="lg:col-span-6 bg-[#030201] p-3 flex flex-col justify-between min-h-0 relative">
          
          {/* Video Container viewport with beautiful visuals */}
          <div className="flex-1 bg-black border border-[#2e2418] rounded-lg overflow-hidden relative group">
            
            {/* Background Simulated Live Camera Feed Artwork */}
            <div 
              style={{ backgroundImage: `url(${currentScene.imgUrl})` }}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 select-none pointer-events-none opacity-45 mix-blend-lighten scale-105 ${
                colorGrade === 'geothermal-amber' ? 'sepia hue-rotate-15 saturate-125' :
                colorGrade === 'neon-cyberpunk' ? 'hue-rotate-180 saturate-150 brightness-110' :
                colorGrade === 'emerald-flow' ? 'hue-rotate-90 saturate-110 contrast-115' : 'grayscale contrast-125'
              } ${activeCamera === 'focal-vertigo' ? 'transform scale-125 skew-y-1 font-bold' : ''}`}
            />

            {/* Matrix overlay block */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0),rgba(0,0,0,0.85))] z-10 pointer-events-none" />

            {/* Procedural Digital Scanline lines */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[length:100%_4px,6px_100%] z-10 opacity-75" />

            {/* Film grain noise simulation overlay */}
            <div 
              style={{ opacity: noiseIntensity / 100 }} 
              className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] pointer-events-none z-10 bg-repeat" 
            />

            {/* Cinematic crop bands (Aspect Ratio Simulation) */}
            <div className={`absolute left-0 right-0 top-0 bg-black/90 pointer-events-none z-10 transition-all duration-300 ${
              currentScene.aspectRatio.includes('2.39') || currentScene.aspectRatio.includes('2.40') ? 'h-10' : 'h-4'
            }`} />
            <div className={`absolute left-0 right-0 bottom-0 bg-black/90 pointer-events-none z-10 transition-all duration-300 ${
              currentScene.aspectRatio.includes('2.39') || currentScene.aspectRatio.includes('2.40') ? 'h-10' : 'h-4'
            }`} />

            {/* Camera Viewport GUI HUD Elements */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-15 text-[8px] font-mono pointer-events-none select-none">
              
              {/* TOP ROW */}
              <div className="flex justify-between items-start pt-6">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full bg-red-600 ${isRecording ? 'animate-ping' : 'opacity-30'}`} />
                  <span className="text-white font-black tracking-widest">
                    REC [{isRecording ? 'LIVE' : 'Halted'}]
                  </span>
                </div>
                
                <div className="text-right space-y-0.5">
                  <div className="text-slate-400 font-sans">COGNITIVE FEED</div>
                  <div className="text-amber-500 font-extrabold">{currentScene.operative}</div>
                </div>
              </div>

              {/* CENTER COMPASS RETICLE */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-65">
                <div className="w-16 h-16 border border-slate-700/60 rounded-full flex items-center justify-center relative">
                  <div className="absolute w-2 h-0.5 bg-amber-500 -top-1" />
                  <div className="absolute w-2 h-0.5 bg-amber-500 -bottom-1" />
                  <div className="absolute h-2 w-0.5 bg-amber-500 -left-1" />
                  <div className="absolute h-2 w-0.5 bg-amber-500 -right-1" />
                  
                  {/* Rotating reticle element */}
                  <div 
                    style={{ transform: `rotate(${playbackTime * 3.6}deg)` }}
                    className="w-12 h-12 border border-dashed border-[#c46a1a]/40 rounded-full flex items-center justify-center transition-transform duration-500"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                </div>
                <div className="text-[6.5px] text-slate-500 mt-1.5 font-bold tracking-widest uppercase">
                  FOCAL PLANE SYNC
                </div>
              </div>

              {/* BOTTOM ROW */}
              <div className="flex justify-between items-end pb-6 text-slate-400">
                <div className="space-y-0.5">
                  <p>COORD: <span className="text-white font-extrabold">{hudCoordinates.lat}</span> / <span className="text-white font-extrabold">{hudCoordinates.lon}</span></p>
                  <p>ELEVATION: <span className="text-emerald-400 font-extrabold">{hudCoordinates.alt}</span></p>
                </div>

                <div className="text-right space-y-0.5">
                  <p>LENS: <span className="text-white font-extrabold">{focalLength}mm</span> F2.8</p>
                  <p className="font-mono text-[7px]">SHUTTER: <span className="text-amber-500 font-bold">{shutterSpeed}</span></p>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Feed Timeline Control Deck */}
          <div className="mt-3 bg-[#0d0b08] border border-[#2e2418] rounded p-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`p-1.5 rounded cursor-pointer transition active:scale-95 border ${
                  isRecording 
                    ? 'bg-[#c46a1a]/20 border-[#c46a1a] text-[#c46a1a]' 
                    : 'bg-[#140e08]/90 border-slate-700 text-slate-400'
                }`}
              >
                {isRecording ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button 
                onClick={() => {
                  setPlaybackTime(0);
                }}
                className="p-1.5 rounded cursor-pointer border border-[#2e2418] bg-[#070503] text-slate-400 hover:text-white transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simulated progress tracker */}
            <div className="flex-1 mx-3 flex items-center gap-2">
              <span className="text-[7.5px] font-mono text-slate-500">00:00</span>
              <div className="flex-1 bg-[#1a140d] h-1.5 rounded-full overflow-hidden border border-[#291e12]/60">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#c46a1a]"
                  style={{ width: `${playbackTime}%` }}
                />
              </div>
              <span className="text-[7.5px] font-mono text-slate-400">
                00:{Math.floor(playbackTime * (parseFloat(currentScene.duration) / 100)).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-sans text-slate-500 uppercase border border-[#2e2418] px-1 rounded">
                {currentScene.aspectRatio}
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Scene Library & Poster Metadata (Cols 10-12) */}
        <div className="lg:col-span-3 border-l border-[#2e2418] bg-[#080604] p-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
          
          <div className="bg-[#0d0b08] border border-[#1f170f] rounded p-2.5">
            <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              <Layers className="w-3 h-3" /> // DECIPHERED FILM LIBRARY
            </span>
            <p className="text-[7.5px] text-slate-500 font-sans leading-relaxed mb-3">
              Select an unlocked operative archive from the Abyssum reactor to sequence their cinematic viewport camera feeds.
            </p>

            <div className="space-y-1.5">
              {scenes.map(sc => (
                <div 
                  key={sc.id}
                  onClick={() => {
                    setSelectedScene(sc.id);
                    setPlaybackTime(0);
                  }}
                  className={`p-2 rounded border transition-all cursor-pointer text-left block ${
                    selectedScene === sc.id
                      ? 'bg-amber-900/10 border-[#c46a1a]/80 shadow-[0_0_10px_rgba(196,106,26,0.15)]'
                      : 'bg-[#030201] border-[#1c160e] hover:border-[#382b1c] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <p className={`font-extrabold text-[8.5px] uppercase ${selectedScene === sc.id ? 'text-amber-400' : 'text-slate-300'}`}>
                      {sc.title}
                    </p>
                    <span className="text-[6.5px] bg-[#1a140d] border border-[#a67c2a]/30 px-1 rounded shrink-0">
                      {sc.duration}
                    </span>
                  </div>
                  <p className="text-[7.5px] text-slate-500 font-sans mt-0.5 line-clamp-1">{sc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active scene metadata metrics */}
          <div className="bg-[#0d0b08] border border-[#1f170f] rounded p-3 space-y-2">
            <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block flex items-center gap-1">
              <Video className="w-3 h-3 text-amber-500" /> // METADATA SPECS
            </span>

            <div className="space-y-1 text-[8.5px] border-t border-[#1f170f]/74 pt-1.5 font-mono">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">OPERATIVE CODE:</span>
                <span className="text-white font-extrabold">{currentScene.operative}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">CAPTURE BASE:</span>
                <span className="text-blue-400 font-semibold">{currentScene.location}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">GRADE PRESET:</span>
                <span className="text-amber-500">{currentScene.grade}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">TARGET RATIO:</span>
                <span className="text-emerald-400 font-mono">{currentScene.aspectRatio}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">REFRESH LEVEL:</span>
                <span className="text-slate-300 font-mono font-bold">{currentScene.fps} fps</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1f170f]/74">
              <p className="text-[8.5px] text-slate-400 leading-normal font-sans italic">
                "{currentScene.description}"
              </p>
            </div>

            <button 
              onClick={() => {
                setToastMessage(`EXPORT TRIGGERED: Rendered "${currentScene.title}" at ${activeFidelity} spec.`);
              }}
              className="mt-2 w-full bg-[#1b140c] hover:bg-[#2e2111] text-amber-500 border border-[#a67c2a]/45 rounded p-1.5 flex items-center justify-center gap-1 text-[8px] font-bold cursor-pointer transition uppercase active:scale-95"
            >
              <Download className="w-3 h-3" /> EXPORT DECIPHERED MATTE
            </button>
          </div>

        </div>

      </div>

      {/* Floating HUD Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#0d0a07] border-2 border-amber-500 text-amber-400 font-mono text-[9px] px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-2 animate-bounce">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
          <span className="font-extrabold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
