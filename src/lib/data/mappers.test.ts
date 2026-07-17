import { describe, it, expect } from "vitest";
import { rowToDoctor, doctorToRow, rowsToNewsData, type DoctorRow, type NewsRow, type UnitRow } from "./mappers";
import type { Doctor } from "@/lib/doctors";

const surgicalUnitRow: UnitRow = {
  id: "unit-1",
  tr: "Göğüs Cerrahisi Polikliniği",
  en: "Thoracic Surgery",
  ar: "جراحة الصدر",
  ru: "Торакальная хирургия",
  ka: "თორაკალური ქირურგია",
  type: "surgical",
  sort_order: 0,
};

const internalUnitRow: UnitRow = {
  id: "unit-2",
  tr: "Dahiliye Polikliniği",
  en: "Internal Medicine",
  ar: "الطب الباطني",
  ru: "Терапия",
  ka: "შინაგანი მედიცინა",
  type: "internal",
  sort_order: 1,
};

const sampleRow: DoctorRow = {
  id: "4177",
  name: "Celal TEKİNBAŞ",
  title: "Prof. Dr.",
  image: "/assets/doctors/celal_tekinbas.jpg",
  email: "celal@ktu.edu.tr",
  education_tr: ["KTÜ"],
  education_en: ["KTU"],
  education_ar: null,
  bio_tr: "tr", bio_en: "en", bio_ar: null, bio_ru: "ru", bio_ka: "ka",
  sort_order: 0,
  doctor_units: [{ units: surgicalUnitRow }],
};

describe("rowToDoctor", () => {
  it("maps snake_case columns into the Doctor shape", () => {
    const doc = rowToDoctor(sampleRow);
    expect(doc.id).toBe("4177");
    expect(doc.educationTr).toEqual(["KTÜ"]);
  });

  it("flattens the doctor_units nested select into units", () => {
    const doc = rowToDoctor({
      ...sampleRow,
      doctor_units: [{ units: surgicalUnitRow }, { units: internalUnitRow }],
    });
    expect(doc.units.map((u) => u.id)).toEqual(["unit-1", "unit-2"]);
    expect(doc.units[0]).toEqual({
      id: "unit-1",
      tr: "Göğüs Cerrahisi Polikliniği",
      en: "Thoracic Surgery",
      ar: "جراحة الصدر",
      ru: "Торакальная хирургия",
      ka: "თორაკალური ქირურგია",
      type: "surgical",
    });
  });

  it("yields an empty units array when there are no links", () => {
    expect(rowToDoctor({ ...sampleRow, doctor_units: [] }).units).toEqual([]);
    expect(rowToDoctor({ ...sampleRow, doctor_units: null }).units).toEqual([]);
    expect(rowToDoctor({ ...sampleRow, doctor_units: [{ units: null }] }).units).toEqual([]);
  });

  it("turns null optional columns into undefined", () => {
    const doc = rowToDoctor(sampleRow);
    expect(doc.bioAr).toBeUndefined();
    expect(doc.educationAr).toBeUndefined();
  });
});

describe("doctorToRow", () => {
  it("round-trips a Doctor back to a row", () => {
    const doc: Doctor = rowToDoctor(sampleRow);
    const row = doctorToRow(doc, 5);
    expect(row.name).toBe("Celal TEKİNBAŞ");
    expect(row.sort_order).toBe(5);
    expect(row.bio_ar).toBeNull();
  });
});

describe("rowsToNewsData", () => {
  it("groups one row's localized columns into per-locale arrays", () => {
    const row: NewsRow = {
      id: "abc",
      image: "https://img/1.jpg",
      name_tr: "Başlık", name_en: "Title", name_ar: "عنوان", name_ru: "Заголовок", name_ka: "სათაური",
      designation_tr: "Etiket", designation_en: "Tag", designation_ar: "علامة", designation_ru: "Тег", designation_ka: "ტეგი",
      quote_tr: "Açıklama", quote_en: "Desc", quote_ar: "وصف", quote_ru: "Описание", quote_ka: "აღწერა",
      sort_order: 0,
    };
    const data = rowsToNewsData([row]);
    expect(data.tr[0]).toEqual({ name: "Başlık", designation: "Etiket", quote: "Açıklama", src: "https://img/1.jpg" });
    expect(data.en[0].name).toBe("Title");
    expect(data.ru[0].name).toBe("Заголовок");
    expect(data.ka[0].quote).toBe("აღწერა");
  });
});
