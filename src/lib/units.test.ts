import { describe, it, expect } from "vitest";
import { units, findUnitByTr, unitLabel } from "./units";

describe("units", () => {
  it("has 56 units: 17 surgical + 39 internal", () => {
    expect(units).toHaveLength(56);
    expect(units.filter((u) => u.type === "surgical")).toHaveLength(17);
    expect(units.filter((u) => u.type === "internal")).toHaveLength(39);
  });

  it("every unit has all 5 language labels", () => {
    for (const u of units) {
      for (const key of ["tr", "en", "ar", "ru", "ka"] as const) {
        expect(u[key], `${u.tr} missing ${key}`).toBeTruthy();
      }
    }
  });

  it("has no duplicate tr names", () => {
    const names = units.map((u) => u.tr);
    expect(new Set(names).size).toBe(names.length);
  });

  it("findUnitByTr returns the matching unit", () => {
    expect(findUnitByTr("Göğüs Cerrahisi Polikliniği")?.type).toBe("surgical");
    expect(findUnitByTr("Cildiye Polikliniği")?.type).toBe("internal");
    expect(findUnitByTr("Yok Böyle Bir Şey")).toBeUndefined();
  });

  it("unitLabel falls back to tr for unknown locale", () => {
    const u = units[0];
    expect(unitLabel(u, "en")).toBe(u.en);
    expect(unitLabel(u, "zz")).toBe(u.tr);
  });
});
