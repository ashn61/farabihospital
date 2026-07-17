export type Locale = "tr" | "en" | "ar" | "ru" | "ka";

const STORAGE_KEY = "farabi_locale";

/** Admin panelinin sunduğu diller — Türkçe dahil. */
export const ALL_LOCALES: readonly Locale[] = ["tr", "en", "ar", "ru", "ka"];

/** Public sitenin sunduğu diller — Türkçe yok. */
export const PUBLIC_LOCALES: readonly Locale[] = ["en", "ar", "ru", "ka"];

/**
 * Saf seçim: `value` verilen kümede geçerli bir dil mi?
 * Değilse null — çağıran kendi varsayılanına düşer.
 */
export function pickLocale(value: string | null, allowed: readonly Locale[]): Locale | null {
  if (!value) return null;
  return (allowed as readonly string[]).includes(value) ? (value as Locale) : null;
}

/** Kayıtlı dili oku; verilen kümede değilse null. */
export function readStoredLocale(allowed: readonly Locale[] = ALL_LOCALES): Locale | null {
  if (typeof window === "undefined") return null;
  return pickLocale(window.localStorage.getItem(STORAGE_KEY), allowed);
}

/** Seçilen dili kalıcılaştır — gezinme ve yenilemede korunur. */
export function storeLocale(locale: Locale): void {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, locale);
}
