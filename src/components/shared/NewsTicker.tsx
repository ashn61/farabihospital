"use client";

import React from "react";
import { Megaphone } from "lucide-react";
import type { NewsItem } from "@/lib/news";
import type { Locale } from "@/lib/locale";

const LABELS: Record<Locale, string> = {
  tr: "Duyuru",
  en: "News",
  ar: "إعلان",
  ru: "Объявление",
  ka: "სიახლე",
};

export default function NewsTicker({ items, locale }: { items: NewsItem[]; locale: Locale }) {
  if (items.length === 0) return null;

  const isRtl = locale === "ar";

  // İçerik iki kez basılır: -50%'ye kayınca ikinci kopya tam başa oturur,
  // döngü dikişsiz görünür.
  const sequence = [...items, ...items];

  return (
    <a
      href="#announcements"
      aria-label={LABELS[locale]}
      className="group block w-full bg-primary text-white overflow-hidden border-b border-white/10"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      <div className="relative flex items-center h-10">
        {/* Sabit etiket */}
        <div
          className={`z-20 flex items-center gap-1.5 shrink-0 h-full px-4 bg-secondary text-primary ${
            isRtl ? "order-last" : ""
          }`}
        >
          <Megaphone className="h-3.5 w-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            {LABELS[locale]}
          </span>
        </div>

        {/* Kayan pist */}
        <div className="flex-1 overflow-hidden">
          <div className="farabi-marquee-track" data-rtl={isRtl}>
            {sequence.map((item, i) => (
              <span
                key={i}
                aria-hidden={i >= items.length}
                className="flex items-center whitespace-nowrap text-[11px] font-semibold px-6"
              >
                <span className="h-1 w-1 rounded-full bg-secondary shrink-0" />
                <span className="ml-3 group-hover:text-secondary transition-colors">
                  {item.name}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
