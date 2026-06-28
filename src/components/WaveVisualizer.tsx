/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { WaveType } from '../types';
import { translations } from '../data/translations';

interface WaveVisualizerProps {
  onToast: (msg: string) => void;
  lang: 'id' | 'en';
  waveType?: WaveType;
  onWaveTypeChange?: (waveType: WaveType) => void;
}

export default function WaveVisualizer({ onToast, lang, waveType: controlledWaveType, onWaveTypeChange }: WaveVisualizerProps) {
  const [frequency, setFrequency] = useState(2);
  const [amplitude, setAmplitude] = useState(40);
  const [phase, setPhase] = useState(0);
  const [internalWaveType, setInternalWaveType] = useState<WaveType>('sine');
  const t = translations[lang];

  const waveType = controlledWaveType !== undefined ? controlledWaveType : internalWaveType;
  const setWaveType = (type: WaveType) => {
    if (onWaveTypeChange) {
      onWaveTypeChange(type);
    } else {
      setInternalWaveType(type);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep latest parameters in a ref for consumption in the drawing loop
  const paramsRef = useRef({ frequency, amplitude, phase, waveType });
  paramsRef.current = { frequency, amplitude, phase, waveType };

  // Animation and drawing function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let driftPhase = 0;
    let canvasWidth = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvasWidth = rect.width;
      // Setup high DPI rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = 300 * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '300px';
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Use ResizeObserver to adapt smoothly to panel changes
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const draw = () => {
      const width = canvasWidth;
      const height = 300;

      if (width === 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Access latest values instantly via ref to prevent loop tearing and rebuild lag
      const { frequency, amplitude, phase, waveType } = paramsRef.current;
      const currentPhase = driftPhase + phase;

      // Draw mathematical guide grid lines
      ctx.strokeStyle = 'rgba(10, 10, 10, 0.04)';
      ctx.lineWidth = 1;

      // Center baseline
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Vertical helper lines
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw the active waveform
      ctx.beginPath();
      ctx.strokeStyle = '#0A0A0A';
      ctx.lineWidth = 2.5;

      if (waveType === 'sine') {
        for (let x = 0; x < width; x++) {
          const radians = (x / width) * Math.PI * 2 * frequency + currentPhase;
          const y = height / 2 + Math.sin(radians) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      } else if (waveType === 'fourier') {
        // Approximate square wave using odd harmonics
        for (let x = 0; x < width; x++) {
          let ySum = 0;
          const baseRad = (x / width) * Math.PI * 2 * frequency + currentPhase;
          for (let n = 1; n <= 7; n += 2) {
            ySum += (4 / (Math.PI * n)) * Math.sin(n * baseRad);
          }
          const y = height / 2 + ySum * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      } else if (waveType === 'chaos') {
        // Combining two non-harmonic sine curves for complex wave structures
        for (let x = 0; x < width; x++) {
          const r1 = (x / width) * Math.PI * 2 * frequency + currentPhase;
          const r2 = (x / width) * Math.PI * 8 * (frequency / 2.5) - currentPhase * 1.3;
          const y = height / 2 + (Math.sin(r1) * 0.65 + Math.sin(r2) * 0.35) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw the floating tracking particle element in the middle
      ctx.fillStyle = '#0A0A0A';
      ctx.beginPath();
      const trackerRad = 0.5 * Math.PI * 2 * frequency + currentPhase;
      let trackerY = height / 2;

      if (waveType === 'sine') {
        trackerY += Math.sin(trackerRad) * amplitude;
      } else if (waveType === 'fourier') {
        let ySum = 0;
        for (let n = 1; n <= 7; n += 2) {
          ySum += (4 / (Math.PI * n)) * Math.sin(n * trackerRad);
        }
        trackerY += ySum * amplitude;
      } else if (waveType === 'chaos') {
        const r2 = 0.5 * Math.PI * 8 * (frequency / 2.5) - currentPhase * 1.3;
        trackerY += (Math.sin(trackerRad) * 0.65 + Math.sin(r2) * 0.35) * amplitude;
      }

      ctx.arc(width / 2, trackerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Ripple halo outline around tracking particle
      ctx.strokeStyle = '#0A0A0A';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(width / 2, trackerY, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      driftPhase += 0.02; // Increment phase drift at roughly 60fps
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  const handleReset = () => {
    setFrequency(2);
    setAmplitude(40);
    setPhase(0);
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Control sliders side menu */}
      <div className="lg:col-span-4 space-y-8">
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-lightgray">
            {t.wave_badge}
          </p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-brand-accent leading-tight">
            {t.wave_title}
          </h2>
          <p className="text-brand-midgray text-xs leading-relaxed font-sans">
            {t.wave_desc}
          </p>
        </div>

        {/* Wave generator type buttons */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono tracking-wider uppercase text-brand-accent block font-semibold">
            {t.wave_label_type}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              onClick={() => {
                setWaveType('sine');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className={`py-3 px-2 text-[10px] font-mono border text-center transition-colors rounded-none cursor-pointer ${
                waveType === 'sine'
                  ? 'bg-brand-accent text-brand-offwhite border-brand-accent font-bold'
                  : 'bg-brand-card border-brand-border text-brand-midgray hover:border-brand-accent'
              }`}
            >
              {t.wave_type_sine}
            </motion.button>
            <motion.button
              onClick={() => {
                setWaveType('fourier');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className={`py-3 px-2 text-[10px] font-mono border text-center transition-colors rounded-none cursor-pointer ${
                waveType === 'fourier'
                  ? 'bg-brand-accent text-brand-offwhite border-brand-accent font-bold'
                  : 'bg-brand-card border-brand-border text-brand-midgray hover:border-brand-accent'
              }`}
            >
              {t.wave_type_fourier}
            </motion.button>
            <motion.button
              onClick={() => {
                setWaveType('chaos');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className={`py-3 px-2 text-[10px] font-mono border text-center transition-colors rounded-none cursor-pointer ${
                waveType === 'chaos'
                  ? 'bg-brand-accent text-brand-offwhite border-brand-accent font-bold'
                  : 'bg-brand-card border-brand-border text-brand-midgray hover:border-brand-accent'
              }`}
            >
              {t.wave_type_chaos}
            </motion.button>
          </div>
        </div>

        {/* Sliders container */}
        <div className="space-y-6 pt-4 border-t border-brand-border font-mono text-xs">
          {/* Frequency Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-brand-accent uppercase tracking-wider font-semibold">
                {t.wave_slider_freq}
              </span>
              <span className="font-bold">{frequency} Hz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-full h-1 bg-brand-border accent-brand-accent cursor-pointer"
            />
          </div>

          {/* Amplitude Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-brand-accent uppercase tracking-wider font-semibold">
                {t.wave_slider_amp}
              </span>
              <span className="font-bold">{amplitude} px</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="1"
              value={amplitude}
              onChange={(e) => setAmplitude(parseInt(e.target.value))}
              className="w-full h-1 bg-brand-border accent-brand-accent cursor-pointer"
            />
          </div>

          {/* Adjustments Actions */}
          <div className="pt-2">
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-full bg-brand-accent text-brand-offwhite hover:bg-neutral-900 border border-brand-accent py-3.5 px-4 text-[10px] tracking-widest transition-colors rounded-none uppercase font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              {t.wave_btn_reset}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Screen Monitor for canvas waveforms */}
      <div className="lg:col-span-8 bg-brand-card border border-brand-border p-6 rounded-none relative shadow-sm">
        {/* Responsive flex indicator and formula to prevent mobile grid overlap */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 font-mono text-[9px] text-brand-lightgray">
          <div className="flex items-center gap-2 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
            {t.wave_monitor_title}
          </div>
          <div className="text-[10px] sm:text-right">
            {waveType === 'sine'
              ? t.wave_formula_sine
              : waveType === 'fourier'
              ? t.wave_formula_fourier
              : t.wave_formula_chaos}
          </div>
        </div>

        <div className="border border-brand-border bg-brand-offwhite flex flex-col justify-center items-center overflow-hidden">
          <canvas ref={canvasRef} className="block w-full cursor-crosshair"></canvas>
        </div>

        {/* Readout calculations underneath */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-brand-border text-[11px] font-mono">
          <div>
            <p className="text-brand-lightgray uppercase">{t.wave_label_sampling}</p>
            <p className="text-brand-accent font-semibold">{(frequency * 1.618).toFixed(3)} GS/s</p>
          </div>
          <div>
            <p className="text-brand-lightgray uppercase">{t.wave_label_distortion}</p>
            <p className="text-brand-accent font-semibold">
              {waveType === 'sine' ? '0.00%' : waveType === 'fourier' ? '12.43%' : '84.11%'}
            </p>
          </div>
          <div>
            <p className="text-brand-lightgray uppercase">{t.wave_label_status}</p>
            <p className="text-neutral-900 font-semibold">{t.wave_status_val}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
