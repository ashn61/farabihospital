# Tasarım: Birim Kategorileri, Memnuniyet Kaldırma ve İ→I Düzeltmesi

**Tarih:** 2026-07-10
**Durum:** Onay bekliyor

## Genel Bakış

Üç bağımsız değişiklik:

1. **Memnuniyet oranını (%99.8) tamamen kaldır** — 3 yerde.
2. **İngilizce'de İ→I** — `<html lang>` özniteliğini seçilen dile göre dinamik yap.
3. **Birimler → kategori** — Merkezi bir birim listesi (~55 birim, 5 dilde, her biri Cerrahi/Dahili tipli) oluştur; doktor formunda birim dropdown'dan seçilsin; ana sayfada "Tıbbi Birimler" bu listeden gelsin; **mevcut doktorlar da ilgili birime taşınsın**.

---

## 1. Memnuniyet Oranını Kaldırma

`%99.8` üç yerde görünüyor, üçü de komple kaldırılacak:

| Dosya | Yer | İşlem |
|-------|-----|-------|
| `src/components/sections/Hero.tsx` | ~273-284: sol üst yüzen "MÜKEMMELLİK MERKEZİ / %99.8 Hasta Memnuniyeti" rozeti | `motion.div` bloğu komple silinir |
| `src/components/DoctorDetailClient.tsx` | ~224-229: 3'lü metrik şeridin ortasındaki "Memnuniyet Oranı %99.8" kartı | Kart silinir; kapsayıcı `grid-cols-3` → `grid-cols-2` (Deneyim + Ameliyat kalır). `patientsTitle` çeviri anahtarları (satır 26, 43…) temizlenir |
| `src/components/HomeClient.tsx` | ~671: ana sayfa istatistiğindeki "%99.8" ve `patientsHealed` etiketi | İstatistik bloğu ve 5 dildeki `patientsHealed` anahtarları kaldırılır |

Not: Uygulama sırasında `HomeClient.tsx`'teki tam blok konumu (satır ~660-680) okunup istatistik ızgarasının kolon sayısı buna göre düzeltilecek.

---

## 2. İngilizce'de İ → I (Dinamik `lang`)

**Kök sebep:** `src/app/layout.tsx` içinde `<html lang="tr">` sabit. CSS `text-transform: uppercase` Türkçe casing kuralını uyguladığı için İngilizce metinlerdeki `i` → `İ` (noktalı) oluyor (ör. "SPECIALTIES" → "SPECİALTİES").

**Çözüm:** Locale state'ini tutan client bileşenlerinde, locale değiştikçe `document.documentElement.lang` güncellenir:

- `src/components/HomeClient.tsx` — `locale` state var:
  ```ts
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  ```
- `src/components/DoctorDetailClient.tsx` — `locale` prop/state'i neyse ona bağlı aynı efekt eklenir.

Böylece İngilizce (ve AR/RU/KA) seçildiğinde tüm büyük-harf dönüşümleri doğru casing ile render edilir. `layout.tsx` başlangıç değeri `tr` kalır (ilk yükleme Türkçe).

---

## 3. Birimler: Veri Modeli

**Yeni dosya `src/lib/units.ts`:**

```ts
export type UnitType = "surgical" | "internal"; // C = Cerrahi, D = Dahili

export interface Unit {
  tr: string;
  en: string;
  ar: string;
  ru: string;
  ka: string;
  type: UnitType;
}

export const units: Unit[] = [ /* aşağıdaki tablo */ ];
```

### Birim Listesi (tekilleştirilmiş + normalize edilmiş)

Senin verdiğin listeden türetildi. **Normalizasyonlar:** `Peditrik→Pediatri`, `İmmünoloj→İmmünoloji`, `Allerji→Alerji`; kesik kısa adlar yok sayıldı, tam poliklinik adı kullanıldı. **Tekrarlar birleştirildi:** Dahiliye Polikliniği (×3→1), Pediatri Hematoloji ve Onkoloji (×2→1).

#### Cerrahi Birimler (C → `surgical`)

