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
