import { isSurgical, type Doctor } from "@/lib/doctors";
import type { NewsItem, NewsData } from "@/lib/news";
import type { UnitRecord } from "@/lib/units";
import type { Locale } from "@/lib/locale";

export interface DoctorRow {
  id: string;
  name: string;
  title: string;
  image: string;
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
  /** Supabase nested select: doctor_units(units(*)) */
  doctor_units?: { units: UnitRow | null }[] | null;
}

export interface NewsRow {
  id: string;
  image: string;
  name_tr: string; name_en: string; name_ar: string; name_ru: string; name_ka: string;
  designation_tr: string; designation_en: string; designation_ar: string; designation_ru: string; designation_ka: string;
  quote_tr: string; quote_en: string; quote_ar: string; quote_ru: string; quote_ka: string;
  sort_order: number;
}

export interface UnitRow {
  id: string;
  tr: string;
  en: string;
  ar: string;
  ru: string;
  ka: string;
  type: "surgical" | "internal";
  sort_order: number;
}

export type { UnitRecord } from "@/lib/units";

export function rowToUnitRecord(row: UnitRow): UnitRecord {
  return { id: row.id, tr: row.tr, en: row.en, ar: row.ar, ru: row.ru, ka: row.ka, type: row.type };
}

export function rowToDoctor(row: DoctorRow): Doctor {
  // getUnits() orders units by sort_order then tr (see units.ts); mirror that
  // ordering here so a doctor's branch chips render deterministically instead
  // of depending on the nested-select row order Supabase happens to return.
  const units = (row.doctor_units ?? [])
    .map((du) => du.units)
    .filter((u): u is UnitRow => u !== null)
    .sort((a, b) => a.sort_order - b.sort_order || a.tr.localeCompare(b.tr))
    .map(rowToUnitRecord);

  return {
    id: row.id,
    name: row.name,
    title: row.title,
    image: row.image,
    units,
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

/**
 * Yalnızca `doctors` satırını üretir. Birimler `doctor_units` tablosunda —
 * onları yazmak çağıranın sorumluluğu (bkz. saveDoctor, seed).
 */
export function doctorToRow(doc: Doctor, sortOrder = 0): Omit<DoctorRow, "doctor_units"> {
  return {
    id: doc.id,
    name: doc.name,
    title: doc.title,
    image: doc.image,
    stats_patients: doc.stats.patients,
    stats_experience: doc.stats.experience,
    stats_surgeries: isSurgical(doc) ? doc.stats.surgeries ?? null : null,
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
