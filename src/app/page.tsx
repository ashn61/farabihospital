import HomeClient from "@/components/HomeClient";
import { getDoctors } from "@/lib/data/doctors";
import { getNews } from "@/lib/data/news";

export default async function Home() {
  const [doctors, news] = await Promise.all([getDoctors(), getNews()]);
  return <HomeClient initialDoctors={doctors} initialNews={news} />;
}
