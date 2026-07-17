import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { rowToDoctor, type DoctorRow } from "./mappers";
import type { Doctor } from "@/lib/doctors";

/** Hekim satırı + doctor_units üzerinden bağlı birimler. */
const SELECT_WITH_UNITS = "*, doctor_units(units(*))";

export const getDoctors = cache(async (): Promise<Doctor[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select(SELECT_WITH_UNITS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getDoctors failed: ${error.message}`);
  return (data as unknown as DoctorRow[]).map(rowToDoctor);
});

export const getDoctorById = cache(async (id: string): Promise<Doctor | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select(SELECT_WITH_UNITS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getDoctorById failed: ${error.message}`);
  return data ? rowToDoctor(data as unknown as DoctorRow) : null;
});
