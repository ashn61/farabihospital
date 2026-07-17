import { describe, it, expect } from "vitest";
import { doctorsData } from "./doctors";
import { findUnitByTr } from "./units";

describe("statik hekim verisi birimlere eşleşir", () => {
  it("her hekimin en az bir birimi var", () => {
    for (const d of doctorsData) {
      expect(d.unitTr.length, `${d.name} birimsiz`).toBeGreaterThan(0);
    }
  });

  it("her unitTr girdisi bilinen bir birime eşleşir", () => {
    for (const d of doctorsData) {
      for (const tr of d.unitTr) {
        expect(findUnitByTr(tr), `${d.name} → "${tr}" bir birime eşleşmiyor`).toBeTruthy();
      }
    }
  });
});
