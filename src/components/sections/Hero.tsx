"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Users, ShieldCheck, ArrowDown } from "lucide-react";
import { Locale } from "../shared/Navbar";

const translations = {
  tr: {
    badge: "Karadeniz Teknik Üniversitesi - Farabi Hastanesi",
    titlePrimary: "Akademik Güvence,",
    titleSecondary: "Küresel Sağlık Vizyonu",
    description:
      "Farabi Hastanesi, 119 seçkin profesör ve 43 anabilim dalıyla uluslararası standartlarda tanı ve şifa hizmetleri sunan öncü bir üniversite hastanesidir.",
    ctaOverview: "Klinikleri İncele",
    ctaAbout: "Hastanemiz Hakkında",
    statDoctors: "Doktor & Akademik Kadro",
    statSpecialties: "Anabilim Dalı",
    academicStaffBreakdown: "Akademik Kadro Dağılımı",
    professors: "Profesör",
    associateProfs: "Doçent",
    assistantProfs: "Dr. Öğretim Üyesi",
    researchAssistants: "Araştırma Görevlisi",
  },
  en: {
    badge: "Karadeniz Technical University - Farabi Hospital",
    titlePrimary: "Academic Authority,",
    titleSecondary: "Global Healthcare Excellence",
    description:
      "KTÜ Farabi Hospital is a leading university medical center offering global diagnostics, clinical research, and advanced treatments across 43 academic departments with 119+ professors.",
    ctaOverview: "Explore Clinics",
    ctaAbout: "About Our Institution",
    statDoctors: "Doctors & Academic Staff",
    statSpecialties: "Academic Departments",
    academicStaffBreakdown: "Academic Staff Breakdown",
    professors: "Professor",
    associateProfs: "Associate Professor",
    assistantProfs: "Assistant Professor",
    researchAssistants: "Research Assistant",
  },
  ar: {
    badge: "جامعة كارادينيز التقنية - مستشفى فارابي",
    titlePrimary: "الريادة الأكاديمية،",
    titleSecondary: "والتميز في الرعاية الصحية العالمية",
    description:
      "مستشفى فارابي هو مركز طبي جامع رائد يقدم خدمات تشخيصية وعلاجية متقدمة في ٤٣ قسماً أكاديمياً تحت إشراف نخبة من الأطباء تضم أكثر من ١١٩ بروفيسوراً.",
    ctaOverview: "استكشف العيادات",
    ctaAbout: "حول مؤسستنا",
    statDoctors: "الأطباء والأكاديميون",
    statSpecialties: "أقسام أكاديمية",
    academicStaffBreakdown: "تفاصيل الهيئة الأكاديمية",
    professors: "بروفيسور",
    associateProfs: "أستاذ مشارك (Doçent)",
    assistantProfs: "أستاذ مساعد (Dr. Öğretim Üyesi)",
    researchAssistants: "معيد / مساعد باحث",
  },
  ru: {
    badge: "Черноморский технический университет - Больница Фараби",
    titlePrimary: "Академическая гарантия,",
    titleSecondary: "Глобальное видение здравоохранения",
    description:
      "Больница Фараби — ведущая университетская клиника, предлагающая диагностику и передовые методы лечения на международном уровне под руководством 119+ выдающихся профессоров на 43 кафедрах.",
    ctaOverview: "Обзор клиник",
    ctaAbout: "О нашей больнице",
    statDoctors: "Врачи и академический состав",
    statSpecialties: "Академические кафедры",
    academicStaffBreakdown: "Состав академических кадров",
    professors: "Профессор",
    associateProfs: "Доцент",
    assistantProfs: "Старший преподаватель (Dr. Öğr. Üyesi)",
    researchAssistants: "Ассистент-исследователь",
  },
  ka: {
    badge: "კარადენისის ტექნიკური უნივერსიტეტი - ფარაბის კლინიკა",
    titlePrimary: "აკადემიური გარანტია,",
    titleSecondary: "ჯანდაცვის გლობალური ხედვა",
    description:
      "ფარაბის ჰოსპიტალი არის წამყვანი საუნივერსიტეტო კლინიკა, რომელიც სთავაზობს პაციენტებს საერთაშორისო დონის დიაგნოსტიკასა და მკურნალობას 43 აკადემიურ დეპარტამენტში 119+ პროფესორის ხელმძღვანელობით.",
    ctaOverview: "კლინიკების დათვალიერება",
    ctaAbout: "კლინიკის შესახებ",
    statDoctors: "ექიმები და აკადემიური პერსონალი",
    statSpecialties: "აკადემიური დეპარტამენტი",
    academicStaffBreakdown: "აკადემიური პერსონალის დეტალები",
    professors: "პროფესორი",
    associateProfs: "ასოცირებული პროფესორი",
    assistantProfs: "ასისტენტ-პროფესორი (Dr. Öğr. Üyesi)",
    researchAssistants: "ასისტენტ-მკვლევარი",
  }
};

