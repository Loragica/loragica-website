/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { WaveType } from './types';
import Footer from './components/Footer';
import Typewriter from './components/Typewriter';
import AnimatedCounter from './components/AnimatedCounter';
import InteractiveCognitiveMap from './components/InteractiveCognitiveMap';
import WaveVisualizer from './components/WaveVisualizer';
import KineticGeometrySandbox from './components/KineticGeometrySandbox';
import LoragicaLogo from './components/LoragicaLogo';
import ScrollFadeIn from './components/ScrollFadeIn';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from './data/translations';
import ContributorHub from './components/ContributorHub';
import LegalModal from './components/LegalModal';

export default function App() {
  const [lang, setLang] = useState<'id' | 'en'>(() => {
    const saved = localStorage.getItem('loragica_language');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  const changeLang = (newLang: 'id' | 'en') => {
    setLang(newLang);
    localStorage.setItem('loragica_language', newLang);
    setHoveredNode(null);
  };

  const t = translations[lang];

  // Active cognitive node for the comparison layout
  const [hoveredNode, setHoveredNode] = useState<{ label: string; status: string; info: string } | null>(null);

  const activeNodeToShow = hoveredNode || {
    label: t.node_calc_label,
    status: lang === 'id' ? 'Terhubung 100%' : 'Connected 100%',
    info: t.node_calc_info
  };

  const [showDonation, setShowDonation] = useState(false);
  const [selectedWaveType, setSelectedWaveType] = useState<WaveType>('sine');
  const [showAllChannels, setShowAllChannels] = useState(false);
  const [showContributorHub, setShowContributorHub] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'trademark'>('privacy');

  useEffect(() => {
    const lastShownTimestamp = localStorage.getItem('loragica_donation_last_shown_v2');
    
    if (!lastShownTimestamp) {
      // First time visiting - trigger modal overlay with a delayed entry
      const timer = setTimeout(() => {
        setShowDonation(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const lastShown = parseInt(lastShownTimestamp, 10);
      const thrityDaysInMs = 30 * 24 * 60 * 60 * 1000;
      
      // If it's been more than 30 days since the last shown popup
      if (Date.now() - lastShown > thrityDaysInMs) {
        const timer = setTimeout(() => {
          setShowDonation(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleCloseDonation = () => {
    localStorage.setItem('loragica_donation_last_shown_v2', Date.now().toString());
    setShowDonation(false);
  };

  const showToast = () => {
    // No-op to disable all toast/popups across the application
  };

  const handleJoinMovement = () => {
    window.open('https://discord.gg/K4HXBwRDuH', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full overflow-x-hidden flex flex-col justify-between min-h-screen bg-brand-offwhite text-brand-accent selection:bg-brand-accent selection:text-brand-offwhite font-sans antialiased">
      {/* STICKY HEADER */}
      <Header
        onJoinCommunity={handleJoinMovement}
        onShowDonation={() => setShowDonation(true)}
        lang={lang}
        setLang={changeLang}
      />
      <div className="h-[73px] md:h-[89px] shrink-0 w-full" />

      {/* HERO SECTION */}
      <ScrollFadeIn>
        <section className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 md:pt-24 md:pb-36 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Sisi Kiri: Hero Text Content */}
            <div className="lg:col-span-7 space-y-8">
              <h1 className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.95] text-brand-accent min-h-[120px] sm:min-h-[160px] md:min-h-[190px] lg:min-h-[240px] xl:min-h-[260px]">
                <Typewriter
                  key={`hero-typewriter-${lang}`}
                  staticText={t.hero_static}
                  dynamicWords={t.hero_dynamic}
                />
              </h1>

              <p className="text-brand-midgray text-sm md:text-base max-w-lg leading-relaxed font-sans">
                {t.hero_desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 font-mono text-xs">
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  onClick={handleJoinMovement}
                  className="btn-premium bg-brand-accent text-brand-offwhite px-8 py-4 rounded-none tracking-widest hover:bg-neutral-900 transition-all flex items-center justify-center gap-3 cursor-pointer font-bold overflow-hidden"
                >
                  <span>{t.hero_btn_join}</span>
                  <span className="inline-flex items-center justify-center relative overflow-hidden w-4 h-4">
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center"
                      variants={{
                        initial: { x: 0, opacity: 1 },
                        hover: { x: 16, opacity: 0 },
                      }}
                      transition={{
                        x: { type: 'spring', stiffness: 320, damping: 24 },
                        opacity: { duration: 0.18, ease: 'easeInOut' }
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-current">
                        <path d="M2 6h8M6 2l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.span>
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center"
                      variants={{
                        initial: { x: -16, opacity: 0 },
                        hover: { x: 0, opacity: 1 },
                      }}
                      transition={{
                        x: { type: 'spring', stiffness: 320, damping: 24 },
                        opacity: { duration: 0.18, ease: 'easeInOut' }
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-current">
                        <path d="M2 6h8M6 2l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.span>
                  </span>
                </motion.button>
                <a
                  href="#visualizer"
                  className="border border-brand-accent hover:bg-brand-accent hover:text-brand-offwhite px-8 py-4 rounded-none tracking-widest text-brand-accent flex items-center justify-center transition-all bg-transparent font-bold"
                >
                  {t.hero_btn_try}
                </a>
              </div>

              {/* Quick Stats ticks */}
              <div className="pt-8 border-t border-brand-border grid grid-cols-3 gap-6">
                <div>
                  <p className="font-display text-4xl font-bold text-brand-accent font-semibold">
                    <AnimatedCounter target="100" suffix="%" />
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-brand-lightgray mt-1">
                    {t.hero_stats_interactive}
                  </p>
                </div>
                <div>
                  <p className="font-display text-4xl font-bold text-brand-accent font-semibold">
                    <AnimatedCounter target="3.4" suffix="x" />
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-brand-lightgray mt-1">
                    {t.hero_stats_retention}
                  </p>
                </div>
                <div>
                  <p className="font-display text-4xl font-bold text-brand-accent font-semibold">
                    <AnimatedCounter target="80" suffix="+" />
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-brand-lightgray mt-1">
                    Modul Lab Interaktif
                  </p>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Live Mathematical Geometric Showcase Panel */}
            <div className="lg:col-span-5 relative flex justify-center w-full">
              <div className="w-full max-w-md bg-brand-card border border-brand-border p-5 sm:p-6 md:p-8 rounded-none shadow-[8px_8px_0px_rgba(10,10,10,0.03)] sm:shadow-[24px_24px_0px_rgba(10,10,10,0.03)] relative overflow-hidden">
                {/* Outer grid details */}
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 border-r border-t border-brand-accent/5 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 border-l border-b border-brand-accent/5 pointer-events-none"></div>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-midgray"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-lightgray"></span>
                  </div>
                  <span className="text-[9px] font-mono text-brand-lightgray tracking-widest font-bold">
                    {t.showcase_vision}
                  </span>
                </div>

                {/* Monochromatic code/math showcase specs */}
                <div className="space-y-4 font-mono">
                  <div className="bg-brand-offwhite p-4 border border-brand-border">
                    <p className="text-[9px] text-brand-lightgray uppercase tracking-wider mb-1">
                      {t.showcase_learn}
                    </p>
                    <p className="text-sm font-semibold text-brand-accent font-bold">{t.showcase_learn_formula}</p>
                    <div className="mt-2 text-[10px] text-brand-midgray leading-relaxed font-sans">
                      {t.showcase_learn_desc}
                    </div>
                  </div>

                  <div className="bg-brand-offwhite p-4 border border-brand-border">
                    <p className="text-[9px] text-brand-lightgray uppercase tracking-wider mb-1">
                      {t.showcase_see}
                    </p>
                    <div className="h-14 flex items-center justify-center relative overflow-hidden bg-brand-accent/[0.02]">
                      <svg
                        width="100%"
                        height="40"
                        viewBox="0 0 300 40"
                        fill="none"
                        className="stroke-current text-brand-accent opacity-75"
                      >
                        <path
                          d="M0 20 Q 35 3, 70 20 T 140 20 T 210 20 T 280 20 T 300 20"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="mt-2 text-[10px] text-brand-midgray leading-relaxed font-sans">
                      {t.showcase_see_desc}
                    </div>
                  </div>

                  <div className="bg-brand-offwhite p-4 border border-brand-border flex flex-col gap-2 h-auto">
                    <div className="flex flex-row justify-between items-center gap-2 w-full">
                      <div className="min-w-0">
                        <p className="text-[9px] text-brand-lightgray uppercase tracking-wider mb-0.5">
                          {t.showcase_discuss}
                        </p>
                        <p className="text-[11px] sm:text-xs font-semibold text-brand-accent truncate">{t.showcase_discuss_title}</p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-brand-accent font-bold bg-brand-card border border-brand-border px-2 sm:px-3 py-1 shrink-0">
                        <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping"></span>
                        {t.showcase_discuss_members}
                      </div>
                    </div>
                    <div className="text-[10px] text-brand-midgray leading-relaxed font-sans mt-0.5">
                      {t.showcase_discuss_desc}
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      {/* PILLARS SECTION (TUJUAN UTAMA LORAGICA) */}
      <ScrollFadeIn>
        <section id="pilar" className="py-24 border-t border-brand-border bg-brand-card">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-lightgray font-semibold">
                {t.pillars_badge}
              </p>
              <h2 className="font-display font-light text-3xl md:text-5xl text-brand-accent">
                {t.pillars_title_prev}{' '}
                <span className="font-serif italic text-brand-darkgray font-medium">
                  {t.pillars_title_italic}
                </span>{' '}
                {t.pillars_title_post}
              </h2>
              <p className="text-brand-midgray text-sm leading-relaxed font-sans">
                {t.pillars_desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {/* Box 1: Cause */}
              <div className="p-8 border border-brand-border bg-brand-offwhite rounded-none flex flex-col justify-between h-full transition-all duration-300 hover:border-brand-accent group">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="font-mono text-xs text-brand-lightgray font-bold">{t.pillars_cause_label}</div>
                    <div className="p-2 bg-brand-accent text-brand-offwhite rounded-none group-hover:bg-brand-luxury transition-colors duration-300">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 tracking-tight text-brand-accent">
                    {t.pillars_cause_title}
                  </h3>
                  <p className="text-[11px] font-mono text-brand-lightgray tracking-widest uppercase mb-4 font-semibold">
                    {t.pillars_cause_subtitle}
                  </p>
                  <p className="text-sm text-brand-midgray leading-relaxed font-sans">
                    {t.pillars_cause_desc}
                  </p>
                </div>
              </div>

              {/* Box 2: Solution */}
              <div className="p-8 border border-brand-accent bg-brand-card rounded-none shadow-[12px_12px_0px_rgba(10,10,10,0.04)] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[16px_16px_0px_rgba(10,10,10,0.08)] group">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="font-mono text-xs text-brand-luxury font-bold">{t.pillars_sol_label}</div>
                    <div className="p-2 bg-brand-accent text-brand-offwhite rounded-none group-hover:bg-brand-luxury transition-colors duration-300">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 tracking-tight text-brand-accent">
                    {t.pillars_sol_title}
                  </h3>
                  <p className="text-[11px] font-mono text-brand-luxury tracking-widest uppercase mb-4 font-semibold">
                    {t.pillars_sol_subtitle}
                  </p>
                  <p className="text-sm text-brand-midgray leading-relaxed font-sans">
                    {t.pillars_sol_desc}
                  </p>
                </div>
              </div>

              {/* Box 3: Benefit */}
              <div className="p-8 border border-brand-border bg-brand-offwhite rounded-none flex flex-col justify-between h-full transition-all duration-300 hover:border-brand-accent group md:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="font-mono text-xs text-brand-lightgray font-bold">{t.pillars_benefit_label}</div>
                    <div className="p-2 bg-brand-accent text-brand-offwhite rounded-none group-hover:bg-brand-luxury transition-colors duration-300">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 tracking-tight text-brand-accent">
                    {t.pillars_benefit_title}
                  </h3>
                  <p className="text-[11px] font-mono text-brand-lightgray tracking-widest uppercase mb-4 font-semibold">
                    {t.pillars_benefit_subtitle}
                  </p>
                  <p className="text-sm text-brand-midgray leading-relaxed font-sans">
                    {t.pillars_benefit_desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      {/* WAVE PLAYGROUND SECTION */}
      <ScrollFadeIn>
        <section id="visualizer" className="py-24 border-t border-brand-border bg-brand-offwhite">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <WaveVisualizer
              lang={lang}
              onToast={showToast}
              waveType={selectedWaveType}
              onWaveTypeChange={setSelectedWaveType}
            />
          </div>
        </section>
      </ScrollFadeIn>

      {/* COGNITIVE PATHWAY COMPARISON MAP */}
      <ScrollFadeIn>
        <section id="dashboard" className="py-24 border-t border-brand-border bg-brand-card">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Content Column */}
              <div className="lg:col-span-4 space-y-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-lightgray font-semibold">
                    {t.cog_badge}
                  </p>
                  <h2 className="font-display font-light text-4xl md:text-5xl text-brand-accent leading-none">
                    {t.cog_title}
                  </h2>
                </div>

                <p className="text-brand-midgray text-sm leading-relaxed font-sans">
                  {t.cog_desc_1}
                </p>
                <p className="text-brand-midgray text-sm leading-relaxed font-sans">
                  {t.cog_desc_2}
                </p>

                {/* Side-by-side comparative box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-brand-border">
                  {/* Traditional */}
                  <div className="p-5 border border-brand-border bg-brand-offwhite rounded-none flex flex-col h-full justify-between">
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-brand-lightgray font-bold mb-2">
                        {t.cog_traditional_label}
                      </p>
                      <p className="text-xs font-bold text-brand-accent mb-2">{t.cog_traditional_title}</p>
                    </div>
                    <p className="text-[11px] text-brand-midgray leading-relaxed font-sans mt-2">
                      {t.cog_traditional_desc}
                    </p>
                  </div>

                  {/* Loragica */}
                  <div className="p-5 border border-brand-luxury bg-brand-card rounded-none shadow-[6px_6px_0px_rgba(197,168,128,0.15)] flex flex-col h-full justify-between">
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-brand-luxury font-bold mb-2">
                        {t.cog_loragica_label}
                      </p>
                      <p className="text-xs font-bold text-brand-accent mb-2">{t.cog_loragica_title}</p>
                    </div>
                    <p className="text-[11px] text-brand-midgray leading-relaxed font-sans mt-2">
                      {t.cog_loragica_desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Dashboard Mock Map Column */}
              <div className="lg:col-span-8 bg-brand-card border border-brand-border p-6 md:p-8 rounded-none relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-brand-border pb-4 h-auto pb-4">
                  <div className="flex items-center gap-3">
                    <LoragicaLogo
                      theme="light"
                      size={32}
                      className="hover:rotate-90 duration-500 transition-transform cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-brand-accent">{t.cog_map_card_title}</p>
                      <p className="text-[9px] font-mono text-brand-lightgray uppercase font-semibold">
                        {t.cog_map_card_subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-brand-accent font-bold">{t.cog_map_diag_mode}</p>
                    <p className="text-[9px] font-mono text-brand-lightgray uppercase font-semibold">
                      {t.cog_map_diag_status}
                    </p>
                  </div>
                </div>

                {/* The interactive spring map nodes */}
                <InteractiveCognitiveMap onNodeHover={setHoveredNode} lang={lang} />

                {/* Hover dynamic parameters readout card container */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono pt-4 border-t border-brand-border h-auto">
                  <div className="space-y-1 flex-1 w-full">
                    <p className="text-brand-lightgray text-[9px] uppercase tracking-wider font-semibold">
                      {t.cog_map_integrate_label}
                    </p>
                    <p className="text-brand-accent font-bold text-sm">
                      {activeNodeToShow.label}{' '}
                      <span className="text-xs font-normal text-brand-midgray">({activeNodeToShow.status})</span>
                    </p>
                    <div className="min-h-[54px] sm:min-h-[36px] flex items-start">
                      <p className="text-brand-midgray text-[11px] font-sans leading-relaxed">{activeNodeToShow.info}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleJoinMovement}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full sm:w-auto bg-brand-accent text-brand-offwhite px-5 py-3 sm:py-2.5 text-[10px] tracking-wider rounded-none font-semibold shrink-0 uppercase cursor-pointer text-center flex items-center justify-center gap-2 border border-brand-accent transition-colors duration-300 hover:bg-neutral-900 shadow-[4px_4px_0px_rgba(10,10,10,0.1)] hover:shadow-[6px_6px_0px_rgba(10,10,10,0.15)]"
                    variants={{
                      rest: { scale: 1, y: 0 },
                      hover: {
                        scale: 1.04,
                        y: -3,
                        transition: { type: 'spring', stiffness: 400, damping: 17 }
                      },
                      tap: { scale: 0.96, y: 0 }
                    }}
                  >
                    <span>{t.cog_btn_discuss_discord}</span>
                    <motion.svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="stroke-current shrink-0 animate-none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={{
                        rest: {
                          x: [0, 4, 0],
                          transition: {
                            x: {
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "easeInOut"
                            }
                          }
                        },
                        hover: {
                          x: 8,
                          transition: {
                            type: 'spring',
                            stiffness: 300,
                            damping: 15
                          }
                        }
                      }}
                    >
                      <path d="M2 6h8M6 2l4 4-4 4" />
                    </motion.svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      {/* CURRICULUM GRID */}
      <ScrollFadeIn>
        <section id="curriculum" className="py-24 border-t border-brand-border bg-brand-offwhite">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 h-auto">
              <div className="space-y-4 max-w-2xl">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-lightgray font-semibold">
                  {t.curr_badge}
                </p>
                <h2 className="font-display font-light text-3xl md:text-5xl text-brand-accent">
                  {t.curr_title}
                </h2>
              </div>
              <div className="font-mono text-xs text-brand-midgray max-w-sm leading-relaxed">
                {t.curr_desc}
              </div>
            </div>

            {/* 4 Laboratory grid blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Math Box */}
              <div className="bg-brand-card border border-brand-border hover:border-brand-accent p-6 md:p-8 transition-all group flex flex-col justify-between h-80 rounded-none hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-brand-lightgray">[{t.curr_chan} 01]</span>
                    <span className="text-[9px] font-mono bg-brand-offwhite border border-brand-border text-brand-accent px-2 py-0.5 rounded-none uppercase font-semibold">
                      {lang === 'id' ? 'MATEMATIKA' : 'MATHEMATICS'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-brand-accent">
                    {t.curr_math_title}
                  </h3>
                  <p className="text-xs text-brand-midgray leading-relaxed font-sans">
                    {t.curr_math_desc}
                  </p>
                </div>
                <button
                  onClick={handleJoinMovement}
                  className="flex items-center justify-between pt-6 border-t border-brand-border text-left w-full cursor-pointer h-auto"
                >
                  <span className="text-[10px] font-mono text-brand-lightgray">{t.curr_join_chan}</span>
                  <span className="text-xs font-mono text-brand-accent group-hover:translate-x-2 transition-transform duration-300">
                    DISCORD →
                  </span>
                </button>
              </div>

              {/* Physics Box */}
              <div className="bg-brand-card border border-brand-border hover:border-brand-accent p-6 md:p-8 transition-all group flex flex-col justify-between h-80 rounded-none hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-brand-lightgray">[{t.curr_chan} 02]</span>
                    <span className="text-[9px] font-mono bg-brand-offwhite border border-brand-border text-brand-accent px-2 py-0.5 rounded-none uppercase font-semibold">
                      {lang === 'id' ? 'FISIKA' : 'PHYSICS'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-brand-accent">
                    {t.curr_physics_title}
                  </h3>
                  <p className="text-xs text-brand-midgray leading-relaxed font-sans">
                    {t.curr_physics_desc}
                  </p>
                </div>
                <button
                  onClick={handleJoinMovement}
                  className="flex items-center justify-between pt-6 border-t border-brand-border text-left w-full cursor-pointer h-auto"
                >
                  <span className="text-[10px] font-mono text-brand-lightgray">{t.curr_join_chan}</span>
                  <span className="text-xs font-mono text-brand-accent group-hover:translate-x-2 transition-transform duration-300">
                    DISCORD →
                  </span>
                </button>
              </div>

              {/* Computer Science Box */}
              <div className="bg-brand-card border border-brand-border hover:border-brand-accent p-6 md:p-8 transition-all group flex flex-col justify-between h-80 rounded-none hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-brand-lightgray">[{t.curr_chan} 03]</span>
                    <span className="text-[9px] font-mono bg-brand-offwhite border border-brand-border text-brand-accent px-2 py-0.5 rounded-none uppercase font-semibold">
                      {lang === 'id' ? 'KOMPUTASI' : 'COMPUTATION'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-brand-accent">
                    {t.curr_compsci_title}
                  </h3>
                  <p className="text-xs text-brand-midgray leading-relaxed font-sans">
                    {t.curr_compsci_desc}
                  </p>
                </div>
                <button
                  onClick={handleJoinMovement}
                  className="flex items-center justify-between pt-6 border-t border-brand-border text-left w-full cursor-pointer h-auto"
                >
                  <span className="text-[10px] font-mono text-brand-lightgray">{t.curr_join_chan}</span>
                  <span className="text-xs font-mono text-brand-accent group-hover:translate-x-2 transition-transform duration-300">
                    DISCORD →
                  </span>
                </button>
              </div>

              {/* Chemistry Box */}
              <div className="bg-brand-card border border-brand-border hover:border-brand-accent p-6 md:p-8 transition-all group flex flex-col justify-between h-80 rounded-none hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-brand-lightgray">[{t.curr_chan} 04]</span>
                    <span className="text-[9px] font-mono bg-brand-offwhite border border-brand-border text-brand-accent px-2 py-0.5 rounded-none uppercase font-semibold">
                      {lang === 'id' ? 'KIMIA' : 'CHEMISTRY'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-brand-accent">
                    {t.curr_chemistry_title}
                  </h3>
                  <p className="text-xs text-brand-midgray leading-relaxed font-sans">
                    {t.curr_chemistry_desc}
                  </p>
                </div>
                <button
                  onClick={handleJoinMovement}
                  className="flex items-center justify-between pt-6 border-t border-brand-border text-left w-full cursor-pointer h-auto"
                >
                  <span className="text-[10px] font-mono text-brand-lightgray">{t.curr_join_chan}</span>
                  <span className="text-xs font-mono text-brand-accent group-hover:translate-x-2 transition-transform duration-300">
                    DISCORD →
                  </span>
                </button>
              </div>
            </div>

            {/* Discover more channels on Discord directory banner */}
            <div className="mt-12">
              <div className="bg-brand-card border-2 border-dashed border-brand-border/80 p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 hover:border-brand-accent/50 transition-colors">
                <div className="inline-block px-3 py-1 bg-brand-offwhite border border-brand-border text-[9px] font-mono text-brand-accent uppercase tracking-wider font-semibold">
                  {t.curr_directory_badge}
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-brand-accent">
                  {t.curr_directory_title}
                </h3>
                <p className="max-w-2xl mx-auto text-xs md:text-sm text-brand-midgray leading-relaxed font-sans">
                  {t.curr_directory_desc}
                </p>
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleJoinMovement}
                    className="group relative flex items-center gap-3 px-8 py-4 border-2 border-brand-accent bg-brand-accent text-brand-offwhite font-mono text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 shadow-[6px_6px_0px_rgba(10,10,10,0.15)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                  >
                    <span>{t.curr_directory_btn}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      {/* LORAGICA MOVEMENT (SAINS TERBUKA) */}
      <ScrollFadeIn>
        <section id="movement" className="py-24 border-t border-brand-border bg-brand-card">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-lightgray font-semibold">
                {t.move_badge}
              </p>

              <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-brand-accent py-4 tracking-tight leading-none">
                <Typewriter
                  key={`movement-typewriter-${lang}`}
                  staticText={t.move_typewriter_static}
                  dynamicWords={t.move_typewriter_words}
                  align="center"
                />
              </h2>

              <p className="text-brand-midgray text-sm font-sans">
                {t.move_desc}
              </p>
            </div>

            {/* Dual Student/Pendidik CTA cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch">
              {/* Box 1: Student */}
              <div className="bg-brand-card border border-brand-accent p-8 md:p-10 flex flex-col justify-between rounded-none shadow-[12px_12px_0px_rgba(10,10,10,0.04)] hover:shadow-[16px_16px_0px_rgba(10,10,10,0.08)] transition-all duration-300 relative group">
                <div className="space-y-6">
                  <span className="text-[10px] font-mono text-brand-lightgray tracking-widest uppercase font-semibold block">
                    {t.move_student_badge}
                  </span>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-brand-accent">
                    {t.move_student_title}
                  </h3>
                  <p className="text-sm text-brand-midgray leading-relaxed font-sans">
                    {t.move_student_desc}
                  </p>
                </div>
                <motion.button
                  onClick={handleJoinMovement}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full bg-brand-accent text-brand-offwhite px-6 py-4 mt-10 text-xs font-mono tracking-widest rounded-none font-semibold uppercase cursor-pointer flex items-center justify-center gap-2 border border-brand-accent transition-colors duration-300 hover:bg-neutral-900 shadow-[4px_4px_0px_rgba(10,10,10,0.1)] hover:shadow-[6px_6px_0px_rgba(10,10,10,0.15)]"
                  variants={{
                    rest: { scale: 1, y: 0 },
                    hover: {
                      scale: 1.02,
                      y: -2,
                      transition: { type: 'spring', stiffness: 450, damping: 17 }
                    },
                    tap: { scale: 0.98 }
                  }}
                >
                  <span>{t.move_student_btn}</span>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="stroke-current shrink-0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      rest: {
                        x: [0, 4, 0],
                        transition: {
                          x: {
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                          }
                        }
                      },
                      hover: {
                        x: 8,
                        transition: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 15
                        }
                      }
                    }}
                  >
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </motion.svg>
                </motion.button>
              </div>

              {/* Box 2: Teacher */}
              <div className="bg-brand-offwhite border border-brand-border hover:border-brand-accent p-8 md:p-10 flex flex-col justify-between rounded-none hover:shadow-[12px_12px_0px_rgba(10,10,10,0.02)] transition-all duration-300 relative group">
                <div className="space-y-6">
                  <span className="text-[10px] font-mono text-brand-luxury font-bold tracking-widest uppercase mb-1 block">
                    {t.move_teacher_badge}
                  </span>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-brand-accent">
                    {t.move_teacher_title}
                  </h3>
                  <p className="text-sm text-brand-midgray leading-relaxed font-sans">
                    {t.move_teacher_desc}
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowContributorHub(true)}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full bg-transparent border-2 border-brand-luxury text-brand-accent px-6 py-4 mt-10 text-xs font-mono tracking-widest rounded-none font-semibold uppercase cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:bg-brand-accent hover:text-brand-luxury hover:border-brand-accent shadow-[4px_4px_0px_rgba(197,168,128,0.2)] hover:shadow-[6px_6px_0px_rgba(10,10,10,0.1)]"
                  variants={{
                    rest: { scale: 1, y: 0 },
                    hover: {
                      scale: 1.02,
                      y: -2,
                      transition: { type: 'spring', stiffness: 450, damping: 17 }
                    },
                    tap: { scale: 0.98 }
                  }}
                >
                  <span>{t.move_teacher_btn}</span>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="stroke-current shrink-0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      rest: {
                        x: [0, 4, 0],
                        transition: {
                          x: {
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                          }
                        }
                      },
                      hover: {
                        x: 8,
                        transition: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 15
                        }
                      }
                    }}
                  >
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </motion.svg>
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      {/* FOOTER PHYSICS KINETIC GEOMETRY SANDBOX ZONE */}
      <section id="antigravity-zone" className="w-full">
        <KineticGeometrySandbox onToast={showToast} lang={lang} />
      </section>



      {/* FOOTER */}
      <Footer
        onToast={showToast}
        onShowDonation={() => setShowDonation(true)}
        onSelectWaveType={setSelectedWaveType}
        onShowPrivacy={() => {
          setLegalTab('privacy');
          setShowLegal(true);
        }}
        onShowTerms={() => {
          setLegalTab('terms');
          setShowLegal(true);
        }}
        lang={lang}
      />

      {/* DONATION CAMPAIGN OVERLAY/MODAL */}
      <AnimatePresence>
        {showDonation && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 md:p-6 bg-[#0A0A0A]/85 backdrop-blur-sm overflow-y-auto">
            {/* Backdrop click to close */}
            <div 
              className="absolute inset-0 cursor-default" 
              onClick={handleCloseDonation}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative my-auto bg-brand-offwhite border-2 border-brand-accent max-w-2xl w-full rounded-none shadow-[10px_10px_0px_rgba(10,10,10,0.2)] md:shadow-[24px_24px_0px_rgba(10,10,10,0.25)] z-10 p-4 sm:p-6 md:p-8 lg:p-10 text-brand-accent text-left blueprint-grid"
            >
              {/* Corner Design Accents */}
              <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-r border-t border-brand-accent/20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-l border-b border-brand-accent/20 pointer-events-none"></div>

              {/* Close Button Trigger */}
              <button
                onClick={handleCloseDonation}
                className="absolute top-3 right-3 md:top-4 md:right-4 text-brand-accent hover:text-[#bba078] p-2 transition-colors cursor-pointer z-20"
                title={t.don_title_close}
                id="close-donation-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="space-y-4 md:space-y-6 font-sans">
                {/* Status Badging */}
                <div>
                  <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#bba078] bg-[#bba078]/10 border border-[#bba078]/20 px-2 py-1 rounded-none inline-block">
                    {t.don_badge}
                  </span>
                </div>

                {/* Main branding typography slogan */}
                <h2 className="font-display font-light text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug md:leading-none text-brand-accent tracking-tight flex flex-col sm:block">
                  <span className="inline">{t.don_free_label}</span>
                  <span className="font-serif italic text-[#bba078] text-2xl sm:text-3xl md:text-4xl lg:text-5xl block sm:inline sm:ml-1.5">{t.don_italic_label}</span>
                </h2>

                <div className="space-y-3 md:space-y-4 text-xs md:text-sm leading-relaxed text-brand-darkgray font-sans border-l-2 border-[#bba078]/30 pl-3 md:pl-4">
                  <p>
                    <strong>Loragica</strong> {t.don_desc_1}
                  </p>
                  <p className="text-brand-midgray hidden sm:block">
                    {t.don_desc_2}
                  </p>
                  <p>
                    {t.don_desc_3}
                  </p>
                </div>

                {/* Donation platforms grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
                  {/* Channel 1: Saweria */}
                  <a
                    href="https://saweria.co/playloragica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-brand-card border border-brand-border hover:border-brand-accent p-4 md:p-5 rounded-none flex flex-col justify-between transition-all duration-300 shadow-[4px_4px_0px_rgba(0,0,0,0.02)] hover:shadow-[6px_6px_0px_rgba(10,10,10,0.05)] cursor-pointer"
                  >
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] md:text-[10px] font-mono font-bold text-[#e18e1d]">[ SAWERIA ]</span>
                        <svg className="text-brand-lightgray group-hover:text-brand-accent transition-colors shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </div>
                      <h4 className="font-display font-bold text-sm md:text-base text-brand-accent">{t.don_saweria_title}</h4>
                      <p className="text-[10px] md:text-[11px] text-brand-midgray font-sans leading-relaxed">
                        {t.don_saweria_desc}
                      </p>
                    </div>
                    <span className="text-[11px] md:text-xs font-mono font-bold text-brand-accent mt-3 md:mt-4 inline-block group-hover:translate-x-1.5 transition-transform duration-300">
                      {t.don_btn_text}
                    </span>
                  </a>

                  {/* Channel 2: Trakteer */}
                  <a
                    href="https://trakteer.id/playloragica/tip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-brand-card border border-brand-border hover:border-brand-accent p-4 md:p-5 rounded-none flex flex-col justify-between transition-all duration-300 shadow-[4px_4px_0px_rgba(0,0,0,0.02)] hover:shadow-[6px_6px_0px_rgba(10,10,10,0.05)] cursor-pointer"
                  >
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] md:text-[10px] font-mono font-bold text-[#be1e2d]">[ TRAKTEER ]</span>
                        <svg className="text-brand-lightgray group-hover:text-brand-accent transition-colors shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </div>
                      <h4 className="font-display font-bold text-sm md:text-base text-brand-accent">{t.don_trakteer_title}</h4>
                      <p className="text-[10px] md:text-[11px] text-brand-midgray font-sans leading-relaxed">
                        {t.don_trakteer_desc}
                      </p>
                    </div>
                    <span className="text-[11px] md:text-xs font-mono font-bold text-brand-accent mt-3 md:mt-4 inline-block group-hover:translate-x-1.5 transition-transform duration-300">
                      {t.don_btn_text}
                    </span>
                  </a>
                </div>

                {/* Dismiss control */}
                <div className="pt-3 md:pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 font-mono text-[9px] md:text-[10px]">
                  <span className="text-brand-lightgray text-center sm:text-left leading-relaxed">
                    {lang === 'id' ? 'TERIMA KASIH TELAH MENGAWAL KEMAJUAN LITERASI SPASIAL.' : 'THANK YOU FOR SUPPORTING THE ADVANCEMENT OF SPATIAL LITERACY.'}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    onClick={handleCloseDonation}
                    className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 border border-brand-accent bg-brand-accent text-brand-offwhite hover:bg-[#111111] text-xs font-bold transition-colors cursor-pointer tracking-widest uppercase rounded-none shadow-[2px_2px_0px_rgba(10,10,10,0.1)] active:shadow-none shrink-0"
                    id="dismiss-donation-btn"
                  >
                    {lang === 'id' ? 'Eksplorasi Gratis' : 'Explore for Free'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ContributorHub isOpen={showContributorHub} onClose={() => setShowContributorHub(false)} lang={lang} />

      <LegalModal
        isOpen={showLegal}
        onClose={() => setShowLegal(false)}
        initialTab={legalTab}
        lang={lang}
      />
    </div>
  );
}
