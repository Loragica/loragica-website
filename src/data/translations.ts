/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationSet {
  // Navigation
  nav_mission: string;
  nav_playground: string;
  nav_cognitive: string;
  nav_curriculum: string;
  nav_movement: string;
  nav_support: string;
  nav_join: string;

  // Hero Section
  hero_static: string;
  hero_dynamic: string[];
  hero_desc: string;
  hero_btn_join: string;
  hero_btn_try: string;
  hero_stats_interactive: string;
  hero_stats_retention: string;
  hero_stats_modules: string;

  // Showcase Sisi Kanan/Specs
  showcase_vision: string;
  showcase_learn: string;
  showcase_learn_formula: string;
  showcase_learn_desc: string;
  showcase_see: string;
  showcase_see_desc: string;
  showcase_discuss: string;
  showcase_discuss_title: string;
  showcase_discuss_members: string;
  showcase_discuss_desc: string;

  // Pillars Section
  pillars_badge: string;
  pillars_title_prev: string;
  pillars_title_italic: string;
  pillars_title_post: string;
  pillars_desc: string;

  pillars_cause_label: string;
  pillars_cause_title: string;
  pillars_cause_subtitle: string;
  pillars_cause_desc: string;

  pillars_sol_label: string;
  pillars_sol_title: string;
  pillars_sol_subtitle: string;
  pillars_sol_desc: string;

  pillars_benefit_label: string;
  pillars_benefit_title: string;
  pillars_benefit_subtitle: string;
  pillars_benefit_desc: string;

  // Wave Playground Section
  wave_badge: string;
  wave_title: string;
  wave_desc: string;
  wave_label_type: string;
  wave_type_sine: string;
  wave_type_fourier: string;
  wave_type_chaos: string;
  wave_slider_freq: string;
  wave_slider_amp: string;
  wave_btn_reset: string;
  wave_monitor_title: string;
  wave_formula_sine: string;
  wave_formula_fourier: string;
  wave_formula_chaos: string;
  wave_label_sampling: string;
  wave_label_distortion: string;
  wave_label_status: string;
  wave_status_val: string;

  // Cognitive Section
  cog_badge: string;
  cog_title: string;
  cog_desc_1: string;
  cog_desc_2: string;
  cog_traditional_label: string;
  cog_traditional_title: string;
  cog_traditional_desc: string;
  cog_loragica_label: string;
  cog_loragica_title: string;
  cog_loragica_desc: string;
  cog_map_card_title: string;
  cog_map_card_subtitle: string;
  cog_map_diag_mode: string;
  cog_map_diag_status: string;
  cog_map_integrate_label: string;
  cog_btn_discuss_discord: string;

  // Cognitive Nodes
  node_calc_label: string;
  node_calc_info: string;
  node_wave_label: string;
  node_wave_info: string;
  node_quant_label: string;
  node_quant_info: string;
  node_alg_label: string;
  node_alg_info: string;
  node_comp_label: string;
  node_comp_info: string;

  // Curriculum section
  curr_badge: string;
  curr_title: string;
  curr_desc: string;
  curr_chan: string;
  curr_join_chan: string;
  curr_math_title: string;
  curr_math_desc: string;
  curr_physics_title: string;
  curr_physics_desc: string;
  curr_compsci_title: string;
  curr_compsci_desc: string;
  curr_chemistry_title: string;
  curr_chemistry_desc: string;
  curr_directory_badge: string;
  curr_directory_title: string;
  curr_directory_desc: string;
  curr_directory_btn: string;

  // Open Science Movement section
  move_badge: string;
  move_typewriter_static: string;
  move_typewriter_words: string[];
  move_desc: string;
  move_student_badge: string;
  move_student_title: string;
  move_student_desc: string;
  move_student_btn: string;
  move_teacher_badge: string;
  move_teacher_title: string;
  move_teacher_desc: string;
  move_teacher_btn: string;

  // Sandbox section
  sand_btn_explode: string;
  sand_btn_gravity_on: string;
  sand_btn_gravity_off: string;
  sand_btn_reassemble: string;
  sand_label_grav_earth: string;
  sand_label_grav_zero: string;
  sand_label_energy: string;
  sand_label_state_balanced: string;
  sand_label_state_unstable: string;

  // Support / Donation Overlay
  don_badge: string;
  don_free_label: string;
  don_italic_label: string;
  don_desc_1: string;
  don_desc_2: string;
  don_desc_3: string;
  don_saweria_title: string;
  don_saweria_desc: string;
  don_trakteer_title: string;
  don_trakteer_desc: string;
  don_btn_text: string;
  don_title_close: string;

  // Footer section
  footer_desc: string;
  footer_col_play: string;
  footer_wave_sine: string;
  footer_wave_fourier: string;
  footer_wave_chaos: string;
  footer_wave_sandbox: string;
  footer_col_philosophy: string;
  footer_phi_about: string;
  footer_phi_aim: string;
  footer_phi_contrib: string;
  footer_phi_support: string;
  footer_col_join: string;
  footer_newsletter_desc: string;
  footer_newsletter_placeholder: string;
  footer_newsletter_btn: string;
  footer_privacy: string;
  footer_terms: string;
  footer_all_rights: string;
}

