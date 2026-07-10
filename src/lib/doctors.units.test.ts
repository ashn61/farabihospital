import { describe, it, expect } from "vitest";
import { doctorsData } from "./doctors";
import { findUnitByTr } from "./units";

describe("doctors mapped to units", () => {
  it("every doctor's specialtyTr matches a known unit and category equals unit type", () => {
    for (const d of doctorsData) {
      const unit = findUnitByTr(d.specialtyTr);
      expect(unit, `${d.name} → "${d.specialtyTr}" bir birime eşleşmiyor`).toBeTruthy();
      expect(d.category, `${d.name} kategori uyuşmuyor`).toBe(unit!.type);
    }
  });

  it("all 5 specialty languages equal the unit's translations", () => {
    for (const d of doctorsData) {
      const u = findUnitByTr(d.specialtyTr)!;
      expect(d.specialtyEn).toBe(u.en);
      expect(d.specialtyAr).toBe(u.ar);
      expect(d.specialtyRu).toBe(u.ru);
      expect(d.specialtyKa).toBe(u.ka);
    }
  });
});
