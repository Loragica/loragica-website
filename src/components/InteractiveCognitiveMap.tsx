/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CognitiveNode } from '../types';
import { translations } from '../data/translations';

interface InteractiveCognitiveMapProps {
  onNodeHover: (node: { label: string; status: string; info: string }) => void;
  lang: 'id' | 'en';
}

const getSymbolForKey = (key: string) => {
  switch (key) {
    case 'CALC':
      return <span className="text-[18px] leading-none font-serif select-none pointer-events-none select-none translate-y-[-1px]">∫</span>;
    case 'WAVE':
      return <span className="text-[16px] leading-none font-sans select-none pointer-events-none">∿</span>;
    case 'QUAN':
      return <span className="text-[13px] leading-none font-sans italic select-none pointer-events-none">ψ</span>;
    case 'ALG':
      return <span className="text-[9px] font-mono select-none pointer-events-none uppercase tracking-tighter">[A]</span>;
    case 'COMP':
      return <span className="text-[10px] font-mono select-none pointer-events-none">&lt;/&gt;</span>;
    default:
      return <span className="text-[9px] font-mono select-none pointer-events-none">{key}</span>;
  }
};

export default function InteractiveCognitiveMap({
  onNodeHover,
  lang,
}: InteractiveCognitiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getLocalizedNode = (node: CognitiveNode) => {
    const t = translations[lang];
    let label = node.label;
    let info = node.info;
    let status = node.status;

    if (lang === 'en') {
      status = 'Connected 100%';
    }

    if (node.key === 'CALC') {
      label = t.node_calc_label;
      info = t.node_calc_info;
    } else if (node.key === 'WAVE') {
      label = t.node_wave_label;
      info = t.node_wave_info;
    } else if (node.key === 'QUAN') {
      label = t.node_quant_label;
      info = t.node_quant_info;
    } else if (node.key === 'ALG') {
      label = t.node_alg_label;
      info = t.node_alg_info;
    } else if (node.key === 'COMP') {
      label = t.node_comp_label;
      info = t.node_comp_info;
    }

    return { ...node, label, info, status };
  };

  const [nodes, setNodes] = useState<CognitiveNode[]>([
    {
      id: 1,
      key: 'CALC',
      label: 'Kalkulus',
      x: 100,
      y: 80,
      homeX: 100,
      homeY: 80,
      vx: 0,
      vy: 0,
      size: 20,
      status: 'Terhubung 100%',
      info: 'Bagaimana laju perubahan matematika terhubung langsung ke kecepatan gerak fisika.',
    },
    {
      id: 2,
      key: 'WAVE',
      label: 'Mekanika Gelombang',
      x: 250,
      y: 130,
      homeX: 250,
      homeY: 130,
      vx: 0,
      vy: 0,
      size: 28,
      status: 'Terhubung 100%',
      info: 'Persamaan diferensial kalkulus yang melahirkan pemodelan getaran harmonis murni.',
    },
    {
      id: 3,
      key: 'QUAN',
      label: 'Fisika Kuantum',
      x: 400,
      y: 90,
      homeX: 400,
      homeY: 90,
      vx: 0,
      vy: 0,
      size: 18,
      status: 'Terhubung 100%',
      info: 'Probabilitas kuantum dan pemetaan matriks aljabar linier dalam struktur atom.',
    },
    {
      id: 4,
      key: 'ALG',
      label: 'Aljabar Linier',
      x: 180,
      y: 220,
      homeX: 180,
      homeY: 220,
      vx: 0,
      vy: 0,
      size: 22,
      status: 'Terhubung 100%',
      info: 'Transformasi matriks ruang yang mengendalikan rotasi grafis pemrograman visual.',
    },
    {
      id: 5,
      key: 'COMP',
      label: 'Sains Komputasi',
      x: 350,
      y: 210,
      homeX: 350,
      homeY: 210,
      vx: 0,
      vy: 0,
      size: 16,
      status: 'Terhubung 100%',
      info: 'Bagaimana kode komputasi menerjemahkan model termodinamika menjadi grafik interaktif.',
    },
  ]);

  const [dragId, setDragId] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [pulseNode, setPulseNode] = useState<number | null>(null);

  const nodesRef = useRef(nodes);
  const dragIdRef = useRef(dragId);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    dragIdRef.current = dragId;
  }, [dragId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      if (e.touches.length === 0) return;
      const touchX = e.touches[0].clientX - rect.left;
      const touchY = e.touches[0].clientY - rect.top;

      // Find if we touched inside a node
      const currentNodes = nodesRef.current;
      const clickedNode = currentNodes.find((node) => {
        const dist = Math.hypot(node.x - touchX, node.y - touchY);
        // generous 40px touch registration threshold for finger taps
        return dist < Math.max(40, node.size * 1.5);
      });

      if (clickedNode) {
        // Stop default touch scroll ONLY when dragging/touching a node
        if (e.cancelable) {
          e.preventDefault();
        }
        setDragId(clickedNode.id);
        dragOffset.current = { x: touchX - clickedNode.x, y: touchY - clickedNode.y };
        setPulseNode(clickedNode.id);
        onNodeHover(getLocalizedNode(clickedNode));
        setTimeout(() => setPulseNode(null), 800);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentDragId = dragIdRef.current;
      if (currentDragId === null) return;

      // Locking document scrolling on active drag
      if (e.cancelable) {
        e.preventDefault();
      }

      const rect = container.getBoundingClientRect();
      if (e.touches.length === 0) return;
      const touchX = e.touches[0].clientX - rect.left;
      const touchY = e.touches[0].clientY - rect.top;

      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === currentDragId) {
            const boundedX = Math.max(25, Math.min(rect.width - 25, touchX - dragOffset.current.x));
            const boundedY = Math.max(25, Math.min(rect.height - 25, touchY - dragOffset.current.y));
            return { ...node, x: boundedX, y: boundedY, vx: 0, vy: 0 };
          }
          return node;
        }),
      );
    };

    const handleTouchEnd = () => {
      setDragId(null);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [onNodeHover]);

  // Responsive mapping ratios representing original layout on desktop (width: 500, height: 300)
  const getResponsiveRatios = (id: number) => {
    switch (id) {
      case 1:
        return { rx: 0.18, ry: 0.28 };
      case 2:
        return { rx: 0.5, ry: 0.44 };
      case 3:
        return { rx: 0.82, ry: 0.32 };
      case 4:
        return { rx: 0.32, ry: 0.72 };
      case 5:
        return { rx: 0.68, ry: 0.68 };
      default:
        return { rx: 0.5, ry: 0.5 };
    }
  };

  useEffect(() => {
    const updateHomePositions = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      setNodes((prev) =>
        prev.map((node) => {
          const { rx, ry } = getResponsiveRatios(node.id);
          const targetX = w * rx;
          const targetY = h * ry;

          // If coordinates are uninitialized or near default test values, set them to the home positions
          const isInitial = node.x === node.id * 100 || node.x < 10 || node.homeX === 100 && node.homeY === 80;
          if (isInitial) {
            return {
              ...node,
              homeX: targetX,
              homeY: targetY,
              x: targetX,
              y: targetY,
            };
          } else {
            // Smoothly scale exact coordinate relative to container adjustments (e.g. tablet rotating)
            const prevHomeX = node.homeX || targetX;
            const prevHomeY = node.homeY || targetY;
            const ratioX = prevHomeX > 0 ? targetX / prevHomeX : 1;
            const ratioY = prevHomeY > 0 ? targetY / prevHomeY : 1;
            
            return {
              ...node,
              homeX: targetX,
              homeY: targetY,
              x: node.id === dragIdRef.current ? node.x : node.x * ratioX,
              y: node.id === dragIdRef.current ? node.y : node.y * ratioY,
            };
          }
        }),
      );
    };

    updateHomePositions();
    const observer = new ResizeObserver(() => updateHomePositions());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Frame simulation loop updating node positions
  useEffect(() => {
    let animId: number;
    const updatePhysics = () => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === dragId) return node;

          // Gentle ambient float drift
          const driftX = (Math.random() - 0.5) * 0.12;
          const driftY = (Math.random() - 0.5) * 0.12;

          // Spring forces pulling node back to its home coordinate
          const kSpring = 0.022;
          const fx = (node.homeX - node.x) * kSpring;
          const fy = (node.homeY - node.y) * kSpring;

          const friction = 0.91;
          const vx = (node.vx + driftX + fx) * friction;
          const vy = (node.vy + driftY + fy) * friction;

          return {
            ...node,
            x: node.x + vx,
            y: node.y + vy,
            vx,
            vy,
          };
        }),
      );
      animId = requestAnimationFrame(updatePhysics);
    };
    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [dragId]);

  const getEventCoords = (
    e:
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent<HTMLDivElement>
      | MouseEvent
      | TouchEvent,
  ) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStartDrag = (
    id: number,
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const coords = getEventCoords(e);
    const node = nodes.find((n) => n.id === id);
    if (node) {
      setDragId(id);
      dragOffset.current = { x: coords.x - node.x, y: coords.y - node.y };
      setPulseNode(id);
      onNodeHover(getLocalizedNode(node));
      setTimeout(() => setPulseNode(null), 800);
    }
  };

  const handleMoveDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (dragId === null || !containerRef.current) return;
    const coords = getEventCoords(e);
    const rect = containerRef.current.getBoundingClientRect();

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === dragId) {
          const boundedX = Math.max(25, Math.min(rect.width - 25, coords.x - dragOffset.current.x));
          const boundedY = Math.max(25, Math.min(rect.height - 25, coords.y - dragOffset.current.y));
          return { ...node, x: boundedX, y: boundedY, vx: 0, vy: 0 };
        }
        return node;
      }),
    );
  };

  const handleStopDrag = () => {
    setDragId(null);
  };

  const findNodeCoords = (id: number) => {
    const n = nodes.find((item) => item.id === id);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-80 bg-brand-offwhite border border-brand-border overflow-hidden select-none cursor-grab active:cursor-grabbing touch-pan-y"
      onMouseMove={handleMoveDrag}
      onMouseLeave={handleStopDrag}
      onMouseUp={handleStopDrag}
    >
      {/* Background CAD alignment grid lines overlay */}
      <svg
        className="absolute inset-0 w-full h-full text-brand-luxury/35 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1={findNodeCoords(1).x}
          y1={findNodeCoords(1).y}
          x2={findNodeCoords(2).x}
          y2={findNodeCoords(2).y}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1={findNodeCoords(2).x}
          y1={findNodeCoords(2).y}
          x2={findNodeCoords(3).x}
          y2={findNodeCoords(3).y}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1={findNodeCoords(2).x}
          y1={findNodeCoords(2).y}
          x2={findNodeCoords(4).x}
          y2={findNodeCoords(4).y}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1={findNodeCoords(1).x}
          y1={findNodeCoords(1).y}
          x2={findNodeCoords(4).x}
          y2={findNodeCoords(4).y}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1={findNodeCoords(3).x}
          y1={findNodeCoords(3).y}
          x2={findNodeCoords(5).x}
          y2={findNodeCoords(5).y}
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1={findNodeCoords(4).x}
          y1={findNodeCoords(4).y}
          x2={findNodeCoords(5).x}
          y2={findNodeCoords(5).y}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      {nodes.map((rawNode) => {
        const isDraggingNow = dragId === rawNode.id;
        const isPulsing = pulseNode === rawNode.id;
        const node = getLocalizedNode(rawNode);
        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${rawNode.x}px`,
              top: `${rawNode.y}px`,
              transform: 'translate(-50%, -50%)',
              transition: isDraggingNow ? 'none' : 'transform 0.08s linear',
            }}
            onMouseDown={(e) => handleStartDrag(node.id, e)}
            onMouseEnter={() => onNodeHover(node)}
            className="flex flex-col items-center group z-20"
          >
            {/* The circular discipline key label */}
            <div
              style={{
                width: `${node.size * 2}px`,
                height: `${node.size * 2}px`,
              }}
              className={`rounded-full flex items-center justify-center font-mono text-[9px] font-bold transition-all border duration-300 relative ${
                node.status.includes('Belum') || node.status.includes('Not')
                  ? 'bg-brand-card border-brand-border text-brand-midgray hover:border-brand-accent'
                  : 'bg-brand-accent border-brand-accent text-brand-offwhite'
              } ${
                isDraggingNow
                  ? 'scale-115 shadow-lg border-brand-lightgray'
                  : 'hover:scale-105 hover:bg-neutral-900'
              }`}
            >
              {getSymbolForKey(node.key)}
              {isPulsing && (
                <span className="absolute inset-0 rounded-full bg-brand-accent/30 animate-ping"></span>
              )}
            </div>

            {/* Display names below */}
            <span className="text-[9px] font-mono mt-1 text-brand-accent uppercase tracking-wider font-semibold pointer-events-none opacity-80 group-hover:opacity-100">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
