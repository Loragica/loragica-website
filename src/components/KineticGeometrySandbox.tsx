/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SandboxQuadrant } from '../types';
import { translations } from '../data/translations';

interface KineticGeometrySandboxProps {
  onToast: (msg: string) => void;
  lang: 'id' | 'en';
}

export default function KineticGeometrySandbox({ onToast, lang }: KineticGeometrySandboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const physicsContainerRef = useRef<HTMLDivElement>(null);

  const [antigravityActive, setAntigravityActive] = useState(false);
  const [gravityMode, setGravityMode] = useState<'gravity' | 'zero-g'>('gravity');
  const t = translations[lang];

  const [telemetry, setTelemetry] = useState({
    gravityLabel: lang === 'id' ? 'Gravitasi: Bumi (9.8m/s²)' : 'Gravity: Earth (9.8m/s²)',
    entropyLabel: lang === 'id' ? 'Energi Kinetik: 0.00 J' : 'Kinetic Energy: 0.00 J',
    stateLabel: lang === 'id' ? 'SEIMBANG' : 'BALANCED',
    isUnstable: false,
  });

  const quadrantsRef = useRef<SandboxQuadrant[]>([
    { id: 0, x: 0, y: 0, homeX: 0, homeY: 0, vx: 0, vy: 0, angle: 0, angleVel: 0, w: 100, h: 100, isDragging: false },
    { id: 1, x: 0, y: 0, homeX: 0, homeY: 0, vx: 0, vy: 0, angle: 0, angleVel: 0, w: 100, h: 100, isDragging: false },
    { id: 2, x: 0, y: 0, homeX: 0, homeY: 0, vx: 0, vy: 0, angle: 0, angleVel: 0, w: 100, h: 100, isDragging: false },
    { id: 3, x: 0, y: 0, homeX: 0, homeY: 0, vx: 0, vy: 0, angle: 0, angleVel: 0, w: 100, h: 100, isDragging: false },
  ]);

  const stateRefs = useRef({
    antigravityActive,
    gravityMode,
    lang,
  });

  useEffect(() => {
    stateRefs.current.antigravityActive = antigravityActive;
    stateRefs.current.gravityMode = gravityMode;
    stateRefs.current.lang = lang;
  }, [antigravityActive, gravityMode, lang]);

  useEffect(() => {
    setTelemetry((prev) => {
      const trans = translations[lang];
      const oldTrans = translations[lang === 'id' ? 'en' : 'id'];
      const gravStr = gravityMode === 'gravity' ? trans.sand_label_grav_earth : trans.sand_label_grav_zero;
      
      let floatValStr = "0.00";
      const match = prev.entropyLabel.match(/[\d.]+/);
      if (match) {
        floatValStr = match[0];
      }

      return {
        ...prev,
        gravityLabel: gravStr,
        entropyLabel: `${trans.sand_label_energy}: ${floatValStr} J`,
        stateLabel: prev.isUnstable ? trans.sand_label_state_unstable : trans.sand_label_state_balanced
      };
    });
  }, [lang]);

  // Main 60FPS physics loop
  useEffect(() => {
    const container = physicsContainerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('.quadrant-item') as NodeListOf<HTMLDivElement>;

    // Cache DOM queries once instead of querying inside the 60fps loop
    const lineElements = Array.from({ length: 4 }, (_, i) => container.querySelector(`#line-${i}`));
    const dockElements = Array.from({ length: 4 }, (_, i) => container.querySelector(`#dock-${i}`));
    const coordElements = Array.from({ length: 4 }, (_, i) => container.querySelector(`#coord-${i}`));

    let containerWidth = 0;
    let containerHeight = 0;

    const initPositions = () => {
      const cx = containerWidth / 2;
      const cy = containerHeight / 2;
      const offset = 54; // Spacing around completed logo layout

      const homePositions = [
        { x: cx - offset, y: cy - offset }, // Q1
        { x: cx + offset, y: cy - offset }, // Q2
        { x: cx - offset, y: cy + offset }, // Q3
        { x: cx + offset, y: cy + offset }, // Q4
      ];

      quadrantsRef.current.forEach((quad, idx) => {
        quad.homeX = homePositions[idx].x;
        quad.homeY = homePositions[idx].y;
        if (quad.x === 0 && quad.y === 0) {
          quad.x = quad.homeX;
          quad.y = quad.homeY;
        }
      });
    };

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      containerWidth = rect.width;
      containerHeight = rect.height;
    };

    updateDimensions();
    initPositions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      initPositions();
    });
    resizeObserver.observe(container);

    let animFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let dragQuad: SandboxQuadrant | null = null;
    let dragOffset = { x: 0, y: 0 };

    const updateMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
    };

    const handleStartDrag = (e: MouseEvent | TouchEvent) => {
      // Prevent drag conflicts when clicking action buttons
      if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
        return;
      }

      updateMousePos(e);
      const clickedEl = (e.target as HTMLElement).closest('.quadrant-item');
      if (!clickedEl) return;

      // Prevent scroll defaults when touching drag targets
      if (e.cancelable) {
        e.preventDefault();
      }

      const qIdAttr = clickedEl.getAttribute('data-id');
      if (qIdAttr === null) return;
      const qId = parseInt(qIdAttr);
      const quad = quadrantsRef.current.find((q) => q.id === qId);

      if (quad) {
        setAntigravityActive(true);
        dragQuad = quad;
        quad.isDragging = true;
        dragOffset.x = mouseX - quad.x;
        dragOffset.y = mouseY - quad.y;
        quad.vx = 0;
        quad.vy = 0;
        quad.angleVel = 0;
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      // Lock touchscroll on viewport while actively dragging
      if (dragQuad && e.cancelable) {
        e.preventDefault();
      }
      updateMousePos(e);
    };

    const handleMouseUp = () => {
      if (dragQuad) {
        dragQuad.isDragging = false;
        const vx = (mouseX - lastMouseX) * 0.85;
        const vy = (mouseY - lastMouseY) * 0.85;

        const maxSpeed = 24;
        const speed = Math.hypot(vx, vy);
        if (speed > maxSpeed) {
          dragQuad.vx = (vx / speed) * maxSpeed;
          dragQuad.vy = (vy / speed) * maxSpeed;
        } else {
          dragQuad.vx = vx;
          dragQuad.vy = vy;
        }
        dragQuad = null;
      }
    };

    container.addEventListener('mousedown', handleStartDrag);
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    container.addEventListener('touchstart', handleStartDrag, { passive: false });
    container.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);

    const updatePhysics = () => {
      const width = containerWidth;
      const height = containerHeight;

      if (width === 0 || height === 0) {
        animFrameId = requestAnimationFrame(updatePhysics);
        return;
      }

      const cx = width / 2;
      const cy = height / 2;
      const offset = 54;

      const homePositions = [
        { x: cx - offset, y: cy - offset },
        { x: cx + offset, y: cy - offset },
        { x: cx - offset, y: cy + offset },
        { x: cx + offset, y: cy + offset },
      ];

      const active = stateRefs.current.antigravityActive;
      const gravityVal = stateRefs.current.gravityMode === 'gravity' ? 0.38 : 0;
      const friction = 0.98;
      const bounce = -0.68;

      lastMouseX += (mouseX - lastMouseX) * 0.22;
      lastMouseY += (mouseY - lastMouseY) * 0.22;

      let totalVelSq = 0;

      quadrantsRef.current.forEach((q, idx) => {
        q.homeX = homePositions[idx].x;
        q.homeY = homePositions[idx].y;

        const el = items[idx];
        if (!el) return;

        if (q.isDragging) {
          q.x = mouseX - dragOffset.x;
          q.y = mouseY - dragOffset.y;
          q.vx = 0;
          q.vy = 0;
        } else if (active) {
          // Physics updates with gravity and fluid friction drag
          q.vy += gravityVal;
          q.vx *= friction;
          q.vy *= friction;
          q.angleVel *= friction;

          q.x += q.vx;
          q.y += q.vy;
          q.angle += q.angleVel;

          const hw = 50;
          const hh = 50;

          // Sandbox container elastic wall collisions
          if (q.y + hh > height) {
            q.y = height - hh;
            q.vy *= bounce;
            q.vx *= 0.82;
            q.angleVel = q.vx * 0.05;
          }
          if (q.y - hh < 0) {
            q.y = hh;
            q.vy *= bounce;
          }
          if (q.x - hw < 0) {
            q.x = hw;
            q.vx *= bounce;
          }
          if (q.x + hw > width) {
            q.x = width - hw;
            q.vx *= bounce;
          }
        } else {
          // Harmonic spring compression (Hooke's Law integration)
          const kSpring = 0.08;
          const damping = 0.76;

          q.vx += (q.homeX - q.x) * kSpring;
          q.vy += (q.homeY - q.y) * kSpring;
          q.vx *= damping;
          q.vy *= damping;

          q.angleVel += (0 - q.angle) * 0.08;
          q.angleVel *= damping;

          q.x += q.vx;
          q.y += q.vy;
          q.angle += q.angleVel;
        }

        totalVelSq += q.vx * q.vx + q.vy * q.vy;

        // Apply visual transformation matrix styling
        const dx = q.x - 50;
        const dy = q.y - 50;
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0px) rotate(${q.angle}rad)`;

        // Vector hook tension wire connections using cached arrays
        const lineEl = lineElements[q.id];
        if (lineEl) {
          lineEl.setAttribute('x1', q.x.toString());
          lineEl.setAttribute('y1', q.y.toString());
          lineEl.setAttribute('x2', q.homeX.toString());
          lineEl.setAttribute('y2', q.homeY.toString());
          const distance = Math.hypot(q.x - q.homeX, q.y - q.homeY);
          lineEl.setAttribute('stroke-opacity', Math.min(distance / 120, 0.82).toString());
        }

        // CAD targets molding anchor frames using cached arrays
        const dockEl = dockElements[q.id];
        if (dockEl) {
          dockEl.setAttribute('x', (q.homeX - 50).toString());
          dockEl.setAttribute('y', (q.homeY - 50).toString());
        }

        // Floating blueprint coordinates readout string using cached arrays
        const coordEl = coordElements[q.id];
        if (coordEl) {
          coordEl.setAttribute('x', (q.x + 42).toString());
          coordEl.setAttribute('y', (q.y - 12).toString());
          const distance = Math.hypot(q.x - q.homeX, q.y - q.homeY);
          if (distance > 3) {
            coordEl.textContent = `Δ [${(q.x - q.homeX).toFixed(0)}, ${(q.y - q.homeY).toFixed(0)}]`;
            coordEl.setAttribute('opacity', '0.9');
          } else {
            coordEl.textContent = '';
          }
        }
      });

      // Inter-quadrant collision resolution (prevent overlapping)
      for (let i = 0; i < quadrantsRef.current.length; i++) {
        for (let j = i + 1; j < quadrantsRef.current.length; j++) {
          const q1 = quadrantsRef.current[i];
          const q2 = quadrantsRef.current[j];

          const dx = q2.x - q1.x;
          const dy = q2.y - q1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = 100;

          if (dist < minDist && active) {
            const overlap = minDist - dist;
            const nx = dist > 0 ? dx / dist : 1;
            const ny = dist > 0 ? dy / dist : 0;

            q1.x -= nx * overlap * 0.5;
            q1.y -= ny * overlap * 0.5;
            q2.x += nx * overlap * 0.5;
            q2.y += ny * overlap * 0.5;

            const rvx = q2.vx - q1.vx;
            const rvy = q2.vy - q1.vy;
            const normalVel = rvx * nx + rvy * ny;

            if (normalVel < 0) {
              const restitution = 0.55;
              const impulse = (-(1 + restitution) * normalVel) / 2;

              q1.vx -= nx * impulse;
              q1.vy -= ny * impulse;
              q2.vx += nx * impulse;
              q2.vy += ny * impulse;

              const tanX = -ny;
              const tanY = nx;
              const tanVel = rvx * tanX + rvy * tanY;
              q1.angleVel -= tanVel * 0.003;
              q2.angleVel += tanVel * 0.003;
            }
          }
        }
      }

      // Update calculations telemetry states
      const kineticEnergy = Math.sqrt(totalVelSq);
      const currentLang = stateRefs.current.lang;
      const trans = translations[currentLang];
      const gravityLabel =
        stateRefs.current.gravityMode === 'gravity'
          ? trans.sand_label_grav_earth
          : trans.sand_label_grav_zero;
      const entropyLabel = `${trans.sand_label_energy}: ${kineticEnergy.toFixed(2)} J`;
      const isUnstable = kineticEnergy > 0.85;
      const stateLabel = isUnstable ? trans.sand_label_state_unstable : trans.sand_label_state_balanced;

      setTelemetry({
        gravityLabel,
        entropyLabel,
        stateLabel,
        isUnstable,
      });

      animFrameId = requestAnimationFrame(updatePhysics);
    };

    animFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handleStartDrag);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleStartDrag);
      container.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const triggerExplosion = () => {
    setAntigravityActive(true);
    quadrantsRef.current.forEach((q) => {
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 12 + 10;
      q.vx = Math.cos(angle) * force;
      q.vy = Math.sin(angle) * force;
      q.angleVel = (Math.random() - 0.5) * 0.3;
    });
  };

  const triggerReassembly = () => {
    setAntigravityActive(false);
  };

  const toggleGravity = () => {
    const nextMode = gravityMode === 'gravity' ? 'zero-g' : 'gravity';
    setGravityMode(nextMode);
    setAntigravityActive(true);
  };

  return (
    <div className="relative w-full border-t border-brand-border py-16 px-6 md:px-12 flex flex-col gap-8 select-none bg-brand-offwhite">
      {/* Workspace top blueprint title */}
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-brand-border h-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-luxury rounded-full animate-ping"></span>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand-luxury font-bold">
              {lang === 'id' ? 'RUANG TELEMETRI KINETIK' : 'KINETIC TELEMETRY WORKSPACE'}
            </span>
          </div>
          <h3 className="font-display font-light text-2xl md:text-3xl tracking-tight text-brand-accent uppercase">
            {lang === 'id' ? 'KINETIC GEOMETRY SANDBOX' : 'KINETIC GEOMETRY SANDBOX'}
          </h3>
          <p className="text-xs font-sans text-brand-midgray max-w-2xl leading-relaxed">
            {lang === 'id' 
              ? 'Uji kelenturan mekanik pegas Hooke dan deformasi spasial terhadap komponen arsitektur logo Loragica. Tarik atau hempaskan potongan geometri untuk melihat pemulihan koordinat real-time.'
              : 'Test Hooke\'s spring elasticity and spatial deformation of the Loragica logo architecture. Drag or fling geometric pieces to watch real-time coordinate recovery.'}
          </p>
        </div>

        {/* CAD Blueprint Stats Readout */}
        <div className="flex flex-wrap gap-5 text-[10px] font-mono text-brand-accent bg-brand-card border border-brand-border px-5 py-4 shadow-sm shrink-0">
          <div>
            <p className="text-brand-lightgray uppercase text-[8px] tracking-wider font-semibold">{lang === 'id' ? 'MEDAN GAYA' : 'FORCE FIELD'}</p>
            <p className="font-bold mt-0.5">{telemetry.gravityLabel}</p>
          </div>
          <div className="border-l border-brand-border pl-5">
            <p className="text-brand-lightgray uppercase text-[8px] tracking-wider font-semibold">{lang === 'id' ? 'KINETIKA' : 'KINETICS'}</p>
            <p className="font-bold mt-0.5">{telemetry.entropyLabel}</p>
          </div>
          <div className="border-l border-brand-border pl-5">
            <p className="text-brand-lightgray uppercase text-[8px] tracking-wider font-semibold font-bold">{lang === 'id' ? 'STABILITAS' : 'STABILITY'}</p>
            <p
              className={`font-bold mt-0.5 ${
                telemetry.isUnstable ? 'text-brand-luxury animate-pulse' : 'text-brand-accent'
              }`}
            >
              {telemetry.stateLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Physics Sandbox frame box */}
      <div className="max-w-7xl mx-auto w-full h-[520px] bg-brand-card border border-brand-border relative overflow-hidden shadow-sm flex flex-col">
        <div
          ref={physicsContainerRef}
          className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing bg-brand-offwhite"
        >
          {/* Blueprint background shapes mapping CAD overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none">
            <defs>
              <pattern id="sandbox-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="0.75"
                  strokeOpacity="0.06"
                />
                <circle cx="0" cy="0" r="1.5" fill="#000000" fillOpacity="0.12" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sandbox-grid)" />

            {/* Architectural golden curves circles */}
            <circle
              cx="50%"
              cy="50%"
              r="180"
              stroke="#C5A880"
              strokeWidth="1.2"
              strokeOpacity="0.22"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="110"
              stroke="#C5A880"
              strokeWidth="1.2"
              strokeOpacity="0.18"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="54"
              stroke="#C5A880"
              strokeWidth="1.5"
              strokeOpacity="0.25"
              strokeDasharray="3 3"
              fill="none"
            />

            {/* Central align axes */}
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="#C5A880"
              strokeWidth="0.75"
              strokeOpacity="0.14"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="#C5A880"
              strokeWidth="0.75"
              strokeOpacity="0.14"
              strokeDasharray="4 4"
            />

            {/* Dynamic string tension vectors */}
            <line id="line-0" stroke="#C5A880" strokeWidth="1.5" strokeDasharray="4,3" strokeOpacity="0" />
            <line id="line-1" stroke="#C5A880" strokeWidth="1.5" strokeDasharray="4,3" strokeOpacity="0" />
            <line id="line-2" stroke="#C5A880" strokeWidth="1.5" strokeDasharray="4,3" strokeOpacity="0" />
            <line id="line-3" stroke="#C5A880" strokeWidth="1.5" strokeDasharray="4,3" strokeOpacity="0" />

            {/* CAD structural blueprint target boundaries holding moldings */}
            <rect
              id="dock-0"
              width="100"
              height="100"
              rx="22"
              stroke="#C5A880"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              fill="none"
              strokeOpacity="0.3"
            />
            <rect
              id="dock-1"
              width="100"
              height="100"
              rx="24"
              stroke="#C5A880"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              fill="none"
              strokeOpacity="0.3"
            />
            <rect
              id="dock-2"
              width="100"
              height="100"
              rx="24"
              stroke="#C5A880"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              fill="none"
              strokeOpacity="0.3"
            />
            <rect
              id="dock-3"
              width="100"
              height="100"
              rx="22"
              stroke="#C5A880"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              fill="none"
              strokeOpacity="0.3"
            />

            {/* Floating text coordinat labels */}
            <text
              id="coord-0"
              fontFamily="monospace"
              fontSize="9"
              fontWeight="bold"
              fill="#B89047"
              opacity="0"
            ></text>
            <text
              id="coord-1"
              fontFamily="monospace"
              fontSize="9"
              fontWeight="bold"
              fill="#B89047"
              opacity="0"
            ></text>
            <text
              id="coord-2"
              fontFamily="monospace"
              fontSize="9"
              fontWeight="bold"
              fill="#B89047"
              opacity="0"
            ></text>
            <text
              id="coord-3"
              fontFamily="monospace"
              fontSize="9"
              fontWeight="bold"
              fill="#B89047"
              opacity="0"
            ></text>
          </svg>

          {/* Q1: Top Left - Huge frame border */}
          <div
            data-id="0"
            className="quadrant-item absolute left-0 top-0 w-[100px] h-[100px] select-none pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              className="filter drop-shadow-[0px_4px_10px_rgba(0,0,0,0.02)] pointer-events-none"
            >
              <rect x="9" y="9" width="82" height="82" rx="22" stroke="#0A0A0A" strokeWidth="16" fill="none" />
            </svg>
          </div>

          {/* Q2: Top Right - Solid filled shape */}
          <div
            data-id="1"
            className="quadrant-item absolute left-0 top-0 w-[100px] h-[100px] select-none pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              className="filter drop-shadow-[0px_8px_16px_rgba(0,0,0,0.03)] pointer-events-none"
            >
              <rect x="9" y="9" width="82" height="82" rx="22" stroke="#0A0A0A" strokeWidth="10" fill="none" />
            </svg>
          </div>

          {/* Q3: Bottom Left - Mid-gray solid box shape */}
          <div
            data-id="2"
            className="quadrant-item absolute left-0 top-0 w-[100px] h-[100px] select-none pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              className="filter drop-shadow-[0px_8px_16px_rgba(0,0,0,0.02)] pointer-events-none"
            >
              <rect x="9" y="9" width="82" height="82" rx="22" stroke="#555555" strokeWidth="6" fill="none" />
            </svg>
          </div>

          {/* Q4: Bottom Right - Light subtle frame outline */}
          <div
            data-id="3"
            className="quadrant-item absolute left-0 top-0 w-[100px] h-[100px] select-none pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              className="pointer-events-none"
            >
              <rect
                x="9"
                y="9"
                width="82"
                height="82"
                rx="22"
                stroke="#0A0A0A"
                strokeWidth="4"
                strokeOpacity="0.45"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Absolute floating controls bridge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center justify-center gap-3 bg-brand-accent text-brand-offwhite px-6 py-3 rounded-full font-sans text-[10px] tracking-widest uppercase select-none shadow-[0px_10px_30px_rgba(10,10,10,0.18)] border border-brand-accent/20 transition-all hover:scale-[1.01] w-auto max-w-[95%]">
          <button
            onClick={triggerExplosion}
            className="hover:text-neutral-300 transition-colors font-semibold flex items-center gap-1.5 py-0.5 cursor-pointer"
          >
            <span className="text-xs">✦</span> {t.sand_btn_explode}
          </button>
          <span className="opacity-35 text-brand-offwhite">|</span>
          <button
            onClick={toggleGravity}
            className="hover:text-neutral-300 transition-colors font-semibold flex items-center gap-1.5 py-0.5 cursor-pointer"
          >
            {gravityMode === 'gravity' ? t.sand_btn_gravity_off : t.sand_btn_gravity_on}
          </button>
          <span className="opacity-35 text-brand-offwhite">|</span>
          <button
            onClick={triggerReassembly}
            className="hover:text-neutral-300 transition-colors bg-gradient-to-r from-brand-luxury to-yellow-600 bg-clip-text text-transparent font-bold flex items-center gap-1.5 py-0.5 cursor-pointer"
          >
            {t.sand_btn_reassemble}
          </button>
        </div>
      </div>
    </div>
  );
}
