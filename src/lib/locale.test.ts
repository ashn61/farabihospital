import { describe, it, expect } from "vitest";
import { pickLocale, ALL_LOCALES, PUBLIC_LOCALES } from "./locale";

describe("dil kümeleri", () => {
  it("public kümesinde Türkçe yok", () => {
    expect(PUBLIC_LOCALES).not.toContain("tr");
    expect(PUBLIC_LOCALES).toEqual(["en", "ar", "ru", "ka"]);
  });

  it("admin kümesinde beş dil var", () => {
    expect(ALL_LOCALES).toEqual(["tr", "en", "ar", "ru", "ka"]);
  });
});

describe("pickLocale", () => {
  it("kayıtlı 'tr' public kümesinde reddedilir", () => {
    expect(pickLocale("tr", PUBLIC_LOCALES)).toBeNull();
  });

  it("kayıtlı 'tr' admin kümesinde kabul edilir", () => {
    expect(pickLocale("tr", ALL_LOCALES)).toBe("tr");
  });

  it("kayıtlı 'ru' public kümesinde kabul edilir", () => {
    expect(pickLocale("ru", PUBLIC_LOCALES)).toBe("ru");
  });

  it("bilinmeyen değer reddedilir", () => {
    expect(pickLocale("de", PUBLIC_LOCALES)).toBeNull();
    expect(pickLocale("de", ALL_LOCALES)).toBeNull();
  });

  it("null girdi null döner", () => {
    expect(pickLocale(null, PUBLIC_LOCALES)).toBeNull();
  });

  it("boş string null döner", () => {
    expect(pickLocale("", PUBLIC_LOCALES)).toBeNull();
  });
});
