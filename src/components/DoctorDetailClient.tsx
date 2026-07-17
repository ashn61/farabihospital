"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Clock,
  Award,
  CheckCircle2,
  Activity
} from "lucide-react";
import Navbar, { Locale } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import { formatDoctorName } from "@/lib/doctors";
import type { Doctor } from "@/lib/doctors";
import { unitLabel } from "@/lib/units";
import { readStoredLocale, storeLocale, PUBLIC_LOCALES } from "@/lib/locale";

const translations = {
  tr: {
    backToDirectory: "Hekim Dizinine Dön",
    doctorNotFound: "Hekim Bulunamadı",
    notFoundDesc: "Aradığınız hekim sistemimizde kayıtlı bulunmamaktadır. Lütfen dizine geri dönerek arama yapınız.",
    aboutDoc: "Hekim Hakkında",
    contactDoc: "İletişim & Danışma",
    emailPlaceholder: "E-posta",
    statusBadge: "Akademik Kadro",
    infoAlert: "Bu profil KTÜ Farabi Hastanesi Uluslararası Hasta Merkezi bilgilendirme servisince hazırlanmıştır."
  },
  en: {
    backToDirectory: "Back to Doctor Directory",
    doctorNotFound: "Doctor Not Found",
    notFoundDesc: "The requested doctor could not be found in our database. Please return to the directory.",
    aboutDoc: "About the Physician",
    contactDoc: "Contact & Information",
    emailPlaceholder: "Email",
    statusBadge: "Academic Faculty",
    infoAlert: "This profile is compiled by the KTÜ Farabi Hospital International Patients Information Services."
  },
  ar: {
    backToDirectory: "العودة إلى دليل الأطباء",
    doctorNotFound: "الطبيب غير موجود",
    notFoundDesc: "لم يتم العثور على الطبيب المطلوب في قاعدة بياناتنا. يرجى العودة إلى الدليل.",
    aboutDoc: "حول الطبيب",
    contactDoc: "الاتصال والاستفسار",
    emailPlaceholder: "البريد الإلكتروني",
    statusBadge: "الكادر الأكاديمي",
    infoAlert: "تم إعداد هذا الملف التعريفي بواسطة خدمة معلومات مركز المرضى الدوليين بمستشفى فارابي."
  },
  ru: {
    backToDirectory: "Вернуться к списку врачей",
    doctorNotFound: "Врач не найден",
    notFoundDesc: "Запрашиваемый специалист не найден в нашей базе данных. Пожалуйста, вернитесь к каталогу.",
    aboutDoc: "Информация о враче",
    contactDoc: "Контакты и консультация",
    emailPlaceholder: "Эл. почта",
    statusBadge: "Академический состав",
    infoAlert: "Этот профиль подготовлен информационной службой Центра иностранных пациентов больницы KTÜ Farabi."
  },
  ka: {
    backToDirectory: "ექიმების კატალოგში დაბრუნება",
    doctorNotFound: "ექიმი ვერ მოიძებნა",
    notFoundDesc: "მოთხოვნილი ექიმი ჩვენს ბაზაში ვერ მოიძებნა. გთხოვთ, დაბრუნდეთ კატალოგში.",
    aboutDoc: "ექიმის შესახებ",
    contactDoc: "კონტაქტი და კონსულტაცია",
    emailPlaceholder: "ელ-ფოსტა",
    statusBadge: "აკადემიური პერსონალი",
    infoAlert: "ეს პროფილი მომზადებულია KTÜ ფარაბის ჰოსპიტალის საერთაშორისო პაციენტთა საინფორმაციო სამსახურის მიერ."
  }
};

