# Tasarım: Admin Panelini Gerçek Veritabanına Bağlama (Supabase)

**Tarih:** 2026-06-29
**Durum:** Onay bekliyor (kullanıcı gözden geçirmesi)

## Amaç

Şu an doktor ve haber verileri `src/lib/*.ts` içinde statik tutuluyor; admin panelinin
yaptığı değişiklikler yalnızca o tarayıcının `localStorage`'ına yazılıyor — yani başka
ziyaretçilere veya sunucuya yansımıyor. Hedef: admin panelini gerçek bir veritabanına
(Supabase) bağlayarak yapılan değişikliklerin **kalıcı** olması ve **tüm ziyaretçilere**
yansıması.

## Kararlar (kullanıcı onaylı)

- **Platform:** Supabase (Postgres + Auth + Storage)
- **Admin girişi:** Supabase Auth, e-posta + şifre
- **Görseller:** Supabase Storage'a gerçek dosya yükleme
- **Kapsam:** Doktorlar + Haberler
- **Veri okuma stratejisi (A):** Açık sayfalar sunucu tarafında (Server Components) DB'den
  okur → güçlü SEO, anında dolu sayfa. Admin yazma işlemleri güvenli Server Actions ile.

## Next.js sürüm notları (16.2.9 — breaking changes)

`AGENTS.md` uyarınca `node_modules/next/dist/docs/` okundu:
- **`middleware.ts` → `proxy.ts`** olarak yeniden adlandırıldı (Next 16). Aynı işlev.
  Yalnızca optimistik auth yönlendirmesi için; asıl yetkilendirme değil.
- Mutasyonlar **Server Actions** (`'use server'`) ile yapılır. Her action içinde oturum
  doğrulanmalı (action'lar doğrudan POST ile çağrılabildiği için). Mutasyon sonrası
  `revalidatePath()` / `refresh()` ile UI tazelenir.

## Mimari

```
Tarayıcı
  ├─ Açık sayfalar (/, /doctors/[id])
  │     → Server Component veriyi Supabase'den çeker → hazır HTML
  │       UI/tasarım ve dil değiştirme davranışı AYNI kalır; sadece veri kaynağı değişir
  │
  └─ /admin
        → proxy.ts oturumsuz erişimi giriş ekranına yönlendirir (optimistik)
        → formlar Server Actions çağırır
              → her action içinde oturum doğrulanır (asıl güvenlik)
              → Supabase'e yazar + revalidatePath ile sayfaları tazeler
```

### Dosya yapısı (eklenecek / değişecek)

```
src/lib/supabase/server.ts     → sunucu Supabase istemcisi (@supabase/ssr, cookie tabanlı)
src/lib/data/doctors.ts        → getDoctors(), getDoctorById(id) + satır→Doctor mapper
src/lib/data/news.ts           → getNews() + satır→NewsData mapper
src/app/admin/actions.ts       → "use server": doktor/haber CRUD, görsel yükleme, giriş/çıkış
src/components/HomeClient.tsx   → mevcut page.tsx UI'ı (doctors & news props ile alır)
proxy.ts                        → /admin koruması (proje kökü, app ile aynı seviye)
scripts/seed.ts                 → mevcut doctorsData/newsData'yı DB'ye bir kez aktarır
.env.local                      → Supabase anahtarları (gitignore'da)
```

`src/lib/doctors.ts` içindeki `formatDoctorName`, `getCleanName` ve `Doctor` tipi **kalır**
(saf fonksiyonlar). Statik `doctorsData`/`newsData` dizileri yalnızca seed kaynağı olur.

### Değişecek mevcut dosyalar

- `src/app/page.tsx`: dev/büyük client bileşeninden → küçük **Server Component**'e. Veriyi
  `getDoctors()`/`getNews()` ile çeker, `HomeClient`'a props geçer. Mevcut tüm UI/çeviri/animasyon
  mantığı `HomeClient.tsx`'e taşınır; `localStorage` senkronizasyonu kaldırılır.
- `src/app/doctors/[id]/page.tsx`: Server Component'e dönüşür; `getDoctorById` ile veri çeker,
  `generateMetadata` ile doktora özel SEO. Dil etkileşimi için ince bir client alt-bileşen.
- `src/app/admin/page.tsx`: client kalır (form state yoğun), ama `localStorage` çağrıları
  Server Action çağrılarıyla değişir; sahte giriş → Supabase Auth; fotoğraf için dosya yükleme
  input'u eklenir.

## Veri modeli (Postgres)

### `doctors`
| Sütun | Tip | Not |
|------|-----|-----|
| id | text (PK) | mevcut "4177" gibi id'ler korunur |
| name | text | |
| title | text | |
| image | text | foto URL'i (mevcutlar `/assets/...`, yeniler Storage URL'i) |
| specialty_tr | text | |
| specialty_en | text | |
| specialty_ar | text null | |
| specialty_ru | text | |
| specialty_ka | text | |
| category | text | 'surgical' \| 'internal' (CHECK kısıtı) |
| stats_patients | int | |
| stats_experience | int | |
| stats_surgeries | int null | yalnızca cerrahi |
| email | text | |
| education_tr | text[] | |
| education_en | text[] | |
| education_ar | text[] null | |
| bio_tr | text | |
| bio_en | text | |
| bio_ar | text null | |
| bio_ru | text | |
| bio_ka | text | |
| sort_order | int | varsayılan 0; yeni eklenen başa gelsin |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `news`
Mevcut "5 dilbazlı dizi" yapısı, **tek satır + çoklu dil sütunu**na sadeleştirilir. Bir haber =
1 görsel + 5 dilde başlık/etiket/açıklama (admin zaten böyle düzenliyor, aynı `src`'yi paylaşan
5 dildeki kayıtlar tek satırda birleşir).

