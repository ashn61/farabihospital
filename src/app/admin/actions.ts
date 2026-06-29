"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { doctorToRow, type NewsRow } from "@/lib/data/mappers";
import type { Doctor } from "@/lib/doctors";

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
