import { createClient } from "@/lib/supabase/server";
import { getDoctors } from "@/lib/data/doctors";
import { getNewsRows } from "@/lib/data/news";
import { getUnits } from "@/lib/data/units";
import LoginForm from "@/components/admin/LoginForm";
import AdminPanel from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return <LoginForm />;

  const [doctors, newsRows, units] = await Promise.all([getDoctors(), getNewsRows(), getUnits()]);
  return <AdminPanel initialDoctors={doctors} initialNewsRows={newsRows} initialUnits={units} />;
}
