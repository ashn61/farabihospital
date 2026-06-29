import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DoctorDetailClient from "@/components/DoctorDetailClient";
import { getDoctorById } from "@/lib/data/doctors";
import { formatDoctorName } from "@/lib/doctors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) return { title: "Hekim Bulunamadı | KTÜ Farabi Hastanesi" };
  const name = formatDoctorName(doctor.name, doctor.title, "tr");
  return {
    title: `${name} | KTÜ Farabi Hastanesi`,
    description: doctor.bioTr,
  };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) notFound();
  return <DoctorDetailClient doctor={doctor} />;
}
