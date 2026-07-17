"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/locale";

export type { Locale } from "@/lib/locale";

const translations = {
  tr: {
    home: "Ana Sayfa",
    about: "Hakkımızda",
    doctors: "Doktorlarımız",
    specialties: "Tıbbi Birimler",
    announcements: "Kurumsal Duyurular",
    contact: "İletişim",
    symptomChecker: "AI Semptom Asistanı",
    selectLang: "Dil Seçimi",
    adminPanel: "Yönetim Paneli",
    university: "KARADENİZ TEKNİK ÜNİVERSİTESİ",
    hospital: "Farabi Hastanesi Başhekimliği"
  },
  en: {
    home: "Home",
    about: "About Us",
    doctors: "Doctors",
    specialties: "Specialties",
    announcements: "News",
    contact: "Contact",
    symptomChecker: "AI Symptom Assistant",
    selectLang: "Select Language",
    adminPanel: "Admin Panel",
    university: "KARADENIZ TECHNICAL UNIVERSITY",
    hospital: "Farabi Hospital Directorate"
  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    doctors: "أطباؤنا",
    specialties: "الأقسام الطبية",
    announcements: "الأخبار",
    contact: "اتصل بنا",
    symptomChecker: "مساعد الأعراض الذكي",
    selectLang: "اختر اللغة",
    adminPanel: "لوحة التحكم",
    university: "جامعة كارادينيز التقنية",
    hospital: "إدارة مستشفى فارابي"
  },
  ru: {
    home: "Главная",
    about: "О нас",
    doctors: "Наши врачи",
    specialties: "Медицинские отделения",
    announcements: "Объявления",
    contact: "Контакты",
    symptomChecker: "AI Симптом-Помощник",
    selectLang: "Выбор языка",
    adminPanel: "Админ-панель",
    university: "КАРАДЕНИЗСКИЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ",
    hospital: "Главный врач больницы Фараби"
  },
  ka: {
    home: "მთავარი",
    about: "ჩვენს შესახებ",
    doctors: "ჩვენი ექიმები",
    specialties: "სამედიცინო განყოფილებები",
    announcements: "სიახლეები",
    contact: "კონტაქტი",
    symptomChecker: "AI სიმპტომების ასისტენტი",
    selectLang: "ენის არჩევა",
    adminPanel: "ადმინ პანელი",
    university: "კარადენისის ტექნიკური უნივერსიტეტი",
    hospital: "ფარაბის ჰოსპიტალის მთავარი ექიმი"
  }
};

interface NavbarProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function Navbar({ currentLocale, onLocaleChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = translations[currentLocale];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t.home, href: "/#home" },
    { name: t.about, href: "/#about" },
    { name: t.doctors, href: "/#doctors" },
    { name: t.specialties, href: "/#specialties" },
    { name: t.announcements, href: "/#announcements" },
    { name: t.contact, href: "/#contact" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "glass-panel py-3 shadow-xs border-b border-neutral-200/50"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/#home" className="flex items-center space-x-3 cursor-pointer">
          <div className="flex items-center shrink-0">
            <img src="/assets/ktu_logo.png" alt="KTÜ Logo" className="h-12 w-auto object-contain" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-primary block leading-tight">
              {t.university}
            </span>
            <span className="text-[10px] font-extrabold text-[#009ea3] block mt-0.5">
              {t.hospital}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Link Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-bold text-neutral-500 hover:text-primary transition-colors tracking-wide"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Interface Control Utilities */}
        <div className="hidden lg:flex items-center space-x-5">
          {/* Language Selector */}
          <div className="relative group py-2">
            <button className="flex items-center space-x-1 p-2 rounded-lg text-neutral-500 hover:text-primary transition-colors cursor-pointer">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-[10px] uppercase font-extrabold tracking-wider">{currentLocale}</span>
            </button>
            <div className="absolute right-0 top-full pt-1 w-36 hidden group-hover:block transition-all z-50">
              <div className="glass-panel border rounded-xl overflow-hidden shadow-xl">
                <button
                  onClick={() => onLocaleChange("tr")}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-105 hover:text-primary cursor-pointer"
                >
                  Türkçe (TR)
                </button>
                <button
                  onClick={() => onLocaleChange("en")}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-105 hover:text-primary cursor-pointer"
                >
                  English (EN)
                </button>
                <button
                  onClick={() => onLocaleChange("ar")}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-105 hover:text-primary cursor-pointer"
                >
                  العربية (AR)
                </button>
                <button
                  onClick={() => onLocaleChange("ru")}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-105 hover:text-primary cursor-pointer"
                >
                  Русский (RU)
                </button>
                <button
                  onClick={() => onLocaleChange("ka")}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-105 hover:text-primary cursor-pointer"
                >
                  ქართული (KA)
                </button>
              </div>
            </div>
          </div>
          {/* Health Türkiye Logo */}
          <Link href="/#home" className="cursor-pointer shrink-0">
            <img src="/assets/healthturkiye.png" alt="Health Türkiye Logo" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        {/* Mobile Navigation Menu Switch */}
        <div className="lg:hidden flex items-center space-x-3">
          <Link href="/#home" className="cursor-pointer shrink-0 mr-1">
            <img src="/assets/healthturkiye.png" alt="Health Türkiye Logo" className="h-6 w-auto object-contain" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-neutral-500 hover:text-primary"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel border-t border-neutral-250 mt-3 mx-4 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-bold text-neutral-500 hover:text-primary"
                >
                  {item.name}
                </a>
              ))}

              <div className="flex flex-col space-y-2 pt-2">
                <span className="text-xs text-slate-500 font-bold">{t.selectLang}</span>
                <div className="flex flex-wrap gap-2">
                  {(["tr", "en", "ar", "ru", "ka"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLocaleChange(lang);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-md cursor-pointer ${currentLocale === lang
                        ? "bg-primary text-white"
                        : "bg-neutral-100 text-neutral-700"
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
