"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Locale } from "./Navbar";
import Link from "next/link";

const translations = {
  tr: {
    rights: "© 2026 KTÜ Farabi Hastanesi Uluslararası Hasta Merkezi. Tüm hakları saklıdır.",
    tagline: "Karadeniz'in akademik güvencesiyle, küresel standartlarda sağlık hizmetleri.",
    contactTitle: "İletişim & Konum",
    phone: "Destek (WhatsApp): 0552 902 97 64",
    staticPhone: "Bilgi Hattı: 0462 377 54 64",
    email: "E-posta: farabihospital@ktu.edu.tr",
    address: "KTÜ Farabi Hastanesi, Üniversite Mahallesi, 61080 Trabzon, Türkiye",
    linksTitle: "Hızlı Bağlantılar",
    linkDoctors: "Hekimlerimiz",
    linkSpecialties: "Tıbbi Birimler",
    lastUpdated: "Son Güncelleme Tarihi: 23.06.2026"
  },
  en: {
    rights: "© 2026 KTÜ Farabi Hospital International Patient Hub. All rights reserved.",
    tagline: "Academic medical expertise of Black Sea, serving global patients with elite standards.",
    contactTitle: "Contact & Location",
    phone: "Support (WhatsApp): 0552 902 97 64",
    staticPhone: "Information Line: 0462 377 54 64",
    email: "Email: farabihospital@ktu.edu.tr",
    address: "KTÜ Farabi Hospital, University Campus, 61080 Trabzon, Turkey",
    linksTitle: "Quick Navigation",
    linkDoctors: "Doctors",
    linkSpecialties: "Clinical Specialties",
    lastUpdated: "Last Updated Date: 23.06.2026"
  },
  ar: {
    rights: "© ٢٠٢٦ مستشفى فارابي بجامعة كيه تي يو - مركز المرضى الدوليين. جميع الحقوق محفوظة.",
    tagline: "الخبرة الطبية الأكاديمية في منطقة البحر الأسود، لخدمة المرضى العالميين بأعلى المستويات.",
    contactTitle: "الاتصال والموقع",
    phone: "الدعم (واتساب): 0552 902 97 64",
    staticPhone: "خط المعلومات: 0462 377 54 64",
    email: "البريد الإلكتروني: farabihospital@ktu.edu.tr",
    address: "مستشفى فارابي، الحرم الجامعي، ٦١٠٨٠ طرابزون، تركيا",
    linksTitle: "روابط سريعة",
    linkDoctors: "أطباؤنا",
    linkSpecialties: "الأقسام والعيادات",
    lastUpdated: "تاريخ آخر تحديث: ٢٣.٠٦.٢٠٢٦"
  },
  ru: {
    rights: "© 2026 Центр поддержки иностранных пациентов больницы KTÜ Farabi. Все права защищены.",
    tagline: "Медицинские услуги мирового уровня под академической гарантией Черноморского региона.",
    contactTitle: "Контакты и местоположение",
    phone: "Поддержка (WhatsApp): 0552 902 97 64",
    staticPhone: "Информационная линия: 0462 377 54 64",
    email: "Эл. почта: farabihospital@ktu.edu.tr",
    address: "Больница KTÜ Farabi, квартал Университет, 61080 Трабзон, Турция",
    linksTitle: "Быстрые ссылки",
    linkDoctors: "Наши врачи",
    linkSpecialties: "Медицинские отделения",
    lastUpdated: "Дата последнего обновления: 23.06.2026"
  },
  ka: {
    rights: "© 2026 KTÜ ფარაბის ჰოსპიტალის საერთაშორისო პაციენტთა ცენტრი. ყველა უფლება დაცულია.",
    tagline: "მსოფლიო დონის სამედიცინო მომსახურება შავი ზღვის რეგიონის აკადემიური გარანტიით.",
    contactTitle: "კონტაქტი და მდებარეობა",
    phone: "მხარდაჭერა (WhatsApp): 0552 902 97 64",
    staticPhone: "საინფორმაციო ხაზი: 0462 377 54 64",
    email: "ელ-ფოსტა: farabihospital@ktu.edu.tr",
    address: "KTÜ ფარაბის ჰოსპიტალი, უნივერსიტეტის უბანი, 61080 ტრაბზონი, თურქეთი",
    linksTitle: "სწრაფი ბმულები",
    linkDoctors: "ჩვენი ექიმები",
    linkSpecialties: "სამედიცინო განყოფილებები",
    lastUpdated: "ბოლო განახლების თარიღი: 23.06.2026"
  }
};

interface FooterProps {
  currentLocale: Locale;
}

export default function Footer({ currentLocale }: FooterProps) {
  const t = translations[currentLocale];
  const isAr = currentLocale === "ar";

  return (
    <footer
      className="bg-primary text-slate-200 border-t border-white/10 pt-16 pb-12 w-full text-left"
      style={{ direction: isAr ? "rtl" : "ltr" }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
        {/* Brand & Mission column */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="flex items-center space-x-2 shrink-0">
              <img src="/assets/healthturkiye.png" alt="Health Türkiye Logo" className="h-10 w-auto object-contain bg-white p-1 rounded-xl" />
              <img src="/assets/ktu_logo.png" alt="KTÜ Logo" className="h-10 w-auto object-contain bg-white/10 p-1 rounded-xl" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white">FARABİ</span>
              <span className="text-[10px] block font-black text-secondary tracking-widest mt-0.5">INTERNATIONAL</span>
            </div>
          </Link>
          <p className="text-sm font-medium leading-relaxed text-slate-350">
            {t.tagline}
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-base font-extrabold text-white tracking-wide">{t.linksTitle}</h4>
          <ul className="space-y-2.5 text-sm font-semibold">
            <li>
              <Link href="/#doctors" className="hover:text-secondary transition-colors flex items-center gap-1.5">
                {t.linkDoctors}
              </Link>
            </li>
            <li>
              <Link href="/#specialties" className="hover:text-secondary transition-colors flex items-center gap-1.5">
                {t.linkSpecialties}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4 lg:col-span-2">
          <h4 className="text-base font-extrabold text-white tracking-wide">{t.contactTitle}</h4>
          <div className="space-y-3 text-sm font-medium">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <span>{t.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="h-4.5 w-4.5 text-[#25D366] shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              <a
                href="https://wa.me/905529029764"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors cursor-pointer"
              >
                {t.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4.5 w-4.5 text-secondary shrink-0" />
              <a
                href="tel:+904623775464"
                className="hover:text-secondary transition-colors cursor-pointer"
              >
                {t.staticPhone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4.5 w-4.5 text-secondary shrink-0" />
              <a
                href="mailto:farabihospital@ktu.edu.tr"
                className="hover:text-secondary transition-colors cursor-pointer"
              >
                {t.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center space-y-2">
        <p className="text-xs font-semibold text-slate-400">
          {t.rights}
        </p>
        <p className="text-[10px] font-medium text-slate-500 tracking-wider">
          {t.lastUpdated}
        </p>
      </div>
    </footer>
  );
}
