# Public Site Revizyonu — Tasarım

Tarih: 2026-07-17

Yedi maddelik bir revizyon. Maddeler bağımsız; risk sırasına göre üç gruba ayrıldı.

## Kapsam

| # | İstek | Grup |
|---|-------|------|
| 1 | Public'te Türkçe dil seçeneği kalksın, admin'de kalsın | B |
| 2 | Kurumsal duyurular en başta, haber banneri gibi | C |
| 3 | Hero'daki Başhekim görseli kalksın | A |
| 4 | Rusça `д-р` → `др` | A |
| 5 | Bir hekime birden fazla branş | C |
| 6 | "Hekim Hakkında" + "Eğitim & Tıbbi Uzmanlık" tek başlık | A |
| 7 | "International Hub" / "Advanced Medical Tech" / "Academic Guidance" kalksın | A |

## Alınan kararlar

Brainstorming sırasında kullanıcı tarafından onaylandı:

- **Duyuru bandı:** Hero'nun üstünde, sürekli yatay kayan marquee. Aşağıdaki mevcut carousel bölümü yerinde kalır.
- **Çoklu branş:** `doctor_units` ara tablosu. Metin eşleşmesi kalkar.
- **Cerrahi/Dahili:** Hekimin `category` kolonu kalkar; sekme filtresi hekimin birimlerinin `type`'ından türer. İki tipte birimi olan hekim iki sekmede de listelenir.
- **Hakkında + Eğitim:** Tek "Hekim Hakkında" başlığı; altında önce biyografi, sonra mevcut eğitim maddeleri. Veri ve admin alanları korunur.
- **Public varsayılan dil:** `en`. Tarayıcısında `tr` kayıtlı ziyaretçi `en`'e düşer.
- **`д-р`:** Ünvan önekleri dahil, kod ve DB'deki tüm varyantlar `др` olur.

---

## Grup A — Doğrudan silme/değiştirme

### 3. Hero görseli

`src/components/sections/Hero.tsx`

- Satır 235-271 arası sağ kolon (`lg:col-span-5`) tamamen kaldırılır: görsel çerçevesi, gradient overlay, "Başhekim" rozeti, arkasındaki glow mesh.
- Öksüz kalan `Users` importu kaldırılır (`ShieldCheck` ve `ArrowDown` kullanımda kalır).
- 12 kolonluk grid tek kolona düşer. Sol kolondaki `lg:col-span-7` kalkar; içerik `max-w-3xl mx-auto` ile ortalanır ve `text-center lg:text-left` → `text-center` olur.
- İstatistik şeridi (`grid-cols-2`) ortalanmış hâliyle korunur. Hover kartının `isAr` konumlandırması aynen kalır.

**Gerekçe:** Görsel gidince tam genişlikte sola yaslı başlık `max-w-7xl` konteynerde dağınık duruyor.

### 7. Bento rozetleri

`src/components/HomeClient.tsx`

- Satır 368-371 (`International Hub` + `Sparkles`), 390-392 (`Advanced Medical Tech`), 411-413 (`Academic Guidance`) blokları kaldırılır.
- Kartların ikon + başlık + açıklama içeriği korunur.
- Öksüz kalan `Sparkles` importu kaldırılır.
- Kartlar `flex flex-col justify-between` kullanıyor; alt blok gidince `justify-between` etkisiz kalır, kaldırılır.

### 6. Hakkında + Eğitim birleşmesi

`src/components/DoctorDetailClient.tsx`

- Satır 240-253'teki ayrı "Eğitim & Tıbbi Uzmanlık" bölümü kaldırılır.
- Eğitim listesi (`CheckCircle2` ikonlu `<ul>`), satır 230-238'deki "Hekim Hakkında" bloğunun içine, biyografi paragrafının altına taşınır.
- `educationTitle` çeviri anahtarı beş dilden de silinir (satır 31, 47, 63, 79, 95).
- `docEducation` hesabı ve `CheckCircle2` importu korunur.
- Veri modeli ve admin alanları değişmez.

### 4. Rusça `д-р` → `др`

Dört ayrı katman. Kod değişikliği tek başına yeterli değildir.