| Sütun | Tip |
|------|-----|
| id | uuid (PK, default gen_random_uuid()) |
| image | text |
| name_tr / name_en / name_ar / name_ru / name_ka | text (başlık) |
| designation_tr / ... / designation_ka | text (etiket) |
| quote_tr / ... / quote_ka | text (açıklama) |
| sort_order | int |
| created_at / updated_at | timestamptz |

Veri katmanı, DB satırını mevcut `Doctor` / `NewsItem` / `NewsData` tiplerine çeviren saf
**mapper** fonksiyonlarıyla okur → UI bileşenlerinin hiçbiri değişmez.

## Kimlik doğrulama (Supabase Auth)

- Admin kullanıcı(lar)ı **Supabase panelinden elle** oluşturulur — herkese açık kayıt yok.
- Giriş bir Server Action ile Supabase'e kimlik doğrular; oturum **httpOnly cookie**'de
  (`@supabase/ssr`).
- İki katman: (1) `proxy.ts` optimistik yönlendirme, (2) her Server Action içinde sunucu
  tarafı oturum doğrulaması (asıl güvenlik).
- Mevcut `localStorage.farabi_admin_logged` sahte girişi kaldırılır.

## Görseller (Supabase Storage)

- Public bir bucket: `media`, içinde `doctors/` ve `news/` klasörleri.
- Admin formuna dosya seçici → Server Action Storage'a yükler → public URL `image`'a yazılır.
- Mevcut `/public/assets/doctors/*` fotoğrafları olduğu gibi kalır (seed'de `image` = mevcut yol).
  Yalnızca yeni yüklemeler Storage'a gider. İki kaynak da sadece URL — toplu taşıma gerekmez.

## Veri taşıma (seed)

- `scripts/seed.ts` (`npm run seed`): `doctorsData`/`newsData`'yı service_role anahtarıyla
  Supabase'e yazar. Haberlerin 5 dildeki dizileri `news` satırlarına birleştirilir.
- **Idempotent:** mevcut id varsa günceller/atlar → tekrar çalışınca kopya oluşmaz.

## Önbellek / anında yansıma

- Admin mutasyonları ilgili action'da `revalidatePath('/')` ve düzenlenen doktor için
  `revalidatePath('/doctors/[id]')` çağırır → değişiklik tüm ziyaretçilere yansır.

## Ortam değişkenleri

`.env.local` (ve Vercel proje ayarları):
- `NEXT_PUBLIC_SUPABASE_URL` = `https://nvnezyiqvywlwfxtlmuq.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Supabase Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY` = (gizli; yalnızca sunucu/seed/yükleme)

Yeni paketler: `@supabase/supabase-js`, `@supabase/ssr`.
Anahtarlar koda/commit'e **asla** gömülmez; sadece env değişken adları kullanılır.

## Test yaklaşımı

- **Birim testleri (TDD):** DB satırı ↔ `Doctor`/`NewsItem` mapper fonksiyonları (saf, kritik mantık).
- **Manuel doğrulama (E2E):** giriş → doktor ekle/düzenle/sil → fotoğraf yükle → ana sayfada ve
  farklı tarayıcıda yansımayı gör. `npm run build` temiz geçmeli.

## Kullanıcının yapacağı (kod dışı) adımlar

1. Supabase projesini açmak (yapıldı: ref `nvnezyiqvywlwfxtlmuq`) ve anon + service_role
   anahtarlarını `.env.local`'e koymak. (yapıldı)
2. Supabase panelinden admin kullanıcısını (e-posta+şifre) oluşturmak.
3. Tabloları/bucket'ı kurmak için hazırlanacak SQL'i Supabase SQL editöründe çalıştırmak.
4. Vercel'e aynı ortam değişkenlerini girmek.

## Kapsam dışı (YAGNI)

- Mevcut /public fotoğraflarının toplu Storage'a taşınması.
- Çoklu admin rolleri/yetki seviyeleri (tek seviye yeterli).
- Genel ziyaretçi kaydı/üyelik.
```
