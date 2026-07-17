import { config } from "dotenv";
config({ path: ".env.local" });

import { Client } from "pg";

const DDL = `
create table if not exists public.doctor_units (
  doctor_id   text not null references public.doctors(id) on delete cascade,
  unit_id     uuid not null references public.units(id)   on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (doctor_id, unit_id)
);
alter table public.doctor_units enable row level security;
drop policy if exists "public read doctor_units" on public.doctor_units;
create policy "public read doctor_units" on public.doctor_units for select using (true);
`;

async function main() {
  const raw =
    process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!raw) throw new Error("POSTGRES_URL(_NON_POOLING) missing in .env.local");
  // Strip query params (sslmode=...) so our explicit ssl config is used.
  const connectionString = raw.split("?")[0];

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(DDL);
    console.log("✓ doctor_units table + RLS policy ensured.");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