**4a. Ünvan önekleri — `src/lib/doctors.ts`, `formatDoctorName`**

| Satır | Eski | Yeni |
|-------|------|------|
| 51 | `Проф. д-р` | `Проф. др` |
| 57 | `Доц. д-р` | `Доц. др` |
| 68 | `Ассист. д-р` | `Ассист. др` |
| 74 | `Д-р` | `Др` |

Dört varyant da canlı veride kullanımda: DB'deki `title` değerleri `Prof. Dr.`, `Assoc. Prof.`, `Asst. Prof.`, `Dr.`. Bu değişiklik 37 hekimin tamamını anında etkiler.

**4b. DB `bio_ru` metinleri — 37 hekimin 17'si**

Biyografi metinleri `doctors` tablosunda duruyor ve içlerinde `Профессор д-р ...` geçiyor. Kod değişikliği bunlara dokunmaz; SQL UPDATE gerekir:

```sql
update public.doctors
set bio_ru = replace(bio_ru, 'д-р', 'др')
where bio_ru like '%д-р%';
```

Yazmadan önce etkilenen satırlar `select` ile listelenip doğrulanır.

**4c. Statik dizi — `src/lib/doctors.ts` `bioRu` alanları (~25 satır)**

`doctorsData` yalnızca `scripts/seed.ts` ve `typeof doctorsData` tip çıkarımı için kullanılıyor; canlı site doktorları Supabase'den okuyor. Yine de 4b ile birlikte değiştirilmeli — aksi hâlde ileride bir `npm run seed` eski metinleri geri getirir.

**4d. Admin placeholder — `src/components/admin/AdminPanel.tsx:897`**

`"Профессор д-р Джелал..."` → `"Профессор др Джелал..."`. Kozmetik.

> Not: `Профессор д-р X` ifadesinde ünvan zaten iki kez geçiyor ("Профессор" + "д-р"). Talep edildiği gibi birebir `др`'ye çevriliyor; metnin kendisini sadeleştirmek ayrı bir iş olarak değerlendirilebilir.

---

## Grup B — Dil ayrımı

### 1. Public'te Türkçe yok, admin'de var

**Sorun:** `AdminPanel.tsx:477` public ile aynı `Navbar` bileşenini kullanıyor; dil menüsü şu an ortak. Navbar'dan Türkçe'yi kaldırmak admin'i de etkiler.

**Çözüm:** `Navbar`'a `availableLocales?: Locale[]` prop'u eklenir (varsayılan: beş dil).

| Çağıran | `availableLocales` | Açılış dili |
|---------|--------------------|-------------|
| `HomeClient` | `["en","ar","ru","ka"]` | `en` |
| `DoctorDetailClient` | `["en","ar","ru","ka"]` | `en` |
| `AdminPanel` | varsayılan (beş dil) | `tr` |

Navbar'daki masaüstü dil menüsü ve mobil drawer'daki `["tr","en","ar","ru","ka"]` sabit dizisi (satır 227) bu prop'tan türetilir. Her dilin görünen adı (`Türkçe (TR)`, `English (EN)`, ...) tek bir sabit tabloya taşınır — şu an beş buton elle yazılmış.

**`src/lib/locale.ts`:** `readStoredLocale(allowed?: Locale[])` imzası alır. Kayıtlı değer izin verilen kümede değilse `null` döner. `HomeClient` / `DoctorDetailClient` public kümesini geçer; kayıtlı `tr` `null` olur ve `useState` varsayılanı `en` devreye girer.

**Admin izolasyonu:** `AdminPanel` dil seçimini `storeLocale` ile kaydetmiyor (`onLocaleChange={(l) => setLocale(l)}`, satır 477). Bu yüzden admin'de Türkçe seçmek public tarafı etkilemiyor. Bu mevcut davranışa dayanan bir varsayım; değişirse public'e `tr` sızabilir. Test ile korunacak.

**Türkçe içerik silinmiyor.** `bio_tr`, `specialty_tr`, `units.tr` durur ve admin bunları düzenlemeye devam eder. Kalkan yalnızca public'teki dil seçeneğidir.

---

