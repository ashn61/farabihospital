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
