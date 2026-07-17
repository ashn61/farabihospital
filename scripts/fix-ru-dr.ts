import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const COMMIT = process.argv.includes("--commit");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/**
 * Rusça doktor kısaltmasını normalize eder: д-р → др, Д-р → Др.
 *
 * UYARI: Bu işlev yalnızca bu veri setinde görülen "Проф./Доц./Ассист. д-р"
 * doktor-unvanı kısaltmasını eşleştirir (Cyrillic word boundary yok).
 * Başka bir metin korpusunda yeniden kullanılmadan önce kontrol edilmesi gerekir.
 */
export function fixRuDr(text: string): string {
  return text.replace(/д-р/g, "др").replace(/Д-р/g, "Др");
}

async function main() {
  const { data, error } = await supabase.from("doctors").select("id,name,bio_ru");
  if (error) throw new Error(`fetch failed: ${error.message}`);
  if (!data) throw new Error("fetch failed: veri dönmedi");

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
    console.log(`✓ ${d.id} ${d.name}`);
  }
  console.log(`${affected.length} hekim güncellendi.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
