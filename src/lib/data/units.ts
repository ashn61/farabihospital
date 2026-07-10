import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { rowToUnitRecord, type UnitRow, type UnitRecord } from "./mappers";
import { units as staticUnits } from "@/lib/units";

/** Fallback used before the `units` table exists / is seeded, so the site never 500s. */
const fallbackUnits: UnitRecord[] = staticUnits.map((u, i) => ({ id: `seed-${i}`, ...u }));

export const getUnits = cache(async (): Promise<UnitRecord[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("tr", { ascending: true });

  if (error || !data || data.length === 0) {
    // Table missing or empty → serve the static seed list.
    return fallbackUnits;
  }
  return (data as UnitRow[]).map(rowToUnitRecord);
});
