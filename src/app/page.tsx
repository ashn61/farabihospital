import HomeClient from "@/components/HomeClient";
import { getDoctors } from "@/lib/data/doctors";
import { getNews } from "@/lib/data/news";
import { getUnits } from "@/lib/data/units";

export default async function Home() {
  const [doctors, news, units] = await Promise.all([getDoctors(), getNews(), getUnits()]);
  return <HomeClient initialDoctors={doctors} initialNews={news} initialUnits={units} />;
}
