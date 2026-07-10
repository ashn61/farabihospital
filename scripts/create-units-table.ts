import { config } from "dotenv";
config({ path: ".env.local" });

import { Client } from "pg";

const DDL = `
create table if not exists public.units (
  id          uuid primary key default gen_random_uuid(),
  tr          text not null,
  en          text not null,
  ar          text not null,
  ru          text not null,
  ka          text not null,
  type        text not null check (type in ('surgical','internal')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.units enable row level security;
drop policy if exists "public read units" on public.units;
create policy "public read units" on public.units for select using (true);
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
    console.log("✓ units table + RLS policy ensured.");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