| tr | en | ar | ru | ka |
|----|----|----|----|----|
| Beyin Cerrahi Polikliniği | Neurosurgery | جراحة الأعصاب | Нейрохирургия | ნეიროქირურგია |
| Göz Polikliniği | Ophthalmology | طب العيون | Офтальмология | ოფთალმოლოგია |
| Plastik Cerrahi Polikliniği | Plastic Surgery | الجراحة التجميلية | Пластическая хирургия | პლასტიკური ქირურგია |
| Plastik Cerrahi Yanık Polikliniği | Plastic Surgery & Burns | الجراحة التجميلية والحروق | Пластическая хирургия и ожоги | პლასტიკური ქირურგია და დამწვრობა |
| Üroloji Polikliniği | Urology | المسالك البولية | Урология | უროლოგია |
| Çocuk Ürolojisi Polikliniği | Pediatric Urology | مسالك بولية الأطفال | Детская урология | ბავშვთა უროლოგია |
| Kulak-Burun-Boğaz Polikliniği | Otorhinolaryngology (ENT) | أنف وأذن وحنجرة | Оториноларингология (ЛОР) | ყელ-ყურ-ცხვირი |
| Girişimsel Radyoloji | Interventional Radiology | الأشعة التداخلية | Интервенционная радиология | ინტერვენციული რადიოლოგია |
| Algoloji Polikliniği | Algology (Pain Medicine) | علاج الألم | Альгология (лечение боли) | ალგოლოგია (ტკივილის მედიცინა) |
| Kalp-Damar Cerrahi Polikliniği | Cardiovascular Surgery | جراحة القلب والأوعية | Сердечно-сосудистая хирургия | კარდიოვასკულური ქირურგია |
| Organ Nakli Polikliniği | Organ Transplantation | زراعة الأعضاء | Трансплантация органов | ორგანოთა ტრანსპლანტაცია |
| Kadın-Doğum Polikliniği | Obstetrics & Gynecology | النساء والتوليد | Акушерство и гинекология | მეანობა-გინეკოლოგია |
| Çocuk Cerrahisi Polikliniği | Pediatric Surgery | جراحة الأطفال | Детская хирургия | ბავშვთა ქირურგია |
| Genel Cerrahi Polikliniği | General Surgery | الجراحة العامة | Общая хирургия | ზოგადი ქირურგია |
| Ortopedi Polikliniği | Orthopedics | جراحة العظام | Ортопедия | ორთოპედია |
| Perinatoloji Ünitesi | Perinatology Unit | وحدة طب الأجنة | Отделение перинатологии | პერინატოლოგიის განყოფილება |
| Göğüs Cerrahisi Polikliniği | Thoracic Surgery | جراحة الصدر | Торакальная хирургия | თორაკალური ქირურგია |

#### Dahili Birimler (D → `internal`)

