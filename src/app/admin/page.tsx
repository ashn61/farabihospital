import { createClient } from "@/lib/supabase/server";
import { getDoctors } from "@/lib/data/doctors";
import { getNewsRows } from "@/lib/data/news";
import LoginForm from "@/components/admin/LoginForm";
import AdminPanel from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return <LoginForm />;

  const [doctors, newsRows] = await Promise.all([getDoctors(), getNewsRows()]);
  return <AdminPanel initialDoctors={doctors} initialNewsRows={newsRows} />;
}
