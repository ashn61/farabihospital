import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { doctorsData } from "../src/lib/doctors";
import { newsData } from "../src/lib/news";
import { doctorToRow } from "../src/lib/data/mappers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function seedDoctors() {
  const rows = doctorsData.map((doc, i) => doctorToRow(doc, i));
  const { error } = await supabase.from("doctors").upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`seed doctors failed: ${error.message}`);
  console.log(`Seeded ${rows.length} doctors.`);
}

async function seedNews() {
  // newsData has 5 parallel locale arrays sharing index + image (src).
  const count = newsData.tr.length;
  const rows = Array.from({ length: count }, (_, i) => ({
    image: newsData.tr[i].src,
    name_tr: newsData.tr[i].name, name_en: newsData.en[i].name, name_ar: newsData.ar[i].name, name_ru: newsData.ru[i].name, name_ka: newsData.ka[i].name,
    designation_tr: newsData.tr[i].designation, designation_en: newsData.en[i].designation, designation_ar: newsData.ar[i].designation, designation_ru: newsData.ru[i].designation, designation_ka: newsData.ka[i].designation,
    quote_tr: newsData.tr[i].quote, quote_en: newsData.en[i].quote, quote_ar: newsData.ar[i].quote, quote_ru: newsData.ru[i].quote, quote_ka: newsData.ka[i].quote,
    sort_order: i,
  }));

  // Idempotent: only insert news if the table is empty (news has no natural key).
  const { count: existing, error: countErr } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true });
  if (countErr) throw new Error(`seed news count failed: ${countErr.message}`);
  if ((existing ?? 0) > 0) {
    console.log(`News table already has ${existing} rows — skipping news seed.`);
    return;
  }

  const { error } = await supabase.from("news").insert(rows);
  if (error) throw new Error(`seed news failed: ${error.message}`);
  console.log(`Seeded ${rows.length} news items.`);
}

async function main() {
  await seedDoctors();
  await seedNews();
  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
