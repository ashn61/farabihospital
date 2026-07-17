# Public Site Revizyonu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Public siteden Türkçe dil seçeneğini kaldırmak, Hero üstüne haber şeridi eklemek, Hero görselini ve üç bento rozetini kaldırmak, Rusça `д-р`'yi `др` yapmak, hekimlere çoklu branş desteği getirmek ve hekim detayında Hakkında + Eğitim bölümlerini birleştirmek.

**Architecture:** Yedi bağımsız madde, riske göre sıralanmış beş faza bölündü. En büyük değişiklik çoklu branş: hekim↔birim ilişkisi metin eşleşmesinden `doctor_units` ara tablosuna taşınıyor, `doctors.category` kolonu kalkıp yerini birimlerden türetilen kategoriye bırakıyor. Dil ayrımı, paylaşılan `Navbar`'a `availableLocales` prop'u eklenerek yapılıyor.

**Tech Stack:** Next.js 16.2.9 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Supabase (postgres + RLS), framer-motion, vitest (node environment), tsx.

## Global Constraints

- **AGENTS.md:** Bu Next.js sürümü eğitim verisinden farklı olabilir. Kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili rehberi oku. Deprecation uyarılarına uy.
- **Test ortamı:** vitest `environment: "node"`, `include: ["src/**/*.test.ts"]`. Yalnızca `.ts` testleri çalışır — bileşen (`.tsx`) testi yazma. Tüm testler saf mantık üzerinde olmalı.
- **Mevcut test tabanı:** 3 dosya, 13 test, hepsi geçiyor. Hiçbir aşamada kırmızıya düşürülmeden bırakılmamalı.
- **Dil kümeleri:** Public = `["en","ar","ru","ka"]`, Admin = `["tr","en","ar","ru","ka"]`. Public varsayılan `en`, admin varsayılan `tr`.
- **Rusça kısaltma:** Kod ve DB'deki **tüm** `д-р` varyantları `др` olur. Ünvan önekleri: `Проф. др`, `Доц. др`, `Ассист. др`, `Др`.
- **Türkçe içerik silinmez:** `bio_tr`, `specialty_tr`, `units.tr` DB'de durur; admin düzenlemeye devam eder. Kalkan yalnızca public'teki dil *seçeneği*.
- **Marka renkleri:** primary `#002d62` (KTÜ lacivert), secondary `#f5a623` (altın). Mevcut `glass-panel` sınıfı ve `text-primary` / `text-secondary` yardımcıları kullanılır.
- **Migration güvenliği:** `specialty_*` ve `category` kolonları, `doctor_units` dolduruldu ve doğrulandı **denmeden** düşürülmez. Kolon düşürme en son task.
- **Commit:** Her task kendi commit'ini atar. Commit mesajları Türkçe gövde, `feat:` / `fix:` / `chore:` / `docs:` / `refactor:` öneki.

**Spec:** `docs/superpowers/specs/2026-07-17-public-site-revizyonu-design.md`

---

## Dosya Haritası

**Yeni:**

| Dosya | Sorumluluk |
|-------|-----------|
| `src/components/shared/NewsTicker.tsx` | Hero üstü kayan duyuru şeridi (client) |
| `src/lib/locale.test.ts` | Dil kümesi/fallback testleri |
| `src/lib/doctors.test.ts` | `formatDoctorName` + kategori türetme testleri |
| `scripts/migrate-doctor-units.ts` | `specialty_tr` → `doctor_units` eşlemesi (kuru çalıştırma + `--commit`) |
| `scripts/fix-ru-dr.ts` | DB `bio_ru` içindeki `д-р` → `др` (kuru çalıştırma + `--commit`) |
| `scripts/drop-legacy-doctor-columns.sql` | `specialty_*` + `category` düşürme |

**Değişen:**

| Dosya | Değişiklik |
|-------|-----------|
| `src/components/sections/Hero.tsx` | Sağ kolon görseli kalkar; şerit için üst boşluk ayarı |
| `src/components/HomeClient.tsx` | Bento rozetleri kalkar; çoklu branş filtresi; NewsTicker; public dil kümesi |
| `src/components/DoctorDetailClient.tsx` | Hakkında+Eğitim birleşir; branş çipleri; public dil kümesi |
| `src/components/shared/Navbar.tsx` | `availableLocales` prop'u; `Locale` tipi re-export'a döner |
| `src/components/admin/AdminPanel.tsx` | Kategori seçimi → birim checkbox'ları; `docSpec` kalkar; placeholder |
| `src/lib/locale.ts` | `Locale` tipinin yeni evi; `pickLocale`; dil kümesi sabitleri |
| `src/lib/units.ts` | `UnitRecord` buraya taşınır |
| `src/lib/doctors.ts` | `Doctor.units`; `doctorTypes` / `isSurgical`; `д-р` önekleri; statik dizi `unitTr` |
| `src/lib/data/mappers.ts` | `specialty_*` + `category` çıkar; `UnitRecord` re-export |
| `src/lib/data/doctors.ts` | Nested `units` select |
| `src/app/admin/actions.ts` | `saveDoctor` `doctor_units` da yazar |
| `src/lib/doctors.units.test.ts` | `unitTr` tabanlı yeniden yazılır |
| `scripts/seed.ts` | `doctor_units` seed adımı |
| `supabase/schema.sql` | `doctor_units` tablosu + RLS |
| `src/app/globals.css` | Marquee keyframes |

---

## Faz 1 — Grup A: Doğrudan silme (Task 1-3)

### Task 1: Hero görselini kaldır

**Files:**
- Modify: `src/components/sections/Hero.tsx:5` (import), `:120-133` (grid + sol kolon), `:235-271` (sağ kolon)

**Interfaces:**
- Consumes: yok
- Produces: yok (görsel değişiklik; `HeroProps` aynı kalır)

- [ ] **Step 1: Sağ kolonu sil**

`src/components/sections/Hero.tsx` içinde `{/* Right Side: High Fidelity Medical UI Mockup */}` yorumundan başlayan `<motion.div>` bloğunu, kapanış `</motion.div>` etiketine kadar (satır 235-271) tamamen sil. Bu blok şunları içeriyor: glow mesh, görsel çerçevesi, `celal_tekinbas.jpg`, gradient overlay ve "Başhekim" rozeti.

Silinecek bloğun ilk ve son satırları:

```tsx
        {/* Right Side: High Fidelity Medical UI Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          ...
        </motion.div>
```

- [ ] **Step 2: Öksüz `Users` importunu kaldır**

Satır 5'i değiştir:

```tsx
import { Users, ShieldCheck, ArrowDown } from "lucide-react";
```

şuna:

```tsx
import { ShieldCheck, ArrowDown } from "lucide-react";
```

`ShieldCheck` (rozet) ve `ArrowDown` (CTA) kullanımda kalıyor; yalnızca `Users` öksüz.

- [ ] **Step 3: Grid'i tek kolona indir ve içeriği ortala**

Satır 120'deki grid konteynerini:

```tsx
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
```

şuna değiştir:

```tsx
      <div className="max-w-3xl mx-auto px-6 flex flex-col items-center relative z-10 w-full">
```

Satır 123-129'daki sol kolonu:

```tsx
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left"
          style={{ direction: isAr ? "rtl" : "ltr" }}
        >
```

şuna değiştir:

```tsx
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col space-y-6 text-center w-full"
          style={{ direction: isAr ? "rtl" : "ltr" }}
        >
```

- [ ] **Step 4: Sol kolon içindeki `lg:*` hizalama artıklarını temizle**

`lg:justify-start`, `lg:mx-0`, `lg:text-left` artık tek kolonda anlamsız — hepsi ortalanmalı.

Rozet satırı (satır 133):
```tsx
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
```
→
```tsx
            className="flex flex-wrap items-center justify-center gap-3"
```

Açıklama paragrafı (satır 162):
```tsx
            className="text-sm sm:text-base text-neutral-500 leading-relaxed font-semibold max-w-xl mx-auto lg:mx-0"
```
→
```tsx
            className="text-sm sm:text-base text-neutral-500 leading-relaxed font-semibold max-w-xl mx-auto"
```

CTA satırı (satır 170):
```tsx
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
```
→
```tsx
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
```

İstatistik şeridi (satır 190):
```tsx
            className="grid grid-cols-2 gap-6 pt-10 border-t border-neutral-200/50"
```
→
```tsx
            className="grid grid-cols-2 gap-6 pt-10 border-t border-neutral-200/50 w-full max-w-md"
```

İstatistik hücreleri `text-left` kalır (iki kolon kendi içinde sola yaslı okunur), hover kartının `isAr` konumlandırması aynen korunur.

- [ ] **Step 5: Lint + build kontrolü**

Run: `npx eslint src/components/sections/Hero.tsx`
Expected: hata yok (öksüz import kalmadıysa)

Run: `npx tsc --noEmit`
Expected: hata yok

- [ ] **Step 6: Görsel doğrulama**

Dev sunucusu ayakta değilse: `npm run dev`

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`

Run: `curl -s http://localhost:3000/ | grep -c "celal_tekinbas.jpg"`
Expected: `0` — Hero'daki görsel gitti. (Not: hekim listesinde aynı foto hekim kartı olarak görünmeye devam eder; bu grep Hero'yu değil tüm sayfayı tarar. `0` beklentisi ancak Celal Tekinbaş hekim kartı o an filtrede değilse tutar. Kesin doğrulama için tarayıcıda Hero bölümüne bak: sağda görsel olmamalı, başlık ortalanmış olmalı.)

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: Hero'dan başhekim görselini kaldır, içeriği ortala

Sağ kolondaki görsel kartı, glow mesh ve Başhekim rozeti kaldırıldı.
12 kolonluk grid tek kolona indi; içerik max-w-3xl ile ortalandı.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Bento rozetlerini kaldır

**Files:**
- Modify: `src/components/HomeClient.tsx` — bento kart altı rozetleri ve `Sparkles` importu

**Interfaces:**
- Consumes: yok
- Produces: yok

- [ ] **Step 1: Üç rozet bloğunu sil**

`src/components/HomeClient.tsx` içinde üç blok silinecek.

Bento Card 1 (satır 368-371):
```tsx
              <div className="pt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-wider">
                <span>International Hub</span>
                <Sparkles className="h-3.5 w-3.5 ml-1 text-secondary animate-spin" />
              </div>
```

Bento Card 2 (satır 390-392):
```tsx
              <div className="pt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-wider">
                <span>Advanced Medical Tech</span>
              </div>
```

Bento Card 3 (satır 411-413):
```tsx
              <div className="pt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-wider">
                <span>Academic Guidance</span>
              </div>
```

Üçünü de tamamen sil. Kartların ikon + başlık + açıklama içeriği (`space-y-4 relative z-10` bloğu) aynen kalır.

- [ ] **Step 2: `justify-between`'i kaldır**

Rozet gidince kartın alt bloğu kalmadı; `justify-between` sarılacak ikinci çocuk olmadığı için etkisiz. Üç kartın da `className`'inden çıkar.

Üç kartta da (satır 356, 378, 399):
```tsx
              className="glass-panel border rounded-3xl p-8 flex flex-col justify-between shadow-xs relative overflow-hidden"
```
→
```tsx
              className="glass-panel border rounded-3xl p-8 flex flex-col shadow-xs relative overflow-hidden"
```

- [ ] **Step 3: Öksüz `Sparkles` importunu kaldır**

`Sparkles` yalnızca Card 1 rozetinde kullanılıyordu. `src/components/HomeClient.tsx` import satırından çıkar.

Önce kullanım kalmadığını doğrula:

Run: `grep -n "Sparkles" src/components/HomeClient.tsx`
Expected: yalnızca import satırı çıkmalı; başka kullanım yoksa importtan sil.