| tr | en | ar | ru | ka |
|----|----|----|----|----|
| Cildiye Polikliniği | Dermatology | الجلدية | Дерматология | დერმატოლოგია |
| Çocuk Psikiyatrisi Polikliniği | Child Psychiatry | الطب النفسي للأطفال | Детская психиатрия | ბავშვთა ფსიქიატრია |
| Göğüs İmmünoloji ve Alerji Polikliniği | Chest Immunology & Allergy | مناعة وحساسية الصدر | Иммунология и аллергология органов дыхания | გულმკერდის იმუნოლოგია და ალერგია |
| Gastroenteroloji Polikliniği | Gastroenterology | أمراض الجهاز الهضمي | Гастроэнтерология | გასტროენტეროლოგია |
| Enfeksiyon Polikliniği | Infectious Diseases | الأمراض المعدية | Инфекционные болезни | ინფექციური დაავადებები |
| Fizik Tedavi Polikliniği | Physical Therapy | العلاج الطبيعي | Физиотерапия | ფიზიოთერაპია |
| Fizik Tedavi-Romatoloji Polikliniği | Physical Therapy & Rheumatology | العلاج الطبيعي والروماتيزم | Физиотерапия и ревматология | ფიზიოთერაპია და რევმატოლოგია |
| Psikiyatri Polikliniği | Psychiatry | الطب النفسي | Психиатрия | ფსიქიატრია |
| Radyasyon Onkolojisi Polikliniği | Radiation Oncology | علاج الأورام بالإشعاع | Радиационная онкология | რადიაციული ონკოლოგია |
| Dahiliye Polikliniği | Internal Medicine | الطب الباطني | Терапия | შინაგანი მედიცინა |
| Dahiliye Romatoloji Polikliniği | Internal Medicine Rheumatology | باطنية روماتيزم | Терапия (ревматология) | შინაგანი მედიცინა – რევმატოლოგია |
| Nefroloji Polikliniği | Nephrology | أمراض الكلى | Нефрология | ნეფროლოგია |
| Endokrinoloji Polikliniği | Endocrinology | الغدد الصماء | Эндокринология | ენდოკრინოლოგია |
| Kardiyoloji Polikliniği | Cardiology | أمراض القلب | Кардиология | კარდიოლოგია |
| Koroner Polikliniği | Coronary Clinic | عيادة القلب التاجية | Коронарная клиника | კორონარული კლინიკა |
| Genel Pediatri Polikliniği | General Pediatrics | طب الأطفال العام | Общая педиатрия | ზოგადი პედიატრია |
| Nöroloji Polikliniği | Neurology | طب الأعصاب | Неврология | ნევროლოგია |
| Pediatri Kardiyoloji Polikliniği | Pediatric Cardiology | قلب الأطفال | Детская кардиология | ბავშვთა კარდიოლოგია |
| Pediatri Endokrin Polikliniği | Pediatric Endocrinology | غدد الأطفال الصماء | Детская эндокринология | ბავშვთა ენდოკრინოლოგია |
| Pediatri Hematoloji ve Onkoloji Polikliniği | Pediatric Hematology & Oncology | أمراض دم وأورام الأطفال | Детская гематология и онкология | ბავშვთა ჰემატოლოგია და ონკოლოგია |
| Pediatri Nöroloji Polikliniği | Pediatric Neurology | أعصاب الأطفال | Детская неврология | ბავშვთა ნევროლოგია |
| Pediatri İmmünoloji ve Alerji Polikliniği | Pediatric Immunology & Allergy | مناعة وحساسية الأطفال | Детская иммунология и аллергология | ბავშვთა იმუნოლოგია და ალერგია |
| Pediatri Nefroloji Polikliniği | Pediatric Nephrology | كلى الأطفال | Детская нефрология | ბავშვთა ნეფროლოგია |
| Pediatri Göğüs Hastalıkları Polikliniği | Pediatric Pulmonology | أمراض صدر الأطفال | Детская пульмонология | ბავშვთა პულმონოლოგია |
| Pediatri Enfeksiyon Polikliniği | Pediatric Infectious Diseases | أمراض معدية للأطفال | Детские инфекционные болезни | ბავშვთა ინფექციური დაავადებები |
| Pediatri Romatoloji Polikliniği | Pediatric Rheumatology | روماتيزم الأطفال | Детская ревматология | ბავშვთა რევმატოლოგია |
| Pediatri Onkoloji Polikliniği | Pediatric Oncology | أورام الأطفال | Детская онкология | ბავშვთა ონკოლოგია |
| Pediatri Gastroenteroloji Polikliniği | Pediatric Gastroenterology | جهاز هضمي الأطفال | Детская гастроэнтерология | ბავშვთა გასტროენტეროლოგია |
| Pediatri KİT Polikliniği | Pediatric Bone Marrow Transplant | زراعة نخاع الأطفال | Детская трансплантация костного мозга | ბავშვთა ძვლის ტვინის ტრანსპლანტაცია |
| Anesteziyoloji Polikliniği | Anesthesiology | التخدير | Анестезиология | ანესთეზიოლოგია |
| Korona 19 Erişkin Poliklinik | COVID-19 Adult Clinic | عيادة كوفيد-19 للبالغين | Клиника COVID-19 (взрослые) | COVID-19 ზრდასრულთა კლინიკა |
| Radyoloji Ünitesi | Radiology Unit | وحدة الأشعة | Отделение радиологии | რადიოლოგიის განყოფილება |
| Medikal Onkoloji Polikliniği | Medical Oncology | الأورام الطبية | Медицинская онкология | სამედიცინო ონკოლოგია |
| İmmünoloji Polikliniği | Immunology | المناعة | Иммунология | იმუნოლოგია |
| Hematoloji Polikliniği | Hematology | أمراض الدم | Гематология | ჰემატოლოგია |
| Yenidoğan Polikliniği | Neonatology | حديثي الولادة | Неонатология | ნეონატოლოგია |
| Nükleer Tıp Polikliniği | Nuclear Medicine | الطب النووي | Ядерная медицина | ბირთვული მედიცინა |
| Göğüs Hastalıkları Polikliniği | Pulmonology (Chest Diseases) | أمراض الصدر | Пульмонология | პულმონოლოგია |
| **Tıbbi Genetik Polikliniği** ⚠ | Medical Genetics | الوراثة الطبية | Медицинская генетика | სამედიცინო გენეტიკა |

⚠ **Açık madde:** "Tıbbi Genetik" senin verdiğin listede yoktu, ama mevcut doktor **Selçuk ARSLAN** bu uzmanlıkta. Doktoru bir birime taşıyabilmek için listeye **Dahili** olarak eklendi. İstemiyorsan söyle — o zaman bu doktora başka bir birim seçmemiz gerekir.

**Toplam:** 17 Cerrahi + 39 Dahili = **56 birim**.

---