export default function DoctorDetailClient({ doctor }: { doctor: Doctor }) {
  const [locale, setLocale] = useState<Locale>("en");

  // Restore the language the user picked on any previous page/visit.
  useEffect(() => {
    const stored = readStoredLocale(PUBLIC_LOCALES);
    if (stored) setLocale(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = translations[locale];
  const isRtl = locale === "ar";

  if (!doctor) {
    return (
      <div className="flex flex-col min-h-screen bg-background" style={{ direction: isRtl ? "rtl" : "ltr" }}>
        <Navbar
          currentLocale={locale}
          onLocaleChange={(l) => { setLocale(l); storeLocale(l); }}
          availableLocales={PUBLIC_LOCALES}
        />
        <main className="flex-1 max-w-3xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-red-50 text-red-500 rounded-full mb-6">
            <Activity className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-black text-primary mb-3">{t.doctorNotFound}</h1>
          <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-8 max-w-md">
            {t.notFoundDesc}
          </p>
          <Link
            href="/"
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white text-xs font-black uppercase rounded-full shadow-xs hover:bg-primary/95 transition-all"
          >
            <ArrowLeft className="h-4 w-4 text-secondary" />
            <span>{t.backToDirectory}</span>
          </Link>
        </main>
        <Footer currentLocale={locale} />
      </div>
    );
  }

  // Multi-lingual translation mapping
  const docBio =
    locale === "tr" ? doctor.bioTr :
    locale === "en" ? doctor.bioEn :
    locale === "ar" ? (doctor.bioAr || doctor.bioEn) :
    locale === "ru" ? doctor.bioRu :
    doctor.bioKa;

  const docEducation =
    locale === "tr" ? doctor.educationTr :
    locale === "ar" ? (doctor.educationAr || doctor.educationEn) :
    doctor.educationEn;

  return (
    <div className="flex flex-col min-h-screen bg-background" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      {/* Global Navbar */}
      <Navbar
        currentLocale={locale}
        onLocaleChange={(l) => { setLocale(l); storeLocale(l); }}
        availableLocales={PUBLIC_LOCALES}
      />

      <main className="flex-1 pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
        {/* Back Link Breadcrumb */}
        <div className="mb-10 flex">
          <Link
            href="/#doctors"
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200/60 rounded-full text-[11px] font-black text-primary uppercase hover:shadow-xs transition-all hover:bg-slate-50 shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-secondary" />
            <span>{t.backToDirectory}</span>
          </Link>
        </div>

        {/* Apple style Profile Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Side: Photo wrapper */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Portrait Image Frame */}
            <div className="w-full max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-primary/20 bg-white p-2.5 z-10">
              <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative bg-[#F8FAFC]">
                {/* Doctor Portrait Image */}
                <img
                  src={doctor.image}
                  alt={formatDoctorName(doctor.name, doctor.title, locale)}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Key Metadata and Content Blocks */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-left">

            {/* Header Identity */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary border border-secondary/40 w-fit">
                <Award className="h-4 w-4 text-secondary" />
                <span className="text-[10px] font-bold tracking-wider uppercase">{t.statusBadge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight leading-tight">
                {formatDoctorName(doctor.name, doctor.title, locale)}
              </h1>
              <div className="flex flex-wrap gap-2">
                {doctor.units.map((u) => (
                  <span
                    key={u.id}
                    className="text-[11px] font-bold text-primary bg-primary/5 border border-primary/20 rounded-full px-3 py-1"
                  >
                    {unitLabel(u, locale)}
                  </span>
                ))}
              </div>
            </div>

            {/* Info warning */}
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-primary leading-relaxed">
                {t.infoAlert}
              </p>
            </div>

            {/* Biography + education, tek başlık altında */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-2">
                {t.aboutDoc}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                {docBio}
              </p>
              {docEducation.length > 0 && (
                <ul className="space-y-3 pt-1">
                  {docEducation.map((edu, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm font-semibold text-neutral-600">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-2">
                {t.contactDoc}
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-3 text-xs font-bold text-neutral-600">
                  <Mail className="h-4.5 w-4.5 text-secondary" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-bold text-neutral-600">
                  <Clock className="h-4.5 w-4.5 text-secondary" />
                  <span>Hafta İçi / Weekdays: 09:00 - 17:00</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer currentLocale={locale} />



      {/* Dynamic Live Chat Support Widget */}
      <ChatWidget currentLocale={locale} />
    </div>
  );
}
