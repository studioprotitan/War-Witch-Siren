import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Compass, Grid, Sparkles, Sliders, Layers, Camera } from 'lucide-react';
import { MeshModel } from '../types';

interface ViewerProps {
  model: MeshModel | null;
  onTriggerMtd?: () => void;
  psiSensitivity?: string;
}

export interface ReactorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  angle: number;
  spin: number;
}

export const parsePsiSensitivity = (psi: string | undefined): number => {
  if (!psi) return 1.0;
  if (psi.includes('∞') || psi.toLowerCase().includes('net') || psi.toLowerCase().includes('sensor')) return 3.0;
  const cleaned = psi.replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    return Math.max(0.5, Math.min(4.0, num / 7000));
  }
  return 1.2;
};

export interface MaterialParameters {
  name: string;
  color: string;
  roughness: number;      // 0.0 to 1.0 (0 = perfect polished mirror, 1 = absolute diffuse pumice)
  reflection: number;     // 0.0 to 1.0 (Specular power / reflectivity coefficient)
  refractionIndex: number;// Index of refraction (1.0 for opaque, 1.5+ for glass)
  emissionGlow: number;   // 0.0 to 1.0 (Lava heat fissures or cosmic ley flow energy)
  description: string;
}

export const MATERIAL_PRESETS: Record<'metallic_copper' | 'volcanic_stone' | 'ethereal_glass', MaterialParameters> = {
  metallic_copper: {
    name: 'Metallic Copper',
    color: '#c46a1a',
    roughness: 0.15,
    reflection: 0.85,
    refractionIndex: 1.0,
    emissionGlow: 0.05,
    description: 'Polished geothermal copper alloy casing with sharp specular reflection'
  },
  volcanic_stone: {
    name: 'Volcanic Stone',
    color: '#1a1615',
    roughness: 0.90,
    reflection: 0.05,
    refractionIndex: 1.0,
    emissionGlow: 0.75,
    description: 'Matte pumice basalt core with pulsing glowing sub-surface magma'
  },
  ethereal_glass: {
    name: 'Ethereal Glass',
    color: '#1a9490',
    roughness: 0.05,
    reflection: 0.55,
    refractionIndex: 1.62,
    emissionGlow: 0.25,
    description: 'Smooth silica crystal with angle-dependent Fresnel translucency'
  }
};