- [ ] **Step 4: Lint + tip kontrolü**

Run: `npx eslint src/components/HomeClient.tsx`
Expected: hata yok

Run: `npx tsc --noEmit`
Expected: hata yok

- [ ] **Step 5: Doğrulama**

Run: `curl -s http://localhost:3000/ | grep -cE "International Hub|Advanced Medical Tech|Academic Guidance"`
Expected: `0`

- [ ] **Step 6: Commit**

```bash
git add src/components/HomeClient.tsx
git commit -m "feat: bento kartlarından International Hub/Advanced Medical Tech/Academic Guidance rozetlerini kaldır

Kartların ikon, başlık ve açıklama içeriği korundu. Öksüz kalan
Sparkles importu ve etkisiz kalan justify-between temizlendi.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Hakkında + Eğitim bölümlerini birleştir

**Files:**
- Modify: `src/components/DoctorDetailClient.tsx:31,47,63,79,95` (çeviri anahtarı), `:230-253` (render)

**Interfaces:**
- Consumes: yok
- Produces: yok (`Doctor` tipi değişmez; `docEducation` hesabı korunur)

- [ ] **Step 1: `educationTitle` anahtarını beş dilden de sil**

`src/components/DoctorDetailClient.tsx` içindeki `translations` nesnesinden şu satırları sil:

- Satır 31: `educationTitle: "Eğitim & Tıbbi Uzmanlık",`
- Satır 47: `educationTitle: "Education & Credentials",`
- Satır 63: `educationTitle: "التعليم والخبرة الطبية",`
- Satır 79: `educationTitle: "Образование и квалификация",`
- Satır 95: `educationTitle: "განათლება და კვალიფიკაცია",`

`aboutDoc` anahtarı beş dilde de kalır — birleşik bölümün başlığı o.

- [ ] **Step 2: İki bölümü tek bloğa birleştir**

Satır 230-253 arasındaki iki ayrı bloğu:

```tsx
            {/* Biography content card */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-2">
                {t.aboutDoc}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                {docBio}
              </p>
            </div>

            {/* Education credentials */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-2">
                {t.educationTitle}
              </h3>
              <ul className="space-y-3">
                {docEducation.map((edu, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm font-semibold text-neutral-600">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
```

şununla değiştir:

```tsx
            {/* Biography + education, tek başlık altında */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-primary uppercase tracking-wider border-b border-slate-100 pb-2">
                {t.aboutDoc}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                {docBio}
              </p>
              {docEducation.length > 0 && (
                <ul className="space-y-3 pt-1">
                  {docEducation.map((edu, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm font-semibold text-neutral-600">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
```

`docEducation.length > 0` koruması yeni: eğitim maddesi olmayan hekimde boş `<ul>` render edilmesin.

- [ ] **Step 3: Tip kontrolü**

Run: `npx tsc --noEmit`
Expected: hata yok. (`educationTitle` silindiği için, hâlâ referans veren yer kalmışsa burada patlar.)

- [ ] **Step 4: Doğrulama**

Bir hekim id'si al:

Run: `curl -s http://localhost:3000/ | grep -oE 'href="/doctors/[^"]*"' | head -1`

Dönen id ile detay sayfasını aç ve "Eğitim & Tıbbi Uzmanlık" başlığının gitmiş, eğitim maddelerinin "Hekim Hakkında" altında duruyor olduğunu doğrula.

Run: `curl -s "http://localhost:3000/doctors/<ID>" | grep -c "Eğitim & Tıbbi Uzmanlık"`
Expected: `0`

- [ ] **Step 5: Commit**

```bash
git add src/components/DoctorDetailClient.tsx
git commit -m "feat: hekim detayında Hakkında ve Eğitim bölümlerini birleştir

Ayrı 'Eğitim & Tıbbi Uzmanlık' başlığı kaldırıldı; eğitim maddeleri
'Hekim Hakkında' bloğunda biyografinin altına taşındı. educationTitle
çeviri anahtarı beş dilden de silindi. Veri ve admin alanları değişmedi.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Faz 2 — Rusça `д-р` → `др` (Task 4-5)

### Task 4: Kod tarafındaki `д-р` varyantları

**Files:**
- Create: `src/lib/doctors.test.ts`
- Modify: `src/lib/doctors.ts:51,57,68,74` (ünvan önekleri) + `bioRu` alanları (~25 satır)
- Modify: `src/components/admin/AdminPanel.tsx:897` (placeholder)

**Interfaces:**
- Consumes: `formatDoctorName(name: string, title: string, locale: string): string` (mevcut, `src/lib/doctors.ts`)
- Produces: yok (davranış düzeltmesi)

- [ ] **Step 1: Başarısız testi yaz**

`src/lib/doctors.test.ts` oluştur:

```ts
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
```

- [ ] **Step 2: Testi çalıştır, kırmızı olduğunu gör**

Run: `npx vitest run src/lib/doctors.test.ts`
Expected: FAIL — üç test de kırmızı. İlk test `Проф. д-р Ahmet YILMAZ` üretip `д-р` içerdiği için düşer.

- [ ] **Step 3: Ünvan öneklerini düzelt**

`src/lib/doctors.ts` içinde `formatDoctorName` fonksiyonunda dört satır:

| Satır | Eski | Yeni |
|-------|------|------|
| 51 | `else if (locale === "ru") translatedTitle = "Проф. д-р";` | `else if (locale === "ru") translatedTitle = "Проф. др";` |
| 57 | `else if (locale === "ru") translatedTitle = "Доц. д-р";` | `else if (locale === "ru") translatedTitle = "Доц. др";` |
| 68 | `else if (locale === "ru") translatedTitle = "Ассист. д-р";` | `else if (locale === "ru") translatedTitle = "Ассист. др";` |
| 74 | `else if (locale === "ru") translatedTitle = "Д-р";` | `else if (locale === "ru") translatedTitle = "Др";` |

- [ ] **Step 4: Statik `bioRu` metinlerini düzelt**

`src/lib/doctors.ts` içindeki `doctorsData` dizisinde `bioRu` alanlarında geçen `Профессор д-р` → `Профессор др`.

Toplu değişim (Git Bash):

```bash
sed -i 's/д-р/др/g; s/Д-р/Др/g' src/lib/doctors.ts
```

`sed` hem ünvan öneklerini hem `bioRu` metinlerini birlikte hallediyor; Step 3'ü elle yaptıysan bu komut kalanları tamamlar. Sonra doğrula:

Run: `grep -c "д-р" src/lib/doctors.ts`
Expected: `0`

Run: `grep -n "Проф. др\|Доц. др\|Ассист. др\|\"Др\"" src/lib/doctors.ts`
Expected: dört ünvan satırı da görünmeli.

- [ ] **Step 5: Testi çalıştır, yeşil olduğunu gör**

Run: `npx vitest run src/lib/doctors.test.ts`
Expected: PASS — 3 test

Run: `npx vitest run`
Expected: PASS — mevcut 13 test + 3 yeni

- [ ] **Step 6: Admin placeholder'ını düzelt**

`src/components/admin/AdminPanel.tsx:897`:

```tsx
placeholder="Профессор д-р Джелал..."
```
→
```tsx
placeholder="Профессор др Джелал..."
```

- [ ] **Step 7: Kodda `д-р` kalmadığını doğrula**

Run: `grep -rni "д-р" src/ scripts/`
Expected: çıktı yok

- [ ] **Step 8: Commit**

```bash
git add src/lib/doctors.ts src/lib/doctors.test.ts src/components/admin/AdminPanel.tsx
git commit -m "fix: Rusça 'д-р' kısaltmasını 'др' yap

formatDoctorName'deki dört ünvan öneki (Проф./Доц./Ассист./tekil),
statik doctorsData'daki bioRu metinleri ve admin placeholder'ı
güncellendi. Regresyon testi eklendi.

DB'deki bio_ru metinleri ayrı bir task'ta güncelleniyor.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: DB `bio_ru` metinlerindeki `д-р`

**Files:**
- Create: `scripts/fix-ru-dr.ts`
- Modify: `package.json` (script kaydı)

**Interfaces:**
- Consumes: `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Produces: yok (veri düzeltmesi)

**Bağlam:** Canlı DB'de 37 hekim var; 17'sinin `bio_ru` metni `Профессор д-р ...` içeriyor. Task 4'teki kod değişikliği bunlara dokunmaz.

- [ ] **Step 1: Script'i yaz**

`scripts/fix-ru-dr.ts` oluştur:

```ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const COMMIT = process.argv.includes("--commit");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/** Rusça doktor kısaltmasını normalize eder: д-р → др, Д-р → Др. */
export function fixRuDr(text: string): string {
  return text.replace(/д-р/g, "др").replace(/Д-р/g, "Др");
}

async function main() {
  const { data, error } = await supabase.from("doctors").select("id,name,bio_ru");
  if (error) throw new Error(`fetch failed: ${error.message}`);

  const affected = data.filter((d) => /[дД]-р/.test(d.bio_ru ?? ""));

  console.log(`Toplam hekim: ${data.length}`);
  console.log(`bio_ru içinde 'д-р' geçen: ${affected.length}\n`);

  for (const d of affected) {
    const before = d.bio_ru as string;
    const after = fixRuDr(before);
    console.log(`  ${d.id} ${d.name}`);
    console.log(`    - ${before.slice(0, 70)}`);
    console.log(`    + ${after.slice(0, 70)}\n`);
  }

  if (!COMMIT) {
    console.log("KURU ÇALIŞTIRMA — hiçbir şey yazılmadı.");
    console.log("Yazmak için: npm run fix:ru-dr -- --commit");
    return;
  }

  for (const d of affected) {
    const { error: upErr } = await supabase
      .from("doctors")
      .update({ bio_ru: fixRuDr(d.bio_ru as string) })
      .eq("id", d.id);
    if (upErr) throw new Error(`update ${d.id} failed: ${upErr.message}`);
  }
  console.log(`${affected.length} hekim güncellendi.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: `package.json`'a script ekle**

`scripts` bloğuna ekle:

```json
    "fix:ru-dr": "tsx scripts/fix-ru-dr.ts",
```

- [ ] **Step 3: Kuru çalıştır**

Run: `npm run fix:ru-dr`
Expected: `Toplam hekim: 37`, `bio_ru içinde 'д-р' geçen: 17`, 17 hekim için önce/sonra satırları ve `KURU ÇALIŞTIRMA — hiçbir şey yazılmadı.`

Çıktıdaki `+` satırlarında `др` göründüğünü, `-` satırlarında `д-р` olduğunu gözle doğrula.

- [ ] **Step 4: Yaz**

Run: `npm run fix:ru-dr -- --commit`
Expected: `17 hekim güncellendi.`

- [ ] **Step 5: DB'de kalmadığını doğrula**

Run: `npm run fix:ru-dr`
Expected: `bio_ru içinde 'д-р' geçen: 0`

- [ ] **Step 6: Sitede doğrula**

Rusça hekim detay sayfasına bak (tarayıcıda dil `RU` seç). Biyografide `Профессор др ...` görünmeli, `д-р` görünmemeli.

- [ ] **Step 7: Commit**

```bash
git add scripts/fix-ru-dr.ts package.json
git commit -m "chore: DB bio_ru metinlerindeki 'д-р' → 'др' script'i

37 hekimin 17'sinin bio_ru metni 'Профессор д-р ...' içeriyordu.
Kuru çalıştırma varsayılan; yazma --commit ile.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Faz 3 — Dil ayrımı (Task 6-7)

### Task 6: `locale.ts` — dil kümeleri ve saf seçim mantığı

**Files:**
- Create: `src/lib/locale.test.ts`
- Modify: `src/lib/locale.ts` (tamamı), `src/components/shared/Navbar.tsx:8` (tip re-export'a döner)

**Interfaces:**
- Consumes: yok
- Produces:
  - `type Locale = "tr" | "en" | "ar" | "ru" | "ka"` (artık `src/lib/locale.ts`'te tanımlı)
  - `const ALL_LOCALES: readonly Locale[]` — `["tr","en","ar","ru","ka"]`
  - `const PUBLIC_LOCALES: readonly Locale[]` — `["en","ar","ru","ka"]`
  - `pickLocale(value: string | null, allowed: readonly Locale[]): Locale | null`
  - `readStoredLocale(allowed?: readonly Locale[]): Locale | null` — varsayılan `ALL_LOCALES`
  - `storeLocale(locale: Locale): void` (imza değişmedi)

**Neden `Locale` taşınıyor:** Şu an `Locale` `Navbar.tsx`'te tanımlı ve `locale.ts` oradan import ediyor. Paylaşılan bir tipin bir bileşende yaşaması ters bağımlılık; ayrıca node ortamındaki vitest testinin bir `.tsx` bileşenine dokunmasını istemiyoruz. Tip `locale.ts`'e taşınıp `Navbar` re-export ediyor — böylece mevcut ~8 `import { Locale } from "@/components/shared/Navbar"` satırı olduğu gibi çalışmaya devam ediyor.

- [ ] **Step 1: Başarısız testi yaz**

`src/lib/locale.test.ts` oluştur:

```ts
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
```

- [ ] **Step 2: Testi çalıştır, kırmızı olduğunu gör**

Run: `npx vitest run src/lib/locale.test.ts`
Expected: FAIL — `pickLocale`, `ALL_LOCALES`, `PUBLIC_LOCALES` export edilmiyor.

- [ ] **Step 3: `locale.ts`'i yeniden yaz**

`src/lib/locale.ts` içeriğini tamamen şununla değiştir:

```ts
export type Locale = "tr" | "en" | "ar" | "ru" | "ka";

const STORAGE_KEY = "farabi_locale";

/** Admin panelinin sunduğu diller — Türkçe dahil. */
export const ALL_LOCALES: readonly Locale[] = ["tr", "en", "ar", "ru", "ka"];

/** Public sitenin sunduğu diller — Türkçe yok. */
export const PUBLIC_LOCALES: readonly Locale[] = ["en", "ar", "ru", "ka"];

/**
 * Saf seçim: `value` verilen kümede geçerli bir dil mi?
 * Değilse null — çağıran kendi varsayılanına düşer.
 */
export function pickLocale(value: string | null, allowed: readonly Locale[]): Locale | null {
  if (!value) return null;
  return (allowed as readonly string[]).includes(value) ? (value as Locale) : null;
}

/** Kayıtlı dili oku; verilen kümede değilse null. */
export function readStoredLocale(allowed: readonly Locale[] = ALL_LOCALES): Locale | null {
  if (typeof window === "undefined") return null;
  return pickLocale(window.localStorage.getItem(STORAGE_KEY), allowed);
}

/** Seçilen dili kalıcılaştır — gezinme ve yenilemede korunur. */
export function storeLocale(locale: Locale): void {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, locale);
}
```

- [ ] **Step 4: `Navbar`'ı tip re-export'a çevir**

`src/components/shared/Navbar.tsx:8`:

```tsx
export type Locale = "tr" | "en" | "ar" | "ru" | "ka";
```
→
```tsx
export type { Locale } from "@/lib/locale";
```

`Navbar.tsx` gövdesinde `Locale` tipini kendi kullandığı için ayrıca değer importu gerekir. Dosyanın import bloğuna ekle:

```tsx
import type { Locale } from "@/lib/locale";
```

- [ ] **Step 5: Testi çalıştır, yeşil olduğunu gör**

Run: `npx vitest run src/lib/locale.test.ts`
Expected: PASS — 8 test

- [ ] **Step 6: Tip kontrolü — mevcut importlar bozulmadı mı**

Run: `npx tsc --noEmit`
Expected: hata yok. `import { Locale } from "@/components/shared/Navbar"` yapan tüm dosyalar (HomeClient, DoctorDetailClient, AdminPanel, Hero, Footer, ChatWidget, SymptomChecker) re-export sayesinde çalışmaya devam etmeli.

Run: `npx vitest run`
Expected: PASS — hepsi

- [ ] **Step 7: Commit**

```bash
git add src/lib/locale.ts src/lib/locale.test.ts src/components/shared/Navbar.tsx
git commit -m "refactor: Locale tipini locale.ts'e taşı, dil kümesi sabitlerini ekle

Locale artık Navbar yerine lib/locale.ts'te tanımlı; Navbar re-export
ediyor, mevcut importlar bozulmuyor. ALL_LOCALES/PUBLIC_LOCALES
sabitleri ve saf pickLocale eklendi. readStoredLocale artık izin
verilen küme alıyor.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Public'ten Türkçe'yi kaldır, admin'de bırak

**Files:**
- Modify: `src/components/shared/Navbar.tsx` (prop + dil menüsü)
- Modify: `src/components/HomeClient.tsx:277,281,331-334`
- Modify: `src/components/DoctorDetailClient.tsx:104,108,122-125,169-172`
- Modify: `src/components/admin/AdminPanel.tsx:477`

**Interfaces:**
- Consumes: `ALL_LOCALES`, `PUBLIC_LOCALES`, `readStoredLocale(allowed)` (Task 6)
- Produces: `NavbarProps.availableLocales?: readonly Locale[]` — varsayılan `ALL_LOCALES`

- [ ] **Step 1: Navbar'a dil adı tablosu ve prop ekle**

`src/components/shared/Navbar.tsx` — `translations` nesnesinden **sonra**, `NavbarProps`'tan **önce** ekle:

```tsx
/** Dil seçicide görünen adlar. Tek kaynak — masaüstü menüsü ve mobil drawer ikisi de bunu kullanır. */
const LOCALE_LABELS: Record<Locale, string> = {
  tr: "Türkçe (TR)",
  en: "English (EN)",
  ar: "العربية (AR)",
  ru: "Русский (RU)",
  ka: "ქართული (KA)",
};
```

`NavbarProps`'u güncelle:

```tsx
interface NavbarProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  /** Bu bağlamda sunulacak diller. Varsayılan: beş dil (admin). Public `PUBLIC_LOCALES` geçer. */
  availableLocales?: readonly Locale[];
}
```

Bileşen imzasını güncelle:

```tsx
export default function Navbar({ currentLocale, onLocaleChange, availableLocales = ALL_LOCALES }: NavbarProps) {
```

Import bloğuna ekle:

```tsx
import { ALL_LOCALES, type Locale } from "@/lib/locale";
```

(Task 6'da eklenen `import type { Locale }` satırını bununla birleştir; `export type { Locale } from "@/lib/locale";` satırı kalır.)

- [ ] **Step 2: Masaüstü dil menüsünü prop'tan türet**

Satır 148-181'deki elle yazılmış beş butonu:

```tsx
            <div className="absolute right-0 top-full pt-1 w-36 hidden group-hover:block transition-all z-50">
              <div className="glass-panel border rounded-xl overflow-hidden shadow-xl">
                <button
                  onClick={() => onLocaleChange("tr")}
                  ...
                >
                  Türkçe (TR)
                </button>
                ... (dört buton daha)
              </div>
            </div>
```

şununla değiştir:

```tsx
            <div className="absolute right-0 top-full pt-1 w-36 hidden group-hover:block transition-all z-50">
              <div className="glass-panel border rounded-xl overflow-hidden shadow-xl">
                {availableLocales.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLocaleChange(lang)}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-105 hover:text-primary cursor-pointer"
                  >
                    {LOCALE_LABELS[lang]}
                  </button>
                ))}
              </div>
            </div>
```

- [ ] **Step 3: Mobil drawer'daki sabit diziyi prop'tan türet**

Satır 227:

```tsx
                  {(["tr", "en", "ar", "ru", "ka"] as const).map((lang) => (
```
→
```tsx
                  {availableLocales.map((lang) => (
```

- [ ] **Step 4: `HomeClient`'ı public kümesine geçir**

`src/components/HomeClient.tsx`:

Import satırını (satır 28) güncelle:
```tsx
import { readStoredLocale, storeLocale } from "@/lib/locale";
```
→
```tsx
import { readStoredLocale, storeLocale, PUBLIC_LOCALES } from "@/lib/locale";
```

Varsayılan dili (satır 277):
```tsx
  const [locale, setLocale] = useState<Locale>("tr");
```
→
```tsx
  const [locale, setLocale] = useState<Locale>("en");
```

Kayıtlı dil okumasını (satır 280-283):
```tsx
  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocale(stored);
  }, []);
```
→
```tsx
  useEffect(() => {
    const stored = readStoredLocale(PUBLIC_LOCALES);
    if (stored) setLocale(stored);
  }, []);
```

Navbar çağrısını (satır 331-334):
```tsx
      <Navbar
        currentLocale={locale}
        onLocaleChange={(l) => { setLocale(l); storeLocale(l); }}
      />
```
→
```tsx
      <Navbar
        currentLocale={locale}
        onLocaleChange={(l) => { setLocale(l); storeLocale(l); }}
        availableLocales={PUBLIC_LOCALES}
      />
```

- [ ] **Step 5: `DoctorDetailClient`'ı public kümesine geçir**

`src/components/DoctorDetailClient.tsx`:

Import (satır 18):
```tsx
import { readStoredLocale, storeLocale } from "@/lib/locale";
```
→
```tsx
import { readStoredLocale, storeLocale, PUBLIC_LOCALES } from "@/lib/locale";
```

Varsayılan (satır 104):
```tsx
  const [locale, setLocale] = useState<Locale>("tr");
```
→
```tsx
  const [locale, setLocale] = useState<Locale>("en");
```

Kayıtlı okuma (satır 107-110):
```tsx
  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocale(stored);
  }, []);
```
→
```tsx
  useEffect(() => {
    const stored = readStoredLocale(PUBLIC_LOCALES);
    if (stored) setLocale(stored);
  }, []);
```

**İki** Navbar çağrısı var — biri "hekim bulunamadı" dalında (satır 122-125), biri ana render'da (satır 169-172). İkisine de `availableLocales={PUBLIC_LOCALES}` ekle:

```tsx
        <Navbar
          currentLocale={locale}
          onLocaleChange={(l) => { setLocale(l); storeLocale(l); }}
          availableLocales={PUBLIC_LOCALES}
        />
```

- [ ] **Step 6: Admin'in beş dilde kaldığını doğrula**

`src/components/admin/AdminPanel.tsx:477` **değişmiyor**:

```tsx
      <Navbar currentLocale={locale} onLocaleChange={(l) => setLocale(l)} />
```

`availableLocales` geçilmediği için varsayılan `ALL_LOCALES` devreye girer — admin beş dili görür, açılış `tr` kalır. Ayrıca admin `storeLocale` çağırmıyor, yani admin'de Türkçe seçmek public'e sızmaz.

Bunu doğrula:

Run: `grep -n "storeLocale" src/components/admin/AdminPanel.tsx`
Expected: çıktı yok — admin dil seçimini kalıcılaştırmıyor.

- [ ] **Step 7: Tip + test kontrolü**

Run: `npx tsc --noEmit`
Expected: hata yok

Run: `npx vitest run`
Expected: PASS — hepsi

Run: `npx eslint src/components/shared/Navbar.tsx src/components/HomeClient.tsx src/components/DoctorDetailClient.tsx`
Expected: hata yok

- [ ] **Step 8: Doğrulama**

Run: `curl -s http://localhost:3000/ | grep -c "Türkçe (TR)"`
Expected: `0` — public'te Türkçe seçeneği yok

Run: `curl -s http://localhost:3000/ | grep -c "English (EN)"`
Expected: `1` veya daha fazla

Tarayıcıda elle:
1. `localStorage.setItem("farabi_locale","tr")` yaz, ana sayfayı yenile → site English açılmalı, dil menüsünde Türkçe olmamalı.
2. `/admin`'e giriş yap → dil menüsünde Türkçe **olmalı**, panel Türkçe açılmalı.

- [ ] **Step 9: Commit**

```bash
git add src/components/shared/Navbar.tsx src/components/HomeClient.tsx src/components/DoctorDetailClient.tsx
git commit -m "feat: public siteden Türkçe dil seçeneğini kaldır, admin'de bırak

Navbar'a availableLocales prop'u eklendi (varsayılan: beş dil).
HomeClient ve DoctorDetailClient PUBLIC_LOCALES geçiyor ve 'en'
varsayılanıyla açılıyor; tarayıcısında 'tr' kayıtlı ziyaretçi 'en'e
düşüyor. AdminPanel prop geçmediği için beş dilde kalıyor.

Dil menüsündeki elle yazılmış beş buton LOCALE_LABELS tablosundan
türetiliyor.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Faz 4 — Çoklu branş (Task 8-15)

### Task 8: `UnitRecord`'u `units.ts`'e taşı

**Files:**
- Modify: `src/lib/units.ts` (tip eklenir), `src/lib/data/mappers.ts:54-55` (tip çıkar, re-export gelir)

**Interfaces:**
- Consumes: `Unit`, `UnitType` (mevcut, `src/lib/units.ts`)
- Produces: `type UnitRecord = Unit & { id: string }` — artık `src/lib/units.ts`'te

**Neden:** Sonraki task'ta `Doctor.units: UnitRecord[]` olacak. `UnitRecord` şu an `mappers.ts`'te ve `mappers.ts` zaten `doctors.ts`'ten `Doctor`'ı import ediyor — `doctors.ts` de `mappers.ts`'ten import ederse döngüsel bağımlılık doğar. `UnitRecord` kavramsal olarak `Unit`'in yanına ait.

- [ ] **Step 1: `units.ts`'e tipi ekle**

`src/lib/units.ts` — `Unit` arayüzünün hemen altına ekle:

```ts
/** DB'den yüklenmiş bir birim — statik Unit şekli artı satır id'si. */
export type UnitRecord = Unit & { id: string };
```

- [ ] **Step 2: `mappers.ts`'i re-export'a çevir**

`src/lib/data/mappers.ts:54-55`:

```ts
/** A unit as loaded from the DB — the static Unit shape plus its row id. */
export type UnitRecord = Unit & { id: string };
```
→
```ts
export type { UnitRecord } from "@/lib/units";
```

`mappers.ts`'in üstündeki `import type { Unit } from "@/lib/units";` satırı `rowToUnitRecord`'un dönüş tipi için hâlâ gerekli mi kontrol et — `rowToUnitRecord` `UnitRecord` döndürüyor, `Unit`'i doğrudan kullanmıyorsa importu `UnitRecord`'a çevir:

```ts
import type { UnitRecord } from "@/lib/units";
```

- [ ] **Step 3: Tip + test kontrolü**

Run: `npx tsc --noEmit`
Expected: hata yok. `UnitRecord`'u `mappers`'tan import eden dosyalar (`data/units.ts`, `AdminPanel.tsx`) re-export sayesinde çalışmaya devam etmeli.

Run: `npx vitest run`
Expected: PASS — hepsi

- [ ] **Step 4: Commit**

```bash
git add src/lib/units.ts src/lib/data/mappers.ts
git commit -m "refactor: UnitRecord tipini units.ts'e taşı

Doctor.units: UnitRecord[] değişikliği doctors.ts → mappers.ts →
doctors.ts döngüsel importu doğuracaktı. UnitRecord kavramsal olarak
Unit'in yanına ait; mappers.ts re-export ediyor.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: `doctor_units` şeması + kuru migration

**Files:**
- Modify: `supabase/schema.sql`
- Create: `scripts/migrate-doctor-units.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Produces: `public.doctor_units` tablosu — `(doctor_id text, unit_id uuid)`, bileşik PK

- [ ] **Step 1: Şemayı ekle**

`supabase/schema.sql` — `units` tablosu tanımından **sonra**, RLS bloğundan **önce** ekle:

```sql
-- Doctor ↔ Unit (çoklu branş) -----------------------------------------
create table if not exists public.doctor_units (
  doctor_id   text not null references public.doctors(id) on delete cascade,
  unit_id     uuid not null references public.units(id)   on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (doctor_id, unit_id)
);
```

RLS bloğuna ekle (`alter table` satırlarının yanına):

```sql
alter table public.doctor_units enable row level security;
```

Policy bloğuna ekle:

```sql
drop policy if exists "public read doctor_units" on public.doctor_units;
create policy "public read doctor_units" on public.doctor_units for select using (true);
```

Desen mevcut tablolarla aynı: public read, yazma yalnızca service role (RLS'i bypass eder).

- [ ] **Step 2: Tabloyu Supabase'de oluştur**

Supabase SQL Editor'de Step 1'deki üç bloğu çalıştır. (Mevcut `scripts/create-units-table.ts` deseni izlenerek bir script de yazılabilir, ancak tek seferlik DDL için SQL Editor yeterli.)

- [ ] **Step 3: Migration script'ini yaz**

`scripts/migrate-doctor-units.ts` oluştur:

```ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const COMMIT = process.argv.includes("--commit");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function main() {
  const { data: doctors, error: docErr } = await supabase
    .from("doctors")
    .select("id,name,specialty_tr,category");
  if (docErr) throw new Error(`fetch doctors failed: ${docErr.message}`);

  const { data: units, error: unitErr } = await supabase
    .from("units")
    .select("id,tr,type");
  if (unitErr) throw new Error(`fetch units failed: ${unitErr.message}`);

  const byTr = new Map(units.map((u) => [u.tr as string, u]));

  const matched: { doctor_id: string; unit_id: string }[] = [];
  const unmatched: typeof doctors = [];
  const typeMismatch: string[] = [];

  for (const d of doctors) {
    const unit = byTr.get(d.specialty_tr as string);
    if (!unit) {
      unmatched.push(d);
      continue;
    }
    matched.push({ doctor_id: d.id as string, unit_id: unit.id as string });
    if (unit.type !== d.category) {
      typeMismatch.push(`${d.name}: doctor.category=${d.category} unit.type=${unit.type}`);
    }
  }

  console.log(`Hekim: ${doctors.length} | Birim: ${units.length}`);
  console.log(`Eşleşen: ${matched.length}`);
  console.log(`Eşleşmeyen: ${unmatched.length}`);
  unmatched.forEach((d) => console.log(`  ✗ ${d.id} ${d.name} | "${d.specialty_tr}"`));
  console.log(`category ≠ unit.type: ${typeMismatch.length}`);
  typeMismatch.forEach((m) => console.log(`  ! ${m}`));

  if (unmatched.length > 0) {
    console.error("\nEşleşmeyen hekim var — migration durduruldu.");
    console.error("Eksik birimi units'e ekle ya da hekimin specialty_tr'sini düzelt.");
    process.exit(1);
  }

  if (!COMMIT) {
    console.log("\nKURU ÇALIŞTIRMA — hiçbir şey yazılmadı.");
    console.log("Yazmak için: npm run migrate:doctor-units -- --commit");
    return;
  }

  const { error: insErr } = await supabase
    .from("doctor_units")
    .upsert(matched, { onConflict: "doctor_id,unit_id" });
  if (insErr) throw new Error(`insert doctor_units failed: ${insErr.message}`);

  console.log(`\n${matched.length} doctor_units satırı yazıldı.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Script eşleşmeyen varsa **yazmayı reddediyor** — sessizce branşsız hekim bırakmıyor.

- [ ] **Step 4: `package.json`'a script ekle**

```json
    "migrate:doctor-units": "tsx scripts/migrate-doctor-units.ts",
```

- [ ] **Step 5: Kuru çalıştır**

Run: `npm run migrate:doctor-units`
Expected:
```
Hekim: 37 | Birim: 56
Eşleşen: 37
Eşleşmeyen: 0
category ≠ unit.type: 0

KURU ÇALIŞTIRMA — hiçbir şey yazılmadı.
```

`Eşleşmeyen` sıfır değilse **devam etme** — listelenen hekimlerin birimlerini `units`'e ekle ya da `specialty_tr` değerlerini düzelt, sonra tekrar çalıştır.

- [ ] **Step 6: Commit**

```bash
git add supabase/schema.sql scripts/migrate-doctor-units.ts package.json
git commit -m "chore: doctor_units şeması ve kuru migration script'i

Hekim↔birim çoklu ilişkisi için ara tablo. Migration specialty_tr'yi
units.tr ile eşleştiriyor; eşleşmeyen varsa yazmayı reddediyor.
Henüz veri yazılmadı.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Migration'ı çalıştır

**Files:** yok (veri işlemi)

**Interfaces:**
- Consumes: `scripts/migrate-doctor-units.ts` (Task 9)
- Produces: dolu `public.doctor_units` tablosu — 37 satır

- [ ] **Step 1: Kuru çalıştırmayı son kez doğrula**

Run: `npm run migrate:doctor-units`
Expected: `Eşleşmeyen: 0`

Sıfır değilse dur ve düzelt.

- [ ] **Step 2: Yaz**

Run: `npm run migrate:doctor-units -- --commit`
Expected: `37 doctor_units satırı yazıldı.`

- [ ] **Step 3: DB'de doğrula**

Supabase SQL Editor'de:

```sql
select count(*) from public.doctor_units;
-- beklenen: 37

select d.name, u.tr, u.type
from public.doctor_units du
join public.doctors d on d.id = du.doctor_id
join public.units   u on u.id = du.unit_id
order by d.name
limit 10;
-- her hekimin bir birimi olmalı; type'lar doctors.category ile aynı
```

Ayrıca hiçbir hekimin dışarıda kalmadığını doğrula:

```sql
select d.id, d.name
from public.doctors d
left join public.doctor_units du on du.doctor_id = d.id
where du.doctor_id is null;
-- beklenen: 0 satır
```

- [ ] **Step 4: Commit yok**

Bu task kod değiştirmiyor, yalnızca veri yazıyor. Commit atılmaz.

---

### Task 11: Tipler, mapper'lar ve veri katmanı

**Files:**
- Modify: `src/lib/doctors.ts` (`Doctor` arayüzü, `doctorTypes`, `isSurgical`, statik dizi)
- Modify: `src/lib/data/mappers.ts` (`DoctorRow`, `rowToDoctor`, `doctorToRow`)
- Modify: `src/lib/data/doctors.ts` (nested select)
- Modify: `src/lib/doctors.units.test.ts` (yeniden yazılır)
- Modify: `src/lib/doctors.test.ts` (kategori testleri eklenir)

**Interfaces:**
- Consumes: `UnitRecord`, `UnitType` (`src/lib/units.ts`, Task 8)
- Produces:
  - `interface Doctor` — `specialtyTr/En/Ar/Ru/Ka` ve `category` yerine `units: UnitRecord[]`
  - `type DoctorSeed = Omit<Doctor, "units"> & { unitTr: string[] }` — statik dizi/seed girdi tipi
  - `doctorTypes(doc: Doctor): Set<UnitType>`
  - `isSurgical(doc: Doctor): boolean`
  - `rowToDoctor(row: DoctorRow): Doctor` — `row.doctor_units` nested birimlerini eşler
  - `doctorToRow(doc: Doctor, sortOrder?: number): DoctorRow` — yalnızca `doctors` satırı; birimler çağıranın işi

- [ ] **Step 1: Başarısız testleri yaz**

`src/lib/doctors.test.ts`'e ekle (Task 4'teki `describe` bloklarının altına):

```ts
import { doctorTypes, isSurgical, type Doctor } from "./doctors";
import type { UnitRecord } from "./units";

const surgicalUnit: UnitRecord = {
  id: "u1", tr: "Göğüs Cerrahisi Polikliniği", en: "Thoracic Surgery",
  ar: "جراحة الصدر", ru: "Торакальная хирургия", ka: "თორაკალური ქირურგია",
  type: "surgical",
};
const internalUnit: UnitRecord = {
  id: "u2", tr: "Onkoloji Polikliniği", en: "Oncology",
  ar: "الأورام", ru: "Онкология", ka: "ონკოლოგია",
  type: "internal",
};

function makeDoctor(units: UnitRecord[]): Doctor {
  return {
    id: "x1", name: "Prof. Dr. Test HEKİM", title: "Prof. Dr.", image: "/x.jpg",
    units,
    stats: { patients: 100, experience: 10, surgeries: 5 },
    email: "t@ktu.edu.tr",
    educationTr: [], educationEn: [],
    bioTr: "", bioEn: "", bioRu: "", bioKa: "",
  };
}

describe("kategori birimlerden türer", () => {
  it("tek cerrahi birimi olan hekim yalnızca surgical", () => {
    const types = doctorTypes(makeDoctor([surgicalUnit]));
    expect([...types]).toEqual(["surgical"]);
    expect(isSurgical(makeDoctor([surgicalUnit]))).toBe(true);
  });

  it("tek dahili birimi olan hekim yalnızca internal", () => {
    const types = doctorTypes(makeDoctor([internalUnit]));
    expect([...types]).toEqual(["internal"]);
    expect(isSurgical(makeDoctor([internalUnit]))).toBe(false);
  });

  it("cerrahi + dahili birimi olan hekim iki tipte de görünür", () => {
    const doc = makeDoctor([surgicalUnit, internalUnit]);
    const types = doctorTypes(doc);
    expect(types.has("surgical")).toBe(true);
    expect(types.has("internal")).toBe(true);
    expect(isSurgical(doc)).toBe(true);
  });

  it("birimsiz hekim boş küme döner", () => {
    const doc = makeDoctor([]);
    expect(doctorTypes(doc).size).toBe(0);
    expect(isSurgical(doc)).toBe(false);
  });
});
```

- [ ] **Step 2: Testi çalıştır, kırmızı olduğunu gör**

Run: `npx vitest run src/lib/doctors.test.ts`
Expected: FAIL — `doctorTypes` / `isSurgical` export edilmiyor, `Doctor` tipi `units` alanı tanımıyor.

- [ ] **Step 3: `Doctor` arayüzünü güncelle ve yardımcıları ekle**

`src/lib/doctors.ts` — `Doctor` arayüzünü (satır 81-106) şununla değiştir:

```ts
export interface Doctor {
  id: string;
  name: string;
  title: string;
  image: string;
  /** Hekimin branşları. Ad ve çeviriler yalnızca burada — units tablosundan gelir. */
  units: UnitRecord[];
  stats: {
    patients: number;
    surgeries?: number;
    experience: number;
  };
  email: string;
  educationTr: string[];
  educationEn: string[];
  educationAr?: string[];
  bioTr: string;
  bioEn: string;
  bioAr?: string;
  bioRu: string;
  bioKa: string;
}

/** Statik dizi ve seed girdisi: birimler henüz DB id'sine sahip değil, tr adıyla anılır. */
export type DoctorSeed = Omit<Doctor, "units"> & { unitTr: string[] };

/** Hekimin birimlerinin tip kümesi — Cerrahi/Dahili sekmesi bunu kullanır. */
export function doctorTypes(doc: Doctor): Set<UnitType> {
  return new Set(doc.units.map((u) => u.type));
}

/** En az bir cerrahi birimi var mı — "Ameliyat sayısı" alanı bunu kullanır. */
export function isSurgical(doc: Doctor): boolean {
  return doc.units.some((u) => u.type === "surgical");
}
```

Dosyanın üstüne import ekle:

```ts
import type { UnitRecord, UnitType } from "@/lib/units";
```

- [ ] **Step 4: Statik diziyi `DoctorSeed`'e çevir**

`src/lib/doctors.ts:108`:

```ts
export const doctorsData: Doctor[] = [
```
→
```ts
export const doctorsData: DoctorSeed[] = [
```

Dizideki her hekim kaydında beş `specialty*` alanını tek `unitTr` ile değiştir. Örnek (satır 110-139'daki ilk kayıt):

```ts
  {
    id: "4177",
    name: "Prof. Dr. Celal TEKİNBAŞ",
    title: "Prof. Dr.",
    image: "/assets/doctors/celal_tekinbas.jpg",
    specialtyTr: "Göğüs Cerrahisi Polikliniği",
    specialtyEn: "Thoracic Surgery",
    specialtyAr: "جراحة الصدر",
    specialtyRu: "Торакальная хирургия",
    specialtyKa: "თორაკალური ქირურგია",
    category: "surgical",
    stats: { patients: 14200, surgeries: 4500, experience: 28 },
```
→
```ts
  {
    id: "4177",
    name: "Prof. Dr. Celal TEKİNBAŞ",
    title: "Prof. Dr.",
    image: "/assets/doctors/celal_tekinbas.jpg",
    unitTr: ["Göğüs Cerrahisi Polikliniği"],
    stats: { patients: 14200, surgeries: 4500, experience: 28 },
```

Tüm kayıtlar için aynısını yap: `specialtyTr` değeri `unitTr` dizisinin tek elemanı olur; `specialtyEn/Ar/Ru/Ka` ve `category` satırları silinir (bu bilgi artık `units.ts`'te).

- [ ] **Step 5: `doctors.units.test.ts`'i yeniden yaz**

`src/lib/doctors.units.test.ts` içeriğini tamamen şununla değiştir:

```ts
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
```

Eski "all 5 specialty languages equal the unit's translations" testi silindi — branş adı artık yalnızca `units`'te, karşılaştırılacak ikinci kopya yok.

- [ ] **Step 6: `mappers.ts`'i güncelle**

`DoctorRow`'dan `specialty_*` ve `category` çıkar, nested birimler gelir:

```ts
export interface DoctorRow {
  id: string;
  name: string;
  title: string;
  image: string;
  stats_patients: number;
  stats_experience: number;
  stats_surgeries: number | null;
  email: string;
  education_tr: string[];
  education_en: string[];
  education_ar: string[] | null;
  bio_tr: string;
  bio_en: string;
  bio_ar: string | null;
  bio_ru: string;
  bio_ka: string;
  sort_order: number;
  /** Supabase nested select: doctor_units(units(*)) */
  doctor_units?: { units: UnitRow | null }[] | null;
}
```

`rowToDoctor`'ı güncelle:

```ts
export function rowToDoctor(row: DoctorRow): Doctor {
  const units = (row.doctor_units ?? [])
    .map((du) => du.units)
    .filter((u): u is UnitRow => u !== null)
    .map(rowToUnitRecord);

  return {
    id: row.id,
    name: row.name,
    title: row.title,
    image: row.image,
    units,
    stats: {
      patients: row.stats_patients,
      experience: row.stats_experience,
      surgeries: row.stats_surgeries ?? undefined,
    },
    email: row.email,
    educationTr: row.education_tr ?? [],
    educationEn: row.education_en ?? [],
    educationAr: row.education_ar ?? undefined,
    bioTr: row.bio_tr,
    bioEn: row.bio_en,
    bioAr: row.bio_ar ?? undefined,
    bioRu: row.bio_ru,
    bioKa: row.bio_ka,
  };
}
```

`doctorToRow`'u güncelle — birimler ayrı tabloda olduğu için yalnızca `doctors` satırını üretir:

```ts
/**
 * Yalnızca `doctors` satırını üretir. Birimler `doctor_units` tablosunda —
 * onları yazmak çağıranın sorumluluğu (bkz. saveDoctor, seed).
 */
export function doctorToRow(doc: Doctor, sortOrder = 0): Omit<DoctorRow, "doctor_units"> {
  return {
    id: doc.id,
    name: doc.name,
    title: doc.title,
    image: doc.image,
    stats_patients: doc.stats.patients,
    stats_experience: doc.stats.experience,
    stats_surgeries: isSurgical(doc) ? doc.stats.surgeries ?? null : null,
    email: doc.email,
    education_tr: doc.educationTr ?? [],
    education_en: doc.educationEn ?? [],
    education_ar: doc.educationAr ?? null,
    bio_tr: doc.bioTr,
    bio_en: doc.bioEn,
    bio_ar: doc.bioAr ?? null,
    bio_ru: doc.bioRu,
    bio_ka: doc.bioKa,
    sort_order: sortOrder,
  };
}
```

`stats_surgeries` artık `doc.category === "surgical"` yerine `isSurgical(doc)` kullanıyor. `mappers.ts` import bloğuna ekle:

```ts
import { isSurgical, type Doctor } from "@/lib/doctors";
```

(`Doctor` zaten import ediliyordu — `import type` olan satırı değer importuna çevir, çünkü `isSurgical` bir fonksiyon.)

- [ ] **Step 7: Veri katmanını nested select'e çevir**

`src/lib/data/doctors.ts` içeriğini şununla değiştir:

```ts
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { rowToDoctor, type DoctorRow } from "./mappers";
import type { Doctor } from "@/lib/doctors";

/** Hekim satırı + doctor_units üzerinden bağlı birimler. */
const SELECT_WITH_UNITS = "*, doctor_units(units(*))";

export const getDoctors = cache(async (): Promise<Doctor[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select(SELECT_WITH_UNITS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getDoctors failed: ${error.message}`);
  return (data as unknown as DoctorRow[]).map(rowToDoctor);
});

export const getDoctorById = cache(async (id: string): Promise<Doctor | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select(SELECT_WITH_UNITS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getDoctorById failed: ${error.message}`);
  return data ? rowToDoctor(data as unknown as DoctorRow) : null;
});
```

- [ ] **Step 8: Testleri çalıştır**

Run: `npx vitest run`
Expected: PASS — `doctors.test.ts` (kategori testleri dahil) ve `doctors.units.test.ts` yeşil.

Not: `npx tsc --noEmit` bu adımda **hâlâ hata verecek** — `HomeClient`, `DoctorDetailClient`, `AdminPanel`, `actions.ts` ve `seed.ts` kaldırılan `specialtyTr`/`category` alanlarına referans veriyor. Bunlar Task 12-15'te düzeltiliyor. Bu task'ın kapısı testlerin geçmesi.

- [ ] **Step 9: Commit**

```bash
git add src/lib/doctors.ts src/lib/data/mappers.ts src/lib/data/doctors.ts src/lib/doctors.test.ts src/lib/doctors.units.test.ts
git commit -m "feat: Doctor tipini çoklu branşa çevir

specialtyTr/En/Ar/Ru/Ka ve category alanları kalktı; yerine
units: UnitRecord[] geldi. Kategori artık birimlerin type'ından
türüyor (doctorTypes/isSurgical). Veri katmanı doctor_units üzerinden
nested select yapıyor. Statik dizi DoctorSeed tipine (unitTr) geçti.

Tüketiciler (HomeClient, DoctorDetailClient, AdminPanel, actions,
seed) sonraki task'larda güncelleniyor — tsc bu commit'te kırmızı.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: `HomeClient` — çoklu branş filtresi

**Files:**
- Modify: `src/components/HomeClient.tsx:24,273,288,299,310-326,479-531,606-620,629-671`

**Interfaces:**
- Consumes: `Doctor`, `doctorTypes`, `isSurgical` (Task 11); `UnitRecord`, `unitLabel` (`src/lib/units.ts`)
- Produces: yok

- [ ] **Step 1: Importları ve prop tiplerini düzelt**

Satır 24:
```tsx
import { doctorsData, formatDoctorName } from "@/lib/doctors";
```
→
```tsx
import { formatDoctorName, doctorTypes, type Doctor } from "@/lib/doctors";
```

`doctorsData` importu tamamen kalkıyor — yalnızca `typeof doctorsData` tip çıkarımı için duruyordu ve artık yanlış tip verir (`DoctorSeed[]`, `Doctor[]` değil).

Satır 27:
```tsx
import { unitLabel, type Unit } from "@/lib/units";
```
→
```tsx
import { unitLabel, type UnitRecord } from "@/lib/units";
```

Prop tipleri (satır 271-276):
```tsx
}: {
  initialDoctors: typeof doctorsData;
  initialNews: typeof newsData;
  initialUnits: Unit[];
}) {
```
→
```tsx
}: {
  initialDoctors: Doctor[];
  initialNews: typeof newsData;
  initialUnits: UnitRecord[];
}) {
```

Satır 288:
```tsx
  const [doctors, setDoctors] = useState<typeof doctorsData>(initialDoctors);
```
→
```tsx
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
```

- [ ] **Step 2: Filtre state'ini id'ye çevir**

Satır 299:
```tsx
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
```
→
```tsx
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
```

- [ ] **Step 3: Filtre mantığını yeniden yaz**

Satır 309-326:
```tsx
  // Filtered doctors based on search query and category tab
  const filteredDoctors = doctors.filter((doc) => {
    const matchesCategory = activeCategory === "all" || doc.category === activeCategory;

    const matchesUnit = !selectedUnit || doc.specialtyTr === selectedUnit;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(searchLower) ||
      doc.specialtyTr.toLowerCase().includes(searchLower) ||
      doc.specialtyEn.toLowerCase().includes(searchLower) ||
      doc.specialtyRu.toLowerCase().includes(searchLower) ||
      doc.specialtyKa.toLowerCase().includes(searchLower);

    return matchesCategory && matchesUnit && matchesSearch;
  });

  const selectedUnitObj = selectedUnit ? initialUnits.find((u) => u.tr === selectedUnit) : null;
```
→
```tsx
  // Filtered doctors based on search query, category tab and unit chip
  const filteredDoctors = doctors.filter((doc) => {
    const matchesCategory = activeCategory === "all" || doctorTypes(doc).has(activeCategory);

    const matchesUnit = !selectedUnitId || doc.units.some((u) => u.id === selectedUnitId);

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(searchLower) ||
      doc.units.some((u) =>
        [u.tr, u.en, u.ar, u.ru, u.ka].some((label) => label.toLowerCase().includes(searchLower))
      );

    return matchesCategory && matchesUnit && matchesSearch;
  });

  const selectedUnitObj = selectedUnitId ? initialUnits.find((u) => u.id === selectedUnitId) : null;
```

Arama artık hekimin **tüm** birimlerinin beş dildeki adında geziyor (eskiden `ar` atlanıyordu — düzeltildi).

- [ ] **Step 4: Birim tıklama çağrılarını id'ye çevir**

Satır 489 ve 531 (`specialties` sekmesindeki birim kartları):
```tsx
                          setSelectedUnit(spec.tr);
```
→
```tsx
                          setSelectedUnitId(spec.id);
```

`spec` artık `UnitRecord` olduğu için `.id` var. (`surgicalSpecialties` / `internalSpecialties` `initialUnits`'ten türüyor, tip otomatik `UnitRecord`.)

- [ ] **Step 5: Filtre sıfırlamalarını yeniden adlandır**

Satır 568, 577, 586, 595 ve 612'deki `setSelectedUnit(null)` çağrılarını `setSelectedUnitId(null)` yap.

Run: `grep -n "setSelectedUnit(" src/components/HomeClient.tsx`
Expected: çıktı yok — hepsi `setSelectedUnitId(` olmalı.

- [ ] **Step 6: Hekim kartında branş çipleri göster**

Satır 629-671 arasındaki kart gövdesini güncelle. Önce satır 630-635'teki tek branş hesabını **sil**:

```tsx
                  const spec =
                    locale === "tr" ? doc.specialtyTr :
                    locale === "en" ? doc.specialtyEn :
                    locale === "ar" ? (doc.specialtyAr || doc.specialtyEn) :
                    locale === "ru" ? doc.specialtyRu :
                    doc.specialtyKa;
```

`filteredDoctors.map((doc) => {` bloğu artık gövdesiz kalıyor; `map((doc) => (` biçimine sadeleştirilebilir, ama `return (` yapısını korumak da kabul.

Kategori rozetini (satır 661-665):
```tsx
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-secondary uppercase tracking-widest">
                              {doc.category === "surgical" ? t.filterSurgical : t.filterInternal}
                            </span>
                          </div>
```
→
```tsx
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-secondary uppercase tracking-widest">
                              {doctorTypes(doc).has("surgical") ? t.filterSurgical : t.filterInternal}
                            </span>
                          </div>
```

Branş metnini (satır 669-671):
```tsx
                          <p className="text-[11px] text-neutral-400 font-semibold line-clamp-2 min-h-[2rem]">
                            {spec}
                          </p>
```
→
```tsx
                          <div className="flex flex-wrap gap-1 min-h-[2rem] content-start">
                            {doc.units.map((u) => (
                              <span
                                key={u.id}
                                className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200/60 rounded-full px-2 py-0.5"
                              >
                                {unitLabel(u, locale)}
                              </span>
                            ))}
                          </div>
```

- [ ] **Step 7: Tip kontrolü**

Run: `npx tsc --noEmit 2>&1 | grep "HomeClient"`
Expected: çıktı yok — `HomeClient.tsx` temiz. (Diğer dosyalar Task 13-15'e kadar hata vermeye devam edebilir.)

- [ ] **Step 8: Commit**

```bash
git add src/components/HomeClient.tsx
git commit -m "feat: HomeClient'ı çoklu branşa geçir

Birim filtresi metin eşleşmesi yerine unit id kullanıyor; Cerrahi/
Dahili sekmesi doctorTypes ile birimlerden türüyor. Hekim kartında tek
branş metni yerine birim çipleri. Arama tüm birimlerin beş dilindeki
adında geziyor (Arapça eskiden atlanıyordu).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: `DoctorDetailClient` — branş çipleri

**Files:**
- Modify: `src/components/DoctorDetailClient.tsx:16-17` (import), `:148-153` (branş hesabı), `:218` (render), ameliyat istatistiği

**Interfaces:**
- Consumes: `Doctor`, `isSurgical` (Task 11); `unitLabel` (`src/lib/units.ts`)
- Produces: yok

- [ ] **Step 1: Importları güncelle**

Satır 16-17:
```tsx
import { formatDoctorName } from "@/lib/doctors";
import type { Doctor } from "@/lib/doctors";
```
→
```tsx
import { formatDoctorName, isSurgical } from "@/lib/doctors";
import type { Doctor } from "@/lib/doctors";
import { unitLabel } from "@/lib/units";
```

- [ ] **Step 2: Tek branş hesabını sil**

Satır 147-153'teki bloğu tamamen sil:

```tsx
  // Multi-lingual translation mapping
  const docSpecialty =
    locale === "tr" ? doctor.specialtyTr :
    locale === "en" ? doctor.specialtyEn :
    locale === "ar" ? (doctor.specialtyAr || doctor.specialtyEn) :
    locale === "ru" ? doctor.specialtyRu :
    doctor.specialtyKa;
```

`docBio` ve `docEducation` hesapları aynen kalır.

- [ ] **Step 3: Branş render'ını çiplere çevir**

Satır 218 civarındaki `{docSpecialty}` kullanımını bul:

Run: `grep -n "docSpecialty" src/components/DoctorDetailClient.tsx`

Bulunan satırdaki tek branş metnini, saran elemanıyla birlikte şununla değiştir:

```tsx
                <div className="flex flex-wrap gap-2">
                  {doctor.units.map((u) => (
                    <span
                      key={u.id}
                      className="text-[11px] font-bold text-primary bg-primary/5 border border-primary/20 rounded-full px-3 py-1"
                    >
                      {unitLabel(u, locale)}
                    </span>
                  ))}
                </div>
```

Saran elemanın mevcut `className`'ini koru — yalnızca içeriği çip listesine çevir.

- [ ] **Step 4: Ameliyat istatistiğini `isSurgical`'a bağla**

`surgeriesTitle` istatistik kartının koşulunu bul:

Run: `grep -n "surgeriesTitle\|stats.surgeries" src/components/DoctorDetailClient.tsx`

Koşul `doctor.category === "surgical"` ise `isSurgical(doctor)` yap. Koşul `doctor.stats.surgeries` varlığına bakıyorsa değişiklik gerekmez — `doctorToRow` zaten cerrahi olmayan hekimde `null` yazıyor.

- [ ] **Step 5: Tip kontrolü**

Run: `npx tsc --noEmit 2>&1 | grep "DoctorDetailClient"`
Expected: çıktı yok

- [ ] **Step 6: Commit**

```bash
git add src/components/DoctorDetailClient.tsx
git commit -m "feat: hekim detayında çoklu branş çipleri

Tek branş metni yerine hekimin tüm birimleri çip olarak listeleniyor.
Ameliyat istatistiği isSurgical ile birimlerden türüyor.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: `AdminPanel` + `actions` — birim çoklu seçimi

**Files:**
- Modify: `src/components/admin/AdminPanel.tsx:69,73,154-163,192-201,229,237-243,264-268,541,550,649-653` ve hekim formu
- Modify: `src/app/admin/actions.ts:34-40` (`saveDoctor`)

**Interfaces:**
- Consumes: `Doctor`, `isSurgical`, `doctorTypes` (Task 11); `UnitRecord`, `unitLabel` (`src/lib/units.ts`)
- Produces: `saveDoctor(doc: Doctor, sortOrder: number): Promise<void>` — imza aynı; artık `doctor_units` da yazıyor

- [ ] **Step 1: `saveDoctor`'ı `doctor_units` yazacak şekilde güncelle**

`src/app/admin/actions.ts:34-40`:

```ts
export async function saveDoctor(doc: Doctor, sortOrder: number): Promise<void> {
  await requireUser();
  const admin = createAdminClient();
  const { error } = await admin.from("doctors").upsert(doctorToRow(doc, sortOrder), { onConflict: "id" });
  if (error) throw new Error(`saveDoctor failed: ${error.message}`);
  revalidatePath("/");
  revalidatePath(`/doctors/${doc.id}`);
}
```
→
```ts
export async function saveDoctor(doc: Doctor, sortOrder: number): Promise<void> {
  await requireUser();
  const admin = createAdminClient();

  const { error } = await admin
    .from("doctors")
    .upsert(doctorToRow(doc, sortOrder), { onConflict: "id" });
  if (error) throw new Error(`saveDoctor failed: ${error.message}`);

  // Birimler ayrı tabloda: önce hekimin mevcut bağlarını sil, sonra seçilenleri yaz.
  const { error: delErr } = await admin.from("doctor_units").delete().eq("doctor_id", doc.id);
  if (delErr) throw new Error(`saveDoctor (units temizleme) failed: ${delErr.message}`);

  if (doc.units.length > 0) {
    const links = doc.units.map((u) => ({ doctor_id: doc.id, unit_id: u.id }));
    const { error: insErr } = await admin.from("doctor_units").insert(links);
    if (insErr) throw new Error(`saveDoctor (units yazma) failed: ${insErr.message}`);
  }

  revalidatePath("/");
  revalidatePath(`/doctors/${doc.id}`);
}
```

`deleteDoctor` değişmiyor — `doctor_units.doctor_id` FK'si `on delete cascade` olduğu için bağlar kendiliğinden siliniyor.

- [ ] **Step 2: Form state'ini birim seçimine çevir**

`src/components/admin/AdminPanel.tsx`:

Satır 69'u **sil**:
```tsx
  const [docCategory, setDocCategory] = useState<"surgical" | "internal">("surgical");
```

Satır 73'ü **sil**:
```tsx
  const [docSpec, setDocSpec] = useState({ tr: "", en: "", ar: "", ru: "", ka: "" });
```

Yerlerine ekle:
```tsx
  const [docUnitIds, setDocUnitIds] = useState<string[]>([]);
```

- [ ] **Step 3: Kaydetme akışlarını güncelle**

Satır 154-163 ve 192-201'deki iki `Doctor` nesnesi kurulumunda:

```tsx
              specialtyTr: docSpec.tr,
              specialtyEn: docSpec.en,
              specialtyAr: docSpec.ar,
              specialtyRu: docSpec.ru,
              specialtyKa: docSpec.ka,
              category: docCategory,
              stats: {
                ...
                surgeries: docCategory === "surgical" ? Number(docStats.surgeries) || 0 : undefined
              },
```
→
```tsx
              units: units.filter((u) => docUnitIds.includes(u.id)),
              stats: {
                ...
                surgeries: selectedUnitsAreSurgical ? Number(docStats.surgeries) || 0 : undefined
              },
```

Bileşen gövdesinde, `docUnitIds` tanımından sonra türetilmiş değeri ekle:

```tsx
  /** Seçili birimlerden en az biri cerrahi mi — "Ameliyat sayısı" alanı buna bağlı. */
  const selectedUnitsAreSurgical = units.some(
    (u) => docUnitIds.includes(u.id) && u.type === "surgical"
  );
```

- [ ] **Step 4: Düzenleme akışını güncelle**

Satır 229'u **sil**:
```tsx
    setDocCategory(doc.category);
```

Satır 237-243'teki `setDocSpec({...})` bloğunu **sil** ve yerine ekle:
```tsx
    setDocUnitIds(doc.units.map((u) => u.id));
```

- [ ] **Step 5: Form sıfırlamayı güncelle**

Satır 266'yı:
```tsx
  setDocSpec({ tr: "", en: "", ar: "", ru: "", ka: "" });
```
→
```tsx
  setDocUnitIds([]);
```

- [ ] **Step 6: Özet sayaçlarını güncelle**

Satır 541:
```tsx
              {doctors.filter(d => d.category === "surgical").length}
```
→
```tsx
              {doctors.filter((d) => doctorTypes(d).has("surgical")).length}
```

Satır 550:
```tsx
              {doctors.filter(d => d.category === "internal").length}
```
→
```tsx
              {doctors.filter((d) => doctorTypes(d).has("internal")).length}
```

Not: Çoklu branşta toplam artık `cerrahi + dahili ≠ hekim sayısı` olabilir (iki tipte birimi olan hekim ikisinde de sayılır). Bu beklenen davranış.

- [ ] **Step 7: Hekim listesindeki kategori rozetini güncelle**

Satır 649-653:
```tsx
                                  doc.category === "surgical"
                                    ? ...
                                  {doc.category === "surgical" ? "Cerrahi" : "Dahili"}
```
→
```tsx
                                  doctorTypes(doc).has("surgical")
                                    ? ...
                                  {doctorTypes(doc).has("surgical") ? "Cerrahi" : "Dahili"}
```

Mevcut koşullu `className` yapısını koru, yalnızca koşulu değiştir.

- [ ] **Step 8: Kategori seçim alanını birim checkbox listesiyle değiştir**

Formda `docCategory` select'ini ve `docSpec` metin alanlarını bul:

Run: `grep -n "docCategory\|docSpec" src/components/admin/AdminPanel.tsx`

Bunların form alanlarını sil ve yerine, hekim formunun "basic" sekmesine birim seçici ekle:

```tsx
              <div className="space-y-2">
                <label className="text-[11px] font-black text-primary uppercase tracking-wider">
                  Birimler (Branşlar)
                </label>
                <p className="text-[10px] text-neutral-400 font-semibold">
                  Hekim birden fazla birimde görev alabilir. Cerrahi/Dahili ayrımı seçilen
                  birimlerden türetilir.
                </p>
                <div className="max-h-64 overflow-y-auto border border-neutral-200 rounded-xl p-3 space-y-1">
                  {units.map((u) => (
                    <label
                      key={u.id}
                      className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={docUnitIds.includes(u.id)}
                        onChange={(e) =>
                          setDocUnitIds((prev) =>
                            e.target.checked ? [...prev, u.id] : prev.filter((id) => id !== u.id)
                          )
                        }
                        className="accent-[#002d62]"
                      />
                      <span className="text-xs font-semibold text-neutral-600">{u.tr}</span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          u.type === "surgical"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {u.type === "surgical" ? "Cerrahi" : "Dahili"}
                      </span>
                    </label>
                  ))}
                </div>
                {docUnitIds.length === 0 && (
                  <p className="text-[10px] font-bold text-red-500">
                    En az bir birim seçilmeli.
                  </p>
                )}
              </div>
```

Birim listesi Türkçe (`u.tr`) gösteriliyor — admin paneli Türkçe.

- [ ] **Step 9: "Ameliyat sayısı" alanını koşullu yap**

Formda `docStats.surgeries` girdisini bul:

Run: `grep -n "docStats.surgeries\|surgeries" src/components/admin/AdminPanel.tsx`

Girdi alanını `selectedUnitsAreSurgical &&` ile sar:

```tsx
                {selectedUnitsAreSurgical && (
                  <div className="space-y-2">
                    {/* mevcut ameliyat sayısı girdisi */}
                  </div>
                )}
```

- [ ] **Step 10: Importları güncelle**

`AdminPanel.tsx` import bloğunda `doctorTypes`'ı ekle:

```tsx
import { formatDoctorName, getCleanName, doctorTypes, type Doctor } from "@/lib/doctors";
```

(Mevcut import satırının tam hâline göre uyarla — `getCleanName` ve `formatDoctorName` zaten kullanımda.)

- [ ] **Step 11: Tip + lint kontrolü**

Run: `npx tsc --noEmit 2>&1 | grep -E "AdminPanel|actions"`
Expected: çıktı yok

Run: `npx eslint src/components/admin/AdminPanel.tsx src/app/admin/actions.ts`
Expected: hata yok

- [ ] **Step 12: Elle doğrula**

1. `/admin`'e giriş yap.
2. Bir hekimi düzenle → mevcut birimi checkbox'ta işaretli olmalı.
3. İkinci bir birim seç (farklı tipte, ör. bir dahili birim) → kaydet.
4. Ana sayfada o hekimin kartında **iki** birim çipi görünmeli.
5. "Cerrahi" sekmesinde **ve** "Dahili" sekmesinde aynı hekim listelenmeli.
6. Hekim detay sayfasında iki çip görünmeli.

- [ ] **Step 13: Commit**

```bash
git add src/components/admin/AdminPanel.tsx src/app/admin/actions.ts
git commit -m "feat: admin'de birim çoklu seçimi

Kategori select'i ve beş dilli branş metin alanları kaldırıldı; yerine
units tablosundan checkbox'lı çoklu seçim geldi. saveDoctor artık
doctor_units bağlarını da yazıyor (önce sil, sonra ekle). Ameliyat
sayısı alanı seçili birimlerden en az biri cerrahiyse görünüyor.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: `seed.ts` — birimleri de seed et

**Files:**
- Modify: `scripts/seed.ts:15-20`

**Interfaces:**
- Consumes: `doctorsData: DoctorSeed[]` (Task 11); `doctorToRow` (Task 11)
- Produces: yok

**Neden:** `doctorToRow` artık birimleri ifade etmiyor. `seedDoctors` bugünkü hâliyle çalışırsa tüm hekimler branşsız kalır.

- [ ] **Step 1: Import bloğunu güncelle**

`scripts/seed.ts` import bloğuna ekle:

```ts
import type { UnitRecord } from "../src/lib/units";
```

- [ ] **Step 2: `seedDoctors`'ı iki adımlı yap**

`scripts/seed.ts:15-20`'deki fonksiyonu:

```ts
async function seedDoctors() {
  const rows = doctorsData.map((doc, i) => doctorToRow(doc, i));
  const { error } = await supabase.from("doctors").upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`seed doctors failed: ${error.message}`);
  console.log(`Seeded ${rows.length} doctors.`);
}
```

tamamen şununla değiştir:

```ts
async function seedDoctors() {
  // doctorsData birimleri tr adıyla taşıyor (DoctorSeed); DB id'sine burada çevriliyor.
  const { data: unitRows, error: unitErr } = await supabase
    .from("units")
    .select("id,tr,en,ar,ru,ka,type");
  if (unitErr) throw new Error(`seed doctors: units okunamadı: ${unitErr.message}`);
  if (!unitRows || unitRows.length === 0) {
    throw new Error("seed doctors: units tablosu boş — önce birimleri seed et.");
  }
  const unitByTr = new Map(unitRows.map((u) => [u.tr as string, u as UnitRecord]));

  /** Seed girdisindeki tr adlarını gerçek birim kayıtlarına çevirir. */
  const resolveUnits = (unitTr: string[], docName: string): UnitRecord[] =>
    unitTr.map((tr) => {
      const unit = unitByTr.get(tr);
      if (!unit) throw new Error(`seed doctors: "${tr}" birimi units'te yok (${docName})`);
      return unit;
    });

  // doctorToRow bir Doctor bekliyor; DoctorSeed'i çözülmüş birimlerle Doctor'a yükseltiyoruz.
  // Birimler doğru geçmeli — doctorToRow stats_surgeries'i isSurgical üzerinden hesaplıyor.
  const rows = doctorsData.map((doc, i) =>
    doctorToRow({ ...doc, units: resolveUnits(doc.unitTr, doc.name) }, i)
  );
  const { error } = await supabase.from("doctors").upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`seed doctors failed: ${error.message}`);
  console.log(`Seeded ${rows.length} doctors.`);

  const links = doctorsData.flatMap((doc) =>
    resolveUnits(doc.unitTr, doc.name).map((u) => ({ doctor_id: doc.id, unit_id: u.id }))
  );
  const { error: linkErr } = await supabase
    .from("doctor_units")
    .upsert(links, { onConflict: "doctor_id,unit_id" });
  if (linkErr) throw new Error(`seed doctor_units failed: ${linkErr.message}`);
  console.log(`Seeded ${links.length} doctor_units links.`);
}
```

`resolveUnits` birimleri **tam** `UnitRecord` olarak çözüyor — `doctorToRow` `stats_surgeries`'i `isSurgical(doc)` ile hesapladığı için `type` alanı doğru gelmeli, yoksa cerrahi hekimlerin ameliyat sayısı sessizce `null` yazılır.

- [ ] **Step 3: Tip kontrolü**

Run: `npx tsc --noEmit`
Expected: hata yok — **tüm** tüketiciler artık güncel. Bu, Task 11'de kırmızıya düşen `tsc`'nin yeşile döndüğü nokta.

Run: `npx vitest run`
Expected: PASS — hepsi

- [ ] **Step 4: Seed'i çalıştırma**

Bu adımda `npm run seed` **çalıştırılmıyor** — canlı veriyi statik diziyle ezer ve admin'den eklenmiş 12 hekimi kaybettirir (DB'de 37, statik dizide ~25). Script'in tip olarak doğru olması yeterli. Seed yalnızca sıfırdan kurulumda kullanılır.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed.ts
git commit -m "chore: seed'i doctor_units'e uyarla

doctorToRow artık birimleri ifade etmiyor; seed birimleri units.tr
üzerinden DB id'sine çevirip doctor_units'e yazıyor. Aksi hâlde seed
sonrası tüm hekimler branşsız kalırdı.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: Eski kolonları düşür

**Files:**
- Create: `scripts/drop-legacy-doctor-columns.sql`
- Modify: `supabase/schema.sql`

**Interfaces:**
- Consumes: dolu `doctor_units` (Task 10), güncellenmiş tüm tüketiciler (Task 11-15)
- Produces: yok

**Ön koşul:** Task 10-15 tamamlanmış, `npx tsc --noEmit` ve `npx vitest run` yeşil, site elle doğrulanmış olmalı. Bu geri dönüşü olmayan adım.

- [ ] **Step 1: Kolonların artık okunmadığını doğrula**

Run: `grep -rn "specialty_tr\|specialty_en\|specialty_ar\|specialty_ru\|specialty_ka" src/`
Expected: çıktı yok

Run: `grep -rn "\.category\|category:" src/ | grep -v "activeCategory\|specialtiesTab\|setActiveCategory"`
Expected: çıktı yok — hekim `category`'sine referans kalmamalı. (`activeCategory` HomeClient'ın sekme state'i, kalır.)

Run: `grep -rn "specialty" scripts/`
Expected: yalnızca `migrate-doctor-units.ts` (migration `specialty_tr`'yi okumak zorunda — kolon düşünce bu script tarihsel kayıt olur).

- [ ] **Step 2: Yedek al**

Supabase SQL Editor'de, kolonları düşürmeden önce içeriklerini bir yedek tabloya kopyala:

```sql
create table if not exists public.doctors_legacy_specialty_backup as
select id, name, specialty_tr, specialty_en, specialty_ar, specialty_ru, specialty_ka, category
from public.doctors;

select count(*) from public.doctors_legacy_specialty_backup;
-- beklenen: 37
```

- [ ] **Step 3: Düşürme script'ini yaz**

`scripts/drop-legacy-doctor-columns.sql` oluştur:

```sql
-- Çoklu branşa geçiş sonrası artık okunmayan kolonlar.
-- ÖN KOŞUL: doctor_units dolu ve doğrulanmış, uygulama kodu güncel.
-- Yedek: public.doctors_legacy_specialty_backup

alter table public.doctors drop column if exists specialty_tr;
alter table public.doctors drop column if exists specialty_en;
alter table public.doctors drop column if exists specialty_ar;
alter table public.doctors drop column if exists specialty_ru;
alter table public.doctors drop column if exists specialty_ka;
alter table public.doctors drop column if exists category;
```

- [ ] **Step 4: Çalıştır**

Supabase SQL Editor'de `scripts/drop-legacy-doctor-columns.sql` içeriğini çalıştır.

Doğrula:

```sql
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'doctors'
order by column_name;
-- specialty_* ve category görünmemeli
```

- [ ] **Step 5: `schema.sql`'i güncelle**

`supabase/schema.sql` içindeki `doctors` tablosu tanımından şu satırları sil:

```sql
  specialty_tr    text not null,
  specialty_en    text not null,
  specialty_ar    text,
  specialty_ru    text not null,
  specialty_ka    text not null,
  category        text not null check (category in ('surgical','internal')),
```

`schema.sql` sıfırdan kurulum için doğruluk kaynağı — düşürülen kolonlar orada da olmamalı.

- [ ] **Step 6: Site doğrulaması**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`

Run: `curl -s http://localhost:3000/ | grep -oE 'href="/doctors/[^"]*"' | head -1`

Dönen id ile detay sayfasını aç: `200` dönmeli, branş çipleri görünmeli.

`/admin`'de bir hekim düzenle ve kaydet — hata vermemeli.

- [ ] **Step 7: Commit**

```bash
git add scripts/drop-legacy-doctor-columns.sql supabase/schema.sql
git commit -m "chore: doctors tablosundan specialty_* ve category kolonlarını düşür

Çoklu branşa geçiş tamamlandı; bu kolonlar artık okunmuyor. İçerikleri
doctors_legacy_specialty_backup tablosuna yedeklendi.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Faz 5 — Haber şeridi (Task 17)

### Task 17: Hero üstü kayan duyuru şeridi

**Files:**
- Create: `src/components/shared/NewsTicker.tsx`
- Modify: `src/app/globals.css` (keyframes)
- Modify: `src/components/HomeClient.tsx` (şeridi yerleştir)
- Modify: `src/components/sections/Hero.tsx` (üst boşluk)

**Interfaces:**
- Consumes: `NewsItem` (`src/lib/news.ts`); `Locale` (`src/lib/locale.ts`)
- Produces: `NewsTicker({ items, locale }: { items: NewsItem[]; locale: Locale })` — default export

- [ ] **Step 1: `NewsItem` şeklini doğrula**

Run: `grep -n "interface NewsItem" -A 6 src/lib/news.ts`
Expected: `name`, `designation`, `quote`, `src` alanları. Şerit `name` alanını gösterir.

- [ ] **Step 2: Keyframes'i ekle**

`src/app/globals.css` sonuna ekle:

```css
/* Haber şeridi — kesintisiz yatay kayma.
   İçerik iki kez basılır; -50% tam bir kopya kaydırır, başa dönüş görünmez. */
@keyframes farabi-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.farabi-marquee-track {
  display: flex;
  width: max-content;
  animation: farabi-marquee 40s linear infinite;
}

.farabi-marquee-track:hover {
  animation-play-state: paused;
}

/* RTL (Arapça): ters yönde kay. */
.farabi-marquee-track[data-rtl="true"] {
  animation-direction: reverse;
}

@media (prefers-reduced-motion: reduce) {
  .farabi-marquee-track {
    animation: none;
    transform: none;
  }
}
```

- [ ] **Step 3: Bileşeni yaz**

`src/components/shared/NewsTicker.tsx` oluştur:

```tsx
"use client";

import React from "react";
import { Megaphone } from "lucide-react";
import type { NewsItem } from "@/lib/news";
import type { Locale } from "@/lib/locale";

const LABELS: Record<Locale, string> = {
  tr: "Duyuru",
  en: "News",
  ar: "إعلان",
  ru: "Объявление",
  ka: "სიახლე",
};

export default function NewsTicker({ items, locale }: { items: NewsItem[]; locale: Locale }) {
  if (items.length === 0) return null;

  const isRtl = locale === "ar";

  // İçerik iki kez basılır: -50%'ye kayınca ikinci kopya tam başa oturur,
  // döngü dikişsiz görünür.
  const sequence = [...items, ...items];

  return (
    <a
      href="#announcements"
      aria-label={LABELS[locale]}
      className="group block w-full bg-primary text-white overflow-hidden border-b border-white/10"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      <div className="relative flex items-center h-10">
        {/* Sabit etiket */}
        <div
          className={`z-20 flex items-center gap-1.5 shrink-0 h-full px-4 bg-secondary text-primary ${
            isRtl ? "order-last" : ""
          }`}
        >
          <Megaphone className="h-3.5 w-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            {LABELS[locale]}
          </span>
        </div>

        {/* Kayan pist */}
        <div className="flex-1 overflow-hidden">
          <div className="farabi-marquee-track" data-rtl={isRtl}>
            {sequence.map((item, i) => (
              <span
                key={i}
                aria-hidden={i >= items.length}
                className="flex items-center whitespace-nowrap text-[11px] font-semibold px-6"
              >
                <span className="h-1 w-1 rounded-full bg-secondary shrink-0" />
                <span className="ml-3 group-hover:text-secondary transition-colors">
                  {item.name}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
```

İkinci kopyanın `aria-hidden` olması, ekran okuyucunun her duyuruyu iki kez okumasını engelliyor.

- [ ] **Step 4: `HomeClient`'a yerleştir**

`src/components/HomeClient.tsx` import bloğuna ekle:

```tsx
import NewsTicker from "@/components/shared/NewsTicker";
```

Navbar ile Hero arasına ekle (satır 334-337 arası):

```tsx
      <Navbar
        currentLocale={locale}
        onLocaleChange={(l) => { setLocale(l); storeLocale(l); }}
        availableLocales={PUBLIC_LOCALES}
      />

      {/* Duyuru şeridi — Navbar'ın altında, Hero'nun üstünde */}
      <div className="pt-[72px]">
        <NewsTicker items={activeNews} locale={locale} />
      </div>

      {/* Hero section */}
      <Hero currentLocale={locale} />
```

`pt-[72px]` sabit `Navbar`'ın altını boşaltıyor (`py-5` + logo yüksekliği ≈ 72px). Şerit akışa girdiği için Hero'nun kendi üst boşluğu artık gereksiz.

- [ ] **Step 5: Hero'nun üst boşluğunu azalt**

`src/components/sections/Hero.tsx:115`:

```tsx
      className="relative min-h-screen pt-32 pb-16 flex items-center justify-center overflow-hidden bg-background w-full"
```
→
```tsx
      className="relative min-h-screen pt-12 pb-16 flex items-center justify-center overflow-hidden bg-background w-full"
```

`pt-32` (128px) sabit Navbar'ı boşaltmak içindi; o iş artık şeridin `pt-[72px]` sarmalayıcısında. Hero yalnızca şeritten sonra nefes payı bırakıyor.

- [ ] **Step 6: Lint + tip kontrolü**

Run: `npx eslint src/components/shared/NewsTicker.tsx src/components/HomeClient.tsx src/components/sections/Hero.tsx`
Expected: hata yok

Run: `npx tsc --noEmit`
Expected: hata yok

- [ ] **Step 7: Doğrulama**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`

Run: `curl -s http://localhost:3000/ | grep -c "farabi-marquee-track"`
Expected: `1`

Tarayıcıda elle:
1. Şerit Navbar'ın hemen altında görünmeli, Navbar'ın arkasında kalmamalı.
2. Duyurular soldan sağa kesintisiz kaymalı; dikiş yerinde zıplama olmamalı.
3. Üzerine gelince durmalı.
4. Tıklayınca duyuru bölümüne kaymalı.
5. Arapça'ya geç → yön ters çevrilmeli, etiket sağda olmalı.
6. İşletim sisteminde "hareketi azalt"ı aç → kayma durmalı.
7. Hero başlığı şeridin altında düzgün konumlanmalı, kesilmemeli.

- [ ] **Step 8: Commit**

```bash
git add src/components/shared/NewsTicker.tsx src/app/globals.css src/components/HomeClient.tsx src/components/sections/Hero.tsx
git commit -m "feat: Hero üstüne kayan duyuru şeridi ekle

Mevcut news verisinden besleniyor; yeni veri çekme yok. İçerik iki kez
basılıp CSS keyframes ile kesintisiz kaydırılıyor, hover'da duruyor,
tıklayınca duyuru bölümüne kayıyor. Arapçada yön ters, reduced-motion
açıkken kayma yok. Sabit Navbar'ın altını boşaltmak Hero'nun pt-32'sinden
şeridin sarmalayıcısına taşındı.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Kapanış doğrulaması

Tüm task'lar bittikten sonra:

- [ ] Run: `npx vitest run` → hepsi yeşil
- [ ] Run: `npx tsc --noEmit` → hata yok
- [ ] Run: `npx eslint src/` → hata yok
- [ ] Run: `npm run build` → başarılı
- [ ] Run: `grep -rni "д-р" src/ scripts/` → çıktı yok
- [ ] Run: `curl -s http://localhost:3000/ | grep -c "Türkçe (TR)"` → `0`
- [ ] Tarayıcıda dört public dilde ana sayfa: şerit kayıyor, Hero görselsiz ve ortalı, bento rozetleri yok
- [ ] Bir hekim detay sayfası: branş çipleri, Hakkında+Eğitim tek başlık altında
- [ ] `/admin`: Türkçe menüde, birim checkbox'ları çalışıyor, çift branşlı hekim iki sekmede de çıkıyor
