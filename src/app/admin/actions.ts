"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { doctorToRow, type NewsRow } from "@/lib/data/mappers";
import type { Doctor } from "@/lib/doctors";
import type { UnitType } from "@/lib/units";

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Unauthorized");
  return data.user;
}

export async function signIn(formData: FormData): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const email = `${username}@farabi.local`;
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

export async function saveDoctor(doc: Doctor, sortOrder: number): Promise<void> {
  await requireUser();
  const admin = createAdminClient();

  const { error } = await admin
    .from("doctors")
    .upsert(doctorToRow(doc, sortOrder), { onConflict: "id" });
  if (error) throw new Error(`saveDoctor failed: ${error.message}`);

  // Birimler ayrı tabloda: önce seçilenleri yaz (upsert, idempotent), sonra
  // fazlalıkları sil. Bu sırayla hekim hiçbir zaman sıfır branşta kalmaz —
  // insert (upsert) başarısız olsa bile mevcut bağlar silinmemiş olur.
  if (doc.units.length > 0) {
    const links = doc.units.map((u) => ({ doctor_id: doc.id, unit_id: u.id }));
    const { error: upsertErr } = await admin
      .from("doctor_units")
      .upsert(links, { onConflict: "doctor_id,unit_id" });
    if (upsertErr) throw new Error(`saveDoctor (units yazma) failed: ${upsertErr.message}`);

    const idList = doc.units.map((u) => u.id).join(",");
    const { error: delErr } = await admin
      .from("doctor_units")
      .delete()
      .eq("doctor_id", doc.id)
      .not("unit_id", "in", `(${idList})`);
    if (delErr) throw new Error(`saveDoctor (units temizleme) failed: ${delErr.message}`);
  } else {
    const { error: delErr } = await admin.from("doctor_units").delete().eq("doctor_id", doc.id);
    if (delErr) throw new Error(`saveDoctor (units temizleme) failed: ${delErr.message}`);
  }

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

export async function saveNews(row: Omit<NewsRow, "id"> & { id?: string }): Promise<{ id: string }> {
  await requireUser();
  const admin = createAdminClient();
  if (row.id) {
    const { error } = await admin.from("news").update(row).eq("id", row.id);
    if (error) throw new Error(`saveNews failed: ${error.message}`);
    revalidatePath("/");
    return { id: row.id };
  }
  const { data, error } = await admin.from("news").insert(row).select("id").single();
  if (error) throw new Error(`saveNews failed: ${error.message}`);
  revalidatePath("/");
  return { id: (data as { id: string }).id };
}

export async function deleteNews(id: string): Promise<void> {
  await requireUser();
  const admin = createAdminClient();
  const { error } = await admin.from("news").delete().eq("id", id);
  if (error) throw new Error(`deleteNews failed: ${error.message}`);
  revalidatePath("/");
}

export interface UnitInput {
  id?: string;
  tr: string;
  en: string;
  ar: string;
  ru: string;
  ka: string;
  type: UnitType;
  sort_order?: number;
}

export async function saveUnit(unit: UnitInput): Promise<{ id: string }> {
  await requireUser();
  const admin = createAdminClient();
  const row = {
    tr: unit.tr,
    en: unit.en,
    ar: unit.ar,
    ru: unit.ru,
    ka: unit.ka,
    type: unit.type,
    sort_order: unit.sort_order ?? 0,
  };
  if (unit.id) {
    const { error } = await admin.from("units").update(row).eq("id", unit.id);
    if (error) throw new Error(`saveUnit failed: ${error.message}`);
    revalidatePath("/");
    revalidatePath("/admin");
    return { id: unit.id };
  }
  const { data, error } = await admin.from("units").insert(row).select("id").single();
  if (error) throw new Error(`saveUnit failed: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/admin");
  return { id: (data as { id: string }).id };
}

export async function deleteUnit(id: string): Promise<void> {
  await requireUser();
  const admin = createAdminClient();

  // Sunucu tarafı koruma: birim en az bir hekimde kullanılıyorsa silme
  // (doctor_units.unit_id -> units.id cascade siler, bu da hekimlerin
  // branşını sessizce sıfırlayabilir).
  const { count, error: countErr } = await admin
    .from("doctor_units")
    .select("doctor_id", { count: "exact", head: true })
    .eq("unit_id", id);
  if (countErr) throw new Error(`deleteUnit (kullanım kontrolü) failed: ${countErr.message}`);
  if (count && count > 0) {
    throw new Error(`Bu birim ${count} hekim tarafından kullanılıyor; önce onları başka birime taşıyın.`);
  }

  const { error } = await admin.from("units").delete().eq("id", id);
  if (error) throw new Error(`deleteUnit failed: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadImage(formData: FormData): Promise<{ url: string }> {
  await requireUser();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "doctors");
  if (!file) throw new Error("uploadImage: no file");

  const safeFolder = folder === "news" ? "news" : "doctors";
  const admin = createAdminClient();
  const rawExt = (file.name.split(".").pop() ?? "jpg");
  const ext = rawExt.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
  const storagePath = `${safeFolder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await admin.storage.from("media").upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`uploadImage failed: ${error.message}`);

  const { data } = admin.storage.from("media").getPublicUrl(storagePath);
  return { url: data.publicUrl };
}