## 4. Admin Doktor Formu (`AdminPanel.tsx`)

- **"Kategori" dropdown'u** (Cerrahi/Dahili) → **"Birim" dropdown'u** ile değiştirilir. `<optgroup label="Cerrahi Birimler">` ve `<optgroup label="Dahili Birimler">` altında `units` listelenir (değer olarak birimin `tr` adı veya index).
- Birim seçilince:
  - `docCategory` = seçilen birimin `type`'ı (otomatik).
  - `docSpec` (tr/en/ar/ru/ka) = seçilen birimin çevirileri (otomatik doldurulur).
- **"Uzmanlık Alanı (Birim)" serbest metin bölümü** (langs sekmesi, ~777-800) kaldırılır. Dil sekmesinde sadece **Bio** metinleri kalır.
- Ameliyat sayısı alanı yine `type === "surgical"` ise aktif olur (mevcut mantık `docCategory` üzerinden korunur).
- Düzenleme (edit) akışında: doktorun mevcut `specialtyTr`'si `units` içinde eşleşen birimi seçili getirir; eşleşme yoksa ilk birim veya boş seçenek gösterilir.

---

## 5. Ana Sayfa "Tıbbi Birimler" (`HomeClient.tsx`)

- Sabit `surgicalSpecialties` / `internalSpecialties` dizileri (~270-291) kaldırılır.
- Bölüm `units`'ten beslenir: `units.filter(u => u.type === "surgical")` ve `internal`. Mevcut Cerrahi/Dahili sekme (`specialtiesTab`) yapısı ve kart tasarımı korunur.
- Kartta gösterilen ad: `locale`'e göre `unit[locale]`. "Birim Hekimlerini Gör" oku tıklanınca `setSearchQuery(unit.tr)` + ilgili kategori filtresi (mevcut davranış korunur).

---

## 6. Mevcut Doktorların Birime Taşınması (`doctors.ts`)

Her mevcut doktorun `specialtyTr`'si uygun birime eşlenir. Uygulamada her doktor kaydının **`specialtyTr/En/Ar/Ru/Ka` alanları o birimin çevirileriyle güncellenir** ve `category` birimin tipinden atanır. (Doktorun bio/isim/foto/istatistik alanları korunur.)

### Eşleme Tablosu

