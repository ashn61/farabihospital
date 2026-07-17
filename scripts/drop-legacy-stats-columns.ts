// Irreversible: drops the legacy stats_patients/stats_experience/stats_surgeries
// columns from public.doctors after backing up their contents. See
// .superpowers/sdd/stats-removal-report.md for the full rationale.
//
// Preconditions (verified separately, not re-checked here):
//   - application code no longer reads or writes stats_*
//   - npx tsc --noEmit and npx vitest run are both clean
//
// Usage: npx tsx scripts/drop-legacy-stats-columns.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { join } from "path";
import { Client } from "pg";

const EXPECTED_ROWS = 37;

async function main() {
  const raw =
    process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!raw) throw new Error("POSTGRES_URL(_NON_POOLING) missing in .env.local");
  // Strip query params (sslmode=...) so our explicit ssl config is used.
  const connectionString = raw.split("?")[0];

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    // Step 1: backup.
    await client.query(`
      create table if not exists public.doctors_legacy_stats_backup as
      select id, name, stats_experience, stats_patients, stats_surgeries
      from public.doctors;
    `);
    const backupCount = await client.query(
      "select count(*)::int as count from public.doctors_legacy_stats_backup"
    );
    const count = backupCount.rows[0].count as number;
    console.log(`Backup row count: ${count}`);
    if (count !== EXPECTED_ROWS) {
      console.error(
        `BLOCKED: expected ${EXPECTED_ROWS} rows in backup, got ${count}. Aborting before drop.`
      );
      process.exit(1);
    }

    // Step 2: execute the drop from the checked-in SQL file.
    const dropSql = readFileSync(
      join(process.cwd(), "scripts", "drop-legacy-stats-columns.sql"),
      "utf-8"
    );
    await client.query(dropSql);
    console.log("✓ Columns dropped: stats_patients, stats_experience, stats_surgeries");

    // Step 3: verify.
    const cols = await client.query(`
      select column_name from information_schema.columns
      where table_schema = 'public' and table_name = 'doctors'
      order by column_name;
    `);
    console.log("Remaining columns on public.doctors:");
    cols.rows.forEach((r) => console.log(`  - ${r.column_name}`));
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