## Grup C — Çoklu branş + haber şeridi

### 5. `doctor_units` ara tablosu

**Bugünkü durum:** Branş, `doctors.specialty_tr` metninin `units.tr` ile karşılaştırılmasıyla eşleşiyor (`HomeClient.tsx:313`: `doc.specialtyTr === selectedUnit`). Branş adı iki yerde tekrar ediyor.

**Şema:**

```sql
create table if not exists public.doctor_units (
  doctor_id  text not null references public.doctors(id) on delete cascade,
  unit_id    uuid not null references public.units(id)   on delete cascade,
  primary key (doctor_id, unit_id)
);

alter table public.doctor_units enable row level security;
create policy "public read doctor_units" on public.doctor_units for select using (true);
```

`supabase/schema.sql`'e eklenir. RLS deseni mevcut tablolarla aynı: public read, yazma yalnızca service role.

**Canlı veri üzerinde ölçülen risk (2026-07-17):**

| Ölçüm | Sonuç |
|-------|-------|
| DB hekim sayısı | 37 |
| DB birim sayısı | 56 (statik liste ile aynı) |
| `specialty_tr` → `units.tr` eşleşmeyen | **0** |
| `category` ≠ eşleşen birimin `type`'ı | **0** |

Eşleme temiz geçiyor ve kategoriyi birimlerden türetmek mevcut hiçbir hekimin sekmesini değiştirmiyor. Kuru çalıştırma yine de migration'ın parçası olarak kalıyor — veri yazma anına kadar değişebilir.

**Migration — iki adımlı, kuru çalıştırma zorunlu:**

`scripts/migrate-doctor-units.ts`:

1. **Kuru çalıştırma (varsayılan):** Her hekimin `specialty_tr` değeri `units.tr` ile eşleştirilir. Rapor: kaç hekim eşleşti, hangileri eşleşmedi. Hiçbir şey yazılmaz.
2. **Yazma (`--commit`):** Yalnızca kuru çalıştırma sıfır eşleşmez raporladıysa. `doctor_units` doldurulur.
3. **Kolon düşürme:** Ancak 2. adım doğrulandıktan sonra ayrı bir migration `doctors.specialty_tr/en/ar/ru/ka` ve `doctors.category` kolonlarını düşürür.

**Risk:** `specialty_tr` hiçbir `units.tr` ile eşleşmeyen hekim branşsız kalır. Bugün böyle bir hekim yok; ama migration çalıştırılana kadar admin'den yeni hekim eklenebileceği için kuru çalıştırma korunuyor. Eşleşmeyen çıkarsa ya eksik birim `units`'e eklenir ya da hekim kaydı düzeltilir.

**Tip değişiklikleri — `src/lib/doctors.ts`:**

```ts
export interface Doctor {
  id: string;
  name: string;
  title: string;
  image: string;
  units: UnitRecord[];        // specialtyTr/En/Ar/Ru/Ka yerine
  stats: { patients: number; surgeries?: number; experience: number };
  email: string;
  educationTr: string[];
  // ... bio alanları aynı
}
// category alanı kalkar
```

**`UnitRecord` taşınır — `src/lib/data/mappers.ts` → `src/lib/units.ts`.**

`UnitRecord` şu an `mappers.ts`'te tanımlı, ama `mappers.ts` zaten `doctors.ts`'ten `Doctor`'ı import ediyor. `Doctor.units: UnitRecord[]` olunca `doctors.ts` de `mappers.ts`'ten import etmek zorunda kalır — döngüsel import. `UnitRecord` kavramsal olarak zaten `Unit`'in yanına ait; `units.ts`'e taşınır:

```ts
// src/lib/units.ts
export type UnitRecord = Unit & { id: string };
```

`mappers.ts` ve `data/units.ts` bunu `units.ts`'ten re-export/import eder. `rowToUnitRecord` mappers.ts'te kalır (satır bazlı dönüşüm oraya ait).

**Türetilen kategori — `src/lib/doctors.ts`'e yeni yardımcılar:**

```ts
export function doctorTypes(doc: Doctor): Set<UnitType>   // birimlerinin type kümesi
export function isSurgical(doc: Doctor): boolean          // en az bir surgical birim
```

