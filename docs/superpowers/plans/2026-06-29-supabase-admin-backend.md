# Supabase-Backed Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the admin panel's `localStorage`-only persistence with a real Supabase backend so doctor/news edits persist and reflect for all visitors.

**Architecture:** Public pages (`/`, `/doctors/[id]`) become Server Components that read from Supabase (strong SEO, instant data). The admin panel writes through Server Actions that verify the Supabase session, write via the service-role client, and `revalidatePath()` the affected pages. Images upload to Supabase Storage. Auth uses Supabase Auth (email + password).

**Tech Stack:** Next.js 16.2.9 (App Router), React 19, TypeScript, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), Vitest (unit tests), tsx + dotenv (seed script).

## Global Constraints

- **Next.js 16 conventions (breaking from older versions):** Middleware file is named `proxy.ts` (not `middleware.ts`); export a `proxy` function. `cookies()` from `next/headers` is async — always `await cookies()`. Mutations use Server Actions (`'use server'`); every action must verify the session server-side. After a mutation call `revalidatePath()`.
- **Secrets:** Never hardcode keys. Read only from `process.env`. `.env.local` is gitignored and already holds `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Supabase project ref:** `nvnezyiqvywlwfxtlmuq`
- **Data types are fixed:** The existing `Doctor`, `NewsItem`, `NewsData` interfaces in `src/lib/doctors.ts` / `src/lib/news.ts` must not change shape — UI consumes them. The DB↔type boundary is handled by mapper functions.
- **Preserve UI:** No visual/markup/translation changes to public pages or admin layout. Only the data source and persistence change.
- **Doctor IDs are strings** (e.g. `"4177"`) and must be preserved on migration.

---

## File Structure

```
Create:
  src/lib/supabase/server.ts      → anon server client (cookie-based, for reads + auth)
  src/lib/supabase/admin.ts       → service-role client (writes, uploads, seed)
  src/lib/data/mappers.ts         → pure DB-row ↔ Doctor/NewsItem/NewsData mappers
  src/lib/data/mappers.test.ts    → unit tests for mappers
  src/lib/data/doctors.ts         → getDoctors(), getDoctorById()
  src/lib/data/news.ts            → getNews()
  src/app/admin/actions.ts        → "use server": signIn/signOut, doctor & news CRUD, uploadImage
  src/components/HomeClient.tsx    → moved-out client UI from page.tsx (props: doctors, news)
  src/components/admin/LoginForm.tsx → client login form (calls signIn action)
  src/components/admin/AdminPanel.tsx → existing admin UI, props-driven, action-backed
  proxy.ts                         → refreshes Supabase session on /admin routes
  scripts/seed.ts                  → one-time migration of doctorsData/newsData into Supabase
  supabase/schema.sql              → tables + RLS + storage bucket (user runs in Supabase)
  vitest.config.ts                 → test runner config

Modify:
  package.json                     → deps + "test" and "seed" scripts
  src/app/page.tsx                 → thin Server Component (fetch + render HomeClient)
  src/app/doctors/[id]/page.tsx    → Server Component (getDoctorById + generateMetadata)
  src/app/admin/page.tsx           → Server Component (session gate → LoginForm | AdminPanel)
```

---

### Task 1: Install dependencies and tooling

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime + dev dependencies**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D vitest tsx dotenv
```
Expected: installs succeed, `package.json` dependencies updated.

- [ ] **Step 2: Add `test` and `seed` scripts**

In `package.json`, set the `scripts` block to:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "seed": "tsx scripts/seed.ts"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Verify the test runner starts**