export const translations: Record<'id' | 'en', TranslationSet> = {
  id: {
    nav_mission: 'TUJUAN KAMI',
    nav_playground: 'PLAYGROUND',
    nav_cognitive: 'KORELASI KOGNITIF',
    nav_curriculum: 'KURIKULUM',
    nav_movement: 'THE MOVEMENT',
    nav_support: '💎 SUPPORT',
    nav_join: 'JOIN THE MOVEMENT',

    hero_static: 'Sains & Matematika',
    hero_dynamic: ['100% Gratis.', 'Menjadi Nyata.', 'Lebih Presisi.', 'Sangat Intuitif.', 'Bisa Disentuh.'],
    hero_desc: 'Kami merombak cara belajar. Kalkulus, mekanika kuantum, dan logika bukan lagi sekadar deretan rumus abstrak—karena di Loragica, semuanya terlihat nyata.',
    hero_btn_join: 'BERGABUNG DENGAN KOMUNITAS',
    hero_btn_try: 'COBA PLAYGROUND',
    hero_stats_interactive: 'Visualisasi Interaktif',
    hero_stats_retention: 'Retensi Konsep Kognitif',
    hero_stats_modules: 'Modul Lab Interaktif',

    showcase_vision: 'VISI LORAGICA',
    showcase_learn: 'pelajari',
    showcase_learn_formula: 'f(x) = A sin(ωt + φ)',
    showcase_learn_desc: 'Berhenti menghafal rumus. Kami membedah logika di baliknya agar kamu bisa melihat keindahan matematika sebagaimana mestinya.',
    showcase_see: 'lihat',
    showcase_see_desc: 'Saksikan bagaimana angka bertransformasi menjadi visual yang presisi. Lihat pola, pahami struktur, dan temukan makna di baliknya.',
    showcase_discuss: 'hubungkan',
    showcase_discuss_title: 'Siswa & Pengajar',
    showcase_discuss_members: '8.412 ANGGOTA',
    showcase_discuss_desc: 'Temukan teman seperjuangan, pelajari berbagai sudut pandang, dan bertumbuh bersama komunitas pemikir kreatif.',

    pillars_badge: 'TUJUAN UTAMA LORAGICA',
    pillars_title_prev: 'Melihat ',
    pillars_title_italic: 'Pola Sains',
    pillars_title_post: ' yang Utuh',
    pillars_desc: 'Sekolah mengajarkan fisika secara terpisah dari kalkulus matematika, seolah-olah keduanya tidak berhubungan. Di Loragica, kami meruntuhkan dinding pembatas tersebut untuk menyatukan kembali bahasa sains alam yang utuh.',
    pillars_cause_label: '[ SEBAB ]',
    pillars_cause_title: 'Abstraksi Membingungkan',
    pillars_cause_subtitle: 'Masalah Pembelajaran Tradisional',
    pillars_cause_desc: 'Pelajar dipaksa menghafal rumus pasif tanpa pemahaman spasial murni terhadap bentuk geometri atau dinamika fisik yang mereka kalkulasikan.',
    pillars_sol_label: '[ SOLUSI LORAGICA ]',
    pillars_sol_title: 'Eksplorasi Tak Terbatas',
    pillars_sol_subtitle: 'Metodologi Bermakna',
    pillars_sol_desc: 'Kami mengubah angka menjadi gerak gelombang, matriks menjadi transformasi grafis, dan dinamika molekul menjadi kepingan yang dapat dimanipulasi secara interaktif.',
    pillars_benefit_label: '[ HASIL ]',
    pillars_benefit_title: 'Kognisi Terhubung',
    pillars_benefit_subtitle: 'Pemahaman Komparatif',
    pillars_benefit_desc: 'Apabila materi sains saling terhubung, pelajar mampu melakukan penalaran spasial tingkat tinggi, menebak hasil estimasi, dan membina pondasi STEM yang kokoh.',

    wave_badge: 'LORAGICA PLAYGROUND',
    wave_title: 'Eksplorasi Gelombang Harmonik',
    wave_desc: 'Eksperimen bagaimana parameter matematis murni seperti frekuensi, amplitudo, dan pergeseran fase memengaruhi bentuk dan ritme visual gelombang harmonis secara real-time.',
    wave_label_type: 'Tipe Gelombang',
    wave_type_sine: 'SINUS',
    wave_type_fourier: 'FOURIER',
    wave_type_chaos: 'CHAOS',
    wave_slider_freq: 'FREKUENSI (ω):',
    wave_slider_amp: 'AMPLITUDO (A):',
    wave_btn_reset: 'RESET KE DEFAULT',
    wave_monitor_title: 'Output Visualisasi Gelombang',
    wave_formula_sine: 'f(x) = A sin(ωt)',
    wave_formula_fourier: 'f(x) = Σ(4/πn)sin(nωt)',
    wave_formula_chaos: 'Aproksimasi Harmonik Kompleks',
    wave_label_sampling: 'FREKUENSI SAMPLING',
    wave_label_distortion: 'DISTORSI HARMONIS',
    wave_label_status: 'STATUS KOMPUTASI',
    wave_status_val: 'Lancar & Presisi (60 FPS)',

    cog_badge: 'KORELASI KOGNITIF',
    cog_title: 'Sekolah tidak mengajarkan hubungannya.',
    cog_desc_1: 'Di sekolah konvensional, kita diajarkan rumus Kalkulus di jam pertama, lalu Mekanika Gelombang di jam berikutnya sebagai subjek terpisah yang tidak terhubung. Kita dipaksa menghafal persamaan mati untuk sekadar lulus ujian.',
    cog_desc_2: 'Di Loragica, semua materi dirangkai ke dalam satu ekosistem interaktif yang utuh. Konsep matematika yang Anda ubah akan langsung memicu dan menjelaskan fenomena fisik pada konsep lainnya secara seketika.',
    cog_traditional_label: '[ SEKOLAH KONVENSIONAL ]',
    cog_traditional_title: 'Terisolasi & Pasif',
    cog_traditional_desc: 'Materi dipelajari sebagai bab-bab terpisah. Menghafal rumus mati tanpa pemahaman spasial.',
    cog_loragica_label: '[ LORAGICA PLAYGROUND ]',
    cog_loragica_title: 'Terhubung Aktif',
    cog_loragica_desc: 'Satu perubahan variabel membuka jalan pemahaman konsep lain. Membangun intuisi kognitif dan estimasi logis yang tajam.',
    cog_map_card_title: 'Alur Belajar Loragica',
    cog_map_card_subtitle: 'PETA HUBUNGAN ANTAR MATERI ILMIAH',
    cog_map_diag_mode: 'MODE DIAGNOSTIK',
    cog_map_diag_status: 'KORELASI: 100% DINAMIS',
    cog_map_integrate_label: 'MATERI YANG TERINTEGRASI:',
    cog_btn_discuss_discord: 'Diskusikan di Discord',

    node_calc_label: 'Kalkulus',
    node_calc_info: 'Bagaimana laju perubahan matematika terhubung langsung ke kecepatan gerak fisika.',
    node_wave_label: 'Mekanika Gelombang',
    node_wave_info: 'Persamaan diferensial kalkulus yang melahirkan pemodelan getaran harmonis murni.',
    node_quant_label: 'Fisika Kuantum',
    node_quant_info: 'Probabilitas kuantum dan pemetaan matriks aljabar linier dalam struktur atom.',
    node_alg_label: 'Aljabar Linier',
    node_alg_info: 'Transformasi matriks ruang yang mengendalikan rotasi grafis pemrograman visual.',
    node_comp_label: 'Sains Komputasi',
    node_comp_info: 'Bagaimana kode komputasi menerjemahkan model termodinamika menjadi grafik interaktif.',

    curr_badge: 'KURIKULUM VISUAL LORAGICA',
    curr_title: 'Eksplorasi Bersama di Discord',
    curr_desc: 'Setiap mata pelajaran ditukar daripada rumus pasif kepada simulasi visual interaktif yang dibincangkan langsung di dalam Komunitas Discord secara sukarela.',
    curr_chan: 'LAB',
    curr_join_chan: 'DISKUSI KOMUNITAS',
    curr_math_title: 'Kalkulus Visual',
    curr_math_desc: 'Siswa berdiskusi memvisualisasikan limit, integral, dan geometri tak hingga bersama komunitas secara sukarela.',
    curr_physics_title: 'Kuantum & Orbit',
    curr_physics_desc: 'Bedah teori mekanika, orbit gravitasi, dan dinamika kuantum secara interaktif bersama komunitas.',
    curr_compsci_title: 'Struktur Data & Graf',
    curr_compsci_desc: 'Pemodelan grafis, visualisasi bayangan pohon biner, dan jalur terpendek secara visual bersama komunitas.',
    curr_chemistry_title: 'Sintesis Molekul',
    curr_chemistry_desc: 'Pemetaan interaktif ikatan kovalen, struktur polimer, dan DNA bersama komunitas.',
    curr_directory_badge: 'LORAGICA DIRECTORY',
    curr_directory_title: 'Eksplorasi Berbagai Subjek Lainnya di Discord',
    curr_directory_desc: 'Ada berbagai sub-disiplin sains yang dieksplorasi secara terbuka oleh komunitas. Cari dan diskusikan topik interaktif seperti Astrodinamika & Orbit (Astronomi), Automata Seluler (Biologi), Geometri Dimensi Tinggi (Topologi), serta Matematika Sandi & Informasi (Kriptografi).',
    curr_directory_btn: 'Eksplorasi Semua Diskusi di Discord',

    move_badge: 'LORAGICA MOVEMENT',
    move_typewriter_static: 'Sains Terbuka untuk',
    move_typewriter_words: ['Masa Depan.', 'Generasi Baru.', 'Sains Indonesia.'],
    move_desc: 'Kami percaya setiap siswa berhak melihat keindahan ilmu pengetahuan. Mulai eksplorasi visual secara gratis, kapan saja, di mana saja.',
    move_student_badge: '[ UNTUK PELAJAR ]',
    move_student_title: 'Siswa & Mahasiswa',
    move_student_desc: 'Akses gratis seluruh visualisasi sains interaktif, berdiskusi pekerjaan rumah, berkolaborasi dalam proyek matematika visual, and belajar langsung bersama ribuan siswa Indonesia lainnya.',
    move_student_btn: 'GABUNG KOMUNITAS DISCORD',
    move_teacher_badge: '[ UNTUK PENDIDIK ]',
    move_teacher_title: 'Pendidik & Kontributor',
    move_teacher_desc: 'Bantu kami melahirkan kurikulum sains visual terbaik secara sukarela. Berbagilah simulasi buatanmu sendiri, beri bimbingan akademis, dan ikut mengawal kemajuan literasi spasial nasional.',
    move_teacher_btn: 'DAFTAR JADI KONTRIBUTOR',

    sand_btn_explode: '✦ Meledak',
    sand_btn_gravity_on: 'Gravitasi Bumi',
    sand_btn_gravity_off: 'Tanpa Gravitasi',
    sand_btn_reassemble: 'Susun Kembali 🔒',
    sand_label_grav_earth: 'Gravitasi: Bumi (9.8m/s²)',
    sand_label_grav_zero: 'Gravitasi: Hampa Udara (0.0m/s²)',
    sand_label_energy: 'Energi Kinetik',
    sand_label_state_balanced: 'SEIMBANG',
    sand_label_state_unstable: 'UNSTABLE',

    don_badge: '[ GABUNG GERAKAN MANDIRI ]',
    don_free_label: 'Free to use, ',
    don_italic_label: 'not free to make.',
    don_desc_1: 'Loragica dibangun dengan semangat sains terbuka—100% bebas biaya dan bebas iklan selamanya untuk seluruh siswa di Indonesia.',
    don_desc_2: 'Namun, memelihara server, merancang kalkulus visual yang presisi, serta mempertahankan kemandirian sistem membutuhkan energi dan investasi nyata.',
    don_desc_3: 'Jika visualisasi kami berhasil membantumu menangkap intuisi logis yang selama ini tersembunyi, mari ikut mengawal gerakan ini agar tetap menyala.',
    don_saweria_title: 'Dukung via Saweria',
    don_saweria_desc: 'Donasi instan via e-wallet (GoPay, OVO, Dana, LinkAja, QRIS).',
    don_trakteer_title: 'Dukung via Trakteer',
    don_trakteer_desc: 'Dukungan instan terintegrasi dengan berbagai pilihan pembayaran lokal.',
    don_btn_text: 'SALURKAN DUKUNGAN →',
    don_title_close: 'Tutup',

    footer_desc: 'Menghubungkan pola sains lewat visualisasi harmonis yang interaktif untuk membangun intuisi kognitif siswa Indonesia.',
    footer_col_play: '[ PLAYGROUND ]',
    footer_wave_sine: 'Gelombang Sinus',
    footer_wave_fourier: 'Aproksimasi Fourier',
    footer_wave_chaos: 'Modulator Chaos',
    footer_wave_sandbox: 'Sandbox Geometri Kinetik',
    footer_col_philosophy: '[ FILOSOFI ]',
    footer_phi_about: 'Tentang Kami',
    footer_phi_aim: 'Tujuan Gerakan',
    footer_phi_contrib: 'Kontributor Sukarela',
    footer_phi_support: 'Dukung Kami (Donasi) 💎',
    footer_col_join: '[ GABUNG GERAKAN ]',
    footer_newsletter_desc: 'Berlangganan untuk mendapatkan info terbaru dan update langsung dari Loragica.',
    footer_newsletter_placeholder: 'Email Anda',
    footer_newsletter_btn: 'OK',
    footer_privacy: 'KEBIJAKAN PRIVASI',
    footer_terms: 'SYARAT & KETENTUAN',
    footer_all_rights: '© 2026 LORAGICA INDONESIA. ALL RIGHTS RESERVED.'
  },
  en: {
    nav_mission: 'OUR MISSION',
    nav_playground: 'PLAYGROUND',
    nav_cognitive: 'COGNITIVE CORRELATION',
    nav_curriculum: 'CURRICULUM',
    nav_movement: 'THE MOVEMENT',
    nav_support: '💎 SUPPORT',
    nav_join: 'JOIN THE MOVEMENT',

    hero_static: 'Science & Math',
    hero_dynamic: ['100% Free.', 'Made Real.', 'More Precise.', 'Highly Intuitive.', 'Tangible.'],
    hero_desc: 'We are transforming learning. Calculus, quantum mechanics, and logic are no longer just strings of abstract formulas—because at Loragica, everything comes to life.',
    hero_btn_join: 'JOIN THE COMMUNITY',
    hero_btn_try: 'TRY PLAYGROUND',
    hero_stats_interactive: 'Interactive Visualizations',
    hero_stats_retention: 'Cognitive Concept Retention',
    hero_stats_modules: 'Interactive Lab Modules',

    showcase_vision: 'LORAGICA VISION',
    showcase_learn: 'learn',
    showcase_learn_formula: 'f(x) = A sin(ωt + φ)',
    showcase_learn_desc: 'Stop memorizing formulas. We deconstruct the logic behind them so you can see the beauty of mathematics as it should be seen.',
    showcase_see: 'see',
    showcase_see_desc: 'Watch as digits transform into precise visuals. See the patterns, grasp the structure, and uncover the meaning within.',
    showcase_discuss: 'connect',
    showcase_discuss_title: 'Students & Teachers',
    showcase_discuss_members: '8,412 MEMBERS',
    showcase_discuss_desc: 'Find fellow learners, explore different perspectives, and grow together within a community of creative minds.',

    pillars_badge: "LORAGICA'S ULTIMATE GOAL",
    pillars_title_prev: 'Seeing ',
    pillars_title_italic: 'Science Patterns',
    pillars_title_post: ' as a Whole',
    pillars_desc: 'Schools teach physics separately from mathematical calculus, as if they are unrelated. At Loragica, we break down those barriers to reunite the complete language of natural science.',
    pillars_cause_label: '[ THE CAUSE ]',
    pillars_cause_title: 'Confusing Abstractions',
    pillars_cause_subtitle: 'Traditional Learning Problems',
    pillars_cause_desc: 'Students are forced to memorize passive formulas without pure spatial understanding of the geometric shapes or physical dynamics they calculate.',
    pillars_sol_label: "[ LORAGICA'S SOLUTION ]",
    pillars_sol_title: 'Infinite Exploration',
    pillars_sol_subtitle: 'Meaningful Methodology',
    pillars_sol_desc: 'We transform numbers into wave motions, matrices into graphic transformations, and molecular dynamics into pieces you can manipulate interactively.',
    pillars_benefit_label: '[ THE RESULT ]',
    pillars_benefit_title: 'Connected Cognition',
    pillars_benefit_subtitle: 'Comparative Understanding',
    pillars_benefit_desc: 'When science concepts are interconnected, students can perform high-level spatial reasoning, formulate logical estimates, and build a sturdy STEM foundation.',

    wave_badge: 'LORAGICA PLAYGROUND',
    wave_title: 'Harmonic Wave Exploration',
    wave_desc: 'Experiment with how pure mathematical parameters like frequency, amplitude, and phase shift affect the shape and visual rhythm of harmonic waves in real-time.',
    wave_label_type: 'Wave Type',
    wave_type_sine: 'SINE',
    wave_type_fourier: 'FOURIER',
    wave_type_chaos: 'CHAOS',
    wave_slider_freq: 'FREQUENCY (ω):',
    wave_slider_amp: 'AMPLITUDE (A):',
    wave_btn_reset: 'RESET TO DEFAULT',
    wave_monitor_title: 'Wave Visualization Output',
    wave_formula_sine: 'f(x) = A sin(ωt)',
    wave_formula_fourier: 'f(x) = Σ(4/πn)sin(nωt)',
    wave_formula_chaos: 'Complex Harmonic Approximation',
    wave_label_sampling: 'SAMPLING FREQUENCY',
    wave_label_distortion: 'HARMONIC DISTORTION',
    wave_label_status: 'COMPUTATIONAL STATUS',
    wave_status_val: 'Smooth & Precise (60 FPS)',

    cog_badge: 'COGNITIVE CORRELATION',
    cog_title: "Schools don't teach the connection.",
    cog_desc_1: 'In conventional schools, we are taught Calculus formulas in the first hour, and then Wave Mechanics as an unrelated separate subject in the next. We are forced to memorize dead equations just to pass exams.',
    cog_desc_2: 'At Loragica, all content is woven into a single, complete interactive ecosystem. Modifying a mathematical variable instantly triggers and explains the physical phenomena in other concepts.',
    cog_traditional_label: '[ CONVENTIONAL SCHOOLS ]',
    cog_traditional_title: 'Isolated & Passive',
    cog_traditional_desc: 'Content is studied as separate chapters. Memorizing dead formulas without spatial understanding.',
    cog_loragica_label: '[ LORAGICA PLAYGROUND ]',
    cog_loragica_title: 'Actively Interconnected',
    cog_loragica_desc: 'A single variable change opens paths to understanding other concepts. Builds cognitive intuition and sharp logical estimation.',
    cog_map_card_title: 'Loragica Learning Pathway',
    cog_map_card_subtitle: 'RELATIONAL SCIENTIFIC PATHWAYS MAP',
    cog_map_diag_mode: 'DIAGNOSTIC MODE',
    cog_map_diag_status: 'CORRELATION: 100% DYNAMIC',
    cog_map_integrate_label: 'INTEGRATED SYLLABUS:',
    cog_btn_discuss_discord: 'Discuss on Discord',

    node_calc_label: 'Calculus',
    node_calc_info: 'How mathematical rates of change directly translate to physical velocities.',
    node_wave_label: 'Wave Mechanics',
    node_wave_info: 'Calculus differential equations which form the model for pure harmonic vibrations.',
    node_quant_label: 'Quantum Physics',
    node_quant_info: 'Quantum probabilities and linear algebra matrix mapping within atomic structures.',
    node_alg_label: 'Linear Algebra',
    node_alg_info: 'Spatial matrix transformations that control graphics rotation in visual programming.',
    node_comp_label: 'Computational Science',
    node_comp_info: 'How computing code translates thermodynamic models into interactive graphics.',

    curr_badge: 'LORAGICA VISUAL CURRICULUM',
    curr_title: 'Joint Exploration on Discord',
    curr_desc: 'Every subject is exchanged from passive formulas to interactive visual simulations discussed directly within the voluntary Discord Community.',
    curr_chan: 'LAB',
    curr_join_chan: 'COMMUNITY DISCUSSION',
    curr_math_title: 'Visual Calculus',
    curr_math_desc: 'Students voluntarily gather to discuss and visualize limits, integrals, and infinite geometry together.',
    curr_physics_title: 'Quantum & Orbits',
    curr_physics_desc: 'Deconstruct mechanics, gravitational orbits, and quantum dynamics interactively with the community.',
    curr_compsci_title: 'Data Structures & Graphs',
    curr_compsci_desc: 'Graphical modeling, binary tree search visualizations, and shortest path solvers with the community.',
    curr_chemistry_title: 'Molecular Synthesis',
    curr_chemistry_desc: 'Interactive mapping of covalent bonds, polymer structures, and DNA with the community.',
    curr_directory_badge: 'LORAGICA DIRECTORY',
    curr_directory_title: 'Explore Various Other Subjects on Discord',
    curr_directory_desc: 'Various scientific fields of study are openly explored by the community. Find and discuss interactive topics like Astrodynamics & Orbits (Astronomy), Cellular Automata (Biology), High-Dimensional Geometry (Topology), and Cryptography & Information.',
    curr_directory_btn: 'Explore All Discussions on Discord',

    move_badge: 'LORAGICA MOVEMENT',
    move_typewriter_static: 'Open Science for',
    move_typewriter_words: ['The Future.', 'The New Gen.', 'Sains Indonesia.'],
    move_desc: 'We believe every student deserves to see the beauty of science. Start visual exploration for free, anytime, anywhere.',
    move_student_badge: '[ FOR STUDENTS ]',
    move_student_title: 'Students & Undergraduates',
    move_student_desc: 'Get free access to all interactive simulations, discuss homework, collaborate on visual math projects, and learn side-by-side with thousands of other Indonesian students.',
    move_student_btn: 'JOIN THE DISCORD COMMUNITY',
    move_teacher_badge: '[ FOR EDUCATORS ]',
    move_teacher_title: 'Educators & Contributors',
    move_teacher_desc: 'Voluntarily help us build the world-class visual science curriculum. Share your custom simulations, provide academic tutoring, and participate in elevating national spatial literacy.',
    move_teacher_btn: 'REGISTER AS CONTRIBUTOR',

    sand_btn_explode: '✦ Explode',
    sand_btn_gravity_on: 'Earth Gravity',
    sand_btn_gravity_off: 'Zero Gravity',
    sand_btn_reassemble: 'Reassemble 🔒',
    sand_label_grav_earth: 'Gravity: Earth (9.8m/s²)',
    sand_label_grav_zero: 'Gravity: Vacuum (0.0m/s²)',
    sand_label_energy: 'Kinetic Energy',
    sand_label_state_balanced: 'BALANCED',
    sand_label_state_unstable: 'UNSTABLE',

    don_badge: '[ JOIN THE CIVIL MOVEMENT ]',
    don_free_label: 'Free to use, ',
    don_italic_label: 'not free to make.',
    don_desc_1: 'Loragica is built with the spirit of open science—100% free of charge and ad-free forever for all students in Indonesia.',
    don_desc_2: 'However, maintaining servers, building mathematically precise calculus tools, and keeping our platform self-governed takes energy and real investment.',
    don_desc_3: 'If our visualizations have helped you capture the logical intuition behind complex topics, join us in keeping this torch burning.',
    don_saweria_title: 'Support via Saweria',
    don_saweria_desc: 'Instant donations via Indonesian e-wallets (GoPay, OVO, Dana, LinkAja, QRIS).',
    don_trakteer_title: 'Support via Trakteer',
    don_trakteer_desc: 'One-time support integrated with local payment options.',
    don_btn_text: 'PROCEED TO SUPPORT →',
    don_title_close: 'Close',

    footer_desc: 'Connecting scientific patterns through harmonious interactive visualizations to foster cognitive intuition in Indonesian students.',
    footer_col_play: '[ PLAYGROUND ]',
    footer_wave_sine: 'Sine Wave',
    footer_wave_fourier: 'Fourier Approximation',
    footer_wave_chaos: 'Chaos Modulator',
    footer_wave_sandbox: 'Kinetic Geometric Sandbox',
    footer_col_philosophy: '[ PHILOSOPHY ]',
    footer_phi_about: 'About Us',
    footer_phi_aim: 'Our Mission',
    footer_phi_contrib: 'Voluntary Contributors',
    footer_phi_support: 'Support Our Mission (Donate) 💎',
    footer_col_join: '[ THE MOVEMENT ]',
    footer_newsletter_desc: 'Subscribe to get the latest updates and direct news from Loragica.',
    footer_newsletter_placeholder: 'Your Email',
    footer_newsletter_btn: 'OK',
    footer_privacy: 'PRIVACY POLICY',
    footer_terms: 'TERMS & CONDITIONS',
    footer_all_rights: '© 2026 LORAGICA INDONESIA. ALL RIGHTS RESERVED.'
  }
};
