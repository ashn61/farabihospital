import type { Doctor } from "@/lib/doctors";
import type { NewsItem, NewsData } from "@/lib/news";

export const LOCALES = ["tr", "en", "ar", "ru", "ka"] as const;
export type Locale = (typeof LOCALES)[number];

export interface DoctorRow {
  id: string;
  name: string;
  title: string;
  image: string;
  specialty_tr: string;
  specialty_en: string;
  specialty_ar: string | null;
  specialty_ru: string;
  specialty_ka: string;
  category: "surgical" | "internal";
  stats_patients: number;
  stats_experience: number;
  stats_surgeries: number | null;
  email: string;
  education_tr: string[];
  education_en: string[];
  education_ar: string[] | null;
  bio_tr: string;
  bio_en: string;
  bio_ar: string | null;
  bio_ru: string;
  bio_ka: string;
  sort_order: number;
}

export interface NewsRow {
  id: string;
  image: string;
  name_tr: string; name_en: string; name_ar: string; name_ru: string; name_ka: string;
  designation_tr: string; designation_en: string; designation_ar: string; designation_ru: string; designation_ka: string;
  quote_tr: string; quote_en: string; quote_ar: string; quote_ru: string; quote_ka: string;
  sort_order: number;
}

export function rowToDoctor(row: DoctorRow): Doctor {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    image: row.image,
    specialtyTr: row.specialty_tr,
    specialtyEn: row.specialty_en,
    specialtyAr: row.specialty_ar ?? undefined,
    specialtyRu: row.specialty_ru,
    specialtyKa: row.specialty_ka,
    category: row.category,
    stats: {
      patients: row.stats_patients,
      experience: row.stats_experience,
      surgeries: row.stats_surgeries ?? undefined,
    },
    email: row.email,
    educationTr: row.education_tr ?? [],
    educationEn: row.education_en ?? [],
    educationAr: row.education_ar ?? undefined,
    bioTr: row.bio_tr,
    bioEn: row.bio_en,
    bioAr: row.bio_ar ?? undefined,
    bioRu: row.bio_ru,
    bioKa: row.bio_ka,
  };
}

export function doctorToRow(doc: Doctor, sortOrder = 0): DoctorRow {
  return {
    id: doc.id,
    name: doc.name,
    title: doc.title,
    image: doc.image,
    specialty_tr: doc.specialtyTr,
    specialty_en: doc.specialtyEn,
    specialty_ar: doc.specialtyAr ?? null,
    specialty_ru: doc.specialtyRu,
    specialty_ka: doc.specialtyKa,
    category: doc.category,
    stats_patients: doc.stats.patients,
    stats_experience: doc.stats.experience,
    stats_surgeries: doc.category === "surgical" ? doc.stats.surgeries ?? 0 : null,
    email: doc.email,
    education_tr: doc.educationTr ?? [],
    education_en: doc.educationEn ?? [],
    education_ar: doc.educationAr ?? null,
    bio_tr: doc.bioTr,
    bio_en: doc.bioEn,
    bio_ar: doc.bioAr ?? null,
    bio_ru: doc.bioRu,
    bio_ka: doc.bioKa,
    sort_order: sortOrder,
  };
}

function rowToNewsItem(row: NewsRow, locale: Locale): NewsItem {
  return {
    name: row[`name_${locale}`],
    designation: row[`designation_${locale}`],
    quote: row[`quote_${locale}`],
    src: row.image,
  };
}

export function rowsToNewsData(rows: NewsRow[]): NewsData {
  return {
    tr: rows.map((r) => rowToNewsItem(r, "tr")),
    en: rows.map((r) => rowToNewsItem(r, "en")),
    ar: rows.map((r) => rowToNewsItem(r, "ar")),
    ru: rows.map((r) => rowToNewsItem(r, "ru")),
    ka: rows.map((r) => rowToNewsItem(r, "ka")),
  };
}