function isPointInTriangle(
  px: number,
  py: number,
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): boolean {
  const d1 = (px - p2.x) * (p1.y - p2.y) - (p1.x - p2.x) * (py - p2.y);
  const d2 = (px - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (py - p3.y);
  const d3 = (px - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (py - p1.y);

  const has_neg = d1 < 0 || d2 < 0 || d3 < 0;
  const has_pos = d1 > 0 || d2 > 0 || d3 > 0;

  return !(has_neg && has_pos);
}

interface HealthBar3DProps {
  ctx: CanvasRenderingContext2D;
  hX: number;
  hY: number;
  hudW: number;
  hudH: number;
  distanceScale: number;
  hudHP: number;
  hudComposure: number;
  activeEffects: string[];
  meshColor: string;
}

function drawHealthBar3D({
  ctx,
  hX,
  hY,
  hudW,
  hudH,
  distanceScale,
  hudHP,
  hudComposure,
  activeEffects,
  meshColor
}: HealthBar3DProps) {
  // HealthBar3D composite values and physical bounds
  const barW = hudW - 10 * distanceScale;
  const barH = 3 * distanceScale;
  const barX = hX + 5 * distanceScale;
  const barY = hY + 15 * distanceScale;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(barX, barY, barW, barH);

  const hpFillRatio = hudHP / 100;
  const hpR = Math.round(255 - (hudComposure * 2.55));
  const hpG = Math.round(hudComposure * 2.55);
  ctx.fillStyle = `rgb(${hpR}, ${hpG}, 18)`;
  ctx.fillRect(barX, barY, barW * hpFillRatio, barH);

  // HealthBar3D Numerics & explicit labels state
  ctx.font = `bold ${5.5 * distanceScale}px monospace`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`HEALTH_BAR_3D: ${hudHP}%`, barX, barY + 8 * distanceScale);
  
  ctx.font = `${5 * distanceScale}px monospace`;
  ctx.fillStyle = '#b7a285';
  ctx.fillText(`COMP: ${hudComposure}%`, barX + 52 * distanceScale, barY + 8 * distanceScale);

  // Status Effects sub-system within HealthBar3D bounds
  let currentSfxX = barX;
  const sfxSizeH = 7 * distanceScale;
  const sfxY = barY + 11 * distanceScale;

  activeEffects.forEach((ele) => {
    ctx.fillStyle = ele === 'Ward' ? 'rgba(56, 189, 248, 0.18)' : ele === 'Oracle Mark' ? 'rgba(168, 85, 247, 0.18)' : 'rgba(239, 68, 68, 0.18)';
    ctx.strokeStyle = ele === 'Ward' ? '#38bdf8' : ele === 'Oracle Mark' ? '#a855f7' : '#ef4444';
    ctx.lineWidth = 0.5 * distanceScale;
    ctx.beginPath();
    ctx.rect(currentSfxX, sfxY, sfxSizeH * 1.8, sfxSizeH);
    ctx.fill();
    ctx.stroke();

    ctx.font = `bold ${4.5 * distanceScale}px monospace`;
    ctx.fillStyle = '#ffffff';
    const sfxGlyph = ele === 'Oracle Mark' ? 'ORC' : ele === 'Ward' ? 'WRD' : ele === 'Poison' ? 'PSN' : ele === 'Burn' ? 'BRN' : 'STN';
    ctx.fillText(sfxGlyph, currentSfxX + 1.2 * distanceScale, sfxY + 5 * distanceScale);

    currentSfxX += (sfxSizeH * 1.8 + 2 * distanceScale);
  });
}

export default function ThreeDimensionalViewer({ model, onTriggerMtd, psiSensitivity }: ViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const takeSnapshotRef = useRef<(() => void) | null>(null);
  
  // Particle Emitter overlay system
  const particlesRef = useRef<ReactorParticle[]>([]);
  const lastTriggeredModelIdRef = useRef<string>('');

  const triggerParticleEruption = () => {
    const intensity = parsePsiSensitivity(psiSensitivity);
    const particleCount = Math.floor(140 * intensity);
    const canvas = canvasRef.current;
    const cx = canvas ? canvas.width / 2 : 200;
    const cy = canvas ? canvas.height / 2 : 200;

    const newParticles: ReactorParticle[] = [];
    const spectralColors = [
      '#ff3a30', '#ff9500', '#ffcc00', '#4cd964', '#5ac8fa', '#007aff', '#5856d6', 
      '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#06b6d4', '#6366f1', '#14b8a6', '#f59e0b'
    ];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 6 + 2.5) * (0.6 + intensity * 0.4);
      const life = Math.random() * 35 + 35; // frames (approx 1-1.5s lifespan)
      newParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: spectralColors[Math.floor(Math.random() * spectralColors.length)],
        size: (Math.random() * 4.2 + 1.8) * (0.7 + intensity * 0.3),
        alpha: 1.0,
        life: life,
        maxLife: life,
        angle: angle,
        spin: (Math.random() - 0.5) * 0.15
      });
    }
    
    particlesRef.current = newParticles;
  };

  // Monitor reconstruction completion on model changes
  useEffect(() => {
    if (model && model.id && model.id !== lastTriggeredModelIdRef.current) {
      lastTriggeredModelIdRef.current = model.id;
      triggerParticleEruption();
    }
  }, [model]);
  const [viewMode, setViewMode] = useState<'solid' | 'wireframe' | 'pointcloud'>('solid');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.2);
  const [zoom, setZoom] = useState<number>(1.0);
  const [ambientIntensity, setAmbientIntensity] = useState<number>(0.6);
  const [meshColor, setMeshColor] = useState<string>('#c46a1a'); // Default to Forge Amber
  const [materialShader, setMaterialShader] = useState<'metallic_copper' | 'volcanic_stone' | 'ethereal_glass'>('metallic_copper');

  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [meshDimensions, setMeshDimensions] = useState<{ width: number; height: number; depth: number } | null>(null);

  const [bgOption, setBgOption] = useState<string>('abyss'); // abyss | slate | warm | nebula | moss | custom
  const [customBgColor, setCustomBgColor] = useState<string>('#0d0b08');

  // Interactive HUD Contract states
  const [hudActive, setHudActive] = useState<boolean>(true);
  const [hudHP, setHudHP] = useState<number>(85);
  const [hudComposure, setHudComposure] = useState<number>(92);
  const [hudAggression, setHudAggression] = useState<number>(35);
  const [hudStress, setHudStress] = useState<number>(12);
  const [activeEffects, setActiveEffects] = useState<string[]>(['Ward', 'Oracle Mark']);
  const [hudHeightOffset, setHudHeightOffset] = useState<number>(0.25);
  const [hudViewFilter, setHudViewFilter] = useState<'owned' | 'other' | 'oracle'>('owned');
  const [hudScaleClamped, setHudScaleClamped] = useState<boolean>(true);

  // Oracle Signaling HUD integration states
  const [oracleSignalingActive, setOracleSignalingActive] = useState<boolean>(true);
  const [oraclePulseFrequency, setOraclePulseFrequency] = useState<number>(3.0); // 1.0 to 5.0 scale speed
  const [oraclePulseStrength, setOraclePulseStrength] = useState<number>(6.0); // 1.0 to 10.0 scale multiplier
  const [oraclePulseColor, setOraclePulseColor] = useState<string>('#a855f7'); // canonical oracle hot magenta/purple

  // Sync styling when material shader changes
  useEffect(() => {
    if (materialShader === 'volcanic_stone') {
      setMeshColor('#8b2020'); // deep volcanic red-brown
    } else if (materialShader === 'ethereal_glass') {
      setMeshColor('#1a9490'); // translucent cyan/teal
    } else {
      setMeshColor('#c46a1a'); // copper geothermal amber
    }
  }, [materialShader]);
  
  // Custom drag state for interactive rotation
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [angleX, setAngleX] = useState<number>(0.6);
  const [angleY, setAngleY] = useState<number>(0.6);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentAngleYRef = useRef<number>(0.6);
  useEffect(() => {
    currentAngleYRef.current = angleY;
  }, [angleY]);

  // Reset viewport state when viewMode changes on parents
  useEffect(() => {
    if (model) {
      setViewMode(model.viewMode);
      setAutoRotate(model.autoRotate);
      setRotationSpeed(model.rotationSpeed);
      if ((model as any).detectedMaterial) {
        setMaterialShader((model as any).detectedMaterial);
      }
    }
  }, [model]);

  // Generate 3D geometry vertices or calculate them procedurally based on Abyssum prompt
  const generateVertices = (promptText: string) => {
    const vertices: [number, number, number][] = [];
    const faces: [number, number, number][] = [];

    const promptLower = promptText.toLowerCase();

    if (promptLower.includes('stone') || promptLower.includes('core') || promptLower.includes('cenote')) {
      // Node Stone / Polyhedral Core Geometry (Octahedron / Icosahedron star)
      // High frequency pulsing mineral
      const t = (1 + Math.sqrt(5)) / 2;
      
      const baseVertices: [number, number, number][] = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
      ];

      // Normalize and scale to render beautifully
      baseVertices.forEach(([vx, vy, vz]) => {
        const length = Math.sqrt(vx * vx + vy * vy + vz * vz);
        vertices.push([vx / length * 1.1, vy / length * 1.1, vz / length * 1.1]);
      });

      const baseFaces: [number, number, number][] = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
      ];

      baseFaces.forEach(f => faces.push(f));

      // Add a couple of sharp facets for geological raw stone spikes
      vertices.push([0, 1.6, 0]);
      vertices.push([0, -1.6, 0]);
      const lastIdx = vertices.length - 2;
      faces.push([0, 1, lastIdx], [1, 5, lastIdx], [5, 11, lastIdx], [11, 10, lastIdx], [10, 0, lastIdx]);
      faces.push([2, 3, lastIdx + 1], [3, 4, lastIdx + 1], [4, 9, lastIdx + 1], [9, 6, lastIdx + 1]);

    } else if (promptLower.includes('goblin') || promptLower.includes('automaton')) {
      // Glitch Goblin Geometry (Angular sharp mask with prominent mechanical ears and jaw)
      // Severe spiky structure
      const points = [
        [0, 1.2, 0], // upper head 0
        [-0.5, 0.4, 0.3], [0.5, 0.4, 0.3], // brow 1, 2
        [0, -0.1, 0.55], // snarling mechanical muzzle 3
        [-0.4, -0.6, 0.2], [0.4, -0.6, 0.2], // pointed chin jaws 4, 5
        [-0.9, 0.8, -0.1], [0.9, 0.8, -0.1], // copper mechanical ears 6, 7
        [-0.6, -0.1, -0.4], [0.6, -0.1, -0.4], // skull sides 8, 9
        [0, -1.1, 0] // bottom neck port 10
      ];

      points.forEach(p => vertices.push(p as [number, number, number]));

      faces.push([0, 1, 2], [0, 6, 1], [0, 2, 7]); // brow and ears
      faces.push([1, 3, 2], [1, 4, 3], [2, 3, 5]); // muzzle/nose and chin plates
      faces.push([4, 10, 5], [4, 8, 10], [5, 10, 9]); // lower neck collar
      faces.push([6, 8, 1], [7, 2, 9], [8, 4, 1]); // cheek cavities
      faces.push([0, 8, 6], [0, 7, 9]); // back skull
    } else if (promptLower.includes('witch') || promptLower.includes('corrupted') || promptLower.includes('siren')) {
      // Siren / Glitch Witch (Symmetric hourglass casing with central floating aura loop)
      const segments = 18;
      const rings = 12;

      for (let r = 0; r <= rings; r++) {
        const v = r / rings;
        let radius = 0.9;
        let y = (v - 0.5) * 2.3;

        if (v < 0.4) {
          // Bottom elegant pedestal base
          radius = 0.8 * (1.1 - v);
        } else if (v < 0.7) {
          // Thin neck waist
          radius = 0.3 + 0.15 * Math.sin((v - 0.4) * Math.PI / 0.3);
        } else {
          // Pointed gothic crown cap
          const top = (v - 0.7) / 0.3;
          radius = 0.75 * Math.cos(top * Math.PI / 2.2);
        }

        // Add interesting asymmetric wing ribs
        for (let s = 0; s < segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          let rMod = radius;
          if (v > 0.45 && v < 0.8 && (s === 2 || s === 11)) {
            // Wing protrusion
            rMod += 0.45 * Math.sin((v - 0.45) / 0.35 * Math.PI);
          }
          const x = Math.cos(theta) * rMod;
          const z = Math.sin(theta) * rMod;
          vertices.push([x, y, z]);
        }
      }

      // Generate rib faces
      for (let r = 0; r < rings; r++) {
        for (let s = 0; s < segments; s++) {
          const curr = r * segments + s;
          const next = r * segments + ((s + 1) % segments);
          const nextRow = (r + 1) * segments + s;
          const nextRowNext = (r + 1) * segments + ((s + 1) % segments);

          faces.push([curr, next, nextRow]);
          faces.push([next, nextRowNext, nextRow]);
        }
      }
    } else {
      // Default: Beautiful Torus/Knot geometry representing high-frequency Ley Lines
      const rings = 16;
      const sectors = 16;
      const rOuter = 0.95;
      const rInner = 0.35;

      for (let ri = 0; ri < rings; ri++) {
        const theta = (ri / rings) * Math.PI * 2;
        for (let si = 0; si < sectors; si++) {
          const phi = (si / sectors) * Math.PI * 2;
          const x = (rOuter + rInner * Math.cos(phi)) * Math.cos(theta);
          const y = rInner * Math.sin(phi) * 1.3;
          const z = (rOuter + rInner * Math.cos(phi)) * Math.sin(theta);
          vertices.push([x, y, z]);
        }
      }

      // Faces
      for (let ri = 0; ri < rings; ri++) {
        for (let si = 0; si < sectors; si++) {
          const curr = ri * sectors + si;
          const next = ri * sectors + ((si + 1) % sectors);
          const nextRow = ((ri + 1) % rings) * sectors + si;
          const nextRowNext = ((ri + 1) % rings) * sectors + ((si + 1) % sectors);

          faces.push([curr, next, nextRow]);
          faces.push([next, nextRowNext, nextRow]);
        }
      }
    }

    return { vertices, faces };
  };

  // Standard geometry setup
  const geomRef = useRef<{ vertices: [number, number, number][]; faces: [number, number, number][] }>({ vertices: [], faces: [] });

  useEffect(() => {
    const promptValue = model?.prompt || 'Cenote Node Stone Core';
    const geometry = generateVertices(promptValue);
    geomRef.current = geometry;
    
    // Choose beautiful color based on prompt
    const text = promptValue.toLowerCase();
    if (text.includes('goblin') || text.includes('automaton')) {
      setMeshColor('#8b7d6b'); // Raw bone ash iron
    } else if (text.includes('witch') || text.includes('corrupted') || text.includes('siren')) {
      setMeshColor('#1a9490'); // Cenote Teal / Glitch Witch fire
    } else if (text.includes('stone') || text.includes('core')) {
      setMeshColor('#a67c2a'); // Geothermal Aurum Gold
    } else {
      setMeshColor('#c46a1a'); // Forge Geothermal Amber
    }

    // Calculate approximate bounding box dimensions
    if (geometry.vertices && geometry.vertices.length > 0) {
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;

      geometry.vertices.forEach(([x, y, z]) => {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
      });

      setMeshDimensions({
        width: maxX - minX,
        height: maxY - minY,
        depth: maxZ - minZ
      });
    } else {
      setMeshDimensions(null);
    }
  }, [model]);

  // Main rendering loop inside canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let localAngleY = angleY;

    const draw = (ctx: CanvasRenderingContext2D, width: number, height: number, currentAngleY: number) => {
      // Clear canvas with deep technical background match
      ctx.clearRect(0, 0, width, height);

      // Render background gradient/color
      if (bgOption === 'abyss') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0d0b08');
        bgGrad.addColorStop(1, '#131008');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgOption === 'slate') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0b0f19');
        bgGrad.addColorStop(1, '#04060b');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgOption === 'warm') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#180808');
        bgGrad.addColorStop(1, '#0a0303');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgOption === 'nebula') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#10081c');
        bgGrad.addColorStop(1, '#05020a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgOption === 'moss') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#08120b');
        bgGrad.addColorStop(1, '#030805');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = customBgColor;
        ctx.fillRect(0, 0, width, height);
      }
      
      const center = { x: width / 2, y: height / 2 };

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      const fov = 400; // perspective scaling factor
      const renderScale = 120 * zoom;

      const projectedPoints: { x: number; y: number; zDepth: number }[] = [];

      // Project all 3D Vertices to 2D screen coordinates
      const { vertices, faces } = geomRef.current;
      
      vertices.forEach(([vx, vy, vz]) => {
        // Rotate around Y axis
        let x1 = vx * cosY - vz * sinY;
        let z1 = vx * sinY + vz * cosY;

        // Rotate around X axis
        let y2 = vy * cosX - z1 * sinX;
        let z2 = vy * sinX + z1 * cosX;

        // Apply distance translate
        let depth = z2 + 3.5;

        // Perspective division
        let screenX = center.x + (x1 * fov * renderScale) / (depth * 350);
        let screenY = center.y + (y2 * fov * renderScale) / (depth * 350);

        projectedPoints.push({ x: screenX, y: screenY, zDepth: depth });
      });

      // Simple grid backing for perspective depth
      // In Abyssum, grid lines correspond to Ley line shifts
      ctx.strokeStyle = meshColor === '#1a9490' ? 'rgba(26, 148, 144, 0.08)' : 'rgba(196, 106, 26, 0.08)';
      ctx.lineWidth = 1;
      const gridY = center.y + 110 * zoom;
      for (let i = -4; i <= 4; i++) {
        // Draw grid lines radiating outwards
        ctx.beginPath();
        ctx.moveTo(center.x + i * 35, gridY);
        ctx.lineTo(center.x + i * 85, gridY + 60);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(center.x - 120, gridY + (i + 4) * 10);
        ctx.lineTo(center.x + 120, gridY + (i + 4) * 10);
        ctx.stroke();
      }

      // Check view mode
      if (viewMode === 'solid') {
        // Rearrange faces by depth for painter's algorithm
        const faceDepths: { index: number; depth: number }[] = [];
        faces.forEach((face, idx) => {
          if (projectedPoints[face[0]] && projectedPoints[face[1]] && projectedPoints[face[2]]) {
            const d = (projectedPoints[face[0]].zDepth + projectedPoints[face[1]].zDepth + projectedPoints[face[2]].zDepth) / 3;
            faceDepths.push({ index: idx, depth: d });
          }
        });

        // Sort descending (render furthest first)
        faceDepths.sort((a, b) => b.depth - a.depth);

        // Draw solid triangles with ambient lighting shading
        faceDepths.forEach(({ index }) => {
          const face = faces[index];
          const p1 = projectedPoints[face[0]];
          const p2 = projectedPoints[face[1]];
          const p3 = projectedPoints[face[2]];

          // Calculate surface normal direction for a light-shading approximation
          const v1x = vertices[face[1]][0] - vertices[face[0]][0];
          const v1y = vertices[face[1]][1] - vertices[face[0]][1];
          const v1z = vertices[face[1]][2] - vertices[face[0]][2];

          const v2x = vertices[face[2]][0] - vertices[face[0]][0];
          const v2y = vertices[face[2]][1] - vertices[face[0]][1];
          const v2z = vertices[face[2]][2] - vertices[face[0]][2];

          // Cross product
          const nx = v1y * v2z - v1z * v2y;
          const ny = v1z * v2x - v1x * v2z;
          const nz = v1x * v2y - v1y * v2x;

          // Normalize normal
          const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
          const nnx = nx / len;
          const nny = ny / len;
          const nnz = nz / len;

          // Light vector normalized
          const lx = 0.5;
          const ly = -0.7;
          const lz = 0.5;
          const llen = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1;
          const lnx = lx / llen;
          const lny = ly / llen;
          const lnz = lz / llen;

          // Dot product: N . L
          const dot = nnx * lnx + nny * lny + nnz * lnz;

          // Reflection vector R = 2 * (N.L) * N - L
          const rx = 2 * dot * nnx - lnx;
          const ry = 2 * dot * nny - lny;
          const rz = 2 * dot * nnz - lnz;

          // Normalize reflection vector
          const rlen = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1;
          const rnx = rx / rlen;
          const rny = ry / rlen;
          const rnz = rz / rlen;

          // Camera View Vector is pointing along positive Z towards the user [0, 0, 1]
          // Specular highlights: R . V = rnz
          const specDot = Math.max(0, rnz);

          let finalR = 0;
          let finalG = 0;
          let finalB = 0;
          let finalOpacity = 1.0;

          if (materialShader === 'volcanic_stone') {
            // Base carbonized dense pumice stone color
            let baseR = 24;
            let baseG = 20;
            let baseB = 18;

            // Roughness displacement noise mock (to simulate micro-granular bumpy structures)
            // Seeded from vertex coordinates to stay stable per face
            const seed = Math.sin(index * 133.7 + 12.3) * 43758.5453;
            const roughnessNoise = (seed - Math.floor(seed)) * 14 - 7; // -7 to +7
            baseR = Math.max(6, Math.min(60, baseR + roughnessNoise));
            baseG = Math.max(6, Math.min(60, baseG + roughnessNoise));
            baseB = Math.max(6, Math.min(60, baseB + roughnessNoise));

            // High roughness diffuse scattering: uniform matte lighting
            const diffuse = Math.max(0, dot) * 0.45;
            const ambient = 0.12 + (ambientIntensity * 0.1);
            const factor = ambient + diffuse;

            finalR = baseR * factor * 1.5;
            finalG = baseG * factor * 1.5;
            finalB = baseB * factor * 1.5;

            // Sub-surface pulsing core fissure heat glow
            const thermalPulse = 0.38 + 0.32 * Math.sin(Date.now() / 420 + index * 0.45);
            // Stronger in shadowed areas
            const shadowedGlow = thermalPulse * 0.9 * (1.0 - Math.max(0, dot) * 0.4);
            
            finalR = Math.min(255, finalR + shadowedGlow * 205);
            finalG = Math.min(255, finalG + shadowedGlow * 55);
            finalB = Math.min(255, finalB + shadowedGlow * 8);

          } else if (materialShader === 'ethereal_glass') {
            // Clear sky/teal cryo-crystalline glass base
            const baseR = 26;
            const baseG = 148;
            const baseB = 144;

            // Fresnel effect: higher opacity/reflection on grazing edges (where normal is orthogonal to viewer)
            // view direction dot with normal is simply nnz
            const cosTheta = Math.abs(nnz);
            const fresnel = Math.pow(1.0 - cosTheta, 2.5); // grazing highlight power

            // Super smooth glass specular highlights (roughness 0.05, extremely high shininess exponent)
            const shininess = 48;
            const specPower = Math.pow(specDot, shininess);

            // Translucency configuration
            finalOpacity = 0.22 + fresnel * 0.58;

            const diffuse = Math.max(0, dot) * 0.38 + 0.2; // deep internal refraction ambient lighting

            finalR = baseR * diffuse + (fresnel * 140) + (specPower * 0.55 * 255);
            finalG = baseG * diffuse + (fresnel * 205) + (specPower * 0.55 * 255);
            finalB = baseB * diffuse + (fresnel * 225) + (specPower * 0.55 * 255);

            // Cold dynamic energy currents shifting inside the glass
            const dynamicShift = 0.12 * Math.sin(Date.now() / 550 + p1.zDepth * 3);
            finalR = Math.max(0, finalR + dynamicShift * 50);
            finalG = Math.max(0, finalG + dynamicShift * 170);
            finalB = Math.max(0, finalB + dynamicShift * 210);

          } else {
            // Metallic Polished Copper core
            const mColor = meshColor || '#c46a1a';
            const baseR = parseInt(mColor.slice(1,3), 16) || 196;
            const baseG = parseInt(mColor.slice(3,5), 16) || 106;
            const baseB = parseInt(mColor.slice(5,7), 16) || 26;

            // Low roughness specularity gloss (roughness = 0.15)
            const shininess = 22;
            const specPower = Math.pow(specDot, shininess);
            const specReflectionPower = 0.85; // high metal reflectivity

            const diffuse = Math.max(0, dot) * 0.72;
            const ambient = 0.28 + (ambientIntensity * 0.12);

            finalR = baseR * (ambient + diffuse) + (specPower * specReflectionPower * 255);
            finalG = baseG * (ambient + diffuse) + (specPower * specReflectionPower * 210);
            finalB = baseB * (ambient + diffuse) + (specPower * specReflectionPower * 140);
          }

          // Convert RGB elements to safe hex or integer strings
          const rHex = Math.max(0, Math.min(255, Math.round(finalR)));
          const gHex = Math.max(0, Math.min(255, Math.round(finalG)));
          const bHex = Math.max(0, Math.min(255, Math.round(finalB)));
          
          const shadedFillColor = `rgb(${rHex}, ${gHex}, ${bHex})`;

          // Draw the triangle with calculated dimensions
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();

          // Set active material transparency level
          ctx.globalAlpha = finalOpacity;

          // Fill with procedural material output
          ctx.fillStyle = shadedFillColor;
          ctx.fill();

          // Reset opacity
          ctx.globalAlpha = 1.0;

          // Outlines
          if (materialShader === 'volcanic_stone') {
            // Lava vein crack glow active (pulsing bright magma red)
            const pulse = 0.35 + 0.45 * Math.sin(Date.now() / 320);
            ctx.strokeStyle = `rgba(225, 82, 21, ${pulse})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          } else if (materialShader === 'ethereal_glass') {
            // Cyan crystal accents
            ctx.strokeStyle = 'rgba(73, 203, 214, 0.35)';
            ctx.lineWidth = 0.4;
            ctx.stroke();
          } else {
            // Metallic Casing edges
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        });
      } else if (viewMode === 'wireframe') {
        // Render simple skeletal structure
        let wireColor = meshColor;
        let wireWidth = 0.8;

        if (materialShader === 'volcanic_stone') {
          // Hot glowing magma red/orange lines
          wireColor = '#e15215';
          wireWidth = 1.0;
        } else if (materialShader === 'ethereal_glass') {
          // Cryptographic floating laser veins
          wireColor = 'rgba(73, 203, 214, 0.65)';
          wireWidth = 0.55;
        } else {
          wireColor = meshColor;
          wireWidth = 0.8;
        }

        ctx.strokeStyle = wireColor;
        ctx.lineWidth = wireWidth;
        faces.forEach((face) => {
          const p1 = projectedPoints[face[0]];
          const p2 = projectedPoints[face[1]];
          const p3 = projectedPoints[face[2]];

          if (p1 && p2 && p3) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.stroke();
          }
        });
      } else if (viewMode === 'pointcloud') {
        // Print individual vertices with coordinates
        projectedPoints.forEach((p) => {
          const size = Math.max(1.5, 4.5 / p.zDepth);
          let ptColor = meshColor;

          if (materialShader === 'volcanic_stone') {
            ptColor = '#f03a11'; // Radiant volcanic ember points
          } else if (materialShader === 'ethereal_glass') {
            ptColor = '#49cbd6'; // Cryo glass star dust points
          } else {
            ptColor = meshColor;
          }

          ctx.fillStyle = ptColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();

          // Sparkle halo glow
          if (p.zDepth < 3.0) {
            ctx.fillStyle = materialShader === 'ethereal_glass' 
              ? 'rgba(73, 203, 214, 0.18)' 
              : materialShader === 'volcanic_stone' 
                ? 'rgba(240, 58, 17, 0.18)' 
                : 'rgba(196, 106, 26, 0.15)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // Draw 3D Bounding Box Wireframe with Dimensions
      if (showMeasurements && vertices && vertices.length > 0) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        vertices.forEach(([x, y, z]) => {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (z < minZ) minZ = z;
          if (z > maxZ) maxZ = z;
        });

        // 8 box vertices
        const boxVerts: [number, number, number][] = [
          [minX, minY, minZ], // 0
          [maxX, minY, minZ], // 1
          [maxX, maxY, minZ], // 2
          [minX, maxY, minZ], // 3
          [minX, minY, maxZ], // 4
          [maxX, minY, maxZ], // 5
          [maxX, maxY, maxZ], // 6
          [minX, maxY, maxZ]  // 7
        ];

        const projectedBoxPoints: { x: number; y: number; zDepth: number }[] = [];
        boxVerts.forEach(([vx, vy, vz]) => {
          let x1 = vx * cosY - vz * sinY;
          let z1 = vx * sinY + vz * cosY;
          let y2 = vy * cosX - z1 * sinX;
          let z2 = vy * sinX + z1 * cosX;
          let depth = z2 + 3.5;
          let screenX = center.x + (x1 * fov * renderScale) / (depth * 350);
          let screenY = center.y + (y2 * fov * renderScale) / (depth * 350);
          projectedBoxPoints.push({ x: screenX, y: screenY, zDepth: depth });
        });

        // Draw 12 Edges
        ctx.save();
        ctx.strokeStyle = meshColor === '#1a9490' ? 'rgba(73, 203, 214, 0.45)' : 'rgba(196, 106, 26, 0.45)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        const drawBoxEdge = (idxA: number, idxB: number) => {
          const pA = projectedBoxPoints[idxA];
          const pB = projectedBoxPoints[idxB];
          if (pA && pB) {
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        };

        // Connect bottom face
        drawBoxEdge(0, 1);
        drawBoxEdge(1, 2);
        drawBoxEdge(2, 3);
        drawBoxEdge(3, 0);

        // Connect top face
        drawBoxEdge(4, 5);
        drawBoxEdge(5, 6);
        drawBoxEdge(6, 7);
        drawBoxEdge(7, 4);

        // Connect vertical columns
        drawBoxEdge(0, 4);
        drawBoxEdge(1, 5);
        drawBoxEdge(2, 6);
        drawBoxEdge(3, 7);

        // Scale factor: standard mock units to real-world meters
        const scaleToMeters = 1.5;
        const dimW = (maxX - minX) * scaleToMeters;
        const dimH = (maxY - minY) * scaleToMeters;
        const dimD = (maxZ - minZ) * scaleToMeters;

        ctx.setLineDash([]); // clear line dash for labels
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = meshColor === '#1a9490' ? '#5de3de' : '#f08129';

        // Helper to draw label with background box
        const drawDimensionLabel = (text: string, x: number, y: number) => {
          const textWidth = ctx.measureText(text).width;
          ctx.fillStyle = 'rgba(6, 4, 3, 0.9)';
          ctx.fillRect(x - 4, y - 7, textWidth + 8, 11);
          ctx.strokeStyle = meshColor === '#1a9490' ? 'rgba(73, 203, 214, 0.5)' : 'rgba(196, 106, 26, 0.5)';
          ctx.strokeRect(x - 4, y - 7, textWidth + 8, 11);
          ctx.fillStyle = meshColor === '#1a9490' ? '#5de3de' : '#f08129';
          ctx.fillText(text, x, y + 1);
        };

        // Draw Width Label at midpoint of front edge (0 to 1)
        if (projectedBoxPoints[0] && projectedBoxPoints[1]) {
          const pMidW = {
            x: (projectedBoxPoints[0].x + projectedBoxPoints[1].x) / 2,
            y: (projectedBoxPoints[0].y + projectedBoxPoints[1].y) / 2
          };
          drawDimensionLabel(`X:${dimW.toFixed(2)}m`, pMidW.x - 15, pMidW.y + 12);
        }

        // Draw Height Label at midpoint of vertical edge (1 to 5)
        if (projectedBoxPoints[1] && projectedBoxPoints[5]) {
          const pMidH = {
            x: (projectedBoxPoints[1].x + projectedBoxPoints[5].x) / 2,
            y: (projectedBoxPoints[1].y + projectedBoxPoints[5].y) / 2
          };
          drawDimensionLabel(`Y:${dimH.toFixed(2)}m`, pMidH.x + 8, pMidH.y);
        }

        // Draw Depth Label at midpoint of side edge (0 to 3)
        if (projectedBoxPoints[0] && projectedBoxPoints[3]) {
          const pMidD = {
            x: (projectedBoxPoints[0].x + projectedBoxPoints[3].x) / 2,
            y: (projectedBoxPoints[0].y + projectedBoxPoints[3].y) / 2
          };
          drawDimensionLabel(`Z:${dimD.toFixed(2)}m`, pMidD.x - 40, pMidD.y);
        }

        ctx.restore();
      }

      // Draw loaded model tag anchor & head-attached HUD Contract visual
      if (model) {
        ctx.font = '500 10px monospace';
        ctx.fillStyle = 'rgba(139, 125, 107, 0.6)';
        ctx.fillText(`LEY_CORE_STATUS: ACTIVE`, 16, height - 32);
        ctx.fillText(`TRANS_SPECTRUM: ${viewMode.toUpperCase()}`, 16, height - 18);
        ctx.fillText(`GEOTHERMAL_ROTATION: ${autoRotate ? 'COMPILING' : 'STABILIZED'}`, 16, height - 6);

        // Diegetic Head-Attached HUD Contract Representation (Deterministic standard)
        if (hudActive && projectedPoints.length > 0) {
          // Find Head vertex (highest Y coordinate in original model coordinates to lock anchor)
          let headIdx = 0;
          let maxYVal = -Infinity;
          const { vertices } = geomRef.current;
          vertices.forEach((v, idx) => {
            if (v[1] > maxYVal) {
              maxYVal = v[1];
              headIdx = idx;
            }
          });

          const headProj = projectedPoints[headIdx];
          if (headProj) {
            // Clamped distance scaling coefficient to preserve visibility
            const distance = headProj.zDepth;
            let distanceScale = 1.0 / (distance / 3.5);
            if (hudScaleClamped) {
              distanceScale = Math.max(0.4, Math.min(1.0, distanceScale));
            }

            // Height offset calculation
            const offsetPixels = (hudHeightOffset * 180 * zoom * distanceScale);
            const hudX = headProj.x;
            const hudY = headProj.y - offsetPixels;

            // Adjust opacity depending on POV Player Controller filter rules
            let hudOpacity = 1.0;
            if (hudViewFilter === 'other') {
              hudOpacity = 0.55;
            } else if (hudViewFilter === 'oracle') {
              hudOpacity = 0.85;
            }

            const hudW = 110 * distanceScale;
            const hudH = 46 * distanceScale;
            const hX = hudX - hudW / 2;
            const hY = hudY - hudH;

            const emitterX = headProj.x + 32 * distanceScale;
            const emitterY = headProj.y - 14 * distanceScale;

            // Frustum boundary calculations to ensure HUD elements are fully within the screen bounds
            const minAllowedX = Math.min(hX, headProj.x, emitterX - 18 * distanceScale);
            const maxAllowedX = Math.max(hX + hudW, headProj.x, emitterX + 24 * distanceScale);
            const minAllowedY = Math.min(hY, headProj.y, emitterY - 18 * distanceScale);
            const maxAllowedY = Math.max(hY + hudH, headProj.y, emitterY + 12 * distanceScale);

            const isFullyWithinFrustum = (
              minAllowedX >= 0 && maxAllowedX <= width &&
              minAllowedY >= 0 && maxAllowedY <= height &&
              headProj.zDepth > 0
            );

            // Scene Geometry depth occlusion evaluation
            let isOccludedByGeometry = false;
            if (viewMode === 'solid') {
              const { faces } = geomRef.current;
              for (let idx = 0; idx < faces.length; idx++) {
                const face = faces[idx];
                if (face[0] === headIdx || face[1] === headIdx || face[2] === headIdx) {
                  continue;
                }
                const p1 = projectedPoints[face[0]];
                const p2 = projectedPoints[face[1]];
                const p3 = projectedPoints[face[2]];
                if (!p1 || !p2 || !p3) continue;

                if (isPointInTriangle(headProj.x, headProj.y, p1, p2, p3)) {
                  const faceAvgDepth = (p1.zDepth + p2.zDepth + p3.zDepth) / 3;
                  if (faceAvgDepth < headProj.zDepth - 0.04) {
                    isOccludedByGeometry = true;
                    break;
                  }
                }
              }
            }

            if (isFullyWithinFrustum && !isOccludedByGeometry) {
              // 1. Render bone joint indicator for head anchorage
            ctx.beginPath();
            ctx.arc(headProj.x, headProj.y, 3 * distanceScale, 0, Math.PI * 2);
            ctx.fillStyle = meshColor;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();

            // 1b. Render dynamic Oracle Signaling indicator rings & personality pulse emitter
            if (oracleSignalingActive) {
              const pulseTime = Date.now() * 0.001 * oraclePulseFrequency;
              ctx.save();
              
              // Draw rotating target crosshair over the head joint
              ctx.translate(headProj.x, headProj.y);
              ctx.rotate(pulseTime * 0.5);
              ctx.strokeStyle = oraclePulseColor;
              ctx.lineWidth = 0.7 * distanceScale;
              ctx.beginPath();
              
              // Standard crosshair dashes
              const innerRadius = 5 * distanceScale;
              const outerRadius = 8 * distanceScale;
              // 4 ticks
              for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                ctx.moveTo(cosA * innerRadius, sinA * innerRadius);
                ctx.lineTo(cosA * outerRadius, sinA * outerRadius);
              }
              ctx.stroke();
              ctx.restore();

              // Draw multi-layered radiating sine-wave pulse rings (Personality Pulse Emitter)
              for (let r = 0; r < 3; r++) {
                const progression = ((pulseTime * 0.4 + r / 3) % 1.0);
                const pulseRad = (10 + progression * 30 * oraclePulseStrength) * distanceScale;
                const pulseOpacity = (1.0 - progression) * 0.45 * hudOpacity;
                
                ctx.beginPath();
                ctx.arc(headProj.x, headProj.y, pulseRad, 0, Math.PI * 2);
                ctx.strokeStyle = oraclePulseColor;
                ctx.lineWidth = 1.2 * distanceScale;
                ctx.save();
                ctx.globalAlpha = pulseOpacity;
                ctx.stroke();
                ctx.restore();
              }
            }

            // 1c. PersonalitySignalEmitter (Pulsing animation changing scale & opacity based on Oracle Intent Pulse logic)
            if (oracleSignalingActive) {
              const pulseTime = Date.now() * 0.001 * oraclePulseFrequency;
              
              // Deriving 'Oracle Intent Pulse' scale and opacity dynamically
              // Scale pulses between 0.6 and 1.8; Opacity pulses between 0.2 and 0.85
              const intentPulseScale = (Math.sin(pulseTime * 1.2) * 0.6 + 1.25) * distanceScale;
              const intentPulseOpacity = (Math.cos(pulseTime * 0.8) * 0.32 + 0.53) * hudOpacity;
              
              // Anchor coordinates to the right side of the head bone (pre-calculated)
              
              // Draw linking coordinate line from head bone joint to the PersonalitySignalEmitter node
              ctx.beginPath();
              ctx.setLineDash([2, 2]);
              ctx.moveTo(headProj.x, headProj.y);
              ctx.lineTo(emitterX, emitterY);
              ctx.strokeStyle = oraclePulseColor + '44'; // semi-transparent
              ctx.lineWidth = 0.8 * distanceScale;
              ctx.stroke();
              ctx.setLineDash([]); // Reset
              
              // Draw Emitter focal point circle
              ctx.beginPath();
              ctx.arc(emitterX, emitterY, 2.5 * distanceScale, 0, Math.PI * 2);
              ctx.fillStyle = oraclePulseColor;
              ctx.fill();
              
              // Draw the Personality intent pulse rings based on HUD Contract logic
              ctx.beginPath();
              ctx.arc(emitterX, emitterY, 12 * intentPulseScale, 0, Math.PI * 2);
              ctx.strokeStyle = oraclePulseColor;
              ctx.lineWidth = 1.0 * distanceScale;
              ctx.save();
              ctx.globalAlpha = intentPulseOpacity * 0.45;
              ctx.stroke();
              ctx.restore();

              // Draw outward radiating bracket arms rotating over time
              ctx.save();
              ctx.translate(emitterX, emitterY);
              ctx.rotate(-pulseTime * 0.45);
              ctx.strokeStyle = oraclePulseColor;
              ctx.lineWidth = 0.7 * distanceScale;
              ctx.globalAlpha = intentPulseOpacity;
              
              const bracketOffset = 6 * intentPulseScale;
              const bracketLen = 3.5 * distanceScale;
              // 3 radial brackets
              for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 3) {
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(cosA * bracketOffset, sinA * bracketOffset);
                ctx.lineTo(cosA * (bracketOffset + bracketLen), sinA * (bracketOffset + bracketLen));
                ctx.stroke();
              }
              ctx.restore();
              
              // Write diegetic HUD label 'PERS_SIGNAL_EMITTER' and pulsing telemetry data
              ctx.font = `bold ${5 * distanceScale}px monospace`;
              ctx.fillStyle = '#ffffff';
              ctx.save();
              ctx.globalAlpha = hudOpacity * 0.95;
              ctx.fillText("PERS_SIGNAL_EMITTER", emitterX + 6 * distanceScale, emitterY - 2 * distanceScale);
              
              ctx.fillStyle = oraclePulseColor;
              ctx.font = `500 ${4.5 * distanceScale}px monospace`;
              ctx.fillText(`INTENT_PULSE: ${(intentPulseScale / distanceScale).toFixed(2)}x`, emitterX + 6 * distanceScale, emitterY + 4 * distanceScale);
              ctx.restore();
            }

            // 2. Connector path linking HUD to root head joint
            ctx.beginPath();
            ctx.setLineDash([1.5, 3]);
            ctx.moveTo(headProj.x, headProj.y);
            ctx.lineTo(hudX, hudY + 12 * distanceScale);
            ctx.strokeStyle = meshColor === '#1a9490' ? 'rgba(73, 203, 214, 0.5)' : 'rgba(196, 106, 26, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]); // clear dash

            // Draw HUD billboard group card (using pre-calculated coordinates)
            ctx.save();
            
            ctx.globalAlpha = hudOpacity;

            // Frame backdrop
            ctx.fillStyle = 'rgba(6, 4, 3, 0.90)';
            ctx.strokeStyle = meshColor === '#1a9490' ? 'rgba(73, 203, 214, 0.75)' : 'rgba(196, 106, 26, 0.75)';
            ctx.lineWidth = 1.2 * distanceScale;
            ctx.beginPath();
            ctx.rect(hX, hY, hudW, hudH);
            ctx.fill();
            ctx.stroke();

            // Minimal tech brackets decoration
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.8 * distanceScale;
            const bSz = 3.5 * distanceScale;
            // Top Left corner bracket
            ctx.beginPath();
            ctx.moveTo(hX + bSz, hY); ctx.lineTo(hX, hY); ctx.lineTo(hX, hY + bSz);
            ctx.stroke();
            // Bottom Right corner bracket
            ctx.beginPath();
            ctx.moveTo(hX + hudW - bSz, hY + hudH); ctx.lineTo(hX + hudW, hY + hudH); ctx.lineTo(hX + hudW, hY + hudH - bSz);
            ctx.stroke();

            // System text headers (Explicit HUD_ROOT identifier)
            ctx.font = `bold ${7 * distanceScale}px monospace`;
            ctx.fillStyle = meshColor === '#1a9490' ? '#5de3de' : '#f08129';
            ctx.fillText(`HUD_ROOT // HEAD_BONE`, hX + 5 * distanceScale, hY + 9 * distanceScale);

            // Render designated HealthBar3D sub-module within HUDRoot
            drawHealthBar3D({
              ctx,
              hX,
              hY,
              hudW,
              hudH,
              distanceScale,
              hudHP,
              hudComposure,
              activeEffects,
              meshColor
            });

            // Ability Signal small clusters
            const spellX = hX + hudW - 20 * distanceScale;
            const spellY = hY + hudH - 7 * distanceScale;
            for (let i = 0; i < 3; i++) {
              ctx.beginPath();
              ctx.arc(spellX + i * 5 * distanceScale, spellY, 1.5 * distanceScale, 0, Math.PI * 2);
              ctx.fillStyle = i < 2 ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)';
              ctx.fill();
            }

            // Personality Signal wave representation
            const waveX = hX + 5 * distanceScale;
            const waveY = hY + hudH - 6 * distanceScale;
            ctx.beginPath();
            ctx.moveTo(waveX, waveY);
            for (let w = 0; w < 35 * distanceScale; w++) {
              const speedFactor = Date.now() * 0.006 * (2.0 - hudStress / 100);
              const wValY = waveY + Math.sin(w / distanceScale * 0.2 + speedFactor) * (1.2 * distanceScale * (1.0 + hudAggression / 100));
              ctx.lineTo(waveX + w, wValY);
            }
            ctx.strokeStyle = meshColor === '#1a9490' ? '#5de3de' : '#f08129';
            ctx.lineWidth = 0.6 * distanceScale;
            ctx.stroke();

            ctx.restore();
            } else {
              // Draw subtle diagnostic telemetry when occluded or out-of-bounds
              ctx.font = '500 7.5px monospace';
              ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
              if (!isFullyWithinFrustum) {
                ctx.fillText(`HUD_STATUS: OUT_OF_FRUSTUM_CLIPPED`, 16, height - 46);
              } else if (isOccludedByGeometry) {
                ctx.fillText(`HUD_STATUS: OCCLUDED_BY_WORLD_MODEL`, 16, height - 46);
              }
            }
          }
        }
      }

    };

    const render = () => {
      if (autoRotate && !isDragging) {
        localAngleY += (rotationSpeed * 0.015);
      }
      draw(ctx, canvas.width, canvas.height, localAngleY);

      // Render overlay particle emitter system
      const particles = particlesRef.current;
      if (particles.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.985; // slightly modified air resistance
          p.vy *= 0.985;
          p.angle += p.spin;
          p.vx += Math.cos(p.angle) * 0.03;
          p.vy += Math.sin(p.angle) * 0.03;
          
          p.life--;
          p.alpha = Math.max(0, p.life / p.maxLife);

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          // Dynamic radial color gradient for glowing spectral particle circles
          const particleGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          particleGrad.addColorStop(0, '#ffffff');
          particleGrad.addColorStop(0.3, p.color);
          particleGrad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = particleGrad;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
        ctx.restore();
      }

      animFrame = requestAnimationFrame(render);
    };

    // Assign snapshot exporter handler
    takeSnapshotRef.current = () => {
      const activeCanvas = canvasRef.current;
      if (!activeCanvas) return;

      const scaleFactor = 3; // 3x multiplier
      const origW = activeCanvas.width;
      const origH = activeCanvas.height;

      // Create high-res offscreen canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = origW * scaleFactor;
      offscreen.height = origH * scaleFactor;

      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      // Draw custom environment background on high-res snapshot
      if (bgOption === 'abyss') {
        const bgGrad = offCtx.createLinearGradient(0, 0, 0, offscreen.height);
        bgGrad.addColorStop(0, '#0d0b08');
        bgGrad.addColorStop(1, '#131008');
        offCtx.fillStyle = bgGrad;
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
      } else if (bgOption === 'slate') {
        const bgGrad = offCtx.createLinearGradient(0, 0, 0, offscreen.height);
        bgGrad.addColorStop(0, '#0b0f19');
        bgGrad.addColorStop(1, '#04060b');
        offCtx.fillStyle = bgGrad;
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
      } else if (bgOption === 'warm') {
        const bgGrad = offCtx.createLinearGradient(0, 0, 0, offscreen.height);
        bgGrad.addColorStop(0, '#180808');
        bgGrad.addColorStop(1, '#0a0303');
        offCtx.fillStyle = bgGrad;
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
      } else if (bgOption === 'nebula') {
        const bgGrad = offCtx.createLinearGradient(0, 0, 0, offscreen.height);
        bgGrad.addColorStop(0, '#10081c');
        bgGrad.addColorStop(1, '#05020a');
        offCtx.fillStyle = bgGrad;
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
      } else if (bgOption === 'moss') {
        const bgGrad = offCtx.createLinearGradient(0, 0, 0, offscreen.height);
        bgGrad.addColorStop(0, '#08120b');
        bgGrad.addColorStop(1, '#030805');
        offCtx.fillStyle = bgGrad;
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
      } else {
        offCtx.fillStyle = customBgColor;
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
      }

      offCtx.scale(scaleFactor, scaleFactor);

      // Render the current scene with exact current rotational angle Y
      draw(offCtx, origW, origH, localAngleY);

      try {
        const dataURL = offscreen.toDataURL('image/png');
        const link = document.createElement('a');
        const filename = model 
          ? `${model.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_snapshot.png` 
          : 'reactor_core_snapshot.png';
        link.download = filename;
        link.href = dataURL;
        link.click();
      } catch (e) {
        console.error('High-resolution snapshot export failed: ', e);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [
    viewMode, autoRotate, rotationSpeed, zoom, angleX, angleY, isDragging, ambientIntensity, meshColor, materialShader,
    hudActive, hudHP, hudComposure, hudAggression, hudStress, activeEffects, hudHeightOffset, hudViewFilter, hudScaleClamped,
    oracleSignalingActive, oraclePulseFrequency, oraclePulseStrength, oraclePulseColor, bgOption, customBgColor
  ]);

  // Handle Resize beautifully
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // UI Drag Handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    setAngleY(prev => prev + deltaX * 0.007);
    setAngleX(prev => Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, prev + deltaY * 0.007)));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Utility shader brightness adjustment
  const adjustBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
  };

  const getContainerBgStyle = () => {
    if (bgOption === 'abyss') return { background: 'linear-gradient(to bottom, #0d0b08, #131008)' };
    if (bgOption === 'slate') return { background: 'linear-gradient(to bottom, #0b0f19, #04060b)' };
    if (bgOption === 'warm') return { background: 'linear-gradient(to bottom, #180808, #0a0303)' };
    if (bgOption === 'nebula') return { background: 'linear-gradient(to bottom, #10081c, #05020a)' };
    if (bgOption === 'moss') return { background: 'linear-gradient(to bottom, #08120b, #030805)' };
    return { backgroundColor: customBgColor };
  };

  return (
    <div id="three-dimensional-viewer-container" className="flex flex-col h-full bg-[#0d0b08] rounded-xl border border-[#2e2418] overflow-hidden relative" ref={containerRef}>
      
      {/* Viewer header controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-4 py-3 bg-[#080604] border-b border-[#2e2418] gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#c46a1a] drop-shadow-[0_0_8px_rgba(196,106,26,0.4)] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-share font-semibold tracking-wider text-[#b0a090]">
            {model ? `CORE GRAPH: ${model.name}` : "SATELLITE SPECTRUM VIEW"}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
          {/* Material Shader Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0d0b08] px-2 py-1 rounded-lg border border-[#2e2418]">
            <span className="text-[9px] font-share font-semibold uppercase tracking-wider text-slate-500">Material Core:</span>
            <select
              id="material-shader-dropdown"
              value={materialShader}
              onChange={(e) => setMaterialShader(e.target.value as any)}
              className="bg-transparent text-[#c46a1a] font-share text-[10px] uppercase font-bold tracking-wider hover:text-[#e27c1f] transition cursor-pointer outline-none border-none py-0.5"
            >
              <option value="metallic_copper" className="bg-[#0d0b08] text-[#c46a1a]">Metallic Copper</option>
              <option value="volcanic_stone" className="bg-[#0d0b08] text-[#c46a1a]">Volcanic Stone</option>
              <option value="ethereal_glass" className="bg-[#0d0b08] text-[#c46a1a]">Ethereal Glass</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 p-0.5 bg-[#0d0b08] rounded-lg border border-[#2e2418]">
            <button
              onClick={() => setViewMode('solid')}
              className={`px-2 py-1 text-[10px] font-share rounded-md transition cursor-pointer ${viewMode === 'solid' ? 'bg-[#c46a1a]/15 text-[#c46a1a] border border-[#c46a1a]/30 font-bold' : 'text-slate-500 hover:text-slate-300 border border-transparent'}`}
              title="Core Alloy Casing"
            >
              Alloy Solid
            </button>
            <button
              onClick={() => setViewMode('wireframe')}
              className={`px-2 py-1 text-[10px] font-share rounded-md transition cursor-pointer ${viewMode === 'wireframe' ? 'bg-[#c46a1a]/15 text-[#c46a1a] border border-[#c46a1a]/30 font-bold' : 'text-slate-500 hover:text-slate-300 border border-transparent'}`}
              title="Nerve-Line Matrix"
            >
              Nerve Grid
            </button>
            <button
              onClick={() => setViewMode('pointcloud')}
              className={`px-2 py-1 text-[10px] font-share rounded-md transition cursor-pointer ${viewMode === 'pointcloud' ? 'bg-[#c46a1a]/15 text-[#c46a1a] border border-[#c46a1a]/30 font-bold' : 'text-slate-500 hover:text-slate-300 border border-transparent'}`}
              title="Ley Coordinate Vertices"
            >
              Ley Points
            </button>
          </div>

          {/* Snapshot Exporter Action */}
          <button
            onClick={() => takeSnapshotRef.current?.()}
            className="flex items-center gap-1.5 bg-[#c46a1a]/10 hover:bg-[#c46a1a]/20 text-[#c46a1a] hover:text-[#e27c1f] px-3 py-1.5 font-share text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#c46a1a]/30 hover:border-[#c46a1a]/50 transition cursor-pointer"
            title="Export High-Resolution Core Snapshot (PNG)"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snapshot</span>
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden shadow-inner transition-all duration-300"
           style={getContainerBgStyle()}
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}>
        
        {/* Render canvas */}
        <canvas ref={canvasRef} className="block w-full h-full relative z-10" />

        {/* 3D Grid background style */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "radial-gradient(#c46a1a 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

        {/* Floating overlays */}
        {model && (
          <div className="absolute top-3 left-3 bg-[#0d0b08]/95 backdrop-blur border border-[#2e2418] rounded-lg p-2.5 max-w-[200px] pointer-events-none z-20 shadow-lg">
            <p className="text-[9px] font-share text-[#8b7d6b] tracking-wider font-bold">RECONSTRUCTED CORE</p>
            <h4 className="text-xs font-cinzel text-white truncate my-1 font-bold">{model.name}</h4>
            <div className="flex gap-2 items-center mt-1.5">
              <img src={model.sourceImageUrl} referrerPolicy="no-referrer" alt="Source physical memory" className="w-8 h-8 rounded border border-[#2e2418] object-cover" />
              <div>
                <span className="text-[9px] font-share text-[#c46a1a] bg-[#c46a1a]/10 border border-[#c46a1a]/20 px-1 py-0.5 rounded">
                  FURNACE ACTIVE
                </span>
                <p className="text-[9px] font-mono text-slate-500 mt-0.5 truncate max-w-[120px]">{model.prompt}</p>
              </div>
            </div>
          </div>
        )}

        {/* HUD Contract Setup Calibration Box */}
        {model && (
          <div id="hud-contract-calibration-panel" className="absolute top-[135px] left-3 bg-[#0c0907]/96 backdrop-blur border border-[#2e2418]/90 rounded-lg p-2.5 max-w-[200px] w-full z-20 shadow-2xl text-[9px] select-none flex flex-col gap-1.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#2e2418]/60 pb-1 font-share">
              <span className="font-bold text-[#b0a090] uppercase tracking-wider text-[8px] flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-[#c46a1a] animate-pulse" /> HUD Contract Setup
              </span>
              <button 
                onClick={() => setHudActive(!hudActive)}
                className={`px-1.5 py-0.5 rounded border text-[7.5px] font-mono uppercase font-bold transition cursor-pointer ${hudActive ? 'bg-[#c46a1a]/20 text-[#c46a1a] border-[#c46a1a]/40' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
              >
                {hudActive ? "CONNECTED" : "OFFLINE"}
              </button>
            </div>
            
            {hudActive ? (
              <div className="space-y-1.5 font-mono text-[8px]">
                <div className="flex flex-col gap-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">HP Indicator:</span>
                    <span className="text-white font-bold">{hudHP}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={hudHP} 
                    onChange={(e) => setHudHP(parseInt(e.target.value))}
                    className="accent-[#c46a1a] w-full h-1 bg-[#131008] rounded cursor-pointer" 
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Composure:</span>
                    <span className="text-white font-bold">{hudComposure}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={hudComposure} 
                    onChange={(e) => setHudComposure(parseInt(e.target.value))}
                    className="accent-[#c46a1a] w-full h-1 bg-[#131008] rounded cursor-pointer" 
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stress Rate:</span>
                    <span className="text-white font-bold">{hudStress}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={hudStress} 
                    onChange={(e) => setHudStress(parseInt(e.target.value))}
                    className="accent-[#c46a1a] w-full h-1 bg-[#131008] rounded cursor-pointer" 
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aggression Level:</span>
                    <span className="text-[#ef4444] font-bold">{hudAggression}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={hudAggression} 
                    onChange={(e) => setHudAggression(parseInt(e.target.value))}
                    className="accent-[#ef4444] w-full h-1 bg-[#131008] rounded cursor-pointer" 
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500 block mb-0.5 font-bold uppercase text-[7.5px] tracking-wide">Status Effects (Single glyph):</span>
                  <div className="flex flex-wrap gap-1">
                    {['Ward', 'Oracle Mark', 'Poison', 'Burn', 'Stun'].map((effect) => {
                      const isActive = activeEffects.includes(effect);
                      return (
                        <button
                          key={effect}
                          onClick={() => {
                            if (isActive) {
                              setActiveEffects(prev => prev.filter(e => e !== effect));
                            } else {
                              setActiveEffects(prev => [...prev, effect]);
                            }
                          }}
                          className={`px-1 py-0.5 rounded text-[6.5px] uppercase font-bold transition border cursor-pointer ${
                            isActive
                              ? effect === 'Ward'
                                ? 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/35'
                                : effect === 'Oracle Mark'
                                  ? 'bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/35'
                                  : 'bg-rose-500/15 text-rose-400 border-rose-500/35'
                              : 'bg-[#15120e] text-slate-500 border-[#2e2418]/50 hover:text-slate-300'
                          }`}
                        >
                          {effect === 'Oracle Mark' ? 'ORC' : effect.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Oracle Signaling calibration Controls */}
                <div className="border-t border-[#2e2418]/40 pt-1.5 flex flex-col gap-1 text-[7px] space-y-1">
                  <div className="flex items-center justify-between border-b border-[#2e2418]/20 pb-0.5">
                    <span className="font-bold text-[#b0a090] uppercase tracking-wider text-[7px] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#a855f7] animate-pulse" /> Oracle Signaling
                    </span>
                    <button 
                      onClick={() => setOracleSignalingActive(!oracleSignalingActive)}
                      className={`px-1 py-0.2 rounded text-[6px] tracking-widest font-bold uppercase transition cursor-pointer ${oracleSignalingActive ? 'text-[#a855f7] border border-[#a855f7]/30 bg-[#a855f7]/10 font-black' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {oracleSignalingActive ? "BROADCASTING" : "OFFLINE"}
                    </button>
                  </div>
                  
                  {oracleSignalingActive && (
                    <div className="space-y-1">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between text-[6.5px]">
                          <span className="text-slate-500">Pulse Frequency (Hz):</span>
                          <span className="text-[#a855f7] font-bold">{oraclePulseFrequency.toFixed(1)}x</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="5.0" 
                          step="0.5"
                          value={oraclePulseFrequency} 
                          onChange={(e) => setOraclePulseFrequency(parseFloat(e.target.value))}
                          className="accent-[#a855f7] w-full h-1 bg-[#131008] rounded cursor-pointer" 
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between text-[6.5px]">
                          <span className="text-slate-500">Emitter Strength:</span>
                          <span className="text-[#a855f7] font-bold">{oraclePulseStrength.toFixed(0)}m</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={oraclePulseStrength} 
                          onChange={(e) => setOraclePulseStrength(parseInt(e.target.value))}
                          className="accent-[#a855f7] w-full h-1 bg-[#131008] rounded cursor-pointer" 
                        />
                      </div>

                      <div className="flex justify-between items-center text-[6.5px]">
                        <span className="text-slate-500">Telemetry Color:</span>
                        <div className="flex gap-1.5">
                          {['#a855f7', '#ec4899', '#3b82f6', '#f59e0b'].map((hex) => (
                            <button
                              key={hex}
                              onClick={() => setOraclePulseColor(hex)}
                              className={`w-2 h-2 rounded-full border transition cursor-pointer ${oraclePulseColor === hex ? 'border-white scale-125' : 'border-transparent opacity-60 hover:opacity-100'}`}
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#2e2418]/40 pt-1.5 flex flex-col gap-1 text-[7px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">POV Opacity Filter:</span>
                    <div className="flex gap-1.5">
                      {['owned', 'other', 'oracle'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setHudViewFilter(mode as any)}
                          className={`text-[7px] uppercase font-bold transition cursor-pointer ${hudViewFilter === mode ? 'text-[#c46a1a] underline font-black' : 'text-slate-505 hover:text-slate-300'}`}
                        >
                          {mode.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Height Offset:</span>
                    <span className="text-teal-400 font-bold">{hudHeightOffset}m</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[8px] text-slate-500 text-center py-2">
                Diegetic HUD contract interface bypassed. Reverting to baseline raw viewport rendering.
              </div>
            )}
          </div>
        )}

        {/* Custom "Forge Pilot MTD" trigger button */}
        {onTriggerMtd && (
          <button
            onClick={onTriggerMtd}
            id="forge-pilot-mtd-trigger-btn"
            className="absolute bottom-3 left-3 bg-gradient-to-r from-[#c46a1a]/85 to-[#a67c2a]/85 hover:from-[#c46a1a] hover:to-[#a67c2a] border border-[#c46a1a]/60 px-3.5 py-2.5 rounded-lg text-[9px] font-mono text-white font-extrabold tracking-widest uppercase shadow-[0_0_15px_rgba(196,106,26,0.25)] hover:shadow-[0_0_25px_rgba(196,106,26,0.5)] transition-all flex items-center gap-1.5 cursor-pointer z-20 animate-pulse hover:animate-none"
          >
            <Layers className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '3s' }} />
            <span>FORGE PILOT MTD</span>
          </button>
        )}

        {/* Viewport coordinate crosshair */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
          <div className="flex gap-1 bg-[#0d0b08]/90 backdrop-blur border border-[#2e2418] rounded px-2 py-0.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c46a1a]" />
            <span className="text-[8px] font-mono text-slate-400">LAT-ROT: {angleX.toFixed(2)}</span>
          </div>
          <div className="flex gap-1 bg-[#0d0b08]/90 backdrop-blur border border-[#2e2418] rounded px-2 py-0.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a67c2a]" />
            <span className="text-[8px] font-mono text-slate-400">LON-ROT: {angleY.toFixed(2)}</span>
          </div>
        </div>

        {/* Dynamic Measurement Overlay */}
        {model && meshDimensions && (
          <div 
            id="measurement-overlay-status-card" 
            className="absolute top-[75px] right-3 bg-[#0d0b08]/95 backdrop-blur border border-[#2e2418] rounded-lg p-2.5 min-w-[190px] z-20 shadow-2xl flex flex-col gap-1.5 text-[9px] select-none animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-[#2e2418] pb-1 font-share mb-1">
              <span className="font-bold text-[#b0a090] uppercase tracking-widest text-[8px] flex items-center gap-1">
                <Grid className="w-3 h-3 text-[#c46a1a] animate-pulse" />
                <span>MEASURE PROTOCOL</span>
              </span>
              <button 
                onClick={() => setShowMeasurements(!showMeasurements)}
                className={`px-1.5 py-0.5 rounded text-[7.5px] font-mono uppercase font-bold transition-all cursor-pointer border ${
                  showMeasurements 
                    ? 'bg-[#c46a1a]/20 text-[#c46a1a] border-[#c46a1a]/40 font-black' 
                    : 'bg-slate-950/80 text-slate-500 border-slate-800'
                }`}
              >
                {showMeasurements ? "ENABLED" : "MUTED"}
              </button>
            </div>

            {showMeasurements ? (
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-[8.5px]">
                  <span className="text-slate-500">X-Span (Width):</span>
                  <span className={`${meshColor === '#1a9490' ? 'text-[#49cbd6]' : 'text-[#f08129]'} font-bold`}>
                    {(meshDimensions.width * 1.5).toFixed(2)} m
                  </span>
                </div>
                <div className="flex justify-between items-center text-[8.5px]">
                  <span className="text-slate-500">Y-Span (Height):</span>
                  <span className={`${meshColor === '#1a9490' ? 'text-[#49cbd6]' : 'text-[#f08129]'} font-bold`}>
                    {(meshDimensions.height * 1.5).toFixed(2)} m
                  </span>
                </div>
                <div className="flex justify-between items-center text-[8.5px]">
                  <span className="text-slate-500">Z-Span (Depth):</span>
                  <span className={`${meshColor === '#1a9490' ? 'text-[#49cbd6]' : 'text-[#f08129]'} font-bold`}>
                    {(meshDimensions.depth * 1.5).toFixed(2)} m
                  </span>
                </div>
                
                <div className="border-t border-[#2e2418]/50 pt-1.5 space-y-1 text-[7.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Volumetric Box:</span>
                    <span className="text-slate-300">
                      {(meshDimensions.width * 1.5 * meshDimensions.height * 1.5 * meshDimensions.depth * 1.5).toFixed(3)} m³
                    </span>
                  </div>
                  <div className="flex justify-between text-[7px] text-slate-500 italic">
                    <span>*Approx bounds in real space</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[7.5px] text-slate-500 leading-relaxed italic">
                Measurement wireframe projection disabled. Click toggle to project dimensional guides.
              </div>
            )}
          </div>
        )}

        {/* Real-time Shader Telemetry HUD Card */}
        {model && (
          <div id="shader-telemetry-status-card" className="absolute bottom-3 right-3 bg-[#0d0b08]/95 backdrop-blur border border-[#2e2418] rounded-lg p-2.5 min-w-[170px] pointer-events-none z-20 shadow-xl flex flex-col gap-1 text-[9px] select-none">
            <div className="flex items-center gap-1.5 border-b border-[#2e2418] pb-1 font-share mb-1">
              <Sliders className="w-3 h-3 text-[#c46a1a] drop-shadow-[0_0_8px_rgba(196,106,26,0.2)] animate-pulse" />
              <span className="font-bold text-[#b0a090] uppercase tracking-widest text-[8px]">Shader Telemetry</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Material:</span>
              <span className="text-[#c46a1a] font-bold text-right truncate max-w-[100px]">{MATERIAL_PRESETS[materialShader].name}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Roughness:</span>
              <span className="text-slate-300">{(MATERIAL_PRESETS[materialShader].roughness * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Reflection:</span>
              <span className="text-slate-300">{(MATERIAL_PRESETS[materialShader].reflection * 100).toFixed(0)}%</span>
            </div>
            {materialShader === 'ethereal_glass' && (
              <div className="flex justify-between font-mono animate-pulse">
                <span className="text-slate-500">Refract Limit:</span>
                <span className="text-[#49cbd6] font-bold">{MATERIAL_PRESETS[materialShader].refractionIndex.toFixed(2)} IOR</span>
              </div>
            )}
            {materialShader === 'volcanic_stone' && (
              <div className="flex justify-between font-mono animate-pulse">
                <span className="text-[#e15215] font-bold uppercase text-[8px]">Magma Emission:</span>
                <span className="text-[#e15215] font-bold text-[8px]">75% Heat</span>
              </div>
            )}
          </div>
        )}

        {/* Background Instruction Overlay when no model */}
        {!model && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none z-10">
            <Grid className="w-10 h-10 text-[#3a2e1e] animate-pulse mb-3" />
            <h3 className="text-sm font-cinzel font-bold text-[#8b7d6b] tracking-wider uppercase">FURNACE PLATFORM CONNECTIVITY</h3>
            <p className="text-xs text-slate-600 max-w-sm mt-1 leading-relaxed font-mono">
              Provide an anomalous memory on the left compiler first, trigger the decryption, and process in the Furnace platform.
            </p>
          </div>
        )}
      </div>

      {/* Control panel sliders footer */}
      <div className="px-4 py-3 bg-[#080604] border-t border-[#2e2418] grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Playback Controls */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-share text-slate-400 tracking-widest uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#c46a1a]" /> Ley Rotation Core
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${autoRotate ? 'bg-[#c46a1a]/10 text-[#c46a1a] border-[#c46a1a]/30' : 'bg-[#0d0b08] text-slate-500 border-[#2e2418] hover:text-slate-300'}`}
              title={autoRotate ? "Pause Rotation" : "Play Rotation"}
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] font-share text-slate-500 w-8">Speed</span>
              <input
                type="range"
                min="0.1"
                max="4"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                disabled={!autoRotate}
                className="flex-1 accent-[#c46a1a] cursor-pointer h-1 bg-[#0d0b08] rounded-lg appearance-none"
              />
              <span className="text-[10px] font-mono text-slate-400 w-6 text-right">{rotationSpeed.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        {/* Shader Adjustments */}
        <div className="flex flex-col gap-2 border-t lg:border-t-0 lg:border-x border-[#2e2418]/60 pt-2 lg:pt-0 lg:px-4">
          <span className="text-[9px] font-share text-slate-400 tracking-widest uppercase flex items-center gap-1">
            <Sliders className="w-3 h-3 text-[#c46a1a]" /> Core Customization
          </span>
          <div className="flex gap-4 items-center justify-between">
            {/* Zoom Slider */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] font-share text-[#e0e0e0] w-8">Scale</span>
              <input
                type="range"
                min="0.4"
                max="1.8"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#c46a1a] cursor-pointer h-1 bg-[#0d0b08] rounded-lg appearance-none"
              />
              <span className="text-[10px] font-mono text-slate-400 w-6 text-right">{Math.round(zoom * 100)}%</span>
            </div>
            
            {/* Mesh Shader Color picker */}
            <div className="flex items-center gap-2 font-share">
              <span className="text-[10px] text-slate-400 w-8">Mineral</span>
              <div className="flex gap-1 bg-[#0d0b08] p-1 rounded-lg border border-[#2e2418]">
                {['#c46a1a', '#1a9490', '#a67c2a', '#8b7d6b', '#8b2020'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setMeshColor(c)}
                    className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${meshColor === c ? 'ring-2 ring-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Environment Chamber Background Customizer */}
        <div className="flex flex-col gap-2 border-t lg:border-t-0 border-[#2e2418]/60 pt-2 lg:pt-0">
          <span className="text-[9px] font-share text-slate-400 tracking-widest uppercase flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#c46a1a]" /> Environment Chamber
          </span>
          <div className="flex gap-4 items-center justify-between">
            {/* Presets flex list */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-share text-slate-500">Theme</span>
              <div className="flex gap-1.5 bg-[#0d0b08] p-1 rounded-lg border border-[#2e2418]">
                {[
                  { id: 'abyss', name: 'Abyss', style: 'linear-gradient(135deg, #0d0b08, #131008)' },
                  { id: 'slate', name: 'Slate', style: 'linear-gradient(135deg, #0b0f19, #04060b)' },
                  { id: 'warm', name: 'Warm', style: 'linear-gradient(135deg, #180808, #0a0303)' },
                  { id: 'nebula', name: 'Nebula', style: 'linear-gradient(135deg, #10081c, #05020a)' },
                  { id: 'moss', name: 'Moss', style: 'linear-gradient(135deg, #08120b, #030805)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBgOption(opt.id)}
                    title={`Chamber Mode: ${opt.name}`}
                    className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer flex-shrink-0 ${bgOption === opt.id ? 'ring-2 ring-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                    style={{ background: opt.style }}
                  />
                ))}
              </div>
            </div>

            {/* Custom hex color selector button */}
            <div className="flex items-center gap-1.5 bg-[#0d0b08]/80 px-2 py-1 rounded-lg border border-[#2e2418] hover:border-[#3d3020] transition">
              <label 
                htmlFor="chamber-custom-color-picker" 
                className="text-[10px] font-share text-slate-400 cursor-pointer hover:text-slate-100 uppercase tracking-widest select-none text-[8px]"
              >
                Custom
              </label>
              <div className="relative flex items-center">
                <input
                  id="chamber-custom-color-picker"
                  type="color"
                  value={customBgColor}
                  onChange={(e) => {
                    setCustomBgColor(e.target.value);
                    setBgOption('custom');
                  }}
                  className="w-4 h-4 bg-transparent border-0 rounded cursor-pointer p-0 accent-[#c46a1a] outline-none"
                  title="Choose exact custom background color"
                />
                {bgOption === 'custom' && (
                  <span className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-[#c46a1a] ring-1 ring-black animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
