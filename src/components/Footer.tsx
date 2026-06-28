/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LoragicaLogo from './LoragicaLogo';
import { Instagram, Youtube, Linkedin, Github } from 'lucide-react';
import { WaveType } from '../types';
import { translations } from '../data/translations';
import { config } from '../data/config';

interface FooterProps {
  onToast: (msg: string) => void;
  onShowDonation: () => void;
  onSelectWaveType?: (type: WaveType) => void;
  onShowPrivacy: () => void;
  onShowTerms: () => void;
  lang: 'id' | 'en';
}

export default function Footer({ onToast, onShowDonation, onSelectWaveType, onShowPrivacy, onShowTerms, lang }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = translations[lang];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const url = `${config.googleSheetsWebhookUrl}?email=${encodeURIComponent(email)}`;
      let success = false;
      let isDuplicate = false;

      try {
        // Try standard fetch to read potential duplicate check response
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.status === 'duplicate') {
          isDuplicate = true;
          success = false;
        } else {
          success = true;
        }
      } catch (fetchErr) {
        // This catch handles "Failed to fetch" (CORS errors).
        // Since Google Apps Script triggers redirected CORS blocks AFTER executing the script,
        // we fallback to sending with 'no-cors' mode to ensure the request is reliably delivered.
        console.warn('Submitting via no-cors fallback due to CORS redirect limit:', fetchErr);
        try {
          await fetch(url, { mode: 'no-cors' });
          success = true;
        } catch (noCorsErr) {
          console.error('Alternative submit failed:', noCorsErr);
        }
      }

      if (isDuplicate) {
        onToast(lang === 'id' ? 'Email ini sudah terdaftar sebelumnya!' : 'This email is already registered!');
        setIsSubmitting(false);
        return;
      }

      if (success) {
        setIsSubmitted(true);
        onToast(lang === 'id' ? 'Email berhasil terdaftar!' : 'Subscribed successfully!');
        setEmail('');
        
        setTimeout(() => {
          setIsSubmitted(false);
        }, 4000);
      } else {
        onToast(lang === 'id' ? 'Koneksi gagal. Silahkan coba lagi.' : 'Connection failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      onToast(lang === 'id' ? 'Koneksi gagal. Silahkan coba lagi.' : 'Connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-brand-accent text-neutral-400 py-16 border-t border-neutral-800 z-10 w-full relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10 lg:gap-12 mb-12">
          {/* Main Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <LoragicaLogo theme="dark" size={26} />
              <span className="font-sans font-normal text-xl tracking-tight text-brand-offwhite">
                loragica
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 font-sans">
              {t.footer_desc}
            </p>
          </div>

          {/* Playground quicklinks */}
          <div className="space-y-4">
            <p className="text-xs font-mono text-brand-offwhite tracking-wider uppercase font-semibold">
              {t.footer_col_play}
            </p>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="#visualizer"
                  onClick={() => onSelectWaveType?.('sine')}
                  className="hover:text-brand-offwhite transition-colors"
                >
                  {t.footer_wave_sine}
                </a>
              </li>
              <li>
                <a
                  href="#visualizer"
                  onClick={() => onSelectWaveType?.('fourier')}
                  className="hover:text-brand-offwhite transition-colors"
                >
                  {t.footer_wave_fourier}
                </a>
              </li>
              <li>
                <a
                  href="#visualizer"
                  onClick={() => onSelectWaveType?.('chaos')}
                  className="hover:text-brand-offwhite transition-colors"
                >
                  {t.footer_wave_chaos}
                </a>
              </li>
              <li>
                <a href="#antigravity-zone" className="hover:text-brand-offwhite transition-colors">
                  {t.footer_wave_sandbox}
                </a>
              </li>
            </ul>
          </div>

          {/* Company quicklinks */}
          <div className="space-y-4">
            <p className="text-xs font-mono text-brand-offwhite tracking-wider uppercase font-semibold">
              {t.footer_col_philosophy}
            </p>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a href="#pilar" className="hover:text-brand-offwhite transition-colors">
                  {t.footer_phi_about}
                </a>
              </li>
              <li>
                <a href="#pilar" className="hover:text-brand-offwhite transition-colors">
                  {t.footer_phi_aim}
                </a>
              </li>
              <li>
                <a href="#movement" className="hover:text-brand-offwhite transition-colors">
                  {t.footer_phi_contrib}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onShowDonation();
                  }}
                  className="text-[#e2c194] font-bold hover:text-brand-offwhite transition-colors flex items-center gap-1"
                >
                  {t.footer_phi_support}
                </a>
              </li>
            </ul>
          </div>

          {/* Join newsletter */}
          <div className="space-y-4">
            <p className="text-xs font-mono text-brand-offwhite tracking-wider uppercase font-semibold">
              {t.footer_col_join}
            </p>
            <p className="text-xs text-neutral-500 font-sans">
              {t.footer_newsletter_desc}
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                id="footer-email-input"
                type="email"
                disabled={isSubmitting || isSubmitted}
                placeholder={isSubmitted ? (lang === 'id' ? 'Terima kasih!' : 'Thank you!') : t.footer_newsletter_placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-brand-offwhite text-xs px-3 py-2.5 w-full rounded-none focus:outline-none focus:border-neutral-500 disabled:opacity-60"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="bg-brand-offwhite text-brand-accent px-4 py-2 text-xs font-bold font-mono hover:bg-neutral-200 transition-colors cursor-pointer disabled:bg-neutral-750 disabled:text-neutral-500"
              >
                {isSubmitting ? '...' : (isSubmitted ? '✓' : t.footer_newsletter_btn)}
              </button>
            </form>
          </div>
        </div>

        {/* Deep copyright details & Social Area */}
        <div className="pt-8 border-t border-neutral-850 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-neutral-500 gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>{t.footer_all_rights}</span>
            <span className="hidden sm:inline text-neutral-800">|</span>
            <span className="text-[#bba078] tracking-widest font-semibold">LEARN. SEE. CONNECT.</span>
          </div>

          {/* Social media links strip */}
          <div className="flex items-center gap-2">
            {[
              {
                icon: <Instagram size={14} className="stroke-[1.75]" />,
                label: "Instagram",
                href: "https://www.instagram.com/playloragica",
                hoverStyle: "hover:text-[#E1306C] hover:border-[#E1306C]/40 hover:bg-[#E1306C]/5"
              },
              {
                icon: <Youtube size={14} className="stroke-[1.75]" />,
                label: "YouTube",
                href: "https://www.youtube.com/@playloragica",
                hoverStyle: "hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5"
              },
              {
                icon: (
                  <svg width="13" height="13" viewBox="0 0 127.14 96.36" fill="currentColor" className="transition-colors">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.45-5c1-.73,2-1.51,3-2.31a75.12,75.12,0,0,0,71.79,0c1,.8,2,1.58,3,2.31a68.43,68.43,0,0,1-10.45,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.06-18.83C129,54.65,123.51,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                  </svg>
                ),
                label: "Discord",
                href: "https://discord.gg/K4HXBwRDuH",
                hoverStyle: "hover:text-[#5865F2] hover:border-[#5865F2]/40 hover:bg-[#5865F2]/5"
              },
              {
                icon: <Linkedin size={14} className="stroke-[1.75]" />,
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/playloragica",
                hoverStyle: "hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:bg-[#0077B5]/5"
              },
              {
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                  </svg>
                ),
                label: "TikTok",
                href: "https://www.tiktok.com/@playloragica",
                hoverStyle: "hover:text-brand-offwhite hover:border-brand-offwhite/40 hover:bg-white/5"
              },
              {
                icon: <Github size={14} className="stroke-[1.75]" />,
                label: "GitHub",
                href: "https://github.com/Loragica",
                hoverStyle: "hover:text-brand-offwhite hover:border-brand-offwhite/40 hover:bg-white/5"
              }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target={social.href !== '#' ? '_blank' : undefined}
                rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
                onClick={social.href === '#' ? (e) => e.preventDefault() : undefined}
                title={social.label}
                className={`w-8 h-8 border border-neutral-800 text-neutral-500 bg-neutral-900/40 flex items-center justify-center transition-all duration-300 rounded-none ${social.hoverStyle} hover:scale-105 active:scale-95`}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            <a 
              href="https://github.com/officialloragica/loragica-legal" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                onShowPrivacy();
              }}
              className="hover:text-brand-offwhite transition-colors relative group py-0.5 cursor-pointer"
            >
              {t.footer_privacy}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#bba078] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="https://github.com/officialloragica/loragica-legal" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                onShowTerms();
              }}
              className="hover:text-brand-offwhite transition-colors relative group py-0.5 cursor-pointer"
            >
              {t.footer_terms}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#bba078] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
