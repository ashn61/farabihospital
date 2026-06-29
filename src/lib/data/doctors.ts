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
