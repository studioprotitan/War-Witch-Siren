import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Activity } from 'lucide-react';

interface AudioVisualizerBarChartProps {
  isPulseCoreActive: boolean;
  pulseFrequency: number;
}

export default function AudioVisualizerBarChart({ isPulseCoreActive, pulseFrequency }: AudioVisualizerBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Channels data ref to avoid React state re-render overhead in 60fps animation loop
  const channelsRef = useRef<number[]>([15, 10, 12, 8, 11, 14, 9, 13, 10, 7, 12, 10]);
  const numBars = 12;

  useEffect(() => {
    // Listen to real-time events from our audio play triggers
    const handleAudioEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type;
      
      const current = channelsRef.current;
      if (type === 'pulse') {
        // Spike Sub-bass & Lows
        current[0] = Math.max(current[0], 95);
        current[1] = Math.max(current[1], 90);
        current[2] = Math.max(current[2], 80);
        current[3] = Math.max(current[3], 60);
        current[4] = Math.max(current[4], 40);
        // Add a bit of decay-ripple to the rest
        for (let i = 5; i < numBars; i++) {
          current[i] = Math.max(current[i], Math.random() * 25 + 15);
        }
      } else if (type === 'alert') {
        // Alarm/siren: huge mid-range spike and high frequency shimmer
        for (let i = 0; i < numBars; i++) {
          if (i >= 3 && i <= 8) {
            current[i] = Math.max(current[i], 98);
          } else {
            current[i] = Math.max(current[i], Math.random() * 45 + 30);
          }
        }
      } else if (type === 'beep') {
        // High-pitch sci-fi beep
        current[7] = Math.max(current[7], 65);
        current[8] = Math.max(current[8], 85);
        current[9] = Math.max(current[9], 90);
        current[10] = Math.max(current[10], 80);
        current[11] = Math.max(current[11], 70);
      } else if (type === 'ping') {
        // Sonar ping: ringing presence and air
        current[5] = Math.max(current[5], 50);
        current[6] = Math.max(current[6], 75);
        current[7] = Math.max(current[7], 85);
        current[8] = Math.max(current[8], 70);
        current[9] = Math.max(current[9], 55);
      } else if (type === 'hum') {
        // Decryption electric power grid hum
        current[0] = Math.max(current[0], 75);
        current[1] = Math.max(current[1], 70);
        current[2] = Math.max(current[2], 55);
      }
    };

    window.addEventListener('reactor-audio-event', handleAudioEvent);
    return () => {
      window.removeEventListener('reactor-audio-event', handleAudioEvent);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 240;
    const height = 40;
    
    // Set up responsive scales
    const xScale = d3.scaleBand()
      .domain(d3.range(numBars).map(String))
      .range([4, width - 4])
      .paddingInner(0.22);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height - 2, 2]);

    // Initial render of rect bars using D3 join
    const bars = svg.selectAll<SVGRectElement, string>('rect')
      .data(d3.range(numBars).map(String))
      .join('rect')
      .attr('x', d => xScale(d) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', height - 2)
      .attr('height', 0)
      .attr('rx', 1.5)
      .attr('ry', 1.5)
      .attr('fill', '#1a9490');

    // Peak dot tracking indicators for a high-end visualizer look
    const peakIndicators = d3.range(numBars).map(() => 0);

    const peaks = svg.selectAll<SVGCircleElement, string>('circle')
      .data(d3.range(numBars).map(String))
      .join('circle')
      .attr('cx', d => (xScale(d) || 0) + xScale.bandwidth() / 2)
      .attr('cy', height - 2)
      .attr('r', 1)
      .attr('fill', '#00fffa')
      .attr('opacity', 0.85);

    let animationId: number;
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const current = channelsRef.current;
      
      for (let i = 0; i < numBars; i++) {
        // Continuous ambient/idle fluctuation
        let ambient = Math.sin(now * 0.003 + i * 0.8) * 4;
        if (isPulseCoreActive) {
          // If the pulse core hum is active, add extra rhythm to ambient fluctuation based on frequency
          ambient += Math.sin(now * 0.006 * pulseFrequency + i * 0.5) * 8;
        }
        
        // Decay the current value towards the ambient noise floor
        const decayRate = 3.5; // decay multiplier
        const target = Math.max(8 + ambient, 5);
        current[i] = current[i] - (current[i] - target) * Math.min(1.0, decayRate * delta);

        // Keep bounds
        current[i] = Math.max(2, Math.min(100, current[i]));

        // Peak indicators drift down slower
        if (current[i] > peakIndicators[i]) {
          peakIndicators[i] = current[i];
        } else {
          peakIndicators[i] = Math.max(2, peakIndicators[i] - 35 * delta);
        }
      }

      // Update actual visual attributes using fast D3 selections
      bars
        .attr('y', (_, i) => yScale(current[i]))
        .attr('height', (_, i) => Math.max(0.5, height - 2 - yScale(current[i])))
        .attr('fill', (_, i) => {
          // Change color gradient from teal to orange/red depending on frequency level
          const val = current[i];
          if (val > 80) return '#ef4444'; // Red peak
          if (val > 55) return '#c46a1a'; // Amber warning
          return '#1a9490'; // Teal core
        });

      peaks
        .attr('cy', (_, i) => yScale(peakIndicators[i]) - 1.5)
        .attr('fill', (_, i) => {
          if (peakIndicators[i] > 80) return '#ff3b3b';
          if (peakIndicators[i] > 55) return '#ffa424';
          return '#00fffa';
        });

      animationId = requestAnimationFrame(updateLoop);
    };

    animationId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPulseCoreActive, pulseFrequency]);

  return (
    <div 
      ref={containerRef}
      className="bg-[#030201] border border-[#211a12] rounded p-2 flex flex-col font-mono relative overflow-hidden select-none"
      id="audio-spectral-visualizer-container"
    >
      <div className="flex items-center justify-between text-[5.5px] text-[#8e806a] uppercase tracking-widest font-black border-b border-[#211a12]/50 pb-1 mb-1.5">
        <span className="flex items-center gap-1">
          <Activity className="w-2.5 h-2.5 text-[#1a9490] animate-pulse" />
          ⬡ D3 Spectral Telemetry Analyzer
        </span>
        <span className="text-[5px] text-[#00fffa] font-extrabold tracking-normal">
          {isPulseCoreActive ? 'RESONATING @ ' + pulseFrequency.toFixed(1) + 'Hz' : 'AMBIENT MONITORING'}
        </span>
      </div>

      <div className="w-full flex items-center justify-center min-h-[40px]">
        <svg 
          ref={svgRef}
          viewBox="0 0 240 40"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          id="d3-audio-bar-chart-svg"
        />
      </div>
      
      {/* Visual Frequency labels */}
      <div className="flex justify-between text-[4.5px] text-[#a89880]/50 uppercase font-bold px-1 pt-1 border-t border-[#211a12]/30">
        <span>SUB</span>
        <span>LOW</span>
        <span>MID-L</span>
        <span>MID</span>
        <span>MID-H</span>
        <span>HIGH</span>
        <span>AIR</span>
      </div>
    </div>
  );
}
