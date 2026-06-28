/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LoragicaLogo from './LoragicaLogo';
import { translations } from '../data/translations';

interface HeaderProps {
  onJoinCommunity: () => void;
  onShowDonation: () => void;
  lang: 'id' | 'en';
  setLang: (lang: 'id' | 'en') => void;
}

export default function Header({ onJoinCommunity, onShowDonation, lang, setLang }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    let lastScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

      // Always show at the very top of the page
      if (currentScrollY < 50) {
        setVisible((prev) => {
          if (!prev) return true;
          return prev;
        });
        lastScrollY = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY;

      // Only act on scrolling changes greater than 5 pixels to avoid trackpad or rubber-banding bounce jitter
      if (Math.abs(diff) > 5) {
        if (diff > 0) {
          // Scrolling down: hide header
          setVisible((prev) => {
            if (prev) return false;
            return prev;
          });
          setMobileMenuOpen((prev) => {
            if (prev) return false;
            return prev;
          });
        } else {
          // Scrolling up: show header
          setVisible((prev) => {
            if (!prev) return true;
            return prev;
          });
        }
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Keep header fully visible if mobile/tablet drawer is open
  const isHeaderVisible = visible || mobileMenuOpen;

  const navLinks = [
    { label: t.nav_mission, href: '#pilar' },
    { label: t.nav_playground, href: '#visualizer' },
    { label: t.nav_cognitive, href: '#dashboard' },
    { label: t.nav_curriculum, href: '#curriculum' },
    { label: t.nav_movement, href: '#movement' },
  ];

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    // Close mobile menu drawer first to prevent layout and height shifting during calculations
    setMobileMenuOpen(false);

    if (element) {
      // Small delay ensures mobile menu has closed and layout has stabilized before computation
      setTimeout(() => {
        const headerOffset = 90; // perfectly accommodates the sticky header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 70);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-45 bg-brand-offwhite/90 backdrop-blur-md border-b border-brand-border py-4 md:py-5 transition-all duration-300 transform ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex justify-between items-center relative">
        {/* Brand logo wordmark */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 md:gap-3 group shrink-0"
        >
          <LoragicaLogo theme="light" size={30} className="md:w-8 md:h-8" />
          <span className="font-sans font-normal text-lg md:text-xl tracking-tight text-brand-accent leading-none">
            loragica
          </span>
        </a>

        {/* Action & Toggle Area */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Elegant Donate button - always visible on all screens */}
          <button
            onClick={onShowDonation}
            className="border-2 border-brand-luxury text-brand-accent px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-none text-[10px] sm:text-xs font-mono tracking-widest uppercase transition-all bg-transparent hover:bg-[#bba078] hover:border-[#bba078] hover:text-brand-offwhite cursor-pointer font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span className="shrink-0 font-bold">{t.nav_support}</span>
          </button>

          {/* Hamburger toggle icon - always visible on all screens */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-brand-accent p-2 hover:bg-neutral-100/60 transition-all rounded-sm cursor-pointer relative h-10 w-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center relative">
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-6 h-0.5 bg-brand-accent absolute top-0 left-0 origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-6 h-0.5 bg-brand-accent absolute top-[9px] left-0 origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-6 h-0.5 bg-brand-accent absolute bottom-0 left-0 origin-center"
              />
            </div>
          </button>
        </div>

        {/* Menu drawer overlay - now supports all screens */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25, ease: 'linear' }
              }}
              className="absolute top-[calc(100%+0px)] left-0 w-full bg-brand-offwhite border-b border-brand-border shadow-lg z-50 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto w-full px-6 md:px-8 lg:px-12 py-6 sm:py-8 flex flex-col space-y-5">
                <nav className="flex flex-col space-y-3 font-mono text-xs tracking-wider">
                  {navLinks.map((link, idx) => (
                    <motion.a
                      key={`mobile-nav-${link.href}-${idx}`}
                      href={link.href}
                      onClick={(e) => handleScrollToSection(e, link.href)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 + idx * 0.03,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="text-brand-accent hover:text-brand-lightgray border-b border-brand-border/40 py-2.5 transition-colors font-semibold block uppercase"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + navLinks.length * 0.03,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="flex bg-neutral-100 p-0.5 rounded-none font-mono text-xs items-center border border-brand-border/45 select-none w-full sm:max-w-xs"
                  >
                    <button
                      onClick={() => { setLang('id'); localStorage.setItem('loragica_language', 'id'); }}
                      className={`flex-1 py-2 text-center transition-all cursor-pointer font-bold rounded-none ${lang === 'id' ? 'bg-brand-accent text-brand-offwhite' : 'text-brand-midgray hover:text-brand-accent'}`}
                    >
                      INDONESIA (ID)
                    </button>
                    <button
                      onClick={() => { setLang('en'); localStorage.setItem('loragica_language', 'en'); }}
                      className={`flex-1 py-2 text-center transition-all cursor-pointer font-bold rounded-none ${lang === 'en' ? 'bg-brand-accent text-brand-offwhite' : 'text-brand-midgray hover:text-brand-accent'}`}
                    >
                      ENGLISH (EN)
                    </button>
                  </motion.div>

                  <motion.button
                    whileHover="hover"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.10 + navLinks.length * 0.03,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onJoinCommunity();
                    }}
                    className="w-full sm:flex-1 btn-premium bg-brand-accent text-brand-offwhite py-3 text-xs font-mono tracking-widest uppercase hover:bg-neutral-900 transition-colors font-bold flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
                  >
                    <span>{t.nav_join}</span>
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
