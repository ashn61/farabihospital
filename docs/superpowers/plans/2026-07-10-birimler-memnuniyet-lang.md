# Birimler / Memnuniyet / Dinamik Lang — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Merkezi birim listesi kur; doktor formunda birim seçtir; ana sayfa birimlerini ve mevcut doktorları bu listeye taşı; memnuniyet oranını kaldır; İngilizce'de İ→I için html lang'ı dinamik yap.

**Architecture:** Yeni `src/lib/units.ts` tek doğruluk kaynağı (56 birim, 5 dil, `surgical|internal` tip). Admin form ve ana sayfa bu dosyadan beslenir. Mevcut doktorlar `doctors.ts` içinde birime göre güncellenir. Memnuniyet UI'dan silinir. Locale değişiminde `document.documentElement.lang` güncellenir.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Vitest, framer-motion.

## Global Constraints

- Spec kaynağı: `docs/superpowers/specs/2026-07-10-birimler-memnuniyet-lang-design.md` — birim adları ve çeviriler bu spec'in 3. bölümündeki tablodan **birebir** alınır.
- `category` alanı Supabase şemasında `"surgical" | "internal"` string olarak kalır; yeni kolon eklenmez. Birim adı doktorun `specialty*` alanlarında saklanır.
- 56 birim: 17 Cerrahi (`surgical`) + 39 Dahili (`internal`).
- Build doğrulaması: `npm run build`. Unit test: `npm test`.
- Commit mesajları sonuna: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: Birim veri dosyası ve yardımcı fonksiyon

**Files:**
- Create: `src/lib/units.ts`
- Test: `src/lib/units.test.ts`

**Interfaces:**
- Produces:
  - `type UnitType = "surgical" | "internal"`
  - `interface Unit { tr: string; en: string; ar: string; ru: string; ka: string; type: UnitType }`
  - `const units: Unit[]` (56 eleman; önce 17 surgical, sonra 39 internal — spec sırasıyla)
  - `function findUnitByTr(tr: string): Unit | undefined`
  - `function unitLabel(u: Unit, locale: string): string` (locale yoksa `tr`)

- [ ] **Step 1: Testi yaz** — `src/lib/units.test.ts`

```ts
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
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npm test -- units`
Expected: FAIL — `Cannot find module './units'`

- [ ] **Step 3: `src/lib/units.ts` dosyasını yaz**

Yapı aşağıdaki gibi. `units` dizisini **spec'in 3. bölümündeki iki tablodan** (önce Cerrahi 17 satır, sonra Dahili 39 satır) birebir doldur; her satır `{ tr, en, ar, ru, ka, type }`. `type`: Cerrahi tablo → `"surgical"`, Dahili tablo → `"internal"`.

