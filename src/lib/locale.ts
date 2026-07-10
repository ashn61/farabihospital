import type { Locale } from "@/components/shared/Navbar";

const STORAGE_KEY = "farabi_locale";
const VALID: readonly Locale[] = ["tr", "en", "ar", "ru", "ka"];

/** Read the persisted locale from localStorage, or null if none/invalid. */
export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value && (VALID as readonly string[]).includes(value) ? (value as Locale) : null;
}

/** Persist the chosen locale so it survives navigation and reloads. */
export function storeLocale(locale: Locale): void {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, locale);
}