Run: `npm test`
Expected: Vitest runs and reports "No test files found" (no tests yet) and exits 0.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add Supabase, Vitest, and seed tooling"
```

---

### Task 2: Database schema and storage bucket

**Files:**
- Create: `supabase/schema.sql`

**Interfaces:**
- Produces: tables `public.doctors` and `public.news` with the columns the mappers (Task 4) read/write; a public Storage bucket named `media`.

- [ ] **Step 1: Write the schema SQL**

Create `supabase/schema.sql`:
```sql
-- Doctors -------------------------------------------------------------
create table if not exists public.doctors (
  id              text primary key,
  name            text not null,
  title           text not null,
  image           text not null,
  specialty_tr    text not null,
  specialty_en    text not null,
  specialty_ar    text,
  specialty_ru    text not null,
  specialty_ka    text not null,
  category        text not null check (category in ('surgical','internal')),
  stats_patients  integer not null default 0,
  stats_experience integer not null default 0,
  stats_surgeries integer,
  email           text not null,
  education_tr    text[] not null default '{}',
  education_en    text[] not null default '{}',
  education_ar    text[],
  bio_tr          text not null default '',
  bio_en          text not null default '',
  bio_ar          text,
  bio_ru          text not null default '',
  bio_ka          text not null default '',
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- News ----------------------------------------------------------------
create table if not exists public.news (
  id              uuid primary key default gen_random_uuid(),
  image           text not null,
  name_tr         text not null default '',
  name_en         text not null default '',
  name_ar         text not null default '',
  name_ru         text not null default '',
  name_ka         text not null default '',
  designation_tr  text not null default '',
  designation_en  text not null default '',
  designation_ar  text not null default '',
  designation_ru  text not null default '',
  designation_ka  text not null default '',
  quote_tr        text not null default '',
  quote_en        text not null default '',
  quote_ar        text not null default '',
  quote_ru        text not null default '',
  quote_ka        text not null default '',
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Row Level Security: public READ, writes only via service role --------
alter table public.doctors enable row level security;
alter table public.news    enable row level security;

drop policy if exists "public read doctors" on public.doctors;
create policy "public read doctors" on public.doctors for select using (true);

drop policy if exists "public read news" on public.news;
create policy "public read news" on public.news for select using (true);
-- (No insert/update/delete policies: the service-role key bypasses RLS;
--  the anon key therefore cannot write.)

-- Storage bucket for uploaded images ----------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
```

- [ ] **Step 2: Run it in Supabase (manual)**

In the Supabase dashboard → **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
Expected: "Success. No rows returned." Verify under **Table Editor** that `doctors` and `news` exist, and under **Storage** that the `media` bucket exists.

- [ ] **Step 3: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add Supabase schema, RLS, and media bucket SQL"
```

---

### Task 3: Supabase client helpers

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`

**Interfaces:**
- Produces: `createClient(): Promise<SupabaseClient>` (anon, cookie-aware — for reads and auth in Server Components/Actions); `createAdminClient(): SupabaseClient` (service role — for writes, uploads, seed).

- [ ] **Step 1: Create the anon server client**

Create `src/lib/supabase/server.ts`:
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component where cookies are read-only.
            // Safe to ignore — the proxy refreshes the session.
          }
        },
      },
    }
  );
}
```

- [ ] **Step 2: Create the service-role admin client**

Create `src/lib/supabase/admin.ts`:
```ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
```

- [ ] **Step 3: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors from these two files. (Pre-existing unrelated errors, if any, are out of scope.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/server.ts src/lib/supabase/admin.ts
git commit -m "feat: add Supabase server and admin clients"
```

---

### Task 4: Row mappers (TDD)

**Files:**
- Create: `src/lib/data/mappers.ts`
- Test: `src/lib/data/mappers.test.ts`

**Interfaces:**
- Consumes: `Doctor` from `@/lib/doctors`; `NewsItem`, `NewsData` from `@/lib/news`.
- Produces:
  - `type DoctorRow` — snake_case shape matching the `doctors` table.
  - `type NewsRow` — snake_case shape matching the `news` table.
  - `rowToDoctor(row: DoctorRow): Doctor`
  - `doctorToRow(doc: Doctor, sortOrder?: number): DoctorRow`
  - `rowsToNewsData(rows: NewsRow[]): NewsData`
  - `LOCALES: readonly ["tr","en","ar","ru","ka"]`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/data/mappers.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { rowToDoctor, doctorToRow, rowsToNewsData, type DoctorRow, type NewsRow } from "./mappers";
import type { Doctor } from "@/lib/doctors";

const sampleRow: DoctorRow = {
  id: "4177",
  name: "Celal TEKİNBAŞ",
  title: "Prof. Dr.",
  image: "/assets/doctors/celal_tekinbas.jpg",
  specialty_tr: "Göğüs Cerrahisi",
  specialty_en: "Thoracic Surgery",
  specialty_ar: "جراحة الصدر",
  specialty_ru: "Торакальная хирургия",
  specialty_ka: "თორაკალური ქირურგია",
  category: "surgical",
  stats_patients: 14200,
  stats_experience: 28,
  stats_surgeries: 4500,
  email: "celal@ktu.edu.tr",
  education_tr: ["KTÜ"],
  education_en: ["KTU"],
  education_ar: null,
  bio_tr: "tr", bio_en: "en", bio_ar: null, bio_ru: "ru", bio_ka: "ka",
  sort_order: 0,
};

describe("rowToDoctor", () => {
  it("maps snake_case columns into the Doctor shape", () => {
    const doc = rowToDoctor(sampleRow);
    expect(doc.id).toBe("4177");
    expect(doc.specialtyTr).toBe("Göğüs Cerrahisi");
    expect(doc.stats).toEqual({ patients: 14200, experience: 28, surgeries: 4500 });
    expect(doc.educationTr).toEqual(["KTÜ"]);
    expect(doc.category).toBe("surgical");
  });

  it("turns null optional columns into undefined", () => {
    const doc = rowToDoctor(sampleRow);
    expect(doc.bioAr).toBeUndefined();
    expect(doc.educationAr).toBeUndefined();
  });
});

describe("doctorToRow", () => {
  it("round-trips a Doctor back to a row", () => {
    const doc: Doctor = rowToDoctor(sampleRow);
    const row = doctorToRow(doc, 5);
    expect(row.specialty_tr).toBe("Göğüs Cerrahisi");
    expect(row.stats_surgeries).toBe(4500);
    expect(row.sort_order).toBe(5);
    expect(row.bio_ar).toBeNull();
  });

  it("sets stats_surgeries to null for internal doctors", () => {
    const doc = rowToDoctor({ ...sampleRow, category: "internal", stats_surgeries: null });
    const row = doctorToRow(doc);
    expect(row.stats_surgeries).toBeNull();
  });
});

describe("rowsToNewsData", () => {
  it("groups one row's localized columns into per-locale arrays", () => {
    const row: NewsRow = {
      id: "abc",
      image: "https://img/1.jpg",
      name_tr: "Başlık", name_en: "Title", name_ar: "عنوان", name_ru: "Заголовок", name_ka: "სათაური",
      designation_tr: "Etiket", designation_en: "Tag", designation_ar: "علامة", designation_ru: "Тег", designation_ka: "ტეგი",
      quote_tr: "Açıklama", quote_en: "Desc", quote_ar: "وصف", quote_ru: "Описание", quote_ka: "აღწერა",
      sort_order: 0,
    };
    const data = rowsToNewsData([row]);
    expect(data.tr[0]).toEqual({ name: "Başlık", designation: "Etiket", quote: "Açıklama", src: "https://img/1.jpg" });
    expect(data.en[0].name).toBe("Title");
    expect(data.ka[0].quote).toBe("აღწერა");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot import from `./mappers` (module/exports do not exist yet).

- [ ] **Step 3: Implement the mappers**

Create `src/lib/data/mappers.ts`:
```ts
import type { Doctor } from "@/lib/doctors";
import type { NewsItem, NewsData } from "@/lib/news";

export const LOCALES = ["tr", "en", "ar", "ru", "ka"] as const;
export type Locale = (typeof LOCALES)[number];

export interface DoctorRow {
  id: string;
  name: string;
  title: string;
  image: string;
  specialty_tr: string;
  specialty_en: string;
  specialty_ar: string | null;
  specialty_ru: string;
  specialty_ka: string;
  category: "surgical" | "internal";
  stats_patients: number;
  stats_experience: number;
  stats_surgeries: number | null;
  email: string;
  education_tr: string[];
  education_en: string[];
  education_ar: string[] | null;
  bio_tr: string;
  bio_en: string;
  bio_ar: string | null;
  bio_ru: string;
  bio_ka: string;
  sort_order: number;
}

export interface NewsRow {
  id: string;
  image: string;
  name_tr: string; name_en: string; name_ar: string; name_ru: string; name_ka: string;
  designation_tr: string; designation_en: string; designation_ar: string; designation_ru: string; designation_ka: string;
  quote_tr: string; quote_en: string; quote_ar: string; quote_ru: string; quote_ka: string;
  sort_order: number;
}

export function rowToDoctor(row: DoctorRow): Doctor {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    image: row.image,
    specialtyTr: row.specialty_tr,
    specialtyEn: row.specialty_en,
    specialtyAr: row.specialty_ar ?? undefined,
    specialtyRu: row.specialty_ru,
    specialtyKa: row.specialty_ka,
    category: row.category,
    stats: {
      patients: row.stats_patients,
      experience: row.stats_experience,
      surgeries: row.stats_surgeries ?? undefined,
    },
    email: row.email,
    educationTr: row.education_tr ?? [],
    educationEn: row.education_en ?? [],
    educationAr: row.education_ar ?? undefined,
    bioTr: row.bio_tr,
    bioEn: row.bio_en,
    bioAr: row.bio_ar ?? undefined,
    bioRu: row.bio_ru,
    bioKa: row.bio_ka,
  };
}

export function doctorToRow(doc: Doctor, sortOrder = 0): DoctorRow {
  return {
    id: doc.id,
    name: doc.name,
    title: doc.title,
    image: doc.image,
    specialty_tr: doc.specialtyTr,
    specialty_en: doc.specialtyEn,
    specialty_ar: doc.specialtyAr ?? null,
    specialty_ru: doc.specialtyRu,
    specialty_ka: doc.specialtyKa,
    category: doc.category,
    stats_patients: doc.stats.patients,
    stats_experience: doc.stats.experience,
    stats_surgeries: doc.category === "surgical" ? doc.stats.surgeries ?? 0 : null,
    email: doc.email,
    education_tr: doc.educationTr ?? [],
    education_en: doc.educationEn ?? [],
    education_ar: doc.educationAr ?? null,
    bio_tr: doc.bioTr,
    bio_en: doc.bioEn,
    bio_ar: doc.bioAr ?? null,
    bio_ru: doc.bioRu,
    bio_ka: doc.bioKa,
    sort_order: sortOrder,
  };
}

function rowToNewsItem(row: NewsRow, locale: Locale): NewsItem {
  return {
    name: row[`name_${locale}`],
    designation: row[`designation_${locale}`],
    quote: row[`quote_${locale}`],
    src: row.image,
  };
}

export function rowsToNewsData(rows: NewsRow[]): NewsData {
  return {
    tr: rows.map((r) => rowToNewsItem(r, "tr")),
    en: rows.map((r) => rowToNewsItem(r, "en")),
    ar: rows.map((r) => rowToNewsItem(r, "ar")),
    ru: rows.map((r) => rowToNewsItem(r, "ru")),
    ka: rows.map((r) => rowToNewsItem(r, "ka")),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all mapper tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/mappers.ts src/lib/data/mappers.test.ts
git commit -m "feat: add tested DB-row mappers for doctors and news"
```

---

### Task 5: Data-access layer

**Files:**
- Create: `src/lib/data/doctors.ts`
- Create: `src/lib/data/news.ts`

**Interfaces:**
- Consumes: `createClient` from `@/lib/supabase/server`; `rowToDoctor`, `rowsToNewsData`, `DoctorRow`, `NewsRow` from `./mappers`.
- Produces: `getDoctors(): Promise<Doctor[]>`, `getDoctorById(id: string): Promise<Doctor | null>`, `getNews(): Promise<NewsData>`.

- [ ] **Step 1: Implement doctor reads**

Create `src/lib/data/doctors.ts`:
```ts
import { createClient } from "@/lib/supabase/server";
import { rowToDoctor, type DoctorRow } from "./mappers";
import type { Doctor } from "@/lib/doctors";

export async function getDoctors(): Promise<Doctor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getDoctors failed: ${error.message}`);
  return (data as DoctorRow[]).map(rowToDoctor);
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getDoctorById failed: ${error.message}`);
  return data ? rowToDoctor(data as DoctorRow) : null;
}
```

- [ ] **Step 2: Implement news reads**

Create `src/lib/data/news.ts`:
```ts
import { createClient } from "@/lib/supabase/server";
import { rowsToNewsData, type NewsRow } from "./mappers";
import type { NewsData } from "@/lib/news";

export async function getNews(): Promise<NewsData> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getNews failed: ${error.message}`);
  return rowsToNewsData((data ?? []) as NewsRow[]);
}
```

- [ ] **Step 3: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no new errors from these files.

- [ ] **Step 4: Commit**

```bash
git add src/lib/data/doctors.ts src/lib/data/news.ts
git commit -m "feat: add server-side data-access layer for doctors and news"
```

---

### Task 6: Seed script (migrate existing data)

**Files:**
- Create: `scripts/seed.ts`

**Interfaces:**
- Consumes: `createAdminClient` from `@/lib/supabase/admin` (via relative path — see note); `doctorsData` from `src/lib/doctors`; `newsData` from `src/lib/news`; `doctorToRow` from `src/lib/data/mappers`.

- [ ] **Step 1: Write the seed script**

Create `scripts/seed.ts`:
```ts
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
```

- [ ] **Step 2: Run the seed (requires Task 2 schema applied + `SUPABASE_SERVICE_ROLE_KEY` set)**

Run: `npm run seed`
Expected: prints "Seeded N doctors." and "Seeded N news items." then "Seed complete." Verify rows appear in the Supabase Table Editor.

- [ ] **Step 3: Commit**

```bash
git add scripts/seed.ts
git commit -m "feat: add idempotent Supabase seed script"
```

---

### Task 7: Refactor public home page to Server Component

**Files:**
- Create: `src/components/HomeClient.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `getDoctors`, `getNews` from data layer.
- Produces: `HomeClient` (client component) accepting props `{ initialDoctors: Doctor[]; initialNews: NewsData }`.

- [ ] **Step 1: Move the existing client UI into `HomeClient.tsx`**

Create `src/components/HomeClient.tsx`. Copy the **entire current contents** of `src/app/page.tsx` into it, then make exactly these changes:
1. Keep the `"use client";` directive at the top.
2. Rename the default export function from `Home` to `HomeClient` and give it props:
```tsx
export default function HomeClient({
  initialDoctors,
  initialNews,
}: {
  initialDoctors: typeof doctorsData;
  initialNews: typeof newsData;
}) {
```
3. Change the initial state to use props instead of the static data:
```tsx
const [doctors, setDoctors] = useState<typeof doctorsData>(initialDoctors);
const [news, setNews] = useState<typeof newsData>(initialNews);
```
4. **Delete the entire `useEffect` block** that reads/writes `localStorage` (the `farabi_doctors` / `farabi_news` sync). The data now comes from props.
5. Keep all other markup, translations, filtering, and imports unchanged. `doctorsData`/`newsData` imports stay (used only for the `typeof` types).

- [ ] **Step 2: Replace `page.tsx` with a Server Component**

Replace the **entire** contents of `src/app/page.tsx` with:
```tsx
import HomeClient from "@/components/HomeClient";
import { getDoctors } from "@/lib/data/doctors";
import { getNews } from "@/lib/data/news";

export default async function Home() {
  const [doctors, news] = await Promise.all([getDoctors(), getNews()]);
  return <HomeClient initialDoctors={doctors} initialNews={news} />;
}
```

- [ ] **Step 3: Verify build + manual check**

Run: `npm run build`
Expected: build succeeds. Then `npm run dev`, open `http://localhost:3000` — doctors and news render from the database, identical to before, with no "loading" flicker.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/HomeClient.tsx
git commit -m "refactor: render home page from Supabase via Server Component"
```

---

### Task 8: Refactor doctor detail page to Server Component

**Files:**
- Create: `src/components/DoctorDetailClient.tsx`
- Modify: `src/app/doctors/[id]/page.tsx`

**Interfaces:**
- Consumes: `getDoctorById` from data layer.
- Produces: `DoctorDetailClient` (client component) accepting prop `{ doctor: Doctor }`.

- [ ] **Step 1: Move existing client UI into `DoctorDetailClient.tsx`**

Create `src/components/DoctorDetailClient.tsx`. Copy the **entire current contents** of `src/app/doctors/[id]/page.tsx` into it, then:
1. Keep `"use client";`.
2. Remove the `useParams` import and its usage. Replace the default export signature with:
```tsx
export default function DoctorDetailClient({ doctor }: { doctor: Doctor }) {
```
   Import the type: `import type { Doctor } from "@/lib/doctors";`
3. Delete any code that looks the doctor up from `doctorsData` by id (e.g. `doctorsData.find(...)` using the param). Use the `doctor` prop directly everywhere the looked-up doctor was used.
4. Keep all markup, translations, and the existing "not found" UI (still used as a fallback if a consumer passes nothing — but the parent now guarantees a doctor).

- [ ] **Step 2: Replace the route with a Server Component + metadata**

Replace the **entire** contents of `src/app/doctors/[id]/page.tsx` with:
```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DoctorDetailClient from "@/components/DoctorDetailClient";
import { getDoctorById } from "@/lib/data/doctors";
import { formatDoctorName } from "@/lib/doctors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) return { title: "Hekim Bulunamadı | KTÜ Farabi Hastanesi" };
  const name = formatDoctorName(doctor.name, doctor.title, "tr");
  return {
    title: `${name} | KTÜ Farabi Hastanesi`,
    description: doctor.bioTr,
  };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) notFound();
  return <DoctorDetailClient doctor={doctor} />;
}
```

- [ ] **Step 3: Verify build + manual check**

Run: `npm run build` then `npm run dev`. Open a doctor's detail page (e.g. `/doctors/4177`). Expected: profile renders from DB; an unknown id (e.g. `/doctors/0000`) shows the not-found page.

- [ ] **Step 4: Commit**

```bash
git add "src/app/doctors/[id]/page.tsx" src/components/DoctorDetailClient.tsx
git commit -m "refactor: render doctor detail from Supabase with per-doctor metadata"
```

---

### Task 9: Auth — session refresh proxy and auth actions

**Files:**
- Create: `proxy.ts`
- Create: `src/app/admin/actions.ts` (auth portion; CRUD added in Task 11)

**Interfaces:**
- Produces: `proxy(request)` + `config.matcher` covering `/admin`; Server Actions `signIn(formData: FormData): Promise<{ error?: string }>` and `signOut(): Promise<void>`; helper `requireUser()` used by all mutation actions.

- [ ] **Step 1: Create the session-refresh proxy**

Create `proxy.ts` at the **project root** (same level as `src/`):
```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session so Server Components see a valid user.
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Create the auth actions + `requireUser` helper**

Create `src/app/admin/actions.ts`:
```ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Unauthorized");
  return data.user;
}

export async function signIn(formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return {};
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
}
```

- [ ] **Step 3: Create an admin user in Supabase (manual)**

Supabase dashboard → **Authentication → Users → Add user** → enter your email + password → create. (Disable "Auto Confirm User" off, i.e. confirm the user so it can log in immediately.)

- [ ] **Step 4: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add proxy.ts src/app/admin/actions.ts
git commit -m "feat: add Supabase auth proxy and sign-in/out actions"
```

---

### Task 10: Mutation actions — doctors, news, image upload

**Files:**
- Modify: `src/app/admin/actions.ts`

**Interfaces:**
- Consumes: `requireUser` (Task 9), `createAdminClient` from `@/lib/supabase/admin`, `doctorToRow` + `DoctorRow`/`NewsRow` types from `@/lib/data/mappers`.
- Produces (all verify session, write via admin client, then `revalidatePath`):
  - `saveDoctor(doc: Doctor, sortOrder: number): Promise<void>` (upsert by id)
  - `deleteDoctor(id: string): Promise<void>`
  - `saveNews(row: Omit<NewsRow,"id"> & { id?: string }): Promise<void>` (insert or update)
  - `deleteNews(id: string): Promise<void>`
  - `uploadImage(formData: FormData): Promise<{ url: string }>` (field `file`, field `folder` = "doctors"|"news")

- [ ] **Step 1: Append the mutation actions**

Append to `src/app/admin/actions.ts`:
```ts
import { createAdminClient } from "@/lib/supabase/admin";
import { doctorToRow, type NewsRow } from "@/lib/data/mappers";
import type { Doctor } from "@/lib/doctors";

export async function saveDoctor(doc: Doctor, sortOrder: number): Promise<void> {
  await requireUser();
  const admin = createAdminClient();
  const { error } = await admin.from("doctors").upsert(doctorToRow(doc, sortOrder), { onConflict: "id" });
  if (error) throw new Error(`saveDoctor failed: ${error.message}`);
  revalidatePath("/");
  revalidatePath(`/doctors/${doc.id}`);
}

export async function deleteDoctor(id: string): Promise<void> {
  await requireUser();
  const admin = createAdminClient();
  const { error } = await admin.from("doctors").delete().eq("id", id);
  if (error) throw new Error(`deleteDoctor failed: ${error.message}`);
  revalidatePath("/");
  revalidatePath(`/doctors/${id}`);
}

export async function saveNews(row: Omit<NewsRow, "id"> & { id?: string }): Promise<void> {
  await requireUser();
  const admin = createAdminClient();
  const { error } = row.id
    ? await admin.from("news").update(row).eq("id", row.id)
    : await admin.from("news").insert(row);
  if (error) throw new Error(`saveNews failed: ${error.message}`);
  revalidatePath("/");
}

export async function deleteNews(id: string): Promise<void> {
  await requireUser();
  const admin = createAdminClient();
  const { error } = await admin.from("news").delete().eq("id", id);
  if (error) throw new Error(`deleteNews failed: ${error.message}`);
  revalidatePath("/");
}

export async function uploadImage(formData: FormData): Promise<{ url: string }> {
  await requireUser();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "doctors");
  if (!file) throw new Error("uploadImage: no file");

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`uploadImage failed: ${error.message}`);

  const { data } = admin.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/actions.ts
git commit -m "feat: add doctor/news mutation and image-upload server actions"
```

---

### Task 11: Refactor admin page — session gate, actions, upload

**Files:**
- Modify: `src/app/admin/page.tsx`
- Create: `src/components/admin/LoginForm.tsx`
- Create: `src/components/admin/AdminPanel.tsx`

**Interfaces:**
- Consumes: `createClient` (server), `getDoctors`, `getNews`, all actions from `@/app/admin/actions`.
- Produces: server-gated admin route rendering `LoginForm` (no session) or `AdminPanel` (session).

- [ ] **Step 1: Create the login form (client)**

Create `src/components/admin/LoginForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import { signIn } from "@/app/admin/actions";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setError("");
    const res = await signIn(formData);
    setPending(false);
    if (res.error) setError("Giriş başarısız: e-posta veya şifre hatalı.");
    // On success the server revalidates /admin and the panel renders.
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form action={action} className="bg-white p-8 rounded-3xl shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-lg font-black text-primary">Yönetim Paneli Girişi</h1>
        <input name="email" type="email" required placeholder="E-posta"
          className="w-full px-4 py-3 border rounded-xl text-sm" />
        <input name="password" type="password" required placeholder="Şifre"
          className="w-full px-4 py-3 border rounded-xl text-sm" />
        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        <button type="submit" disabled={pending}
          className="w-full py-3 bg-primary text-white rounded-xl font-black text-sm disabled:opacity-60">
          {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Create `AdminPanel.tsx` from the existing admin UI**

Create `src/components/admin/AdminPanel.tsx`. Copy the **entire current contents** of `src/app/admin/page.tsx` into it, then make these changes:
1. Keep `"use client";`.
2. Change the default export signature to accept server-loaded data:
```tsx
export default function AdminPanel({
  initialDoctors,
  initialNews,
}: {
  initialDoctors: Doctor[];
  initialNews: NewsData;
}) {
```
3. Initialize state from props and **remove all `localStorage` usage**:
```tsx
const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
const [news, setNews] = useState<NewsData>(initialNews);
```
   Delete the `useEffect` blocks that read/write `farabi_doctors`, `farabi_news`, and `farabi_admin_logged`. Delete the login/logout/`isLoggedIn`/`username`/`password` state and the entire login-screen JSX branch (auth is now handled by the server gate + `LoginForm`).
4. Replace the logout button's handler with the `signOut` action:
```tsx
import { signOut, saveDoctor, deleteDoctor, saveNews, deleteNews, uploadImage } from "@/app/admin/actions";
// ...the logout button:
<button onClick={() => signOut()}>...</button>
```
5. In the **add/edit doctor** handler, after building the `newDoctor` / `updatedDoctor` object, call the action and keep local state in sync:
```tsx
// replace the localStorage.setItem(...) lines with:
await saveDoctor(theDoctorObject, sortOrderForThisDoctor);
setDoctors(updatedDocs);
```
   (Make the handler `async`. Use the doctor's index in `updatedDocs` as `sortOrderForThisDoctor`, or `0` for newly-added-at-front.)
6. In **delete doctor**:
```tsx
await deleteDoctor(id);
setDoctors(updatedDocs);
```
7. For **news add/edit/delete**, build a `NewsRow`-shaped object from the per-language form state (`image`, `name_<locale>`, `designation_<locale>`, `quote_<locale>`, `sort_order`) and call `await saveNews(row)` / `await deleteNews(id)`, then update local `news` state. News rows now carry a DB `id` (uuid); store it on each item so edits/deletes target the right row.
8. **Image upload:** add a file input to the doctor form. On file select:
```tsx
const fd = new FormData();
fd.append("file", file);
fd.append("folder", "doctors");
const { url } = await uploadImage(fd);
setDocImage(url); // existing image-URL state
```
   Keep the existing URL text field as a fallback. Do the same for the news form with `folder: "news"`.
9. Add the imports for `Doctor`, `NewsData` types.

- [ ] **Step 3: Replace `admin/page.tsx` with a server gate**

Replace the **entire** contents of `src/app/admin/page.tsx` with:
```tsx
import { createClient } from "@/lib/supabase/server";
import { getDoctors } from "@/lib/data/doctors";
import { getNews } from "@/lib/data/news";
import LoginForm from "@/components/admin/LoginForm";
import AdminPanel from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return <LoginForm />;

  const [doctors, news] = await Promise.all([getDoctors(), getNews()]);
  return <AdminPanel initialDoctors={doctors} initialNews={news} />;
}
```

- [ ] **Step 4: Build + full manual verification (E2E)**

Run: `npm run build` (expect success), then `npm run dev`:
1. Visit `/admin` → login form shows. Wrong password → error message. Correct credentials → panel loads.
2. Add a doctor (with photo upload) → appears on `/` after the page revalidates; open in a **different browser/incognito** → the new doctor is there (proves it's server-side, not localStorage).
3. Edit and delete a doctor → reflected for all visitors.
4. Add/edit/delete a news item → reflected in the news carousel.
5. Click logout → returns to login form.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/page.tsx src/components/admin/LoginForm.tsx src/components/admin/AdminPanel.tsx
git commit -m "refactor: admin panel uses Supabase auth, server actions, and uploads"
```

---

### Task 12: Deployment configuration

**Files:** none (Vercel dashboard) — verification only.

- [ ] **Step 1: Add environment variables to Vercel**

Vercel project → **Settings → Environment Variables** → add for Production + Preview:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
(Values from `.env.local`.)

- [ ] **Step 2: Deploy and smoke-test**

Push to the deployment branch (or trigger a Vercel deploy). After deploy:
- Public site lists doctors/news from Supabase.
- `/admin` login works with the Supabase user.
- An edit in production reflects for all visitors.

- [ ] **Step 3: Final commit (if any config files changed)**

```bash
git add -A
git commit -m "chore: finalize Supabase deployment config" || echo "nothing to commit"
```

---

## Self-Review Notes

- **Spec coverage:** Supabase platform ✓ (Tasks 1,3), schema/data model ✓ (Task 2), auth email+password ✓ (Tasks 9,11), image upload ✓ (Tasks 10,11), doctors+news scope ✓ (all), Server-Component reads ✓ (Tasks 7,8), seed/migration ✓ (Task 6), proxy.ts ✓ (Task 9), revalidatePath ✓ (Task 10), env vars + deploy ✓ (Task 12), unit tests for mappers ✓ (Task 4), manual E2E ✓ (Task 11).
- **Auth enforcement:** `requireUser()` is called inside every mutation action (defense-in-depth), independent of the proxy.
- **News identity:** news rows use a uuid `id`; the admin panel must persist that id per item to target edits/deletes (Task 11, step 2.7).
```