```ts
export type UnitType = "surgical" | "internal";

export interface Unit {
  tr: string;
  en: string;
  ar: string;
  ru: string;
  ka: string;
  type: UnitType;
}

export const units: Unit[] = [
  // --- Cerrahi (surgical) — spec 3. bölüm "Cerrahi Birimler" tablosu, 17 satır ---
  { tr: "Beyin Cerrahi Polikliniği", en: "Neurosurgery", ar: "جراحة الأعصاب", ru: "Нейрохирургия", ka: "ნეიროქირურგია", type: "surgical" },
  { tr: "Göz Polikliniği", en: "Ophthalmology", ar: "طب العيون", ru: "Офтальмология", ka: "ოფთალმოლოგია", type: "surgical" },
  { tr: "Plastik Cerrahi Polikliniği", en: "Plastic Surgery", ar: "الجراحة التجميلية", ru: "Пластическая хирургия", ka: "პლასტიკური ქირურგია", type: "surgical" },
  { tr: "Plastik Cerrahi Yanık Polikliniği", en: "Plastic Surgery & Burns", ar: "الجراحة التجميلية والحروق", ru: "Пластическая хирургия и ожоги", ka: "პლასტიკური ქირურგია და დამწვრობა", type: "surgical" },
  { tr: "Üroloji Polikliniği", en: "Urology", ar: "المسالك البولية", ru: "Урология", ka: "უროლოგია", type: "surgical" },
  { tr: "Çocuk Ürolojisi Polikliniği", en: "Pediatric Urology", ar: "مسالك بولية الأطفال", ru: "Детская урология", ka: "ბავშვთა უროლოგია", type: "surgical" },
  { tr: "Kulak-Burun-Boğaz Polikliniği", en: "Otorhinolaryngology (ENT)", ar: "أنف وأذن وحنجرة", ru: "Оториноларингология (ЛОР)", ka: "ყელ-ყურ-ცხვირი", type: "surgical" },
  { tr: "Girişimsel Radyoloji", en: "Interventional Radiology", ar: "الأشعة التداخلية", ru: "Интервенционная радиология", ka: "ინტერვენციული რადიოლოგია", type: "surgical" },
  { tr: "Algoloji Polikliniği", en: "Algology (Pain Medicine)", ar: "علاج الألم", ru: "Альгология (лечение боли)", ka: "ალგოლოგია (ტკივილის მედიცინა)", type: "surgical" },
  { tr: "Kalp-Damar Cerrahi Polikliniği", en: "Cardiovascular Surgery", ar: "جراحة القلب والأوعية", ru: "Сердечно-сосудистая хирургия", ka: "კარდიოვასკულური ქირურგია", type: "surgical" },
  { tr: "Organ Nakli Polikliniği", en: "Organ Transplantation", ar: "زراعة الأعضاء", ru: "Трансплантация органов", ka: "ორგანოთა ტრანსპლანტაცია", type: "surgical" },
  { tr: "Kadın-Doğum Polikliniği", en: "Obstetrics & Gynecology", ar: "النساء والتوليد", ru: "Акушерство и гинекология", ka: "მეანობა-გინეკოლოგია", type: "surgical" },
  { tr: "Çocuk Cerrahisi Polikliniği", en: "Pediatric Surgery", ar: "جراحة الأطفال", ru: "Детская хирургия", ka: "ბავშვთა ქირურგია", type: "surgical" },
  { tr: "Genel Cerrahi Polikliniği", en: "General Surgery", ar: "الجراحة العامة", ru: "Общая хирургия", ka: "ზოგადი ქირურგია", type: "surgical" },
  { tr: "Ortopedi Polikliniği", en: "Orthopedics", ar: "جراحة العظام", ru: "Ортопедия", ka: "ორთოპედია", type: "surgical" },
  { tr: "Perinatoloji Ünitesi", en: "Perinatology Unit", ar: "وحدة طب الأجنة", ru: "Отделение перинатологии", ka: "პერინატოლოგიის განყოფილება", type: "surgical" },
  { tr: "Göğüs Cerrahisi Polikliniği", en: "Thoracic Surgery", ar: "جراحة الصدر", ru: "Торакальная хирургия", ka: "თორაკალური ქირურგია", type: "surgical" },

  // --- Dahili (internal) — spec 3. bölüm "Dahili Birimler" tablosu, 39 satır ---
  { tr: "Cildiye Polikliniği", en: "Dermatology", ar: "الجلدية", ru: "Дерматология", ka: "დერმატოლოგია", type: "internal" },
  { tr: "Çocuk Psikiyatrisi Polikliniği", en: "Child Psychiatry", ar: "الطب النفسي للأطفال", ru: "Детская психиатрия", ka: "ბავშვთა ფსიქიატრია", type: "internal" },
  { tr: "Göğüs İmmünoloji ve Alerji Polikliniği", en: "Chest Immunology & Allergy", ar: "مناعة وحساسية الصدر", ru: "Иммунология и аллергология органов дыхания", ka: "გულმკერდის იმუნოლოგია და ალერგია", type: "internal" },
  { tr: "Gastroenteroloji Polikliniği", en: "Gastroenterology", ar: "أمراض الجهاز الهضمي", ru: "Гастроэнтерология", ka: "გასტროენტეროლოგია", type: "internal" },
  { tr: "Enfeksiyon Polikliniği", en: "Infectious Diseases", ar: "الأمراض المعدية", ru: "Инфекционные болезни", ka: "ინფექციური დაავადებები", type: "internal" },
  { tr: "Fizik Tedavi Polikliniği", en: "Physical Therapy", ar: "العلاج الطبيعي", ru: "Физиотерапия", ka: "ფიზიოთერაპია", type: "internal" },
  { tr: "Fizik Tedavi-Romatoloji Polikliniği", en: "Physical Therapy & Rheumatology", ar: "العلاج الطبيعي والروماتيزم", ru: "Физиотерапия и ревматология", ka: "ფიზიოთერაპია და რევმატოლოგია", type: "internal" },
  { tr: "Psikiyatri Polikliniği", en: "Psychiatry", ar: "الطب النفسي", ru: "Психиатрия", ka: "ფსიქიატრია", type: "internal" },
  { tr: "Radyasyon Onkolojisi Polikliniği", en: "Radiation Oncology", ar: "علاج الأورام بالإشعاع", ru: "Радиационная онкология", ka: "რადიაციული ონკოლოგია", type: "internal" },
  { tr: "Dahiliye Polikliniği", en: "Internal Medicine", ar: "الطب الباطني", ru: "Терапия", ka: "შინაგანი მედიცინა", type: "internal" },
  { tr: "Dahiliye Romatoloji Polikliniği", en: "Internal Medicine Rheumatology", ar: "باطنية روماتيزم", ru: "Терапия (ревматология)", ka: "შინაგანი მედიცინა – რევმატოლოგია", type: "internal" },
  { tr: "Nefroloji Polikliniği", en: "Nephrology", ar: "أمراض الكلى", ru: "Нефрология", ka: "ნეფროლოგია", type: "internal" },
  { tr: "Endokrinoloji Polikliniği", en: "Endocrinology", ar: "الغدد الصماء", ru: "Эндокринология", ka: "ენდოკრინოლოგია", type: "internal" },
  { tr: "Kardiyoloji Polikliniği", en: "Cardiology", ar: "أمراض القلب", ru: "Кардиология", ka: "კარდიოლოგია", type: "internal" },
  { tr: "Koroner Polikliniği", en: "Coronary Clinic", ar: "عيادة القلب التاجية", ru: "Коронарная клиника", ka: "კორონარული კლინიკა", type: "internal" },
  { tr: "Genel Pediatri Polikliniği", en: "General Pediatrics", ar: "طب الأطفال العام", ru: "Общая педиатрия", ka: "ზოგადი პედიატრია", type: "internal" },
  { tr: "Nöroloji Polikliniği", en: "Neurology", ar: "طب الأعصاب", ru: "Неврология", ka: "ნევროლოგია", type: "internal" },
  { tr: "Pediatri Kardiyoloji Polikliniği", en: "Pediatric Cardiology", ar: "قلب الأطفال", ru: "Детская кардиология", ka: "ბავშვთა კარდიოლოგია", type: "internal" },
  { tr: "Pediatri Endokrin Polikliniği", en: "Pediatric Endocrinology", ar: "غدد الأطفال الصماء", ru: "Детская эндокринология", ka: "ბავშვთა ენდოკრინოლოგია", type: "internal" },
  { tr: "Pediatri Hematoloji ve Onkoloji Polikliniği", en: "Pediatric Hematology & Oncology", ar: "أمراض دم وأورام الأطفال", ru: "Детская гематология и онкология", ka: "ბავშვთა ჰემატოლოგია და ონკოლოგია", type: "internal" },
  { tr: "Pediatri Nöroloji Polikliniği", en: "Pediatric Neurology", ar: "أعصاب الأطفال", ru: "Детская неврология", ka: "ბავშვთა ნევროლოგია", type: "internal" },
  { tr: "Pediatri İmmünoloji ve Alerji Polikliniği", en: "Pediatric Immunology & Allergy", ar: "مناعة وحساسية الأطفال", ru: "Детская иммунология и аллергология", ka: "ბავშვთა იმუნოლოგია და ალერგია", type: "internal" },
  { tr: "Pediatri Nefroloji Polikliniği", en: "Pediatric Nephrology", ar: "كلى الأطفال", ru: "Детская нефрология", ka: "ბავშვთა ნეფროლოგია", type: "internal" },
  { tr: "Pediatri Göğüs Hastalıkları Polikliniği", en: "Pediatric Pulmonology", ar: "أمراض صدر الأطفال", ru: "Детская пульмонология", ka: "ბავშვთა პულმონოლოგია", type: "internal" },
  { tr: "Pediatri Enfeksiyon Polikliniği", en: "Pediatric Infectious Diseases", ar: "أمراض معدية للأطفال", ru: "Детские инфекционные болезни", ka: "ბავშვთა ინფექციური დაავადებები", type: "internal" },
  { tr: "Pediatri Romatoloji Polikliniği", en: "Pediatric Rheumatology", ar: "روماتيزم الأطفال", ru: "Детская ревматология", ka: "ბავშვთა რევმატოლოგია", type: "internal" },
  { tr: "Pediatri Onkoloji Polikliniği", en: "Pediatric Oncology", ar: "أورام الأطفال", ru: "Детская онкология", ka: "ბავშვთა ონკოლოგია", type: "internal" },
  { tr: "Pediatri Gastroenteroloji Polikliniği", en: "Pediatric Gastroenterology", ar: "جهاز هضمي الأطفال", ru: "Детская гастроэнтерология", ka: "ბავშვთა გასტროენტეროლოგია", type: "internal" },
  { tr: "Pediatri KİT Polikliniği", en: "Pediatric Bone Marrow Transplant", ar: "زراعة نخاع الأطفال", ru: "Детская трансплантация костного мозга", ka: "ბავშვთა ძვლის ტვინის ტრანსპლანტაცია", type: "internal" },
  { tr: "Anesteziyoloji Polikliniği", en: "Anesthesiology", ar: "التخدير", ru: "Анестезиология", ka: "ანესთეზიოლოგია", type: "internal" },
  { tr: "Korona 19 Erişkin Poliklinik", en: "COVID-19 Adult Clinic", ar: "عيادة كوفيد-19 للبالغين", ru: "Клиника COVID-19 (взрослые)", ka: "COVID-19 ზრდასრულთა კლინიკა", type: "internal" },
  { tr: "Radyoloji Ünitesi", en: "Radiology Unit", ar: "وحدة الأشعة", ru: "Отделение радиологии", ka: "რადიოლოგიის განყოფილება", type: "internal" },
  { tr: "Medikal Onkoloji Polikliniği", en: "Medical Oncology", ar: "الأورام الطبية", ru: "Медицинская онкология", ka: "სამედიცინო ონკოლოგია", type: "internal" },
  { tr: "İmmünoloji Polikliniği", en: "Immunology", ar: "المناعة", ru: "Иммунология", ka: "იმუნოლოგია", type: "internal" },
  { tr: "Hematoloji Polikliniği", en: "Hematology", ar: "أمراض الدم", ru: "Гематология", ka: "ჰემატოლოგია", type: "internal" },
  { tr: "Yenidoğan Polikliniği", en: "Neonatology", ar: "حديثي الولادة", ru: "Неонатология", ka: "ნეონატოლოგია", type: "internal" },
  { tr: "Nükleer Tıp Polikliniği", en: "Nuclear Medicine", ar: "الطب النووي", ru: "Ядерная медицина", ka: "ბირთვული მედიცინა", type: "internal" },
  { tr: "Göğüs Hastalıkları Polikliniği", en: "Pulmonology (Chest Diseases)", ar: "أمراض الصدر", ru: "Пульмонология", ka: "პულმონოლოგია", type: "internal" },
  { tr: "Tıbbi Genetik Polikliniği", en: "Medical Genetics", ar: "الوراثة الطبية", ru: "Медицинская генетика", ka: "სამედიცინო გენეტიკა", type: "internal" },
];

export function findUnitByTr(tr: string): Unit | undefined {
  return units.find((u) => u.tr === tr);
}

export function unitLabel(u: Unit, locale: string): string {
  return (u as Record<string, string>)[locale] ?? u.tr;
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npm test -- units`
Expected: PASS (4 test)