**`src/lib/data/doctors.ts`:** `getDoctors` / `getDoctorById` sorguları `doctor_units` üzerinden birimleri de çeker (Supabase nested select: `*, units(*)`).

**`src/lib/data/mappers.ts`:** `DoctorRow`'dan `specialty_*` ve `category` çıkar. `rowToDoctor(row, units)` nested birim satırlarını `Doctor.units`'e eşler.

`doctorToRow` artık birimleri **ifade edemez** — birimler ayrı tabloda. Bu yüzden imzası `doctorToRow(doc, sortOrder): DoctorRow` olarak kalır ama yalnızca `doctors` satırını üretir; birimler çağıranın sorumluluğudur. İki çağıran etkilenir:

- **`scripts/seed.ts`:** `seedDoctors` bugün yalnızca `doctors.upsert` yapıyor. Birimler ayrı tabloya gittiği için ikinci bir adım gerekir: her hekim için `doctor_units` satırlarını `units.tr` üzerinden çözüp upsert etmek. Aksi hâlde seed sonrası tüm hekimler branşsız kalır.
- **`src/app/admin/actions.ts`:** hekim kaydet/güncelle akışı `doctor_units`'i de yazar (önce sil, sonra ekle).

**`src/lib/doctors.ts` statik dizi:** `doctorsData`'daki `specialtyTr/En/Ar/Ru/Ka` alanları `units: UnitRecord[]` olur. Statik veride birimlerin gerçek DB id'si yok; seed sırasında `units.tr` ile çözülür. Bu yüzden statik dizide branş, id yerine `unitTr: string[]` olarak tutulur ve `Doctor` tipi ile seed girdi tipi ayrışır — seed girdisi `Omit<Doctor,"units"> & { unitTr: string[] }`.

**`src/components/HomeClient.tsx`:**
- `initialDoctors` / `doctors` state'inin tipi `typeof doctorsData` (satır 273, 288) yerine açıkça `Doctor[]` olur. `doctorsData` artık seed girdi şeklinde (`unitTr`), `Doctor` ile aynı değil; `typeof doctorsData` yanlış tip verir. Bununla birlikte `doctorsData` importu (satır 24) HomeClient'tan tamamen kalkar — zaten yalnızca tip çıkarımı için duruyordu.
- `selectedUnit` state'i `string | null` (birim `tr` metni) yerine `unitId: string | null` tutar.
- Birim filtresi: `doc.units.some(u => u.id === selectedUnitId)`.
- Sekme filtresi: `activeCategory === "all" || doctorTypes(doc).has(activeCategory)`.
- Arama: hekim adı + tüm birimlerinin beş dildeki etiketleri üzerinde. Bugünkü `doc.specialtyTr/En/Ru/Ka` taraması (satır 318-321) yerini alır.
- Hekim kartında tek branş yerine birim çipleri listelenir.
- `surgicalSpecialties` / `internalSpecialties` (satır 291-292) aynen kalır — bunlar birim listesi, hekim değil.

**`src/components/DoctorDetailClient.tsx`:** Tek branş metni yerine tüm birimler çip olarak. "Gerçekleşen Ameliyat" istatistiği `isSurgical(doctor)` ise gösterilir (bugün `doctor.category === "surgical"`).

**`src/components/admin/AdminPanel.tsx`:**
- Kategori seçimi kaldırılır (satır 159, 197, 229 ve ilgili form alanı).
- Yerine birim listesinden checkbox'lı çoklu seçim.
- "Ameliyat sayısı" alanı, seçili birimlerden en az biri `surgical` ise gösterilir.
- Özet sayaçları (satır 541, 550: `d.category === "surgical"` filtreleri) `isSurgical(d)` / `doctorTypes(d).has("internal")` ile değiştirilir.
- `actions.ts`: hekim kaydet/güncelle akışı `doctor_units` satırlarını da yazar (önce sil, sonra ekle).

