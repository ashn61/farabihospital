import { describe, it, expect } from "vitest";
import { formatDoctorName, doctorsData } from "./doctors";

describe("formatDoctorName — Rusça kısaltma", () => {
  // DB'de fiilen kullanılan dört title değeri.
  const TITLES = ["Prof. Dr.", "Assoc. Prof.", "Asst. Prof.", "Dr."];

  it("hiçbir Rusça ünvan öneki 'д-р' içermez", () => {
    for (const title of TITLES) {
      const out = formatDoctorName("Ahmet YILMAZ", title, "ru");
      expect(out, `title="${title}" → "${out}"`).not.toContain("д-р");
    }
  });

  it("dört ünvan da beklenen 'др' biçimini üretir", () => {
    expect(formatDoctorName("Ahmet YILMAZ", "Prof. Dr.", "ru")).toContain("Проф. др");
    expect(formatDoctorName("Ahmet YILMAZ", "Assoc. Prof.", "ru")).toContain("Доц. др");
    expect(formatDoctorName("Ahmet YILMAZ", "Asst. Prof.", "ru")).toContain("Ассист. др");
    expect(formatDoctorName("Ahmet YILMAZ", "Dr.", "ru")).toContain("Др");
  });

  it("statik hekim verisindeki hiçbir bioRu 'д-р' içermez", () => {
    for (const d of doctorsData) {
      expect(d.bioRu, `${d.name}`).not.toContain("д-р");
    }
  });
});

describe("formatDoctorName — ünvan eşlemesi beş dilde", () => {
  it("dört DB ünvanının tüm beş dilde doğru prefiksleri", () => {
    const cases: Array<{title: string; locale: string; expectedPrefix: string}> = [
      // Prof. Dr.
      { title: "Prof. Dr.", locale: "tr", expectedPrefix: "Prof. Dr." },
      { title: "Prof. Dr.", locale: "en", expectedPrefix: "Prof. Dr." },
      { title: "Prof. Dr.", locale: "ar", expectedPrefix: "أ. د." },
      { title: "Prof. Dr.", locale: "ru", expectedPrefix: "Проф. др" },
      { title: "Prof. Dr.", locale: "ka", expectedPrefix: "პროფ. დოქტ." },
      // Assoc. Prof. — must NOT match prof first, or will regress to Prof prefix
      { title: "Assoc. Prof.", locale: "tr", expectedPrefix: "Doç. Dr." },
      { title: "Assoc. Prof.", locale: "en", expectedPrefix: "Assoc. Prof." },
      { title: "Assoc. Prof.", locale: "ar", expectedPrefix: "أ. م. د." },
      { title: "Assoc. Prof.", locale: "ru", expectedPrefix: "Доц. др" },
      { title: "Assoc. Prof.", locale: "ka", expectedPrefix: "ასოც. პროფ." },
      // Asst. Prof. — must NOT match prof first, or will regress to Prof prefix
      { title: "Asst. Prof.", locale: "tr", expectedPrefix: "Dr. Öğr. Üyesi" },
      { title: "Asst. Prof.", locale: "en", expectedPrefix: "Asst. Prof." },
      { title: "Asst. Prof.", locale: "ar", expectedPrefix: "أ. مس. د." },
      { title: "Asst. Prof.", locale: "ru", expectedPrefix: "Ассист. др" },
      { title: "Asst. Prof.", locale: "ka", expectedPrefix: "ასისტ. პროფ." },
      // Dr.
      { title: "Dr.", locale: "tr", expectedPrefix: "Dr." },
      { title: "Dr.", locale: "en", expectedPrefix: "Dr." },
      { title: "Dr.", locale: "ar", expectedPrefix: "د." },
      { title: "Dr.", locale: "ru", expectedPrefix: "Др" },
      { title: "Dr.", locale: "ka", expectedPrefix: "დოქტ." },
    ];

    for (const {title, locale, expectedPrefix} of cases) {
      const result = formatDoctorName("Test NAME", title, locale);
      expect(result.startsWith(expectedPrefix),
        `title="${title}" locale="${locale}" → expected to start with "${expectedPrefix}", got "${result}"`
      ).toBe(true);
    }
  });
});