- [ ] **Step 5: Commit**

```bash
git add src/lib/units.ts src/lib/units.test.ts
git commit -m "feat: add units data module (56 units, 5 languages)"
```

---

### Task 2: Memnuniyet oranını kaldır

**Files:**
- Modify: `src/components/sections/Hero.tsx` (~273-284)
- Modify: `src/components/DoctorDetailClient.tsx` (~26, ~43, ~224-229, ~217)
- Modify: `src/components/HomeClient.tsx` (~53, ~101, memnuniyet istatistik bloğu ~660-680)

**Interfaces:** Yok (yalnızca UI silme).

- [ ] **Step 1: Hero.tsx — yüzen memnuniyet rozetini sil**

`src/components/sections/Hero.tsx` içinde şu bloğun tamamını (`{/* Small Floating Micro-Badge */}` yorumundan başlayıp kapanan `</motion.div>`'e kadar, ~273-284) sil:

```tsx
        {/* Small Floating Micro-Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="absolute -top-4 -left-4 glass-panel border border-primary/20 rounded-2xl p-3 shadow-lg flex items-center space-x-2.5 z-20 cursor-default"
        >
          <div className="p-2 bg-secondary rounded-lg text-primary">
            <HeartHandshake className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-extrabold text-neutral-400">MÜKEMMELLİK MERKEZİ</p>
            <p className="text-[11px] font-black text-primary">99.8% Hasta Memnuniyeti</p>
          </div>
        </motion.div>
```

Silindikten sonra `HeartHandshake` importu başka yerde kullanılmıyorsa import satırından da çıkar (kullanımını grep'le: `HeartHandshake`).

- [ ] **Step 2: DoctorDetailClient.tsx — ortadaki memnuniyet kartını sil, ızgarayı 2'ye düşür**

`~217` satırındaki `grid grid-cols-3 gap-4` → `grid grid-cols-2 gap-4` yap. Ortadaki kartı (`{t.patientsTitle}` içeren, ~224-229) tümüyle sil:

```tsx
              <div className="glass-panel border rounded-2xl p-4 shadow-2xs">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.patientsTitle}</p>
                <p className="text-xl sm:text-2xl font-black text-primary mt-1">
                  99.8%
                </p>
              </div>
```

Ardından her locale objesindeki `patientsTitle:` satırlarını (tr/en/ar/ru/ka) sil.

- [ ] **Step 3: HomeClient.tsx — memnuniyet istatistiğini sil**

`~660-680` civarında `99.8%` içeren istatistik bloğunu ve onu saran kartı sil (uygulama sırasında dosyayı okuyup tam sınırları belirle). Ardından her locale objesindeki `patientsHealed:` satırlarını sil. Blok bir istatistik ızgarasının parçasıysa (ör. `grid-cols-4`), kalan kart sayısına göre kolon sayısını düşür.

- [ ] **Step 4: Build ile doğrula**

Run: `npm run build`
Expected: Hatasız derleme (kullanılmayan değişken/import kalmadığından emin ol).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/DoctorDetailClient.tsx src/components/HomeClient.tsx
git commit -m "feat: remove 99.8% patient satisfaction displays"
```

---

### Task 3: İngilizce'de İ→I — dinamik html lang

**Files:**
- Modify: `src/components/HomeClient.tsx` (locale state'i olan yer)
- Modify: `src/components/DoctorDetailClient.tsx` (locale prop/state'i olan yer)

**Interfaces:** Yok.

- [ ] **Step 1: HomeClient.tsx'e effect ekle**

`HomeClient` içinde `const [locale, setLocale] = useState<Locale>("tr");` altına, mevcut `useEffect` importunu kullanarak:

```tsx
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
```

`useEffect` zaten import edilmemişse `import { useState, useEffect } from "react";` olacak şekilde güncelle.

- [ ] **Step 2: DoctorDetailClient.tsx'e effect ekle**

Bileşendeki aktif `locale` değerine bağlı aynı efekti ekle (locale burada prop ise onu, state ise onu kullan):

```tsx
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
```

`useEffect` importunu gerekiyorsa ekle.

- [ ] **Step 3: Build ile doğrula**

Run: `npm run build`
Expected: Hatasız.

- [ ] **Step 4: Commit**

```bash
git add src/components/HomeClient.tsx src/components/DoctorDetailClient.tsx
git commit -m "fix: set html lang to active locale so uppercase casing is correct (İ→I in EN)"
```

---

### Task 4: Mevcut doktorları birime taşı (`doctors.ts`)

**Files:**
- Modify: `src/lib/doctors.ts` (36 doktor kaydının `specialty*` ve `category` alanları)

**Interfaces:**
- Consumes: `units` / `findUnitByTr` (Task 1) — referans amaçlı; burada elle spec eşleme tablosu uygulanır.

- [ ] **Step 1: Eşleme tablosunu uygula**

Spec'in 6. bölümündeki "Eşleme Tablosu"na göre her doktorun `specialtyTr/En/Ar/Ru/Ka` alanlarını **hedef birimin** 5 dildeki değerleriyle (Task 1'deki `units` dizisinden) değiştir ve `category`'yi birimin `type`'ı yap. İsim, bio, foto, e-posta, istatistik alanlarına dokunma.

Örnek (Doktor #1, Celal TEKİNBAŞ → "Göğüs Cerrahisi Polikliniği", surgical):

```ts
    specialtyTr: "Göğüs Cerrahisi Polikliniği",
    specialtyEn: "Thoracic Surgery",
    specialtyAr: "جراحة الصدر",
    specialtyRu: "Торакальная хирургия",
    specialtyKa: "თორაკალური ქირურგია",
    // ...
    category: "surgical",
```

Örnek (Doktor #4, Deniz AKSU ARICA → "Cildiye Polikliniği", internal):

```ts
    specialtyTr: "Cildiye Polikliniği",
    specialtyEn: "Dermatology",
    specialtyAr: "الجلدية",
    specialtyRu: "Дерматология",
    specialtyKa: "დერმატოლოგია",
    // ...
    category: "internal",
```

36 doktorun tamamı spec tablosundaki hedef birime göre bu şekilde güncellenir. `specialtyAr` alanı bazı doktorlarda opsiyoneldi (`?`) — artık birimden gelen değerle dolu olur.

- [ ] **Step 2: Doğrulama betiği — her doktor bir birime eşleşiyor mu**

Geçici doğrulama için `npm test` çalıştırılabilir olması adına aşağıdaki testi ekle (isteğe bağlı ama önerilir): `src/lib/doctors.units.test.ts`

```ts
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
});
```

- [ ] **Step 3: Testi çalıştır**

Run: `npm test -- doctors.units`
Expected: PASS. FAIL olursa hata mesajındaki doktorun `specialtyTr`'sini spec tablosundaki birim adıyla birebir eşle (yazım/boşluk farkı olmamalı).

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: Hatasız.

- [ ] **Step 5: Commit**

```bash
git add src/lib/doctors.ts src/lib/doctors.units.test.ts
git commit -m "feat: migrate existing doctors to unit categories"
```

---

### Task 5: Admin doktor formunda birim dropdown'u

**Files:**
- Modify: `src/components/admin/AdminPanel.tsx` (kategori dropdown ~680-689; uzmanlık serbest metin ~777-800; edit doldurma ~224-237)

**Interfaces:**
- Consumes: `units`, `findUnitByTr` (Task 1).

- [ ] **Step 1: Import ekle**

`AdminPanel.tsx` başındaki importlara:

```tsx
import { units, findUnitByTr } from "@/lib/units";
```

- [ ] **Step 2: "Kategori" dropdown'unu "Birim" dropdown'u yap**

`~680-689` arasındaki Kategori bloğunu şununla değiştir:

```tsx
                          <div>
                            <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1.5">Birim</label>
                            <select
                              value={docSpec.tr}
                              onChange={(e) => {
                                const u = findUnitByTr(e.target.value);
                                if (u) {
                                  setDocCategory(u.type);
                                  setDocSpec({ tr: u.tr, en: u.en, ar: u.ar, ru: u.ru, ka: u.ka });
                                }
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            >
                              <option value="" disabled>Birim seçin</option>
                              <optgroup label="Cerrahi Birimler">
                                {units.filter((u) => u.type === "surgical").map((u) => (
                                  <option key={u.tr} value={u.tr}>{u.tr}</option>
                                ))}
                              </optgroup>
                              <optgroup label="Dahili Birimler">
                                {units.filter((u) => u.type === "internal").map((u) => (
                                  <option key={u.tr} value={u.tr}>{u.tr}</option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
```

Not: `docCategory` state'i (surgical/internal) korunur; ameliyat alanı mantığı (`docCategory === "internal"` ile disable) aynen çalışır.

- [ ] **Step 3: Langs sekmesindeki serbest metin "Uzmanlık Alanı (Birim)" bölümünü kaldır**

`~776-800+` arasındaki `<h4>Uzmanlık Alanı (Birim)</h4>` başlığı ve altındaki 5 dilli `docSpec` input'larını sil (artık birim dropdown'dan otomatik doluyor). Bio dil alanları kalır. `docSpec` state'i ve `setDocSpec` hâlâ dropdown tarafından kullanıldığı için **silinmez**.

- [ ] **Step 4: Edit akışında birim seçili gelsin**

`~224` civarındaki edit doldurma kodunda `setDocCategory(doc.category);` ve `setDocSpec({...})` zaten doktorun `specialtyTr`'sini `docSpec.tr`'ye koyuyor; dropdown `value={docSpec.tr}` olduğundan eşleşen birim otomatik seçili gelir. Ek değişiklik gerekmiyorsa dokunma; `docSpec.tr` birim adıyla birebir olmalı (Task 4 sayesinde öyle).

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: Hatasız.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/AdminPanel.tsx
git commit -m "feat: select doctor unit from units dropdown in admin form"
```

---

### Task 6: Ana sayfa "Tıbbi Birimler" bölümünü units'ten besle

**Files:**
- Modify: `src/components/HomeClient.tsx` (~270-291 sabit diziler; ~460-547 render)

**Interfaces:**
- Consumes: `units`, `unitLabel` (Task 1).

- [ ] **Step 1: Import ekle, sabit dizileri kaldır**

`HomeClient.tsx` importlarına `import { units, unitLabel } from "@/lib/units";` ekle. `~270-291` arasındaki `surgicalSpecialties` ve `internalSpecialties` sabit dizilerini sil.

- [ ] **Step 2: Render'ı units'ten türet**

`~472` `surgicalSpecialties.map((spec, idx) => ...)` → `units.filter((u) => u.type === "surgical").map((spec, idx) => ...)`.
`~513` `internalSpecialties.map(...)` → `units.filter((u) => u.type === "internal").map(...)`.

Kart içindeki ad gösterimini locale-güvenli yap: `{locale === "tr" ? spec.tr : ...}` yerine `{unitLabel(spec, locale)}`. `onClick` içindeki `setSearchQuery(spec.tr)` aynen kalır.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: Hatasız.

- [ ] **Step 4: Commit**

```bash
git add src/components/HomeClient.tsx
git commit -m "feat: drive specialties section from units data"
```

---

### Task 7: Uçtan uca lokal doğrulama

**Files:** Yok (manuel test).

- [ ] **Step 1: Tam test ve build**

Run: `npm test`
Expected: Tüm testler PASS.

Run: `npm run build`
Expected: Hatasız.

- [ ] **Step 2: Dev sunucusunu başlat ve manuel kontrol**

Run: `npm run dev` (arka planda)
Kontrol listesi:
- Ana sayfa "Tıbbi Birimler": Cerrahi sekmesi 17, Dahili sekmesi 39 birim.
- Dil İngilizce → büyük harf başlıklar "I" ile (İ değil).
- Memnuniyet %99.8 hiçbir yerde yok (Hero, doktor detay, ana sayfa).
- Bir doktorun detay sayfasında birim adı ve kategori doğru.
- `/admin` (giriş sonrası) doktor ekle → Birim dropdown → seçince kategori + 5 dilli uzmanlık otomatik.

- [ ] **Step 3: Son commit (gerekiyorsa küçük düzeltmeler)**

```bash
git add -A
git commit -m "chore: final fixes after e2e verification"
```

---

## Self-Review

**Spec coverage:**
- §1 Memnuniyet kaldırma → Task 2 ✓
- §2 Dinamik lang → Task 3 ✓
- §3 Birim veri modeli (56 birim, 5 dil) → Task 1 ✓
- §4 Admin form birim dropdown → Task 5 ✓
- §5 Ana sayfa birimler → Task 6 ✓
- §6 Mevcut doktor migrasyonu → Task 4 ✓
- Test/doğrulama → Task 7 ✓

**Placeholder scan:** Task 1 units dizisi tam veriyle dolu; diğer tasklarda kod blokları mevcut. AR/RU/KA değerleri spec tablosuyla aynı. Placeholder yok.

**Type consistency:** `Unit`, `UnitType`, `units`, `findUnitByTr`, `unitLabel` isimleri Task 1'de tanımlanıp Task 4/5/6'da aynı imzayla kullanılıyor. `docSpec` şekli `{tr,en,ar,ru,ka}` admin formunda tutarlı.
