import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { units, findUnitByTr } from "../src/lib/units";

// current specialty_tr (DB) -> target unit tr name (spec §6)
const MAP: Record<string, string> = {
  "Göğüs Cerrahisi & Başhekim": "Göğüs Cerrahisi Polikliniği",
  "Çocuk Sağlığı ve Hastalıkları": "Genel Pediatri Polikliniği",
  "Çocuk Onkolojisi & Hematolojisi": "Pediatri Hematoloji ve Onkoloji Polikliniği",
  "Dermatoloji (Deri ve Zührevi)": "Cildiye Polikliniği",
  "Çocuk Nörolojisi": "Pediatri Nöroloji Polikliniği",
  "Kulak Burun Boğaz (KBB)": "Kulak-Burun-Boğaz Polikliniği",
  "Tıbbi Genetik": "Tıbbi Genetik Polikliniği",
  "Üroloji (Onkolojik)": "Üroloji Polikliniği",
  "Göğüs Cerrahisi": "Göğüs Cerrahisi Polikliniği",
  "Dermatoloji": "Cildiye Polikliniği",
  "Kardiyoloji": "Kardiyoloji Polikliniği",
  "Göğüs Hastalıkları": "Göğüs Hastalıkları Polikliniği",
  "İç Hastalıkları (Gastroenteroloji)": "Gastroenteroloji Polikliniği",
  "Genel Cerrahi (Gastrointestinal)": "Genel Cerrahi Polikliniği",
  "İç Hastalıkları (Dahiliye)": "Dahiliye Polikliniği",
  "Göğüs Cerrahisi & Akciğer Nakli": "Göğüs Cerrahisi Polikliniği",
  "Beyin ve Sinir Cerrahisi (Nöroşirürji)": "Beyin Cerrahi Polikliniği",
  "Çocuk Hematolojisi": "Pediatri Hematoloji ve Onkoloji Polikliniği",
  "Çocuk Ürolojisi": "Çocuk Ürolojisi Polikliniği",
  "Beyin ve Sinir Cerrahisi": "Beyin Cerrahi Polikliniği",
  "Çocuk Alerjisi ve İmmünolojisi": "Pediatri İmmünoloji ve Alerji Polikliniği",
  "Göz Hastalıkları (Retina & Şaşılık)": "Göz Polikliniği",
  "Erişkin Hematoloji (Kan Hastalıkları)": "Hematoloji Polikliniği",
  "Kardiyoloji & Girişimsel Anjiyo": "Kardiyoloji Polikliniği",
  "Plastik, Rekonstrüktif ve Estetik Cerrahi": "Plastik Cerrahi Polikliniği",
  "Çocuk Gastroenterolojisi": "Pediatri Gastroenteroloji Polikliniği",
  "Çocuk Cerrahisi": "Çocuk Cerrahisi Polikliniği",
  "Enfeksiyon Hastalıkları": "Enfeksiyon Polikliniği",
  "Genel Cerrahi (Meme & Endokrin)": "Genel Cerrahi Polikliniği",
  "Kadın Hastalıkları ve Doğum & IVF": "Kadın-Doğum Polikliniği",
  // DB'de admin'den düzenlenmiş/eklenmiş kayıtlar:
  "Çocuk Hematoloji": "Pediatri Hematoloji ve Onkoloji Polikliniği",
  "Medikal Onkoloji(Kemoterapi)": "Medikal Onkoloji Polikliniği",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function seedUnits() {
  const { count, error: countErr } = await supabase
    .from("units")
    .select("*", { count: "exact", head: true });
  if (countErr) throw new Error(`units count failed: ${countErr.message}`);
  if ((count ?? 0) > 0) {
    console.log(`units table already has ${count} rows — skipping unit seed.`);
    return;
  }
  const rows = units.map((u, i) => ({
    tr: u.tr, en: u.en, ar: u.ar, ru: u.ru, ka: u.ka, type: u.type, sort_order: i,
  }));
  const { error } = await supabase.from("units").insert(rows);
  if (error) throw new Error(`seed units failed: ${error.message}`);
  console.log(`Seeded ${rows.length} units.`);
}

async function migrateDoctors() {
  const { data, error } = await supabase.from("doctors").select("id, name, specialty_tr, category");
  if (error) throw new Error(`fetch failed: ${error.message}`);

  let updated = 0;
  const skipped: string[] = [];

  for (const row of data as { id: string; name: string; specialty_tr: string; category: string }[]) {
    // Already a known unit? Then it's fine, skip.
    if (findUnitByTr(row.specialty_tr)) continue;

    const targetTr = MAP[row.specialty_tr];
    const u = targetTr ? findUnitByTr(targetTr) : undefined;
    if (!u) {
      skipped.push(`${row.name} — "${row.specialty_tr}"`);
      continue;
    }

    const { error: upErr } = await supabase
      .from("doctors")
      .update({
        specialty_tr: u.tr,
        specialty_en: u.en,
        specialty_ar: u.ar,
        specialty_ru: u.ru,
        specialty_ka: u.ka,
        category: u.type,
      })
      .eq("id", row.id);
    if (upErr) throw new Error(`update ${row.name} failed: ${upErr.message}`);
    updated++;
    console.log(`✓ ${row.name}: ${row.specialty_tr} → ${u.tr} (${u.type})`);
  }

  console.log(`\nUpdated ${updated} doctors.`);
  if (skipped.length) {
    console.log(`Skipped (no mapping) ${skipped.length}:`);
    skipped.forEach((s) => console.log("  - " + s));
  }
}

async function main() {
  await seedUnits();
  await migrateDoctors();
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
