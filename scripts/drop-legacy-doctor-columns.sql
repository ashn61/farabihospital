-- Çoklu branşa geçiş sonrası artık okunmayan kolonlar.
-- ÖN KOŞUL: doctor_units dolu ve doğrulanmış, uygulama kodu güncel.
-- Yedek: public.doctors_legacy_specialty_backup

alter table public.doctors drop column if exists specialty_tr;
alter table public.doctors drop column if exists specialty_en;
alter table public.doctors drop column if exists specialty_ar;
alter table public.doctors drop column if exists specialty_ru;
alter table public.doctors drop column if exists specialty_ka;
alter table public.doctors drop column if exists category;
