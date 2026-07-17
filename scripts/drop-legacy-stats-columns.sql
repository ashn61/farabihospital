-- Hiçbir yerde gösterilmeyen ölü istatistik kolonları.
-- ÖN KOŞUL: yedek alınmış ve doğrulanmış, uygulama kodu güncel
-- (stats_* artık okunmuyor/yazılmıyor).
-- Yedek: public.doctors_legacy_stats_backup

alter table public.doctors drop column if exists stats_patients;
alter table public.doctors drop column if exists stats_experience;
alter table public.doctors drop column if exists stats_surgeries;
