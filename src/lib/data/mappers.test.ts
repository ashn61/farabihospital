import { describe, it, expect } from "vitest";
import { rowToDoctor, doctorToRow, rowsToNewsData, type DoctorRow, type NewsRow } from "./mappers";
import type { Doctor } from "@/lib/doctors";

const sampleRow: DoctorRow = {
  id: "4177",
  name: "Celal TEKİNBAŞ",
  title: "Prof. Dr.",
  image: "/assets/doctors/celal_tekinbas.jpg",
  specialty_tr: "Göğüs Cerrahisi",
  specialty_en: "Thoracic Surgery",
  specialty_ar: "جراحة الصدر",
  specialty_ru: "Торакальная хирургия",
  specialty_ka: "თორაკალური ქირურგია",
  category: "surgical",
  stats_patients: 14200,
  stats_experience: 28,
  stats_surgeries: 4500,
  email: "celal@ktu.edu.tr",
  education_tr: ["KTÜ"],
  education_en: ["KTU"],
  education_ar: null,
  bio_tr: "tr", bio_en: "en", bio_ar: null, bio_ru: "ru", bio_ka: "ka",
  sort_order: 0,
};

describe("rowToDoctor", () => {
  it("maps snake_case columns into the Doctor shape", () => {
    const doc = rowToDoctor(sampleRow);
    expect(doc.id).toBe("4177");
    expect(doc.specialtyTr).toBe("Göğüs Cerrahisi");
    expect(doc.stats).toEqual({ patients: 14200, experience: 28, surgeries: 4500 });
    expect(doc.educationTr).toEqual(["KTÜ"]);
    expect(doc.category).toBe("surgical");
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
    expect(row.specialty_tr).toBe("Göğüs Cerrahisi");
    expect(row.stats_surgeries).toBe(4500);
    expect(row.sort_order).toBe(5);
    expect(row.bio_ar).toBeNull();
  });

  it("sets stats_surgeries to null for internal doctors", () => {
    const doc = rowToDoctor({ ...sampleRow, category: "internal", stats_surgeries: null });
    const row = doctorToRow(doc);
    expect(row.stats_surgeries).toBeNull();
  });

  it("writes null stats_surgeries for a surgical doctor with no surgeries value", () => {
    const doc = rowToDoctor({ ...sampleRow, stats_surgeries: null }); // surgical, surgeries undefined
    const row = doctorToRow(doc);
    expect(row.stats_surgeries).toBeNull();
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
