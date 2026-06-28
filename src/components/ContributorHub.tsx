/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Loader, Database, Copy, Settings, ExternalLink, HelpCircle } from 'lucide-react';
import { config } from '../data/config';

interface ContributorHubProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'id' | 'en';
}

interface SmoothInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  id?: string;
}

const SmoothInput: React.FC<SmoothInputProps> = ({ value, onChange, placeholder, type = 'text', className, onBlur, id }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <input
      id={id}
      type={type}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={(e) => {
        onChange(localValue);
        if (onBlur) onBlur(e);
      }}
      placeholder={placeholder}
      className={className}
    />
  );
};

interface SmoothTextareaProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  id?: string;
}

const SmoothTextarea: React.FC<SmoothTextareaProps> = ({ value, onChange, placeholder, className, onBlur, id }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <textarea
      id={id}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={(e) => {
        onChange(localValue);
        if (onBlur) onBlur(e);
      }}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default function ContributorHub({ isOpen, onClose, lang }: ContributorHubProps) {
  // Current active scroll stage (0 to 4)
  const [stage, setStage] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Integration sheets URL (secured via environment variables / stored config)
  const sheetsUrl = config.googleSheetsWebhookUrl || ((import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBAPP_URL || '') || localStorage.getItem('loragica_sheets_webhook_url') || '';

  // Core Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    institusi: '',
    jurusan: '',
    domisili: '',
    portofolio: '',
  });

  // Role selection checkboxes
  const [roles, setRoles] = useState({
    konten: true, // Default checked in preview
    dev: false,
    desain: false,
    akademik: false,
    growth: false,
    lainnya: false,
  });

  // Role details
  const [roleDetails, setRoleDetails] = useState({
    manim: 'Lagi belajar', // Default checked 'Lagi belajar'
    manimTools: '',
    manimPortfolio: '',
    manimTopics: '',
    
    devStackReact: true,
    devStackTailwind: false,
    devStackBackend: false,
    devStackLainnya: false,
    devGit: 'Ya',
    devPortfolio: '',
    devDeployed: '',

    desainStackFigma: true,
    desainStackAdobe: false,
    desainStackProcreate: false,
    desainStackLainnya: false,
    desainPortfolio: '',
    desainExperience: '',

    acadMath: false,
    acadPhys: false,
    acadChem: false,
    acadBio: false,
    acadComp: true,
    acadExperience: '',
    acadType: 'Menulis soal',

    growthSmed: '',
    growthTiktok: true,
    growthInstagram: false,
    growthYoutube: false,
    growthLainnya: false,
    growthNetwork: '',
    lainnyaDetail: '',
  });

  // Commitment & Logistics
  const [commitment, setCommitment] = useState({
    jam: '4–7 jam', // Default checked '4–7 jam'
    ketersediaan: '',
    volunteering: 'Ya, saya paham', // Default checked 'Ya, saya paham'
    cofounder: 'Mungkin nanti', // Default checked 'Mungkin nanti'
  });

  // Motivasi
  const [motivasi, setMotivasi] = useState({
    alasan: '',
    ide: '',
  });

  // Form error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Labels based on language
  const labelsMap: Record<number, string> = {
    1: lang === 'id' ? 'DATA DIRI' : 'PERSONAL INFO',
    2: lang === 'id' ? 'MINAT & ROLE' : 'ROLE & INTERESTS',
    3: lang === 'id' ? 'KOMITMEN' : 'COMMITMENT',
    4: lang === 'id' ? 'MOTIVASI' : 'MOTIVATION',
  };

  // Tracking scrolling to highlight the quadrant
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;

    const secData = container.querySelector('#sec-data') as HTMLElement;
    const secMinat = container.querySelector('#sec-minat') as HTMLElement;
    const secKomitmen = container.querySelector('#sec-komitmen') as HTMLElement;
    const secMotivasi = container.querySelector('#sec-motivasi') as HTMLElement;

    let currentStage = 0;
    if (secData && scrollTop >= secData.offsetTop - containerHeight / 1.5) {
      currentStage = 1;
    }
    if (secMinat && scrollTop >= secMinat.offsetTop - containerHeight / 1.5) {
      currentStage = 2;
    }
    if (secKomitmen && scrollTop >= secKomitmen.offsetTop - containerHeight / 1.5) {
      currentStage = 3;
    }
    if (secMotivasi && scrollTop >= secMotivasi.offsetTop - containerHeight / 1.5) {
      currentStage = 4;
    }

    // Force stage 4 if scrolled near absolute bottom
    if (scrollTop + containerHeight >= scrollHeight - 60) {
      currentStage = 4;
    }

    setStage(currentStage);
  };

  const handlePersonalChange = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleRoleToggle = (field: keyof typeof roles) => {
    setRoles((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!personalInfo.nama.trim()) newErrors.nama = lang === 'id' ? 'Nama lengkap wajib diisi' : 'Full name is required';
    if (!personalInfo.email.trim()) {
      newErrors.email = lang === 'id' ? 'Email wajib diisi' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = lang === 'id' ? 'Format email tidak valid' : 'Invalid email format';
    }
    if (!personalInfo.whatsapp.trim()) newErrors.whatsapp = lang === 'id' ? 'Nomor WhatsApp wajib diisi' : 'WhatsApp number is required';
    if (!personalInfo.institusi.trim()) newErrors.institusi = lang === 'id' ? 'Institusi wajib diisi' : 'Institution is required';
    if (!personalInfo.jurusan.trim()) newErrors.jurusan = lang === 'id' ? 'Jurusan wajib diisi' : 'Field of study is required';
    if (!personalInfo.domisili.trim()) newErrors.domisili = lang === 'id' ? 'Kota domisili wajib diisi' : 'City is required';
    
    // Check if at least one role is checked
    const anyRoleChecked = Object.values(roles).some(Boolean);
    if (!anyRoleChecked) {
      newErrors.roles = lang === 'id' ? 'Pilih minimal satu bidang minat' : 'Select at least one field of interest';
    }

    if (!commitment.ketersediaan) newErrors.ketersediaan = lang === 'id' ? 'Tanggal ketersediaan wajib diisi' : 'Availability date is required';
    if (!motivasi.alasan.trim()) newErrors.alasan = lang === 'id' ? 'Tuliskan alasan ketertarikan Anda' : 'Please provide your motivation';

    if (roles.lainnya && !roleDetails.lainnyaDetail?.trim()) {
      newErrors.lainnyaDetail = lang === 'id' ? 'Ceritakan rencana kontribusi lainnya Anda' : 'Please describe your other contribution pathway';
    }

    setErrors(newErrors);

    // If there are errors, scroll to the first error element
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorField = document.getElementById(`field-${firstErrorKey}`);
      if (errorField && containerRef.current) {
        containerRef.current.scrollTo({
          top: errorField.offsetTop - 100,
          behavior: 'smooth',
        });
      }
      return false;
    }
    return true;
  };

  const formatRolesDetails = (rolesObj: typeof roles, detailsObj: typeof roleDetails) => {
    const lines: string[] = [];
    if (rolesObj.konten) {
      lines.push(`[KONTEN] Manim: ${detailsObj.manim} | Tools: ${detailsObj.manimTools} | Portfolio: ${detailsObj.manimPortfolio} | Topik: ${detailsObj.manimTopics}`);
    }
    if (rolesObj.dev) {
      const stacks = [];
      if (detailsObj.devStackReact) stacks.push('React');
      if (detailsObj.devStackTailwind) stacks.push('Tailwind');
      if (detailsObj.devStackBackend) stacks.push('Backend/Node');
      if (detailsObj.devStackLainnya) stacks.push('Lainnya');
      lines.push(`[DEV] Stack: ${stacks.join(', ')} | Git: ${detailsObj.devGit} | Portfolio: ${detailsObj.devPortfolio} | Deployed app: ${detailsObj.devDeployed}`);
    }
    if (rolesObj.desain) {
      const stacks = [];
      if (detailsObj.desainStackFigma) stacks.push('Figma');
      if (detailsObj.desainStackAdobe) stacks.push('Adobe Creative');
      if (detailsObj.desainStackProcreate) stacks.push('Procreate');
      if (detailsObj.desainStackLainnya) stacks.push('Lainnya');
      lines.push(`[DESAIN] Tools: ${stacks.join(', ')} | Portfolio: ${detailsObj.desainPortfolio} | Experience: ${detailsObj.desainExperience}`);
    }
    if (rolesObj.akademik) {
      const subjs = [];
      if (detailsObj.acadMath) subjs.push('Matematika');
      if (detailsObj.acadPhys) subjs.push('Fisika');
      if (detailsObj.acadChem) subjs.push('Kimia');
      if (detailsObj.acadBio) subjs.push('Biologi');
      if (detailsObj.acadComp) subjs.push('Komputer');
      lines.push(`[AKADEMIK] Mapel: ${subjs.join(', ')} | Kerja: ${detailsObj.acadType} | Experience: ${detailsObj.acadExperience}`);
    }
    if (rolesObj.growth) {
      const platforms = [];
      if (detailsObj.growthTiktok) platforms.push('TikTok');
      if (detailsObj.growthInstagram) platforms.push('Instagram');
      if (detailsObj.growthYoutube) platforms.push('YouTube');
      if (detailsObj.growthLainnya) platforms.push('Lainnya');
      lines.push(`[GROWTH] Akun: ${detailsObj.growthSmed} | Platforms: ${platforms.join(', ')} | Network: ${detailsObj.growthNetwork}`);
    }
    if (rolesObj.lainnya) {
      lines.push(`[LAINNYA] ${detailsObj.lainnyaDetail}`);
    }
    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const selectedRolesList = Object.keys(roles).filter(k => roles[k as keyof typeof roles]);
    const payload = {
      nama: personalInfo.nama,
      email: personalInfo.email,
      whatsapp: personalInfo.whatsapp,
      institusi: personalInfo.institusi,
      jurusan: personalInfo.jurusan,
      domisili: personalInfo.domisili,
      portofolio: personalInfo.portofolio,
      roles: selectedRolesList,
      details: formatRolesDetails(roles, roleDetails),
      jam: commitment.jam,
      ketersediaan: commitment.ketersediaan,
      volunteering: commitment.volunteering,
      cofounder: commitment.cofounder,
      alasan: motivasi.alasan,
      ide: motivasi.ide,
    };

    const finalSheetsUrl = sheetsUrl?.trim();

    if (finalSheetsUrl) {
      // Send real data to the deployed Google Sheets Apps Script!
      fetch(finalSheetsUrl, {
        method: 'POST',
        mode: 'no-cors', // Avoid complex browser CORS configurations for straightforward Web Apps
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        localStorage.setItem('loragica_contributor_registered', 'true');
        localStorage.setItem('loragica_contributor_payload', JSON.stringify({
          nama: personalInfo.nama,
          email: personalInfo.email,
          roles: selectedRolesList,
          time: new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US'),
        }));
      })
      .catch((err) => {
        console.error('Spreadsheet submit failed', err);
        // Fallback so application experience doesn't break for user
        setIsSubmitting(false);
        setIsSubmitted(true);
        localStorage.setItem('loragica_contributor_registered', 'true');
      });
    } else {
      // Simulate real submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        // Save registration state so main page can interact on reload
        localStorage.setItem('loragica_contributor_registered', 'true');
        localStorage.setItem('loragica_contributor_payload', JSON.stringify({
          nama: personalInfo.nama,
          email: personalInfo.email,
          roles: selectedRolesList,
          time: new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US'),
        }));
      }, 1200);
    }
  };

  // Restore on mount
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStage(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleAllRolesDemo = () => {
    // Helper to reveal all role cards inside this preview for visual review
    setRoles({
      konten: true,
      dev: true,
      desain: true,
      akademik: true,
      growth: true,
      lainnya: true
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-[#0A0A0A]/85 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        <motion.div
          initial={{ x: '100%', opacity: 0.9 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.9 }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-2xl bg-[#F5F5F3] border-l border-[#000000]/20 h-full flex flex-col shadow-2xl z-10 text-[#0A0A0A]"
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-[#DEDDD7] bg-[#EFEEEA] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse"></span>
              <span className="font-mono text-xs tracking-widest font-bold uppercase text-brand-darkgray">
                {lang === 'id' ? 'Loragica Contributor Hub' : 'Loragica Contributor Entry'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-[#DEDDD7] rounded-none transition-all cursor-pointer text-[#0A0A0A]"
                title={lang === 'id' ? 'Tutup' : 'Close'}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Floating Progress Quadrant Dock (Follows Scroll matching HTML preview style) */}
          <div className="absolute top-20 right-6 z-30 flex items-center gap-3 bg-[#F5F5F3]/90 backdrop-blur-md border border-[#DEDDD7] rounded-full py-1.5 px-3 md:px-4 shadow-[4px_4px_12px_rgba(0,0,0,0.04)] pointer-events-none select-none">
            <div className="grid grid-cols-2 grid-rows-2 gap-[2px] w-[22px] h-[22px]">
              <div className={`rounded-[2px] border transition-all duration-300 ${stage >= 1 ? 'bg-[#0A0A0A] border-[#0A0A0A]' : 'bg-transparent border-[#DEDDD7]'}`} />
              <div className={`rounded-[2px] border transition-all duration-300 ${stage >= 2 ? 'bg-[#185FA5] border-[#185FA5]' : 'bg-transparent border-[#DEDDD7]'}`} />
              <div className={`rounded-[2px] border transition-all duration-300 ${stage >= 3 ? 'bg-[#1D9E75] border-[#1D9E75]' : 'bg-transparent border-[#DEDDD7]'}`} />
              <div className={`rounded-[2px] border transition-all duration-300 ${stage >= 4 ? 'bg-[#534AB7] border-[#534AB7]' : 'bg-transparent border-[#DEDDD7]'}`} />
            </div>
            <span className="font-mono text-[9px] font-bold tracking-wider text-[#5B5B57] whitespace-nowrap">
              {stage === 0 ? (lang === 'id' ? 'MULAI' : 'INTRO') : labelsMap[stage]}
            </span>
          </div>

          {/* Form scroll container */}
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-20 blueprint-grid scroll-smooth relative"
          >
            {isSubmitted ? (
              /* ================= SUCCESS STATE ================= */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center max-w-md mx-auto space-y-8"
              >
                <div className="w-16 h-16 grid grid-cols-2 grid-rows-2 gap-1.5 mx-auto">
                  <div className="rounded-lg border-[2.4px] border-[#0A0A0A]" />
                  <div className="rounded-lg bg-[#185FA5]" />
                  <div className="rounded-lg bg-[#1D9E75]" />
                  <div className="rounded-lg bg-[#534AB7]" />
                </div>

                <div className="space-y-4">
                  <h2 className="font-display font-bold text-3xl tracking-tight leading-tight">
                    {lang === 'id' ? 'Pendaftaran Dikirim!' : 'Application Submitted!'}
                  </h2>
                  <p className="text-sm text-[#5B5B57] leading-relaxed">
                    {lang === 'id' 
                      ? `Terima kasih, ${personalInfo.nama}. Tim Loragica akan memeriksa draf pendaftaran kontributor Anda dan berdiskusi melalui WhatsApp atau email dalam beberapa hari ke depan.`
                      : `Thank you, ${personalInfo.nama}. The Loragica team will review your application details and reach out via WhatsApp or email within a few days.`
                    }
                  </p>
                </div>

                <div className="bg-[#EFEEEA] border border-[#DEDDD7] p-5 text-left text-xs font-mono space-y-2 mt-4">
                  <p className="text-[#5B5B57] uppercase font-bold tracking-widest text-[9px] border-b border-[#DEDDD7] pb-1.5 mb-2">
                    {lang === 'id' ? 'Draf Tanda Terima' : 'Receipt Details'}
                  </p>
                  <div><span className="text-[#A6A59F]">{lang === 'id' ? 'NAMA:' : 'NAME:'}</span> {personalInfo.nama}</div>
                  <div><span className="text-[#A6A59F]">EMAIL:</span> {personalInfo.email}</div>
                  <div><span className="text-[#A6A59F]">ROLE:</span> {Object.keys(roles).filter(k => roles[k as keyof typeof roles]).map(r => r.toUpperCase()).join(', ')}</div>
                  <div><span className="text-[#A6A59F]">STATUS:</span> <span className="text-brand-luxury font-bold bg-[#C5A880]/10 px-1 py-0.5 rounded-[2px]">PENDING REVIEW</span></div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={onClose}
                    className="w-full bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#F5F5F3] font-mono text-xs uppercase tracking-widest font-bold py-4 cursor-pointer outline-none transition-colors rounded-none"
                  >
                    {lang === 'id' ? 'KEMBALI KE LORAGICA' : 'BACK TO LORAGICA'}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ================= CORE FORM FLOW ================= */
              <form onSubmit={handleSubmit} className="space-y-20 pb-12">
                
                {/* INTRO HERO SUBSECTION */}
                <section id="sec-hero" className="space-y-6 pt-6">
                  <div className="w-[45px] h-[45px] grid grid-cols-2 grid-rows-2 gap-[4px]">
                    <div className="rounded-[4px] border-2 border-[#0A0A0A]" />
                    <div className="rounded-[4px] bg-[#185FA5]" />
                    <div className="rounded-[4px] bg-[#5B5B57] opacity-60" />
                    <div className="rounded-[4px] border border-[#0A0A0A] opacity-40" />
                  </div>

                  <h1 className="font-display font-extrabold text-4xl tracking-tight leading-none text-brand-accent">
                    Loragica<br />Contributor Hub
                  </h1>

                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#534AB7] font-semibold">
                    <span>Learn</span>
                    <span className="w-1 h-1 rounded-full bg-[#DEDDD7]" />
                    <span>See</span>
                    <span className="w-1 h-1 rounded-full bg-[#DEDDD7]" />
                    <span>Connect</span>
                  </div>

                  <p className="text-[#5B5B57] text-sm leading-relaxed max-w-lg font-sans">
                    {lang === 'id' 
                      ? 'Kami sedang membangun ekosistem pembelajaran STEM berbasis visual harmonis untuk Indonesia — dan mencari kontributor sukarela yang ingin membentuknya bersama kami.'
                      : 'We are building a harmonious visual STEM education ecosystem for Indonesia — and looking for passionate volunteer contributors to sculpt it together.'
                    }
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#DEDDD7] font-mono text-[9px] md:text-[10px] text-[#5B5B57]">
                    <div>
                      <span>STATUS</span>
                      <b className="block text-xs text-[#0A0A0A] font-sans font-bold mt-1 uppercase">Volunteer</b>
                    </div>
                    <div>
                      <span>{lang === 'id' ? 'DURASI' : 'EST. TIME'}</span>
                      <b className="block text-xs text-[#0A0A0A] font-sans font-bold mt-1">~10 Mins</b>
                    </div>
                    <div>
                      <span>{lang === 'id' ? 'JANGKAUAN' : 'TRACKS'}</span>
                      <b className="block text-xs text-[#0A0A0A] font-sans font-bold mt-1">5 Pathways</b>
                    </div>
                  </div>
                </section>

                {/* ============ SECTION 1: DATA DIRI ============ */}
                <section id="sec-data" className="space-y-6 pt-6 border-t border-[#DEDDD7]/80">
                  <div className="flex justify-between items-end border-b border-[#DEDDD7] pb-3">
                    <h2 className="font-display font-bold text-2xl text-brand-accent">
                      {lang === 'id' ? '01. Data Diri' : '01. Personal Info'}
                    </h2>
                    <span className="font-mono text-xs text-[#5B5B57]">01 / 05</span>
                  </div>
                  <p className="text-xs text-[#5B5B57] leading-relaxed max-w-lg">
                    {lang === 'id'
                      ? 'Mulai dengan perkenalan singkat. Informasi ini membantu kami menghubungi dan mengenal latar belakang akademikmu.'
                      : 'Introduce yourself. This details help us connect and understand your academic background.'
                    }
                  </p>

                  <div className="space-y-4">
                    {/* Nama Lengkap */}
                    <div id="field-nama" className="space-y-1.5">
                      <label className="flex items-center text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' ? 'Nama Lengkap' : 'Full Name'} <span className="text-[#534AB7] ml-1">*</span>
                      </label>
                      <SmoothInput 
                        type="text" 
                        value={personalInfo.nama}
                        onChange={(val) => handlePersonalChange('nama', val)}
                        placeholder={lang === 'id' ? 'cth. Joshua Albert' : 'ex. Joshua Albert'}
                        className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all"
                      />
                      {errors.nama && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.nama}</span>}
                    </div>

                    {/* Email Aktif */}
                    <div id="field-email" className="space-y-1.5">
                      <label className="flex items-center text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' ? 'Email Aktif' : 'Active Email'} <span className="text-[#534AB7] ml-1">*</span>
                      </label>
                      <SmoothInput 
                        type="email" 
                        value={personalInfo.email}
                        onChange={(val) => handlePersonalChange('email', val)}
                        placeholder={lang === 'id' ? 'nama@email.com' : 'name@email.com'}
                        className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all"
                      />
                      {errors.email && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.email}</span>}
                    </div>

                    {/* WhatsApp */}
                    <div id="field-whatsapp" className="space-y-1.5">
                      <label className="flex items-center text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' ? 'Nomor WhatsApp' : 'WhatsApp Number'} <span className="text-[#534AB7] ml-1">*</span>
                      </label>
                      <SmoothInput 
                        type="tel" 
                        value={personalInfo.whatsapp}
                        onChange={(val) => handlePersonalChange('whatsapp', val)}
                        placeholder="+62"
                        className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all"
                      />
                      {errors.whatsapp && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.whatsapp}</span>}
                    </div>

                    {/* Institut */}
                    <div id="field-institusi" className="space-y-1.5">
                      <label className="flex items-center text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' ? 'Universitas / Institusi Asal' : 'University / Organization'} <span className="text-[#534AB7] ml-1">*</span>
                      </label>
                      <SmoothInput 
                        type="text" 
                        value={personalInfo.institusi}
                        onChange={(val) => handlePersonalChange('institusi', val)}
                        placeholder={lang === 'id' ? 'cth. Institut Teknologi Bandung' : 'ex. Bandung Institute of Technology'}
                        className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all"
                      />
                      {errors.institusi && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.institusi}</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Jurusan / Semester */}
                      <div id="field-jurusan" className="space-y-1.5">
                        <label className="flex items-center text-xs font-bold text-[#0A0A0A]">
                          {lang === 'id' ? 'Jurusan & Semester' : 'Major & Semester'} <span className="text-[#534AB7] ml-1">*</span>
                        </label>
                        <SmoothInput 
                          type="text" 
                          value={personalInfo.jurusan}
                          onChange={(val) => handlePersonalChange('jurusan', val)}
                          placeholder={lang === 'id' ? 'cth. Teknik Informatika, Smt 3' : 'ex. Computer Science, 3rd Sem'}
                          className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all"
                        />
                        {errors.jurusan && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.jurusan}</span>}
                      </div>

                      {/* Domisili */}
                      <div id="field-domisili" className="space-y-1.5">
                        <label className="flex items-center text-xs font-bold text-[#0A0A0A]">
                          {lang === 'id' ? 'Kota Domisili' : 'City Ecosystem'} <span className="text-[#534AB7] ml-1">*</span>
                        </label>
                        <SmoothInput 
                          type="text" 
                          value={personalInfo.domisili}
                          onChange={(val) => handlePersonalChange('domisili', val)}
                          placeholder={lang === 'id' ? 'cth. Bandung / Jakarta' : 'ex. Bandung / Jakarta'}
                          className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all"
                        />
                        {errors.domisili && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.domisili}</span>}
                      </div>
                    </div>

                    {/* Portofolio */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="text-xs font-bold text-[#0A0A0A]">
                          {lang === 'id' ? 'Portofolio / LinkedIn / Instagram' : 'Portfolio / LinkedIn / Instagram'}
                        </label>
                        <span className="font-mono text-[9px] text-[#5B5B57] uppercase tracking-[0.05em]">{lang === 'id' ? 'OPSIONAL' : 'OPTIONAL'}</span>
                      </div>
                      <SmoothInput 
                        type="url" 
                        value={personalInfo.portofolio}
                        onChange={(val) => handlePersonalChange('portofolio', val)}
                        placeholder="https://"
                        className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all"
                      />
                      <span className="text-[10px] text-[#5B5B57] leading-relaxed block mt-1">
                        {lang === 'id' ? 'Pisahkan dengan koma jika mengisi beberapa tautan sekaligus.' : 'Separate with comma if submitting multiple links.'}
                      </span>
                    </div>
                  </div>
                </section>

                {/* ============ SECTION 2: MINAT & PERAN ============ */}
                <section id="sec-minat" className="space-y-6 pt-6 border-t border-[#DEDDD7]/80">
                  <div className="flex justify-between items-end border-b border-[#DEDDD7] pb-3">
                    <h2 className="font-display font-bold text-2xl text-brand-accent">
                      {lang === 'id' ? '02. Minat & Peran' : '02. Interests & Tracks'}
                    </h2>
                    <span className="font-mono text-xs text-[#5B5B57]">02 / 05</span>
                  </div>
                  <p className="text-xs text-[#5B5B57] leading-relaxed max-w-lg">
                    {lang === 'id'
                      ? 'Pilih satu atau beberapa bidang kontribusi. Kuesioner bagian berikutnya akan menyesuaikan secara cerdas berdasarkan pilihanmu di sini!'
                      : 'Select your pathways. The next detailed questionnaires will adapt instantly based on your selections below!'
                    }
                  </p>

                  <div className="space-y-4">
                    <div id="field-roles" className="space-y-2.5">
                      <label className="text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' ? 'Bidang minat yang ingin kamu kerjakan:' : 'Pathways you wish to contribute to:'} <span className="text-[#534AB7]">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {/* Option 1: Konten & Animasi */}
                        <label className={`relative border border-[#DEDDD7] rounded-[4px] py-4.5 pl-12 pr-4 cursor-pointer text-sm select-none transition-all ${roles.konten ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-[#EFEEEA] hover:border-[#5B5B57]'}`}>
                          <input 
                            type="checkbox" 
                            checked={roles.konten}
                            onChange={() => handleRoleToggle('konten')}
                            className="absolute opacity-0 cursor-pointer h-0 w-0"
                          />
                          <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-[4px] border ${roles.konten ? 'bg-[#185FA5] border-[#185FA5] flex items-center justify-center' : 'bg-white border-[#5B5B57]'}`}>
                            {roles.konten && <Check size={11} className="text-white stroke-[3.5px]" />}
                          </span>
                          <span>🎬 {lang === 'id' ? 'Konten & Animasi' : 'Content & Animation'}</span>
                        </label>

                        {/* Option 2: Dev */}
                        <label className={`relative border border-[#DEDDD7] rounded-[4px] py-4.5 pl-12 pr-4 cursor-pointer text-sm select-none transition-all ${roles.dev ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-[#EFEEEA] hover:border-[#5B5B57]'}`}>
                          <input 
                            type="checkbox" 
                            checked={roles.dev}
                            onChange={() => handleRoleToggle('dev')}
                            className="absolute opacity-0 cursor-pointer h-0 w-0"
                          />
                          <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-[4px] border ${roles.dev ? 'bg-[#185FA5] border-[#185FA5] flex items-center justify-center' : 'bg-white border-[#5B5B57]'}`}>
                            {roles.dev && <Check size={11} className="text-white stroke-[3.5px]" />}
                          </span>
                          <span>💻 {lang === 'id' ? 'Development' : 'Software Development'}</span>
                        </label>

                        {/* Option 3: Desain */}
                        <label className={`relative border border-[#DEDDD7] rounded-[4px] py-4.5 pl-12 pr-4 cursor-pointer text-sm select-none transition-all ${roles.desain ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-[#EFEEEA] hover:border-[#5B5B57]'}`}>
                          <input 
                            type="checkbox" 
                            checked={roles.desain}
                            onChange={() => handleRoleToggle('desain')}
                            className="absolute opacity-0 cursor-pointer h-0 w-0"
                          />
                          <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-[4px] border ${roles.desain ? 'bg-[#185FA5] border-[#185FA5] flex items-center justify-center' : 'bg-white border-[#5B5B57]'}`}>
                            {roles.desain && <Check size={11} className="text-white stroke-[3.5px]" />}
                          </span>
                          <span>🎨 {lang === 'id' ? 'Desain Grafis / UI' : 'Design & UI/UX'}</span>
                        </label>

                        {/* Option 4: Akademik */}
                        <label className={`relative border border-[#DEDDD7] rounded-[4px] py-4.5 pl-12 pr-4 cursor-pointer text-sm select-none transition-all ${roles.akademik ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-[#EFEEEA] hover:border-[#5B5B57]'}`}>
                          <input 
                            type="checkbox" 
                            checked={roles.akademik}
                            onChange={() => handleRoleToggle('akademik')}
                            className="absolute opacity-0 cursor-pointer h-0 w-0"
                          />
                          <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-[4px] border ${roles.akademik ? 'bg-[#185FA5] border-[#185FA5] flex items-center justify-center' : 'bg-white border-[#5B5B57]'}`}>
                            {roles.akademik && <Check size={11} className="text-white stroke-[3.5px]" />}
                          </span>
                          <span>📐 {lang === 'id' ? 'Akademik & Kurikulum' : 'Academic & Curriculum'}</span>
                        </label>

                        {/* Option 5: Growth */}
                        <label className={`relative border border-[#DEDDD7] rounded-[4px] py-4.5 pl-12 pr-4 cursor-pointer text-sm select-none transition-all ${roles.growth ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-[#EFEEEA] hover:border-[#5B5B57]'}`}>
                          <input 
                            type="checkbox" 
                            checked={roles.growth}
                            onChange={() => handleRoleToggle('growth')}
                            className="absolute opacity-0 cursor-pointer h-0 w-0"
                          />
                          <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-[4px] border ${roles.growth ? 'bg-[#185FA5] border-[#185FA5] flex items-center justify-center' : 'bg-white border-[#5B5B57]'}`}>
                            {roles.growth && <Check size={11} className="text-white stroke-[3.5px]" />}
                          </span>
                          <span>📣 {lang === 'id' ? 'Growth & Community' : 'Growth & Community'}</span>
                        </label>

                        {/* Option 6: Lainnya */}
                        <label className={`relative border border-[#DEDDD7] rounded-[4px] py-4.5 pl-12 pr-4 cursor-pointer text-sm select-none transition-all ${roles.lainnya ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-[#EFEEEA] hover:border-[#5B5B57]'}`}>
                          <input 
                            type="checkbox" 
                            checked={roles.lainnya}
                            onChange={() => handleRoleToggle('lainnya')}
                            className="absolute opacity-0 cursor-pointer h-0 w-0"
                          />
                          <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-[4px] border ${roles.lainnya ? 'bg-[#185FA5] border-[#185FA5] flex items-center justify-center' : 'bg-white border-[#5B5B57]'}`}>
                            {roles.lainnya && <Check size={11} className="text-white stroke-[3.5px]" />}
                          </span>
                          <span>🤝 {lang === 'id' ? 'Lainnya' : 'Other Roles'}</span>
                        </label>
                      </div>
                      {errors.roles && <span className="text-[10px] font-mono text-[#be1e2d] mt-1.5 block">{errors.roles}</span>}
                    </div>

                    <div className="bg-[#1D9E75]/5 border border-[#1D9E75]/30 dashed p-4.5 rounded-[4px] text-xs font-mono text-[#1D9E75] leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <b>↳ DYNAMIC LOGIC ROUTING ACTIVE:</b>
                        <span className="block mt-0.5 font-sans text-brand-midgray">
                          {lang === 'id' 
                            ? 'Kartu detail kuesioner pada sesi 03 akan muncul sesuai draf centang di atas secara langsung.' 
                            : 'Pathway questionnaire cards in section 03 will adapt and render instantly based on your selections above.'
                          }
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={toggleAllRolesDemo}
                        className="text-[9px] border border-[#1D9E75]/40 hover:bg-[#1D9E75]/10 px-2 py-1 rounded-[2px] transition-all uppercase shrink-0 font-bold tracking-wider"
                      >
                        {lang === 'id' ? 'Buka semua kuesioner' : 'Expand all blocks'}
                      </button>
                    </div>
                  </div>
                </section>

                {/* ============ SECTION 3: CONDITIONAL ROLE-SPECIFIC DETAILS ============ */}
                <section id="sec-role" className="space-y-8 pt-6 border-t border-[#DEDDD7]/80">
                  <div className="flex justify-between items-end border-b border-[#DEDDD7] pb-3">
                    <h2 className="font-display font-bold text-2xl text-brand-accent">
                      {lang === 'id' ? '03. Detail Kuesioner Peran' : '03. Pathway Details'}
                    </h2>
                    <span className="font-mono text-xs text-[#5B5B57]">03 / 05</span>
                  </div>
                  <p className="text-xs text-[#5B5B57] leading-relaxed max-w-lg">
                    {lang === 'id'
                      ? 'Tolong lengkapi kuesioner berikut sesuai dengan minat kontribusi yang kamu centang.'
                      : 'Please fill out details for your selected pathways below.'
                    }
                  </p>

                  <div className="space-y-8">
                    <AnimatePresence mode="popLayout">
                      {/* === KONTEN & ANIMASI SUB-SECTION CARD === */}
                      {roles.konten && (
                        <motion.div
                          key="role-konten"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="bg-white border border-[#DEDDD7] border-l-[3.5px] border-l-[#185FA5] rounded-[4px] p-6 md:p-8 space-y-6"
                        >
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B5B57] font-bold block mb-1">🎬 {lang === 'id' ? 'Konten & Animasi' : 'Content & Animation'}</span>
                            <h3 className="font-display font-extrabold text-[#0A0A0A] text-lg">
                              {lang === 'id' ? 'Untuk calon kontributor konten & animasi visual' : 'For Visual Animation & Content Track'}
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {/* Manim? */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#0A0A0A]">
                                {lang === 'id' ? 'Apakah kamu sudah menguasai Manim (Math Animation Engine)?' : 'Have you used Manim before?'}
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {['Pernah', 'Belum', 'Lagi belajar'].map((state) => (
                                  <label key={state} className={`relative border border-[#DEDDD7] rounded-[4px] py-4 px-1 cursor-pointer text-xs text-center select-none transition-all ${roleDetails.manim === state ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-white hover:border-[#5B5B57]'}`}>
                                    <input 
                                      type="radio" 
                                      name="manimState"
                                      checked={roleDetails.manim === state}
                                      onChange={() => setRoleDetails((prev) => ({ ...prev, manim: state }))}
                                      className="absolute opacity-0 h-0 w-0"
                                    />
                                    <span>
                                      {state === 'Pernah' 
                                        ? (lang === 'id' ? 'Pernah' : 'Yes, used it') 
                                        : state === 'Belum' 
                                          ? (lang === 'id' ? 'Belum' : 'Not yet') 
                                          : (lang === 'id' ? 'Lagi belajar' : 'Learning it')
                                      }
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Tools Lain */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Sofware / tools desain visual lain yang kamu gunakan:' : 'Other creative software tools you use:'}
                              </label>
                              <SmoothInput 
                                type="text"
                                value={roleDetails.manimTools}
                                onChange={(val) => setRoleDetails((prev) => ({ ...prev, manimTools: val }))}
                                placeholder={lang === 'id' ? 'cth. After Effects, Blender, GeoGebra, Figma' : 'ex. After Effects, Blender, GeoGebra, Figma'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all"
                              />
                            </div>

                            {/* Contoh Karya */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Link contoh karya visual, video atau animasi (Drive/YT/IG):' : 'Sample links of animations/videos (Drive/YT/IG):'}
                              </label>
                              <SmoothInput 
                                type="url"
                                value={roleDetails.manimPortfolio}
                                onChange={(val) => setRoleDetails((prev) => ({ ...prev, manimPortfolio: val }))}
                                placeholder={lang === 'id' ? 'https://youtube.com/... atau google drive' : 'https://youtube.com/... or Google Drive'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all"
                              />
                            </div>

                            {/* Topik STEM Favorit */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Topik sains/matematika terfavoritmu untuk divisualisasikan:' : 'Top STEM topics you are excited to visualize:'}
                              </label>
                              <SmoothTextarea 
                                value={roleDetails.manimTopics}
                                onChange={(val) => setRoleDetails((prev) => ({ ...prev, manimTopics: val }))}
                                placeholder={lang === 'id' ? 'cth. Transformasi Fourier, Persamaan Maxwell, Kalkulus Integral...' : 'ex. Fourier Transform, Maxwell Equations, Integral Calculus...'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all min-h-16 resize-y"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* === DEVELOPMENT SUB-SECTION CARD === */}
                      {roles.dev && (
                        <motion.div
                          key="role-dev"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="bg-white border border-[#DEDDD7] border-l-[3.5px] border-l-[#1D9E75] rounded-[4px] p-6 md:p-8 space-y-6"
                        >
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B5B57] font-bold block mb-1">💻 {lang === 'id' ? 'Jalur Developer' : 'Developer Track'}</span>
                            <h3 className="font-display font-extrabold text-[#0A0A0A] text-lg">
                              {lang === 'id' ? 'Untuk calon kontributor rekayasa perangkat lunak' : 'For Software Engineering Contributors'}
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {/* Stack */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#0A0A0A] block">
                                {lang === 'id' ? 'Stack yang kamu kuasai:' : 'Stack you have mastered:'}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.devStackReact}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, devStackReact: e.target.checked }))}
                                    className="accent-[#1D9E75] cursor-pointer"
                                  />
                                  <span>React / Vite</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.devStackTailwind}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, devStackTailwind: e.target.checked }))}
                                    className="accent-[#1D9E75] cursor-pointer"
                                  />
                                  <span>Tailwind CSS</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.devStackBackend}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, devStackBackend: e.target.checked }))}
                                    className="accent-[#1D9E75] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Backend Node / API' : 'Node Backend / API'}</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.devStackLainnya}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, devStackLainnya: e.target.checked }))}
                                    className="accent-[#1D9E75] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Lainnya (Three.js/D3)' : 'Others (Three.js/D3)'}</span>
                                </label>
                              </div>
                            </div>

                            {/* Git/Github */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#0A0A0A] block">
                                {lang === 'id' ? 'Punya pengalaman dengan Git & GitHub flow?' : 'Do you have experience with Git & GitHub workflow?'}
                              </label>
                              <div className="flex gap-4">
                                {['Ya', 'Belum'].map((state) => (
                                  <label key={state} className="flex items-center gap-1.5 text-xs cursor-pointer">
                                    <input 
                                      type="radio" 
                                      name="gitFlow"
                                      checked={roleDetails.devGit === state}
                                      onChange={() => setRoleDetails(prev => ({ ...prev, devGit: state }))}
                                      className="accent-[#1D9E75] cursor-pointer"
                                    />
                                    <span>{state === 'Ya' ? (lang === 'id' ? 'Ya' : 'Yes') : (lang === 'id' ? 'Belum' : 'Not yet')}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* GitHub URL */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Link Portofolio GitHub / GitLab:' : 'GitHub / GitLab Portfolio Link:'}
                              </label>
                              <SmoothInput 
                                type="url"
                                value={roleDetails.devPortfolio}
                                onChange={(val) => setRoleDetails(prev => ({ ...prev, devPortfolio: val }))}
                                placeholder="https://github.com/username"
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#1D9E75] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all"
                              />
                            </div>

                            {/* Deployed Project */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Pernah men-deploy proyek web milikmu sendiri? Ceritakan singkat:' : 'Have you deployed your own web projects? Describe briefly:'}
                              </label>
                              <SmoothTextarea 
                                value={roleDetails.devDeployed}
                                onChange={(val) => setRoleDetails(prev => ({ ...prev, devDeployed: val }))}
                                placeholder={lang === 'id' ? 'cth. Membangun static math solver dan deploy ke Vercel/Netlify...' : 'ex. Built static math solver and deployed to Vercel/Netlify...'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#1D9E75] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all min-h-16 resize-y"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* === DESIGN SUB-SECTION CARD === */}
                      {roles.desain && (
                        <motion.div
                          key="role-desain"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="bg-white border border-[#DEDDD7] border-l-[3.5px] border-l-[#534AB7] rounded-[4px] p-6 md:p-8 space-y-6"
                        >
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B5B57] font-bold block mb-1">🎨 {lang === 'id' ? 'Jalur Desain' : 'Design Track'}</span>
                            <h3 className="font-display font-extrabold text-[#0A0A0A] text-lg">
                              {lang === 'id' ? 'Untuk calon kontributor desain kreatif' : 'For Creative Design Contributors'}
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {/* Tools */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#0A0A0A] block">
                                {lang === 'id' ? 'Tools kreasimu:' : 'Your creative tools:'}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.desainStackFigma}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, desainStackFigma: e.target.checked }))}
                                    className="accent-[#534AB7] cursor-pointer"
                                  />
                                  <span>Figma</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.desainStackAdobe}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, desainStackAdobe: e.target.checked }))}
                                    className="accent-[#534AB7] cursor-pointer"
                                  />
                                  <span>Adobe Suite</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.desainStackProcreate}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, desainStackProcreate: e.target.checked }))}
                                    className="accent-[#534AB7] cursor-pointer"
                                  />
                                  <span>Procreate / Ilustrator</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.desainStackLainnya}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, desainStackLainnya: e.target.checked }))}
                                    className="accent-[#534AB7] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Lainnya' : 'Other'}</span>
                                </label>
                              </div>
                            </div>

                            {/* Portfolio Link */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Link Portofolio Ilustrasi / Behance / Dribbble:' : 'Illustration / Behance / Dribbble Portfolio Link:'}
                              </label>
                              <SmoothInput 
                                type="url"
                                value={roleDetails.desainPortfolio}
                                onChange={(val) => setRoleDetails(prev => ({ ...prev, desainPortfolio: val }))}
                                placeholder="https://..."
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#534AB7] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all"
                              />
                            </div>

                            {/* Bio details */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Punya pengalaman dalam melahirkan visual branding, grafis media sosial, atau UI kit?' : 'Experienced in creating social media graphics, visual branding, or UI kits?'}
                              </label>
                              <SmoothTextarea 
                                value={roleDetails.desainExperience}
                                onChange={(val) => setRoleDetails(prev => ({ ...prev, desainExperience: val }))}
                                placeholder={lang === 'id' ? 'Tuliskan jika ada...' : 'Describe if any...'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#534AB7] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all min-h-16 resize-y"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* === AKADEMIK & KURIKULUM SUB-SECTION CARD === */}
                      {roles.akademik && (
                        <motion.div
                          key="role-akademik"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="bg-white border border-[#DEDDD7] border-l-[3.5px] border-l-[#C5A880] rounded-[4px] p-6 md:p-8 space-y-6"
                        >
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B5B57] font-bold block mb-1">📐 {lang === 'id' ? 'Jalur Akademik' : 'Academic Track'}</span>
                            <h3 className="font-display font-extrabold text-[#0A0A0A] text-lg">
                              {lang === 'id' ? 'Untuk calon kontributor konten silabus & akademik' : 'For Curriculum & Syllabus Contributors'}
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {/* Bidang */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#0A0A0A] block">
                                {lang === 'id' ? 'Bidang STEM yang paling kamu kuasai:' : 'STEM topics you are best at:'}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.acadMath}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, acadMath: e.target.checked }))}
                                    className="accent-[#C5A880] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Math / Kalkulus' : 'Math / Calculus'}</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.acadPhys}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, acadPhys: e.target.checked }))}
                                    className="accent-[#C5A880] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Fisika Kuantum / Mekanika' : 'Quantum Physics / Mechanics'}</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.acadChem}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, acadChem: e.target.checked }))}
                                    className="accent-[#C5A880] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Kimia Sintesis' : 'Synthetic Chemistry'}</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.acadBio}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, acadBio: e.target.checked }))}
                                    className="accent-[#C5A880] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Biologi Komparatif' : 'Comparative Biology'}</span>
                                </label>
                                <label className="flex items-center gap-2 col-span-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.acadComp}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, acadComp: e.target.checked }))}
                                    className="accent-[#C5A880] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Computer Science / Logika Biner' : 'Computer Science / Binary Logic'}</span>
                                </label>
                              </div>
                            </div>

                            {/* Experience */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Ceritakan pengalaman mengajarmu (asisten laboratorium, tutor sebaya, kontingen olimpiade, dll):' : 'Share your teaching/tutoring experience (lab assistant, peer tutor, olympiad alumni, etc):'}
                              </label>
                              <SmoothTextarea 
                                value={roleDetails.acadExperience}
                                onChange={(val) => setRoleDetails(prev => ({ ...prev, acadExperience: val }))}
                                placeholder={lang === 'id' ? 'cth. Menjadi asisten dosen Aljabar Linier di kampus...' : 'ex. Linear Algebra tutor or teaching assistant at college...'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#C5A880] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all min-h-16 resize-y"
                              />
                            </div>

                            {/* Preference */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-[#0A0A0A] block">
                                {lang === 'id' ? 'Apakah kamu lebih condong ke penulisan soal / pembuat konten, atau riset filosofi edukasi?' : 'Are you more leaned towards writing questions/content creation or researching pedagogy?'}
                              </label>
                              <div className="flex gap-4">
                                {['Menulis soal', 'Riset pedagogi'].map((state) => (
                                  <label key={state} className="flex items-center gap-1.5 text-xs cursor-pointer">
                                    <input 
                                      type="radio" 
                                      name="acadPreference"
                                      checked={roleDetails.acadType === state}
                                      onChange={() => setRoleDetails(prev => ({ ...prev, acadType: state }))}
                                      className="accent-[#C5A880] cursor-pointer"
                                    />
                                    <span>{state === 'Menulis soal' ? (lang === 'id' ? 'Menulis soal' : 'Question writing') : (lang === 'id' ? 'Riset pedagogi' : 'Pedagogy research')}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* === GROWTH & COMMUNITY SUB-SECTION CARD === */}
                      {roles.growth && (
                        <motion.div
                          key="role-growth"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="bg-white border border-[#DEDDD7] border-l-[3.5px] border-l-[#185FA5] rounded-[4px] p-6 md:p-8 space-y-6"
                        >
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B5B57] font-bold block mb-1">📣 {lang === 'id' ? 'Jalur Growth & Komunitas' : 'Growth & Community Track'}</span>
                            <h3 className="font-display font-extrabold text-[#0A0A0A] text-lg">
                              {lang === 'id' ? 'Untuk calon kontributor humas & sosial media' : 'For Public Relations & Event Organizers'}
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {/* Experience */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Punya pengalaman dalam admin sosial media, komunitas server Discord, atau organizer kepanitiaan?' : 'Have experience as a social media admin, Discord moderator, or event organizer?'}
                              </label>
                              <SmoothTextarea 
                                value={roleDetails.growthSmed}
                                onChange={(val) => setRoleDetails(prev => ({ ...prev, growthSmed: val }))}
                                placeholder={lang === 'id' ? 'cth. Moderator server belajar dengan 2,000+ member...' : 'ex. Discord moderator for a study server with 2,000+ members...'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all min-h-16 resize-y"
                              />
                            </div>

                            {/* Preference Platform */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#0A0A0A] block">
                                {lang === 'id' ? 'Platform medsos andalanmu:' : 'Your go-to social media platforms:'}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.growthTiktok}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, growthTiktok: e.target.checked }))}
                                    className="accent-[#185FA5] cursor-pointer"
                                  />
                                  <span>TikTok</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.growthInstagram}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, growthInstagram: e.target.checked }))}
                                    className="accent-[#185FA5] cursor-pointer"
                                  />
                                  <span>Instagram</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.growthYoutube}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, growthYoutube: e.target.checked }))}
                                    className="accent-[#185FA5] cursor-pointer"
                                  />
                                  <span>YouTube</span>
                                </label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={roleDetails.growthLainnya}
                                    onChange={(e) => setRoleDetails(prev => ({ ...prev, growthLainnya: e.target.checked }))}
                                    className="accent-[#185FA5] cursor-pointer"
                                  />
                                  <span>{lang === 'id' ? 'Lainnya (X/Discord)' : 'Others (X/Discord)'}</span>
                                </label>
                              </div>
                            </div>

                            {/* Network */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Memiliki relasi ke jaringan BEM, Himpunan Mahasiswa STEM, atau klub belajar sekolah?' : 'Do you have connections to student unions (BEM), STEM student associations, or high school study clubs?'}
                              </label>
                              <SmoothTextarea 
                                value={roleDetails.growthNetwork}
                                onChange={(val) => setRoleDetails(prev => ({ ...prev, growthNetwork: val }))}
                                placeholder={lang === 'id' ? 'Tuliskan organisasi atau kemitraan potensial...' : 'Describe potential organizations or student networks...'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3 px-4 text-xs outline-none transition-all min-h-16 resize-y"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* === LAINNYA / UNIK SUB-SECTION CARD === */}
                      {roles.lainnya && (
                        <motion.div
                          id="field-lainnyaDetail"
                          key="role-lainnya"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="bg-white border border-[#DEDDD7] border-l-[3.5px] border-l-[#be1e2d] rounded-[4px] p-6 md:p-8 space-y-6"
                        >
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#be1e2d] font-bold block mb-1">🤝 {lang === 'id' ? 'Kontribusi Lainnya' : 'Other Contribution'}</span>
                            <h3 className="font-display font-extrabold text-[#0A0A0A] text-lg">
                              {lang === 'id' ? 'Ceritakan gagasan atau kontribusi unik Anda' : 'Describe your custom contribution pathway'}
                            </h3>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[#0A0A0A]">
                                {lang === 'id' ? 'Mempunyai keahlian atau gagasan kontribusi lain? Tulis secara santai dan terbuka di sini:' : 'Have unique skills or community ideas? Share them openly here:'} <span className="text-[#be1e2d] ml-1">*</span>
                              </label>
                              <SmoothTextarea
                                id="field-lainnyaDetail"
                                value={roleDetails.lainnyaDetail}
                                onChange={(val) => setRoleDetails(prev => ({ ...prev, lainnyaDetail: val }))}
                                placeholder={lang === 'id' ? 'cth. Saya tertarik membantu menerjemahkan konten bahasa Indonesia ke daerah, legalitas, riset UI/UX, atau dokumentasi audio...' : 'ex. My skills are in translating content to regional dialects, helping with legal status, doing UI/UX audits, or audio capture...'}
                                className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#be1e2d] focus:bg-white rounded-[3px] py-3.5 px-4 text-xs outline-none transition-all min-h-24 resize-y"
                              />
                              {errors.lainnyaDetail && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.lainnyaDetail}</span>}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </section>

                {/* ============ SECTION 4: KOMITMEN & LOGISTIK ============ */}
                <section id="sec-komitmen" className="space-y-6 pt-6 border-t border-[#DEDDD7]/80">
                  <div className="flex justify-between items-end border-b border-[#DEDDD7] pb-3">
                    <h2 className="font-display font-bold text-2xl text-brand-accent">
                      {lang === 'id' ? '04. Komitmen & Logistik' : '04. Capacity & Commitment'}
                    </h2>
                    <span className="font-mono text-xs text-[#5B5B57]">04 / 05</span>
                  </div>
                  <p className="text-xs text-[#5B5B57] leading-relaxed max-w-lg">
                    {lang === 'id'
                      ? 'Ini membantu kami mencocokkan beban kerja dan ekspektasi per minggu dengan ketersediaan waktumu.'
                      : 'This details assist us in balancing weekly responsibilities alongside your availability.'
                    }
                  </p>

                  <div className="space-y-4">
                    {/* Jam / Minggu */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' ? 'Berapa rata-rata jam per minggu yang bisa kamu luangkan untuk Loragica?' : 'Weekly hours contribution scope:'} <span className="text-[#534AB7]">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['1–3 jam', '4–7 jam', '8+ jam'].map((option) => (
                          <label key={option} className={`relative border border-[#DEDDD7] rounded-[4px] py-4 px-1 cursor-pointer text-xs text-center select-none transition-all ${commitment.jam === option ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-white hover:border-[#5B5B57]'}`}>
                            <input 
                              type="radio" 
                              name="commitJam"
                              checked={commitment.jam === option}
                              onChange={() => setCommitment((prev) => ({ ...prev, jam: option }))}
                              className="absolute opacity-0 h-0 w-0"
                            />
                            <span>{option.replace('jam', lang === 'id' ? 'jam' : 'hours')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Ketersediaan */}
                    <div id="field-ketersediaan" className="space-y-1.5">
                      <label className="flex items-center text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' ? 'Bisa bergabung aktif mulai kapan?' : 'Earliest joining date?'} <span className="text-[#534AB7] ml-1">*</span>
                      </label>
                      <input 
                        type="date"
                        value={commitment.ketersediaan}
                        onChange={(e) => setCommitment((prev) => ({ ...prev, ketersediaan: e.target.value }))}
                        className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all"
                      />
                      {errors.ketersediaan && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.ketersediaan}</span>}
                    </div>

                    {/* Volunteer Agreement */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' 
                          ? 'Peran ini murni kontribusi volunteer nirlaba pada tahap pengembangan awal gratis ini. Apakah kamu memahaminya?' 
                          : 'This is purely a voluntary role in this early open learning system stage. Do you agree?'
                        } <span className="text-[#534AB7]">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {['Ya, saya paham', 'Perlu didiskusikan'].map((option) => (
                          <label key={option} className={`relative border border-[#DEDDD7] rounded-[4px] py-4 pl-12 pr-4 cursor-pointer text-sm select-none transition-all ${commitment.volunteering === option ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'bg-white hover:border-[#5B5B57]'}`}>
                            <input 
                              type="radio" 
                              name="volAgreement"
                              checked={commitment.volunteering === option}
                              onChange={() => setCommitment((prev) => ({ ...prev, volunteering: option }))}
                              className="absolute opacity-0 h-0 w-0"
                            />
                            <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full border ${commitment.volunteering === option ? 'bg-[#185FA5] border-[#185FA5] flex items-center justify-center' : 'bg-white border-[#5B5B57]'}`}>
                              {commitment.volunteering === option && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span>
                              {option === 'Ya, saya paham' 
                                ? (lang === 'id' ? 'Ya, saya paham' : 'Yes, I understand') 
                                : (lang === 'id' ? 'Perlu didiskusikan' : 'Need discussion')
                              }
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Co-founder */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' 
                          ? 'Tertarik menjadi salah satu co-founder teknis Loragica jika kecocokan berlanjut jangka panjang?' 
                          : 'Interested in evolving as a technical co-founder over longer terms?'
                        }
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['Sangat tertarik', 'Mungkin nanti', 'Hanya sementara'].map((option) => (
                          <label key={option} className={`relative border border-[#DEDDD7] rounded-[4px] py-4 px-1 cursor-pointer text-xs text-center select-none transition-all ${commitment.cofounder === option ? 'bg-[#EFEEEA] border-[#185FA5] font-semibold' : 'opacity-80 bg-white hover:border-[#5B5B57]'}`}>
                            <input 
                              type="radio" 
                              name="cofounderInterest"
                              checked={commitment.cofounder === option}
                              onChange={() => setCommitment((prev) => ({ ...prev, cofounder: option }))}
                              className="absolute opacity-0 h-0 w-0"
                            />
                            <span>
                              {option === 'Sangat tertarik' 
                                ? (lang === 'id' ? 'Sangat tertarik' : 'Highly interested') 
                                : option === 'Mungkin nanti' 
                                  ? (lang === 'id' ? 'Mungkin nanti' : 'Maybe later')
                                  : (lang === 'id' ? 'Hanya sementara' : 'Just temporary/short term')
                              }
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ============ SECTION 5: MOTIVASI ============ */}
                <section id="sec-motivasi" className="space-y-6 pt-6 border-t border-[#DEDDD7]/80">
                  <div className="flex justify-between items-end border-b border-[#DEDDD7] pb-3">
                    <h2 className="font-display font-bold text-2xl text-brand-accent">
                      {lang === 'id' ? '05. Motivasi' : '05. Motivation & Vision'}
                    </h2>
                    <span className="font-mono text-xs text-[#5B5B57]">05 / 05</span>
                  </div>
                  <p className="text-xs text-[#5B5B57] leading-relaxed max-w-lg">
                    {lang === 'id'
                      ? 'Bagian terakhir — beri tahu kami lebih banyak mengenai dorongan dan ide besarmu.'
                      : 'Last step — share a bit of your creative vision and driving force with Loragica.'
                    }
                  </p>

                  <div className="space-y-4">
                    {/* Alasan */}
                    <div id="field-alasan" className="space-y-1.5">
                      <label className="flex items-center text-xs font-bold text-[#0A0A0A]">
                        {lang === 'id' ? 'Mengapa kamu tertarik bergabung untuk berkontribusi di Loragica?' : 'Why are you passionate to contribute with us?'} <span className="text-[#534AB7]">*</span>
                      </label>
                      <SmoothTextarea 
                        id="field-alasan"
                        value={motivasi.alasan}
                        onChange={(val) => setMotivasi((prev) => ({ ...prev, alasan: val }))}
                        placeholder={lang === 'id' ? 'Ceritakan motivasimu secara bebas...' : 'Tell us your personal spark...'}
                        className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all min-h-24 resize-y"
                      />
                      {errors.alasan && <span className="text-[10px] font-mono text-[#be1e2d] mt-1 block">{errors.alasan}</span>}
                    </div>

                    {/* Ide Eksplorasi */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="text-xs font-bold text-[#0A0A0A]">
                          {lang === 'id' ? 'Ada ide atau insight yang menurutmu bisa Loragica eksplor lebih jauh?' : 'Any distinct ideas/simulations we should explore next?'}
                        </label>
                        <span className="font-mono text-[9px] text-[#5B5B57] uppercase tracking-[0.05em]">{lang === 'id' ? 'OPSIONAL' : 'OPTIONAL'}</span>
                      </div>
                      <SmoothTextarea 
                        value={motivasi.ide}
                        onChange={(val) => setMotivasi((prev) => ({ ...prev, ide: val }))}
                        placeholder={lang === 'id' ? 'Bebas berbagi pemikiranmu di sini...' : 'Feel free to unleash your creative calculations...'}
                        className="w-full bg-[#EFEEEA] border border-[#DEDDD7] hover:border-[#5B5B57] focus:border-[#185FA5] focus:bg-white rounded-[3px] py-3.5 px-4 text-sm font-sans outline-none transition-all min-h-24 resize-y"
                      />
                    </div>
                  </div>
                </section>

                {/* ============ SUBMIT TRIGGERS ============ */}
                <section className="pt-8 border-t border-[#DEDDD7]">
                  <div className="text-center max-w-sm mx-auto space-y-4">
                    <div className="w-[32px] h-[32px] grid grid-cols-2 grid-rows-2 gap-[3px] mx-auto">
                      <div className="rounded-[3px] border border-[#0A0A0A]" />
                      <div className="rounded-[3px] bg-[#185FA5]" />
                      <div className="rounded-[3px] bg-[#1D9E75]" />
                      <div className="rounded-[3px] bg-[#534AB7]" />
                    </div>

                    <h3 className="font-display font-extrabold text-[#0A0A0A] text-lg">
                      {lang === 'id' ? 'Draf Siap Dikirim' : 'Ready to Launch'}
                    </h3>
                    <p className="text-xs text-[#5B5B57] leading-relaxed">
                      {lang === 'id' 
                        ? 'Tim pendidik Loragica akan segera meninjau draf Anda dan menghubungi kembali.'
                        : 'Your application is set. Click submit to send your credentials to the review deck.'
                      }
                    </p>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0A0A0A] hover:bg-[#1E1E1E] text-white disabled:bg-[#5B5B57] py-4.5 font-mono text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 rounded-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin text-white" size={14} />
                          <span>{lang === 'id' ? 'MENGIRIM DRAF...' : 'DISPATCHING...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{lang === 'id' ? 'KIRIM PENDAFTARAN' : 'SEND APPLICATION'}</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                    
                    <span className="block text-[9px] font-mono text-brand-lightgray uppercase tracking-[0.06em]">
                      LEARN · SEE · CONNECT
                    </span>
                  </div>
                </section>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
