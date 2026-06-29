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
