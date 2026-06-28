/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, Award, X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'trademark';
  lang: 'id' | 'en';
}

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy', lang }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'trademark'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const tabs = [
    { id: 'privacy', label: lang === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy', icon: <Shield size={16} /> },
    { id: 'terms', label: lang === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions', icon: <FileText size={16} /> },
    { id: 'trademark', label: lang === 'id' ? 'Kebijakan Merek' : 'Trademark Policy', icon: <Award size={16} /> },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-[#0A0A0A]/90 backdrop-blur-sm overflow-y-auto">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 cursor-default" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative my-auto bg-brand-offwhite border-2 border-brand-accent max-w-4xl w-full rounded-none shadow-[12px_12px_0px_rgba(10,10,10,0.25)] md:shadow-[24px_24px_0px_rgba(10,10,10,0.3)] overflow-hidden max-h-[95vh] sm:max-h-[92vh] md:max-h-[86vh] flex flex-col z-10 text-brand-accent blueprint-grid"
          >
            {/* Header Area */}
            <div className="p-4 sm:p-6 border-b-2 border-brand-accent flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-card shrink-0">
              <div className="space-y-1 pr-10 md:pr-0">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#bba078] bg-[#bba078]/15 border border-[#bba078]/25 px-2 py-0.5 rounded-none inline-block">
                  {lang === 'id' ? 'DOKUMEN LEGAL & REGULASI' : 'LEGAL & BRAND DOCUMENTS'}
                </span>
                <h2 className="font-display font-light text-xl md:text-2xl tracking-tight text-brand-accent flex items-center gap-2">
                  Loragica {lang === 'id' ? <span className="font-serif italic font-medium text-[#bba078]">Koridor Hukum</span> : <span className="font-serif italic font-medium text-[#bba078]">Legal Corridors</span>}
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:static text-brand-accent hover:text-[#bba078] p-2 transition-colors cursor-pointer"
                title={lang === 'id' ? 'Tutup' : 'Close'}
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Tabbed Navigation */}
            <div className="flex border-b border-brand-border bg-brand-card shrink-0 overflow-x-auto scrollbar-none font-mono text-[10px] sm:text-xs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 border-r border-brand-border transition-all font-bold cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-brand-offwhite text-brand-accent border-b-2 border-b-brand-accent font-black'
                        : 'text-brand-lightgray hover:text-brand-midgray bg-brand-card'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Body Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 text-xs sm:text-sm text-brand-darkgray leading-relaxed font-sans scrollbar touch-pan-y overscroll-contain">
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  {lang === 'id' ? (
                    <>
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-accent mb-1 border-b border-brand-accent/10 pb-2">
                          Kebijakan Privasi Loragica
                        </h3>
                        <p className="font-mono text-[10px] text-brand-lightgray">
                          Berlaku efektif: 19 Juni 2026 | Versi dokumen: 1.0
                        </p>
                      </div>

                      <div className="p-4 bg-brand-card border-l-4 border-brand-luxury font-mono text-[11px] leading-relaxed text-brand-darkgray">
                        <strong className="text-brand-accent">PENTING UNTUK DIPAHAMI DI AWAL:</strong> Loragica saat ini berada di tahap <strong className="text-brand-luxury">branding dan validasi awal</strong>. Situs ini adalah halaman perkenalan brand — belum ada sistem akun pengguna (login/registrasi), belum ada pembayaran, dan belum ada penyimpanan data pembelajaran pribadi. Kebijakan ini akan diperbarui begitu fitur-fitur tersebut dirilis, dan kami akan menandai dengan jelas kapan pembaruan signifikan terjadi.
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          1. Pendahuluan
                        </h4>
                        <p>
                          Loragica (&quot;kami&quot;) menghargai privasi setiap orang yang mengunjungi situs web kami di{' '}
                          <span className="font-mono text-[11px] font-bold">loragica.com</span> /{' '}
                          <span className="font-mono text-[11px] font-bold">loragica.id</span> (&quot;Situs&quot;). Dokumen ini menjelaskan data apa saja yang mungkin kami kumpulkan, untuk apa data itu digunakan, dan hak yang kamu miliki atas data tersebut.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          2. Data yang Kami Kumpulkan
                        </h4>

                        <div className="space-y-3 pl-4 border-l border-brand-border">
                          <p>
                            <strong className="text-brand-accent">2.1 Data yang kamu berikan secara langsung</strong>
                            <br />
                            Jika Situs menyediakan formulir (misalnya formulir kontak, pendaftaran minat/waitlist, atau pendaftaran cohort berbayar di masa depan), kami hanya mengumpulkan data yang kamu masukkan secara sukarela, seperti: Nama, Alamat email, serta Pesan atau pertanyaan yang kamu kirimkan.
                          </p>

                          <p>
                            <strong className="text-brand-accent">2.2 Data teknis otomatis</strong>
                            <br />
                            Karena Situs di-hosting di <strong className="text-brand-accent">Cloudflare Pages</strong>, sebagian data teknis dasar (seperti alamat IP, jenis browser, halaman yang diakses, dan waktu kunjungan) dapat tercatat secara otomatis melalui infrastruktur Cloudflare untuk keperluan keamanan dan performa jaringan. Kami sendiri tidak menjalankan sistem analitik pelacakan pihak ketiga (seperti Google Analytics).
                          </p>

                          <p>
                            <strong className="text-brand-accent">2.3 Cookies</strong>
                            <br />
                            Situs ini saat ini <strong className="text-brand-accent">tidak menggunakan cookies pelacakan (tracking cookies)</strong> untuk iklan atau profiling. Jika di masa depan kami menambahkan alat analitik yang menggunakan cookies, kami akan menyediakan mekanisme persetujuan (consent) secara eksplisit.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          3. Bagaimana Kami Menggunakan Data
                        </h4>
                        <p>Data yang kamu berikan secara langsung hanya kami gunakan untuk:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Membalas pertanyaan atau pesan yang kamu kirimkan</li>
                          <li>Menghubungi kamu terkait program yang kamu daftarkan minatnya (misalnya cohort pembelajaran)</li>
                          <li>Memperbaiki dan mengembangkan Situs serta layanan Loragica</li>
                        </ul>
                        <p>Kami <strong className="text-brand-accent font-bold">tidak menjual, menyewakan, atau memperdagangkan</strong> data pribadi kepada pihak ketiga mana pun.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          4. Penyimpanan &amp; Keamanan Data
                        </h4>
                        <p>
                          Data formulir yang kamu kirimkan disimpan menggunakan layanan pihak ketiga tepercaya (misalnya penyedia email atau form-handling yang terhubung ke Situs). Kami berupaya menggunakan layanan dengan standar keamanan yang wajar, namun tidak ada metode transmisi di internet yang 100% aman secara absolut.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          5. Pihak Ketiga
                        </h4>
                        <p>
                          Situs ini di-hosting menggunakan <strong className="text-brand-accent">Cloudflare Pages</strong>. Penggunaan Situs ini secara tidak langsung tunduk pula pada kebijakan privasi pihak ketiga untuk hal-hal yang berkaitan dengan infrastruktur jaringan mereka.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          6. Hak Kamu
                        </h4>
                        <p>Kamu berhak untuk:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Meminta salinan data pribadi yang kami simpan tentang kamu</li>
                          <li>Meminta kami memperbarui atau menghapus data tersebut</li>
                          <li>Menarik persetujuan kapan saja (misalnya berhenti dari daftar waitlist email)</li>
                        </ul>
                      </div>

                      <div className="space-y-4 bg-brand-card p-5 border border-brand-border">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          7. Hubungi Kami
                        </h4>
                        <p>
                          Jika kamu punya pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak atas data pribadimu, silakan hubungi kami melalui surel resmi kami:
                        </p>
                        <p className="font-mono text-xs font-bold text-brand-luxury mt-2 flex items-center gap-1.5">
                          📧 official.loragica@gmail.com
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-accent mb-1 border-b border-brand-accent/10 pb-2">
                          Loragica Privacy Policy
                        </h3>
                        <p className="font-mono text-[10px] text-brand-lightgray">
                          Effective Date: June 19, 2026 | Document version: 1.0
                        </p>
                      </div>

                      <div className="p-4 bg-brand-card border-l-4 border-brand-luxury font-mono text-[11px] leading-relaxed text-brand-darkgray">
                        <strong className="text-brand-accent">CRITICAL TO UNDERSTAND FROM THE OUTSET:</strong> Loragica is currently in its early <strong className="text-brand-luxury">branding and validation phase</strong>. This website serves as a brand introduction page—there is no user account system (login/registration), no payments, and no permanent storage of personalized learning data. This policy will be updated once these features are released, and we will clearly mark when significant updates occur.
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          1. Introduction
                        </h4>
                        <p>
                          Loragica (&quot;we&quot;) values the privacy of everyone visiting our website at{' '}
                          <span className="font-mono text-[11px] font-bold">loragica.com</span> /{' '}
                          <span className="font-mono text-[11px] font-bold">loragica.id</span> (&quot;Site&quot;). This document explains what data we may collect, how it is used, and the rights you have regarding that data.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          2. Data We Collect
                        </h4>

                        <div className="space-y-3 pl-4 border-l border-brand-border">
                          <p>
                            <strong className="text-brand-accent">2.1 Data you provide directly</strong>
                            <br />
                            If the Site provides any forms (such as contact forms, waitlist/interest sign-up, or paid cohort registrations in the future), we only collect data that you enter voluntarily, such as: Name, Email address, and any messages or questions you submit.
                          </p>

                          <p>
                            <strong className="text-brand-accent">2.2 Automatic technical data</strong>
                            <br />
                            Because the Site is hosted on <strong className="text-brand-accent">Cloudflare Pages</strong>, some basic technical data (like IP addresses, browser types, accessed pages, and visit timestamps) may be automatically logged through Cloudflare&apos;s infrastructure for network security and performance purposes. We do not run third-party tracking analytics systems ourselves (such as Google Analytics).
                          </p>

                          <p>
                            <strong className="text-brand-accent">2.3 Cookies</strong>
                            <br />
                            This Site does not currently use tracking cookies for advertising or profiling. If we add analytics tools using cookies in the future, we will provide an explicit consent mechanism.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          3. How We Use Data
                        </h4>
                        <p>Data you provide directly is only used to:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Reply to questions or messages you send to us</li>
                          <li>Contact you regarding programs you signed up for (e.g., learning cohorts)</li>
                          <li>Improve and develop the Site and Loragica services</li>
                        </ul>
                        <p>We <strong className="text-brand-accent font-bold">do not sell, rent, or trade</strong> personal data to any third party.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          4. Data Retention &amp; Security
                        </h4>
                        <p>
                          Form data you submit is stored using trusted third-party services (e.g., email or form-handling providers connected to the Site). We strive to use services with reasonable security standards, but no internet transmission is 100% secure.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          5. Third Parties
                        </h4>
                        <p>
                          This Site is hosted on <strong className="text-brand-accent">Cloudflare Pages</strong>. Use of this Site is indirectly subject to third-party privacy policies regarding network infrastructure.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          6. Your Rights
                        </h4>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Request a copy of the personal data we store about you</li>
                          <li>Request us to update or delete that data</li>
                          <li>Withdraw your consent at any time (e.g., unsubscribe from waitlists/emails)</li>
                        </ul>
                      </div>

                      <div className="space-y-4 bg-brand-card p-5 border border-brand-border">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          7. Contact Us
                        </h4>
                        <p>
                          If you have questions about this privacy policy or want to exercise your rights, please reach out to us at our official email:
                        </p>
                        <p className="font-mono text-xs font-bold text-brand-luxury mt-2 flex items-center gap-1.5">
                          📧 official.loragica@gmail.com
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-6">
                  {lang === 'id' ? (
                    <>
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-accent mb-1 border-b border-brand-accent/10 pb-2">
                          Syarat dan Ketentuan Loragica
                        </h3>
                        <p className="font-mono text-[10px] text-brand-lightgray">
                          Berlaku efektif: 19 Juni 2026 | Versi dokumen: 1.0
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          1. Tentang Dokumen Ini
                        </h4>
                        <p>
                          Dengan mengakses atau menggunakan situs web Loragica (
                          <span className="font-mono text-[11px] font-bold">loragica.com</span> /{' '}
                          <span className="font-mono text-[11px] font-bold">loragica.id</span>) (&quot;Situs&quot;) atau kode sumber di repository ini, kamu setuju untuk terikat dengan Syarat dan Ketentuan ini. Jika kamu tidak setuju, mohon untuk tidak menggunakan Situs atau kode sumber ini.
                        </p>
                        <p className="text-brand-midgray text-xs sm:text-sm">
                          Loragica saat ini berada pada <strong className="text-brand-accent">tahap branding dan validasi awal</strong>: belum ada sistem akun pengguna, belum ada transaksi pembayaran, dan belum ada platform pembelajaran penuh yang aktif. Syarat ini akan diperluas seiring berkembangnya produk di masa mendatang.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          2. Penggunaan Situs
                        </h4>
                        <p>Situs ini disediakan untuk tujuan informasi mengenai Loragica sebagai inisiatif EdTech STEM. Kamu setuju untuk tidak:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Menggunakan Situs untuk tujuan ilegal atau melanggar hukum yang berlaku di Indonesia.</li>
                          <li>Mencoba mengakses bagian non-publik dari sistem komputasi kami tanpa izin sah.</li>
                          <li>Menyalahgunakan formulir kontak/pendaftaran untuk spam atau penipuan manipulatif.</li>
                          <li>Mengklaim afiliasi atau kerja sama resmi dengan Loragica tanpa izin tertulis eksplisit.</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          3. Lisensi Kode Sumber (Open Source)
                        </h4>
                        <p>
                          Kode sumber yang terdapat dalam repository ini dilisensikan di bawah{' '}
                          <strong className="text-brand-accent">GNU Affero General Public License v3.0 (AGPL-3.0)</strong>.
                        </p>

                        <div className="overflow-x-auto my-3">
                          <table className="w-full text-xs font-mono border-collapse border border-brand-accent">
                            <thead>
                              <tr className="bg-brand-accent text-brand-offwhite">
                                <th className="border border-brand-accent px-4 py-2 text-left">Kamu boleh</th>
                                <th className="border border-brand-accent px-4 py-2 text-left">Dengan syarat</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-brand-card">
                                <td className="border border-brand-border px-4 py-3">✅ Menggunakan kode untuk keperluan apa pun, termasuk komersial</td>
                                <td className="border border-brand-border px-4 py-3">📋 Source code turunan tetap harus dilisensikan di bawah AGPL-3.0</td>
                              </tr>
                              <tr className="bg-brand-offwhite">
                                <td className="border border-brand-border px-4 py-3">✅ Mempelajari dan memodifikasi baris kode</td>
                                <td className="border border-brand-border px-4 py-3">📋 Perubahan signifikan wajib didokumentasikan</td>
                              </tr>
                              <tr className="bg-brand-card">
                                <td className="border border-brand-border px-4 py-3">✅ Mendistribusikan ulang baris kode (asli/modifikasi)</td>
                                <td className="border border-brand-border px-4 py-3">📋 Sertakan salinan lisensi &amp; copyright resmi</td>
                              </tr>
                              <tr className="bg-brand-offwhite">
                                <td className="border border-brand-border px-4 py-3">✅ Menjalankan versi modifikasi sebagai layanan jaringan/web</td>
                                <td className="border border-brand-border px-4 py-3">📋 <strong className="text-brand-luxury">Wajib menyediakan source code lengkap</strong> ke seluruh pengguna jaringan layanan tersebut</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <p className="text-xs text-brand-midgray">
                          Poin terakhir adalah ciri khas AGPL dibanding lisensi open source lain (seperti MIT atau GPL biasa): jika kamu menjalankan versi modifikasi dari kode ini di server publik, kamu wajib memberi akses source code-nya kepada pengguna platform tersebut.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          4. Merek &amp; Identitas (Brand Assets)
                        </h4>
                        <p>
                          Merek dagang, logo grid 2×2, kombinasi pilar Logos-Horasis-Agora, skema warna brand, dan aset identitas visual resmi Loragica <strong className="text-brand-luxury uppercase font-bold">BUKAN bagian dari lisensi open source</strong>. Penggunaan materi merek ini disetujui secara terbatas dan diatur ketat di tab <button onClick={() => setActiveTab('trademark')} className="text-brand-luxury font-bold underline cursor-pointer hover:text-brand-accent">Kebijakan Merek</button>.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          5. Konten Edukasi &amp; Animasi
                        </h4>
                        <p>
                          Materi pembelajaran, visualisasi matematika, dan animasi (termasuk yang dibuat menggunakan kerangka kerja Manim) yang dipublikasikan oleh Loragica adalah kekayaan intelektual kami dan dilindungi hak cipta, kecuali dinyatakan lain secara eksplisit.
                        </p>
                      </div>

                      <div className="space-y-4 border-t border-brand-border pt-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          6. Batasan Tanggung Jawab
                        </h4>
                        <p className="text-xs font-mono text-brand-midgray leading-relaxed">
                          SITUS DAN KODE SUMBER DISEDIAKAN &quot;SEBAGAIMANA ADANYA&quot; (AS-IS), TANPA JAMINAN APA PUN, BAIK TERSURAT MAUPUN TERSIRAT — TERMASUK NAMUN TIDAK TERBATAS PADA JAMINAN LELAYAKAN UNTUK TUJUAN TERTENTU, SEBAGAIMANA DIATUR OLEH BAGIAN 15 &amp; 16 LISENSI AGPL-3.0. LORAGICA TIDAK BERTANGGUNG JAWAB ATAS SEGALA KERUGIAN YANG TIMBUL DARI PENGGUNAAN BERKALA.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-accent mb-1 border-b border-brand-accent/10 pb-2">
                          Loragica Terms and Conditions
                        </h3>
                        <p className="font-mono text-[10px] text-brand-lightgray">
                          Effective Date: June 19, 2026 | Document version: 1.0
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          1. About This Document
                        </h4>
                        <p>
                          By accessing or using the Loragica website (
                          <span className="font-mono text-[11px] font-bold">loragica.com</span> /{' '}
                          <span className="font-mono text-[11px] font-bold">loragica.id</span>) (&quot;Site&quot;) or the source code inside this repository, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Site or this source code.
                        </p>
                        <p className="text-brand-midgray text-xs sm:text-sm">
                          Loragica is currently in its <strong className="text-brand-accent font-bold">branding and early validation phase</strong>: there are no user accounts, no payment transactions, and no full active learning platform yet. These terms will be expanded as the product develops.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          2. Use of the Site
                        </h4>
                        <p>This Site is provided for informational purposes as a STEM EdTech initiative. You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Use the Site for illegal purposes or in violation of any applicable laws in Indonesia.</li>
                          <li>Attempt to gain unauthorized access to any non-public parts of our computing systems.</li>
                          <li>Misuse contact or registration forms to spam or perform manipulative scams.</li>
                          <li>Claim official affiliation or partnership with Loragica without explicit written permission.</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          3. Source Code License (Open Source)
                        </h4>
                        <p>
                          The source code in this repository is licensed under the{' '}
                          <strong className="text-brand-accent">GNU Affero General Public License v3.0 (AGPL-3.0)</strong>.
                        </p>

                        <div className="overflow-x-auto my-3">
                          <table className="w-full text-xs font-mono border-collapse border border-brand-accent">
                            <thead>
                              <tr className="bg-brand-accent text-brand-offwhite">
                                <th className="border border-brand-accent px-4 py-2 text-left">You may</th>
                                <th className="border border-brand-accent px-4 py-2 text-left">On condition that</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-brand-card">
                                <td className="border border-brand-border px-4 py-3">✅ Use the code for any purpose, including commercial use</td>
                                <td className="border border-brand-border px-4 py-3">📋 Derivative source code must also be licensed under AGPL-3.0</td>
                              </tr>
                              <tr className="bg-brand-offwhite">
                                <td className="border border-brand-border px-4 py-3">✅ Study and modify the code base</td>
                                <td className="border border-brand-border px-4 py-3">📋 Significant changes must be documented</td>
                              </tr>
                              <tr className="bg-brand-card">
                                <td className="border border-brand-border px-4 py-3">✅ Redistribute the code (original or modified)</td>
                                <td className="border border-brand-border px-4 py-3">📋 Include copy of license &amp; official copyright notices</td>
                              </tr>
                              <tr className="bg-brand-offwhite">
                                <td className="border border-brand-border px-4 py-3">✅ Run a modified version as a network/web service</td>
                                <td className="border border-brand-border px-4 py-3">📋 <strong className="text-brand-luxury">Must provide full source code</strong> to all users of that network service</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <p className="text-xs text-brand-midgray">
                          The last point is a primary characteristic of AGPL: if you run a modified version of this code on a public server, you are obliged to provide the complete source code to the users of that service.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          4. Brand Assets (Trademarks)
                        </h4>
                        <p>
                          Trademarks, the asymmetrical 2×2 logo grid, the combination of Logos-Horasis-Agora, the official color palette, and other official visual identity assets are <strong className="text-brand-luxury uppercase font-bold">NOT part of the open-source license</strong>. Use is strictly protected and defined in the <button onClick={() => setActiveTab('trademark')} className="text-brand-luxury font-bold underline cursor-pointer hover:text-brand-accent">Trademark Policy</button> tab.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          5. Educational Content &amp; Animations
                        </h4>
                        <p>
                          Learning materials, mathematical visualizers, and animations (including those made using the Manim framework) published by Loragica are our intellectual property and protected by copyright unless stated otherwise.
                        </p>
                      </div>

                      <div className="space-y-4 border-t border-brand-border pt-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          6. Limitation of Liability
                        </h4>
                        <p className="text-xs font-mono text-brand-midgray leading-relaxed">
                          THE SITE AND SOURCE CODE ARE PROVIDED &quot;AS-IS&quot;, WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED — INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, AS OUTLINED IN SECTIONS 15 &amp; 16 OF THE AGPL-3.0 LICENSE. LORAGICA SHALL NOT BE LIABLE FOR ANY DAMAGES ARISING FROM USAGE.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'trademark' && (
                <div className="space-y-6">
                  {lang === 'id' ? (
                    <>
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-accent mb-1 border-b border-brand-accent/10 pb-2">
                          Kebijakan Merek &amp; Brand Assets Loragica
                        </h3>
                        <p className="font-mono text-[10px] text-brand-lightgray">
                          Berlaku efektif: 19 Juni 2026
                        </p>
                      </div>

                      <div className="p-4 bg-brand-luxury/10 border-l-4 border-brand-luxury font-sans text-xs md:text-sm text-brand-darkgray">
                        <strong className="text-brand-accent">Mengapa Dokumen Ini Terpisah dari Lisensi Kode?</strong>
                        <p className="mt-1">
                          Kode sumber di repository ini bersifat <strong className="text-brand-accent">open source (AGPL-3.0)</strong> — bebas dipakai, dimodifikasi, dan didistribusikan ulang sesuai syarat lisensinya. Namun, <strong className="text-brand-luxury">lisensi open source pada kode tidak secara otomatis memberikan hak untuk menggunakan nama dan identitas brand Loragica.</strong>
                        </p>
                        <p className="mt-1.5 text-xs text-brand-midgray">
                          Ini adalah praktik standar industri (dipakai oleh proyek e.g. Mozilla Firefox, WordPress) agar pengguna tidak bingung mana yang merupakan produk resmi Loragica dan mana yang merupakan produk hasil modifikasi pihak ketiga.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          1. Brand Assets yang Dilindungi penuh
                        </h4>
                        <p>Aset berikut dilindungi penuh dan tidak boleh digunakan tanpa persetujuan tertulis dari Loragica:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-darkgray font-sans">
                          <li>Nama <strong className="text-brand-accent font-bold">&quot;Loragica&quot;</strong> dan segala bentuk penulisan/variasinya.</li>
                          <li>Logomark grid 2×2 asimetris beserta seluruh variasi tata letaknya.</li>
                          <li>Wordmark Loragica dalam tipografi apa pun.</li>
                          <li>
                            Palet warna brand resmi:
                            <ul className="list-none pl-6 mt-1 space-y-1 font-mono text-xs">
                              <li className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 inline-block border border-brand-border bg-[#185FA5]"></span>
                                Logos Blue (#185FA5)
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 inline-block border border-brand-border bg-[#1D9E75]"></span>
                                Horasis Teal (#1D9E75)
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 inline-block border border-brand-border bg-[#534AB7]"></span>
                                Agora Purple (#534AB7)
                              </li>
                            </ul>
                          </li>
                          <li>Tagline <strong className="text-brand-accent font-bold">&quot;Learn · See · Connect&quot;</strong>.</li>
                          <li>Filosofi tiga pilar <strong className="text-brand-accent">Logos (λόγος) · Horasis (ὅρασις) · Agora (ἀγορά)</strong> sebagai identitas visual terstruktur.</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide text-red-700">
                          2. Yang SANGAT Dilarang dilakukan
                        </h4>
                        <p>Tanpa izin tertulis eksplisit dari kami, kamu dilarang keras untuk:</p>
                        <ul className="list-decimal pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Menggunakan kata &quot;Loragica&quot; untuk proyek fork modifikasi lain.</li>
                          <li>Mempublikasikan proyek modifikasi dengan skema visual, logo pilar, dan palet warna yang meniru Loragica sehingga berpotensi membingungkan publik.</li>
                          <li>Menyatakan atau menyiratkan afiliasi komersial murni, endorsement resmi, atau dukungan bersponsor dari kami tanpa kesepakatan tertulis.</li>
                        </ul>
                        <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-900 font-mono">
                          💡 <strong>Petunjuk Fork:</strong> Jika kamu meng-fork kode ini untuk membangun platform edukasi serupa, kamu wajib mengganti nama, logo, dan seluruh elemen estetika identitas visual dengan milikmu sendiri secara mandiri.
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          3. Yang Boleh dilakukan
                        </h4>
                        <p>Kamu diperbolehkan menggunakan brand assets kami secara bebas untuk:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Menyebut nama &quot;Loragica&quot; dalam konteks faktual (seperti berita, artikel, ulasan, materi studi akademis).</li>
                          <li>Menempelkan link atau rujukan murni ke situs resmi Loragica.</li>
                          <li>Menjelaskan bahwa proyek edukasi milikmu &quot;terinspirasi dari&quot; atau &quot;merupakan fork dari kode sumber Loragica&quot; dengan menampilkan nama brand unikmu sendiri.</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-accent mb-1 border-b border-brand-accent/10 pb-2">
                          Loragica Trademark &amp; Brand Assets Policy
                        </h3>
                        <p className="font-mono text-[10px] text-brand-lightgray">
                          Effective Date: June 19, 2026
                        </p>
                      </div>

                      <div className="p-4 bg-brand-luxury/10 border-l-4 border-brand-luxury font-sans text-xs md:text-sm text-brand-darkgray">
                        <strong className="text-brand-accent">Why is this document separate from the code license?</strong>
                        <p className="mt-1">
                          The source code in this repository is <strong className="text-brand-accent">open source (AGPL-3.0)</strong>—freely usable, modifiable, and redistributable under its license conditions. However, <strong className="text-brand-luxury">the open-source license on the code does not automatically grant rights to use the Loragica brand name or identity.</strong>
                        </p>
                        <p className="mt-1.5 text-xs text-brand-midgray">
                          This is a standard industry practice (e.g. Mozilla Firefox, WordPress) to prevent confusion about which products are official and which are modified third-party forks.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          1. Brand Assets that are fully protected
                        </h4>
                        <p>The following assets are fully protected and cannot be used without prior written consent from Loragica:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-darkgray font-sans">
                          <li>The name <strong className="text-brand-accent font-bold">&quot;Loragica&quot;</strong> and any variant thereof.</li>
                          <li>The asymmetrical 2×2 grid logomark and its layouts.</li>
                          <li>The Loragica wordmark in any given font.</li>
                          <li>
                            Official brand color values:
                            <ul className="list-none pl-6 mt-1 space-y-1 font-mono text-xs">
                              <li className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 inline-block border border-brand-border bg-[#185FA5]"></span>
                                Logos Blue (#185FA5)
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 inline-block border border-brand-border bg-[#1D9E75]"></span>
                                Horasis Teal (#1D9E75)
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 inline-block border border-brand-border bg-[#534AB7]"></span>
                                Agora Purple (#534AB7)
                              </li>
                            </ul>
                          </li>
                          <li>The tagline <strong className="text-brand-accent font-bold">&quot;Learn · See · Connect&quot;</strong>.</li>
                          <li>The three-pillar philosophy <strong className="text-brand-accent">Logos (λόγος) · Horasis (ὅρασις) · Agora (ἀγορά)</strong> visual framework.</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide text-red-700">
                          2. Actions that are STRICTLY prohibited
                        </h4>
                        <p>Without explicit written consent, you are strictly prohibited from:</p>
                        <ul className="list-decimal pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Using the name &quot;Loragica&quot; for any fork or modified project.</li>
                          <li>Publishing modified projects using a visual design, color palette, or pillar combination that mimics Loragica&apos;s official branding.</li>
                          <li>Implying any commercial affiliation, official endorsement, or sponsorship.</li>
                        </ul>
                        <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-900 font-mono">
                          💡 <strong>Fork Guide:</strong> If you fork this repository to build a similar educational platform, you must replace the name, logo and visual branding elements with your own independent visual identity.
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm sm:text-base text-brand-accent uppercase tracking-wide">
                          3. Permitted Actions
                        </h4>
                        <p>You may use our brand assets freely to:</p>
                        <ul className="list-disc pl-5 space-y-1.5 list-inside text-brand-midgray">
                          <li>Mention &quot;Loragica&quot; in factual contexts (such as news reports, articles, reviews, or academic papers).</li>
                          <li>Link directly to the official Loragica website.</li>
                          <li>Explain that your project is &quot;inspired by&quot; or &quot;is a fork of Loragica&quot; while using your own unique brand name.</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer Control Area */}
            <div className="p-4 sm:p-6 bg-brand-card border-t-2 border-brand-accent flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 text-center sm:text-left">
              <span className="font-mono text-[9px] md:text-[10px] text-brand-lightgray uppercase">
                {lang === 'id' ? 'Loragica Indonesia • Platform Edukasi STEM Terbuka' : 'Loragica Indonesia • Open STEM Education Platform'}
              </span>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 border border-brand-accent bg-brand-accent text-brand-offwhite hover:bg-neutral-900 transition-colors cursor-pointer text-xs font-mono font-bold uppercase tracking-widest"
              >
                {lang === 'id' ? 'Tutup Dokumen' : 'Close Document'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