**Bilinen sınırlama:** `getUnits`, `units` tablosu boş/yoksa `seed-${i}` sahte id'leriyle statik listeye düşüyor (`src/lib/data/units.ts`). Bu sahte id'ler `doctor_units` ile eşleşmez, dolayısıyla o durumda hekimler branşsız görünür. Yalnızca bozuk-kurulum senaryosu; kabul ediliyor.

### 2. Haber şeridi (marquee)

**Yeni bileşen:** `src/components/shared/NewsTicker.tsx` (client).

- **Kaynak:** Mevcut `news` verisi. `HomeClient` zaten `activeNews = news[locale]` hesaplıyor; şeride prop olarak geçilir. Yeni veri çekme yok.
- **Gösterim:** Her duyurunun `name` alanı, aralarında ayraçla tek satırda.
- **Kayma:** İçerik iki kez basılıp CSS `@keyframes` ile kesintisiz kaydırılır (`translateX(0)` → `translateX(-50%)`). JS animasyon döngüsü yok.
- **Yön:** Arapça (`ar`) için kayma yönü ters çevrilir.
- **Etkileşim:** Hover'da `animation-play-state: paused`. Tıklanınca `#announcements`'a kayar.
- **Erişilebilirlik:** `prefers-reduced-motion: reduce` ise kayma durur, yalnızca en son duyuru sabit görünür.
- **Boş durum:** `activeNews` boşsa şerit hiç render edilmez.

**Yerleşim — dikkat:** `Navbar` `fixed` konumlu ve `Hero`'nun `pt-32`'si onun altını boşaltıyor. Şerit `Navbar` ile `Hero` arasına, normal akışa girer; `Hero`'nun üst boşluğu şerit yüksekliği kadar azaltılır. Aksi hâlde şerit sabit navbar'ın altında kalır. Yükseklik sabit tutulur ki dil değişiminde sayfa zıplamasın.

---

## Test

`vitest` kurulu; `src/lib/data/mappers.test.ts` ve `src/lib/doctors.units.test.ts` mevcut.

**Yeni testler:**

- **Locale fallback** (`src/lib/locale.test.ts`): kayıtlı `tr` + public kümesi → `null`; kayıtlı `ru` + public kümesi → `ru`; kayıtlı `tr` + admin kümesi → `tr`.
- **Kategori türetme** (`src/lib/doctors.test.ts`): cerrahi+dahili birimi olan hekim `doctorTypes` ile iki tipi de döner; `isSurgical` en az bir cerrahi birimde `true`; birimsiz hekim boş küme.
- **`doctor_units` mapper** (`mappers.test.ts`): nested `units` satırları `Doctor.units`'e doğru eşlenir; boş birim listesi `[]` döner.
- **`д-р` regresyonu** (`doctors.test.ts`): `formatDoctorName` dört ünvan varyantı için de `ru` locale'de `д-р` içermez.

**Güncellenecek:** `src/lib/doctors.units.test.ts` şu an `doctorsData` üzerinde `specialtyTr`'nin bir birime eşleştiğini ve beş dilin birimin çevirileriyle birebir aynı olduğunu denetliyor. Çoklu branşa geçince `specialty*` alanları kalmıyor; test, statik dizideki her `unitTr` girdisinin bilinen bir birime eşleştiğini doğrulayacak şekilde yazılır. Dil karşılaştırması anlamsızlaşıyor (branş adı artık yalnızca `units`'te), o testi silinir.

**Elle doğrulama:** `npm run dev` ile ana sayfa, hekim detay ve admin; dört public dilde şerit + branş çipleri; admin'de Türkçe'nin durduğu.

## Uygulama sırası

1. Grup A (3, 6, 7) — bağımsız, düşük risk.
2. Madde 4 (4a → 4c → 4d kod; 4b DB update ayrı ve doğrulamalı).
3. Grup B (1) — Navbar prop'u + locale fallback + testler.
4. Madde 5 — şema → kuru migration → rapor incelemesi → yazma → kod → kolon düşürme.
5. Madde 2 — NewsTicker + Hero boşluk ayarı.

Madde 5'in kolon düşürme adımı, madde 2'nin yerleşim ayarı Grup A'daki Hero değişikliğinden sonra yapılmalı (ikisi de `Hero.tsx`'in üst boşluğuna dokunuyor).