interface HeroProps {
  currentLocale: Locale;
}

export default function Hero({ currentLocale }: HeroProps) {
  const t = translations[currentLocale];
  const isAr = currentLocale === "ar";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-16 flex items-center justify-center overflow-hidden bg-background w-full"
    >
      {/* Subtle Blueish Brand Background Gradient */}
      <div className="absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        
        {/* Left Side: High Fidelity Content Column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left"
          style={{ direction: isAr ? "rtl" : "ltr" }}
        >
          {/* Institution Badge & Health Türkiye Logo */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
          >
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/5 text-primary border border-secondary/40">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              <span className="text-[10px] font-bold tracking-wider uppercase">{t.badge}</span>
            </div>
            <div className="flex items-center px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs h-8 shrink-0">
              <img
                src="/assets/healthturkiye.png"
                alt="Health Türkiye"
                className="h-5 w-auto object-contain"
              />
            </div>
          </motion.div>

          {/* Bold Header utilizing KTÜ Navy as main color */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-primary"
          >
            {t.titlePrimary}{" "}
            <span className="bg-gradient-to-r from-primary via-neutral-700 to-secondary bg-clip-text text-transparent block mt-1">
              {t.titleSecondary}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-neutral-500 leading-relaxed font-semibold max-w-xl mx-auto lg:mx-0"
          >
            {t.description}
          </motion.p>

          {/* Action Row with Corporate styling */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <a
              href="#specialties"
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-7 py-3.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary/90 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <span>{t.ctaOverview}</span>
              <ArrowDown className="h-4 w-4 animate-bounce text-secondary" />
            </a>
            <a
              href="#about"
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-7 py-3.5 bg-neutral-100 text-primary hover:bg-neutral-200 rounded-full text-xs font-bold border border-neutral-200/50 hover:shadow-xs transition-all duration-300 cursor-pointer"
            >
              <span>{t.ctaAbout}</span>
            </a>
          </motion.div>

          {/* Key Indicators Ribbon */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-6 pt-10 border-t border-neutral-200/50"
          >
            <div className="flex flex-col text-left">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">43</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{t.statSpecialties}</span>
            </div>
            
            <div className="flex flex-col text-left group relative cursor-pointer">
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary">900+</span>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/5 text-primary text-[9px] font-bold border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                  i
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{t.statDoctors}</span>
              
              {/* Premium Hover Card */}
              <div className={`absolute bottom-full mb-3 w-64 bg-white/95 backdrop-blur-lg border border-primary/10 shadow-2xl rounded-2xl p-4 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${isAr ? "right-0" : "left-0"}`}>
                <div className={`absolute -bottom-1.5 w-3 h-3 bg-white border-r border-b border-primary/10 rotate-45 ${isAr ? "right-6" : "left-6"}`} />
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-neutral-100">
                  {t.academicStaffBreakdown}
                </p>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-neutral-500">{t.professors}</span>
                    <span className="font-bold text-primary">119+</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-neutral-500">{t.associateProfs}</span>
                    <span className="font-bold text-primary">62+</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-neutral-500">{t.assistantProfs}</span>
                    <span className="font-bold text-primary">70+</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-neutral-500">{t.researchAssistants}</span>
                    <span className="font-bold text-primary">600+</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: High Fidelity Medical UI Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-5 relative flex items-center justify-center w-full"
        >
          {/* Ambient Gold & Navy Glow Mesh behind card */}
          <div className="absolute -inset-10 bg-radial from-secondary/20 via-primary/5 to-transparent blur-3xl opacity-75 z-0 pointer-events-none" />

          {/* Main Visual Image Wrapper with Apple Glass Frame */}
          <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-primary/20 bg-white p-2 cursor-pointer z-10"
          >
            <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent z-10" />
              <img
                src="/assets/doctors/celal_tekinbas.jpg"
                alt="Prof. Dr. Celal TEKİNBAŞ"
                className="absolute inset-0 w-full h-full object-cover object-top transform hover:scale-[1.02] transition-transform duration-700"
              />
              
              {/* Visual Highlight Badge */}
              <div className="absolute bottom-6 left-6 right-6 z-20 glass-panel border border-white/20 rounded-2xl p-4 shadow-lg flex items-center space-x-4">
                <div className="p-2.5 rounded-xl bg-primary text-white shadow-xs shrink-0">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Başhekim</p>
                  <p className="text-sm font-extrabold text-primary">Prof. Dr. Celal TEKİNBAŞ</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