| # | Doktor | Eski specialtyTr | → Birim | Tip |
|---|--------|------------------|---------|-----|
| 1 | Celal TEKİNBAŞ | Göğüs Cerrahisi & Başhekim | Göğüs Cerrahisi Polikliniği | C |
| 2 | Ayşenur BAHADIR | Çocuk Sağlığı ve Hastalıkları | Genel Pediatri Polikliniği | D |
| 3 | Bircan SÖNMEZ | Çocuk Onkolojisi & Hematolojisi | Pediatri Hematoloji ve Onkoloji Polikliniği | D |
| 4 | Deniz AKSU ARICA | Dermatoloji (Deri ve Zührevi) | Cildiye Polikliniği | D |
| 5 | Elif ACAR ARSLAN | Çocuk Nörolojisi | Pediatri Nöroloji Polikliniği | D |
| 6 | Hatice Bengü YALDIZ ÇOBANOĞLU | Kulak Burun Boğaz (KBB) | Kulak-Burun-Boğaz Polikliniği | C |
| 7 | Selçuk ARSLAN | Tıbbi Genetik | Tıbbi Genetik Polikliniği ⚠ | D |
| 8 | İlke Onur KAZAZ | Üroloji (Onkolojik) | Üroloji Polikliniği | C |
| 9 | Fatih ÇOLAK | Göğüs Cerrahisi | Göğüs Cerrahisi Polikliniği | C |
| 10 | Kerim ÖNER | Çocuk Sağlığı ve Hastalıkları | Genel Pediatri Polikliniği | D |
| 11 | Leyla BAYKAL SELÇUK | Dermatoloji | Cildiye Polikliniği | D |
| 12 | Mürsel ŞAHİN | Kardiyoloji | Kardiyoloji Polikliniği | D |
| 13 | Seher Nazlı KAZAZ | Göğüs Hastalıkları | Göğüs Hastalıkları Polikliniği ⚠ | D |
| 14 | Abdülcemal Ümit IŞIK | İç Hastalıkları (Gastroenteroloji) | Gastroenteroloji Polikliniği | D |
| 15 | Adnan ÇALIK | Genel Cerrahi (Gastrointestinal) | Genel Cerrahi Polikliniği | C |
| 16 | Ahmet Coşkun ÖZDEMİR | İç Hastalıkları (Dahiliye) | Dahiliye Polikliniği | D |
| 17 | Atila TÜRKYILMAZ | Göğüs Cerrahisi & Akciğer Nakli | Göğüs Cerrahisi Polikliniği | C |
| 18 | Erhan ARSLAN | Beyin ve Sinir Cerrahisi (Nöroşirürji) | Beyin Cerrahi Polikliniği | C |
| 19 | Erol ERDURAN | Çocuk Hematolojisi | Pediatri Hematoloji ve Onkoloji Polikliniği | D |
| 20 | Ersagun KARAGÜZEL | Çocuk Ürolojisi | Çocuk Ürolojisi Polikliniği | C |
| 21 | Ertuğrul ÇAKIR | Beyin ve Sinir Cerrahisi | Beyin Cerrahi Polikliniği | C |
| 22 | Fazıl ORHAN | Çocuk Alerjisi ve İmmünolojisi | Pediatri İmmünoloji ve Alerji Polikliniği | D |
| 23 | Hidayet ERDÖL | Göz Hastalıkları (Retina & Şaşılık) | Göz Polikliniği | C |
| 24 | Mehmet SÖNMEZ | Erişkin Hematoloji (Kan Hastalıkları) | Hematoloji Polikliniği | D |
| 25 | Merih KUTLU | Kardiyoloji & Girişimsel Anjiyo | Kardiyoloji Polikliniği | D |
| 26 | Muhammet URALOĞLU | Plastik, Rekonstrüktif ve Estetik Cerrahi | Plastik Cerrahi Polikliniği | C |
| 27 | Murat ÇAKIR | Çocuk Gastroenterolojisi | Pediatri Gastroenteroloji Polikliniği | D |
| 28 | Murat LİVAOĞLU | Plastik, Rekonstrüktif ve Estetik Cerrahi | Plastik Cerrahi Polikliniği | C |
| 29 | Mustafa İMAMOĞLU | Çocuk Cerrahisi | Çocuk Cerrahisi Polikliniği | C |
| 30 | Ömer GEDİKLİ | Kulak Burun Boğaz (KBB) | Kulak-Burun-Boğaz Polikliniği | C |
| 31 | Selçuk ARSLAN (2. kayıt) | Tıbbi Genetik | Tıbbi Genetik Polikliniği ⚠ | D |
| 32 | Selçuk KAYA | Enfeksiyon Hastalıkları | Enfeksiyon Polikliniği | D |
| 33 | Serdar TÜRKYILMAZ | Genel Cerrahi (Meme & Endokrin) | Genel Cerrahi Polikliniği | C |
| 34 | Süleyman BAYKAL | Beyin ve Sinir Cerrahisi | Beyin Cerrahi Polikliniği | C |
| 35 | Süleyman GUVEN | Kadın Hastalıkları ve Doğum & IVF | Kadın-Doğum Polikliniği | C |
| 36 | Yılmaz BÜLBÜL | Göğüs Hastalıkları | Göğüs Hastalıkları Polikliniği ⚠ | D |

⚠ **İkinci açık madde:** #13 ve #36 "Göğüs Hastalıkları Polikliniği"ne (Dahili) eşlendi — bu birim senin listende var ve birim listesine eklendi.

⚠ **Üçüncü açık madde:** **Selçuk ARSLAN iki kez kayıtlı** (#7 ve #31, ikisi de Tıbbi Genetik). Bu muhtemelen yinelenen bir kayıt. Bu spec kapsamında **dokunmuyoruz** (ikisi de aynı birime taşınır); istersen ayrı olarak birini silebiliriz.

---

## Kapsam Dışı / Dokunulmayanlar

- Supabase şeması (`category` alanı `surgical/internal` string olarak kalır; birim adı `specialty` alanlarında saklanır — yeni kolon eklenmez).
- Doktor bio, foto, istatistik, isim alanları.
- Yinelenen Selçuk ARSLAN kaydının silinmesi (ayrı iş).

## Test / Doğrulama (manuel)

1. Ana sayfa "Tıbbi Birimler" → Cerrahi/Dahili sekmelerinde 17/39 birim listeleniyor.
2. Dil İngilizce yapılınca büyük-harf başlıklar "I" ile çıkıyor (İ değil).
3. Memnuniyet %99.8 hiçbir yerde görünmüyor (Hero, doktor detay, ana sayfa).
4. Admin → doktor ekle → Birim dropdown'dan seçim → kategori ve 5 dilli uzmanlık otomatik doluyor.
5. Mevcut bir doktorun detay sayfasında birim adı doğru ve kategorisi doğru.
6. `npm run build` / tsc hatasız.
```
