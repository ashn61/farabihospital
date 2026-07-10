"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Award,
  Stethoscope,
  Building,
  Clock,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Navbar, { Locale } from "@/components/shared/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/shared/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import { doctorsData, formatDoctorName } from "@/lib/doctors";
import { newsData } from "@/lib/news";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";
import { unitLabel, type Unit } from "@/lib/units";

const translations = {
  tr: {
    aboutTitle: "Hakkımızda",
    aboutSubtitle: "Tıbbi Mükemmeliyet ve Akademik Derinlik",
    aboutCard1Title: "Uluslararası Hizmet",
    aboutCard1Desc: "5 farklı dilde (TR, EN, AR, RU, KA) kesintisiz koordinasyon ve küresel düzeyde tanı hizmetleri.",
    aboutCard2Title: "Teknolojik Altyapı",
    aboutCard2Desc: "Modern radyoloji, ileri düzey tarama üniteleri ve robotik cerrahi donanımı ile donatılmış klinikler.",
    aboutCard3Title: "Akademik Kadro",
    aboutCard3Desc: "Karadeniz Teknik Üniversitesi'nin seçkin 36+ profesör hekimiyle en zor vakalarda güvenilir teşhis.",

    specialtiesTitle: "Tıbbi Birimler",
    specialtiesSubtitle: "Uzmanlık Alanlarımıza Göre Klinik Dağılımımız",
    tabSurgical: "Cerrahi Birimler",
    tabInternal: "Dahili Birimler",
    viewSpecialtyDocs: "Birim Hekimlerini Gör",

    doctorsTitle: "Hekimlerimiz",
    doctorsSubtitle: "Seçkin Akademik Kadromuz ve Profesörlerimiz",
    searchPlaceholder: "Hekim adı veya uzmanlık dalı ara...",
    allCategories: "Tüm Birimler",
    filterSurgical: "Cerrahi",
    filterInternal: "Dahili",
    noDoctorsFound: "Arama kriterlerine uygun hekim bulunamadı.",
    doctorDetailsBtn: "Detaylı Profil",
    experienceYears: "Yıl Deneyim",

    announcementsTitle: "Haberler & Başarılar",
    announcementsSubtitle: "Hastanemizde Gerçekleştirilen Başarılı Operasyonlar",
    news1Title: "Tümör Rezeksiyonunda Büyük Başarı",
    news1Desc: "Prof. Dr. Celal Tekinbaş liderliğindeki cerrahi ekibimiz, nadir görülen akciğer trakea tümörünü başarıyla çıkardı.",
    news2Title: "Çocuk Hematolojisinde Yeni Kemik İliği Ünitesi",
    news2Desc: "Prof. Dr. Erol Erduran öncülüğünde yeni kurulan aferez ve çocuk nakil ünitesi hasta kabulüne başladı.",
    news3Title: "Uluslararası JCI Akreditasyon Süreci",
    news3Desc: "Farabi Hastanesi, küresel tıp kalite standartlarını belgeleyen akreditasyon sürecini başarıyla sürdürüyor.",

    contactTitle: "İletişim & Randevu Bilgi",
    contactSubtitle: "Uluslararası Koordinasyon Ofisimizle İrtibata Geçin",
    contactFormName: "Adınız Soyadınız",
    contactFormEmail: "E-posta Adresiniz",
    contactFormPhone: "Telefon Numaranız",
    contactFormMsg: "Mesajınız veya Tıbbi Dosya Notunuz",
    contactFormSubmit: "Bilgi Formunu Gönder",
    contactSuccess: "Bilgileriniz uluslararası hasta merkezimize ulaştı. En kısa sürede geri dönüş yapılacaktır.",
    workingHours: "Çalışma Saatleri",
    workingHoursVal: "7/24 Acil & Uluslararası Ofis: 08:30 - 17:30",
    accreditationTitle: "Akreditasyon Belgemiz"
  },
  en: {
    aboutTitle: "About Us",
    aboutSubtitle: "Clinical Excellence & Academic Depth",
    aboutCard1Title: "International Service",
    aboutCard1Desc: "Seamless coordination in 5 distinct languages (TR, EN, AR, RU, KA) and global-grade diagnostics.",
    aboutCard2Title: "Advanced Technology",
    aboutCard2Desc: "Clinics equipped with modern radiology, elite scanning units, and state-of-the-art robotic surgery.",
    aboutCard3Title: "Academic Staff",
    aboutCard3Desc: "Reliable diagnoses for complex cases directed by 36+ distinguished professor physicians from KTÜ.",

    specialtiesTitle: "Specialties",
    specialtiesSubtitle: "Our Medical and Surgical Departments",
    tabSurgical: "Surgical Divisions",
    tabInternal: "Internal Medicine",
    viewSpecialtyDocs: "View Specialists",

    doctorsTitle: "Our Doctors",
    doctorsSubtitle: "Distinguished Academic Staff & Professors",
    searchPlaceholder: "Search doctor by name or specialty...",
    allCategories: "All Departments",
    filterSurgical: "Surgical",
    filterInternal: "Internal",
    noDoctorsFound: "No physicians match your search criteria.",
    doctorDetailsBtn: "Detailed Profile",
    experienceYears: "Years Exp",

    announcementsTitle: "News & Successes",
    announcementsSubtitle: "Successful Medical Operations Performed at KTÜ Farabi",
    news1Title: "Major Success in Tumor Resection",
    news1Desc: "Our surgical team led by Prof. Dr. Celal Tekinbaş successfully resected a rare lung trachea tumor.",
    news2Title: "New Pediatric Bone Marrow Unit",
    news2Desc: "The newly established pediatric transplant and apheresis unit led by Prof. Dr. Erol Erduran has opened.",
    news3Title: "International JCI Accreditation Progress",
    news3Desc: "Farabi Hospital continues its evaluation process certifying global clinical quality standards.",

    contactTitle: "Contact & Information",
    contactSubtitle: "Get in Touch with Our International Patients Office",
    contactFormName: "Full Name",
    contactFormEmail: "Email Address",
    contactFormPhone: "Phone Number",
    contactFormMsg: "Your Message or Medical File Note",
    contactFormSubmit: "Submit Information Form",
    contactSuccess: "Your inquiry has reached our international department. We will contact you shortly.",
    workingHours: "Working Hours",
    workingHoursVal: "24/7 Emergencies & International Dept: 08:30 - 17:30",
    accreditationTitle: "Our Accreditation Certificate"
  },
  ar: {
    aboutTitle: "من نحن",
    aboutSubtitle: "التميز السريري والعمق الأكاديمي",
    aboutCard1Title: "الخدمة الدولية",
    aboutCard1Desc: "تنسيق طبي سلس بـ ٥ لغات مختلفة (TR, EN, AR, RU, KA) وتشخيصات بمستوى عالمي.",
    aboutCard2Title: "البنية التحتية التكنولوجية",
    aboutCard2Desc: "عيادات مجهزة بأحدث تقنيات الأشعة، ووحدات المسح المتقدمة، وأدوات الجراحة الروبوتية.",
    aboutCard3Title: "الهيئة التدريسية الأكاديمية",
    aboutCard3Desc: "تشخيصات موثوقة لأعقد الحالات الطبية بإشراف أكثر من ٣٦ طبيباً بروفيسوراً من جامعة KTÜ.",

    specialtiesTitle: "الأقسام الطبية",
    specialtiesSubtitle: "توزيع عياداتنا بحسب مجالات الاختصاص",
    tabSurgical: "الأقسام الجراحية",
    tabInternal: "الأقسام الباطنية",
    viewSpecialtyDocs: "عرض الأطباء المتخصصين",

    doctorsTitle: "أطباؤنا",
    doctorsSubtitle: "نخبة الأطباء البروفيسورات وهيئتنا الأكاديمية",
    searchPlaceholder: "ابحث عن طبيب بالاسم أو التخصص...",
    allCategories: "جميع الأقسام",
    filterSurgical: "الجراحية",
    filterInternal: "الباطنية",
    noDoctorsFound: "لم يتم العثور على أطباء يطابقون معايير البحث.",
    doctorDetailsBtn: "الملف التفصيلي",
    experienceYears: "سنة خبرة",

    announcementsTitle: "الأخبار والإنجازات",
    announcementsSubtitle: "العمليات الجراحية الناجحة التي أجريت في مستشفانا",
    news1Title: "نجاح باهر في استئصال الأورام",
    news1Desc: "نجح فريقنا الجراحي بقيادة البروفيسور د. جلال تكينباش في استئصال ورم نادر في القصبة الهوائية.",
    news2Title: "وحدة جديدة لزراعة نخاع العظم للأطفال",
    news2Desc: "بدأت وحدة فصادة الدم وزراعة نخاع العظم للأطفال المنشأة حديثًا بقيادة البروفيسور د. إرول إردوران في استقبال المرضى.",
    news3Title: "مسار الاعتماد الدولي لـ JCI",
    news3Desc: "يواصل مستشفى فارابي مسيرة التقييم بنجاح لتوثيق معايير جودة الرعاية الصحية العالمية.",

    contactTitle: "الاتصال والاستفسار",
    contactSubtitle: "تواصل مع مكتب تنسيق المرضى الدوليين لدينا",
    contactFormName: "الاسم الكامل",
    contactFormEmail: "البريد الإلكتروني",
    contactFormPhone: "رقم الهاتف",
    contactFormMsg: "رسالتك أو ملاحظاتك حول الملف الطبي",
    contactFormSubmit: "إرسال نموذج المعلومات",
    contactSuccess: "وصل استفسارك إلى قسم المرضى الدوليين. سنتواصل معك في أقرب وقت ممكن.",
    workingHours: "ساعات العمل",
    workingHoursVal: "الطوارئ ٢٤/٧ والمكتب الدولي: ٠٨:٣٠ - ١٧:٣٠",
    accreditationTitle: "شهادة الاعتماد الخاصة بنا"
  },
  ru: {
    aboutTitle: "О нас",
    aboutSubtitle: "Клиническое превосходство и академическая глубина",
    aboutCard1Title: "Международный сервис",
    aboutCard1Desc: "Бесперебойная координация на 5 языках (TR, EN, AR, RU, KA) и диагностика мирового уровня.",
    aboutCard2Title: "Передовые технологии",
    aboutCard2Desc: "Клиники оснащены современной радиологией, новейшими сканерами и оборудованием для роботизированной хирургии.",
    aboutCard3Title: "Академический штат",
    aboutCard3Desc: "Надежная диагностика сложных клинических случаев под руководством более 36 выдающихся профессоров KTÜ.",

    specialtiesTitle: "Медицинские отделения",
    specialtiesSubtitle: "Распределение наших клиник по специальностям",
    tabSurgical: "Хирургические отделения",
    tabInternal: "Терапевтические отделения",
    viewSpecialtyDocs: "Показать врачей отделения",

    doctorsTitle: "Наши врачи",
    doctorsSubtitle: "Выдающийся академический состав и профессора",
    searchPlaceholder: "Поиск врача по имени или специальности...",
    allCategories: "Все отделения",
    filterSurgical: "Хирургия",
    filterInternal: "Терапия",
    noDoctorsFound: "Врачи, соответствующие критериям поиска, не найдены.",
    doctorDetailsBtn: "Подробный профиль",
    experienceYears: "лет опыта",

    announcementsTitle: "Новости и достижения",
    announcementsSubtitle: "Успешные медицинские операции, проведенные в клинике",
    news1Title: "Крупный успех в резекции опухоли",
    news1Desc: "Наша хирургическая бригада во главе с профессором Джелалом Текинбашем успешно удалила редкую опухоль трахеи легкого.",
    news2Title: "Новое детское отделение трансплантации костного мозга",
    news2Desc: "Под руководством профессора Эрола Эрдурана открылось новое детское отделение трансплантации костного мозга и афереза.",
    news3Title: "Международная аккредитация JCI",
    news3Desc: "Больница Фараби успешно проходит оценку для подтверждения соответствия глобальным стандартам качества.",

    contactTitle: "Контакты и информация",
    contactSubtitle: "Свяжитесь с нашим отделом по работе с иностранными пациентами",
    contactFormName: "Ваше имя",
    contactFormEmail: "Электронная почта",
    contactFormPhone: "Номер телефона",
    contactFormMsg: "Ваше сообщение или медицинские примечания",
    contactFormSubmit: "Отправить форму",
    contactSuccess: "Ваш запрос успешно доставлен в международный отдел. Мы ответим вам в ближайшее время.",
    workingHours: "Рабочие часы",
    workingHoursVal: "Круглосуточная экстренная служба и международный отдел: 08:30 - 17:30",
    accreditationTitle: "Наш сертификат аккредитации"
  },
  ka: {
    aboutTitle: "ჩვენს შესახებ",
    aboutSubtitle: "კლინიკური სრულყოფილება და აკადემიური სიღრმე",
    aboutCard1Title: "საერთაშორისო სერვისი",
    aboutCard1Desc: "შეუფერხებელი კოორდინაცია 5 ენაზე (TR, EN, AR, RU, KA) და მსოფლიო დონის დიაგნოსტიკა.",
    aboutCard2Title: "ტექნოლოგიური ინფრასტრუქტურა",
    aboutCard2Desc: "კლინიკები აღჭურვილია თანამედროვე რადიოლოგიით, სკანერებითა და რობოტული ქირურგიის აპარატურით.",
    aboutCard3Title: "აკადემიური პერსონალი",
    aboutCard3Desc: "საიმედო დიაგნოზი რთულ შემთხვევებში KTÜ-ს 36+ გამორჩეული პროფესორი ექიმის მიერ.",

    specialtiesTitle: "სამედიცინო განყოფილებები",
    specialtiesSubtitle: "ჩვენი კლინიკების განაწილება სპეციალიზაციის მიხედვით",
    tabSurgical: "ქირურგიული განყოფილებები",
    tabInternal: "თერაპიული განყოფილებები",
    viewSpecialtyDocs: "ექიმების ნახვა",

    doctorsTitle: "ჩვენი ექიმები",
    doctorsSubtitle: "გამორჩეული აკადემიური პერსონალი და პროფესორები",
    searchPlaceholder: "მოძებნეთ ექიმი სახელით ან სპეციალობით...",
    allCategories: "ყველა განყოფილება",
    filterSurgical: "ქირურგიული",
    filterInternal: "თერაპიული",
    noDoctorsFound: "ექიმები მითითებული კრიტერიუმით ვერ მოიძებნა.",
    doctorDetailsBtn: "დეტალური პროფილი",
    experienceYears: "წლის გამოცდილება",

    announcementsTitle: "სიახლეები და მიღწევები",
    announcementsSubtitle: "ჩვენს კლინიკაში ჩატარებული წარმატებული ოპერაციები",
    news1Title: "დიდი წარმატება სიმსივნის რეზექციაში",
    news1Desc: "ჩვენმა ქირურგიულმა ჯგუფმა პროფესორ ჯელალ ტეკინბაშის ხელმძღვანელობით წარმატებით ამოკვეთა ტრაქეის სიმსივნე.",
    news2Title: "ძვლის ტვინის ახალი განყოფილება ბავშვებისთვის",
    news2Desc: "პროფესორ ეროლ ერდურანის ხელმძღვანელობით გაიხსნა ბავშვთა ტრანსპლანტაციისა და აფერეზის ახალი განყოფილება.",
    news3Title: "JCI საერთაშორისო აკრედიტაცია",
    news3Desc: "ფარაბის ჰოსპიტალი წარმატებით აგრძელებს შეფასების პროცესს ხარისხის გლობალური სტანდარტების დასადასტურებლად.",

    contactTitle: "კონტაქტი და ინფორმაცია",
    contactSubtitle: "დაუკავშირდით ჩვენს საერთაშორისო პაციენტთა ოფისს",
    contactFormName: "სახელი და გვარი",
    contactFormEmail: "ელ-ფოსტა",
    contactFormPhone: "ტელეფონის ნომერი",
    contactFormMsg: "თქვენი შეტყობინება ან სამედიცინო ჩანაწერი",
    contactFormSubmit: "ინფორმაციის გაგზავნა",
    contactSuccess: "თქვენი შეკითხვა გაიგზავნა საერთაშორისო განყოფილებაში. მალე დაგიკავშირდებით.",
    workingHours: "სამუშაო საათები",
    workingHoursVal: "24/7 გადაუდებელი დახმარება და საერთაშორისო ოფისი: 08:30 - 17:30",
    accreditationTitle: "ჩვენი აკრედიტაციის სერტიფიკატი"
  }
};

export default function HomeClient({
  initialDoctors,
  initialNews,
  initialUnits,
}: {
  initialDoctors: typeof doctorsData;
  initialNews: typeof newsData;
  initialUnits: Unit[];
}) {
  const [locale, setLocale] = useState<Locale>("tr");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const [doctors, setDoctors] = useState<typeof doctorsData>(initialDoctors);
  const [news, setNews] = useState<typeof newsData>(initialNews);

  const surgicalSpecialties = initialUnits.filter((u) => u.type === "surgical");
  const internalSpecialties = initialUnits.filter((u) => u.type === "internal");

  const activeNews = news[locale] || [];

  // Doctors filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "surgical" | "internal">("all");

  // Specialties active tab state
  const [specialtiesTab, setSpecialtiesTab] = useState<"surgical" | "internal">("surgical");

  const t = translations[locale];
  const isRtl = locale === "ar";



  // Filtered doctors based on search query and category tab
  const filteredDoctors = doctors.filter((doc) => {
    const matchesCategory = activeCategory === "all" || doc.category === activeCategory;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(searchLower) ||
      doc.specialtyTr.toLowerCase().includes(searchLower) ||
      doc.specialtyEn.toLowerCase().includes(searchLower) ||
      doc.specialtyRu.toLowerCase().includes(searchLower) ||
      doc.specialtyKa.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen w-full bg-background" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      {/* Global Navigation Header */}
      <Navbar
        currentLocale={locale}
        onLocaleChange={(l) => setLocale(l)}
      />

      {/* Hero section */}
      <Hero currentLocale={locale} />

      {/* About Us / Bento Grid Info Section */}
      <section id="about" className="py-24 bg-white/60 relative w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              {t.aboutTitle}
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {t.aboutSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bento Card 1 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel border rounded-3xl p-8 flex flex-col justify-between shadow-xs relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem]" />
              <div className="space-y-4 relative z-10">
                <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl border border-primary/20">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-black text-primary">{t.aboutCard1Title}</h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                  {t.aboutCard1Desc}
                </p>
              </div>
              <div className="pt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-wider">
                <span>International Hub</span>
                <Sparkles className="h-3.5 w-3.5 ml-1 text-secondary animate-spin" />
              </div>
            </motion.div>

            {/* Bento Card 2 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel border rounded-3xl p-8 flex flex-col justify-between shadow-xs relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-[4rem]" />
              <div className="space-y-4 relative z-10">
                <div className="p-3 bg-secondary/10 text-secondary w-fit rounded-2xl border border-secondary/20">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-black text-primary">{t.aboutCard2Title}</h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                  {t.aboutCard2Desc}
                </p>
              </div>
              <div className="pt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-wider">
                <span>Advanced Medical Tech</span>
              </div>
            </motion.div>

            {/* Bento Card 3 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel border rounded-3xl p-8 flex flex-col justify-between shadow-xs relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem]" />
              <div className="space-y-4 relative z-10">
                <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl border border-primary/20">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-black text-primary">{t.aboutCard3Title}</h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                  {t.aboutCard3Desc}
                </p>
              </div>
              <div className="pt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-wider">
                <span>Academic Guidance</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialties Tabs Section */}
      <section id="specialties" className="py-24 bg-background relative w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              {t.specialtiesTitle}
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {t.specialtiesSubtitle}
            </p>
          </div>

          {/* Specialties Sliding Tabs Selector */}
          <div className="flex items-center justify-center mb-12">
            <div className="p-1 rounded-full bg-slate-100 flex items-center space-x-1 relative z-10">
              <button
                onClick={() => setSpecialtiesTab("surgical")}
                className={`px-8 py-3 rounded-full text-xs font-black transition-all ${specialtiesTab === "surgical"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-500 hover:text-primary"
                  }`}
              >
                {t.tabSurgical}
              </button>
              <button
                onClick={() => setSpecialtiesTab("internal")}
                className={`px-8 py-3 rounded-full text-xs font-black transition-all ${specialtiesTab === "internal"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-500 hover:text-primary"
                  }`}
              >
                {t.tabInternal}
              </button>
            </div>
          </div>

          {/* Specialties Grid list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {specialtiesTab === "surgical" ? (
                <motion.div
                  key="surgical"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="contents"
                >
                  {surgicalSpecialties.map((spec, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      className="glass-panel border rounded-2xl p-5 hover:border-primary/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
                          <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-primary leading-tight">
                            {unitLabel(spec, locale)}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                            Cerrahi Birim
                          </p>
                        </div>
                      </div>
                      <a
                        href="#doctors"
                        onClick={() => {
                          setSearchQuery(spec.tr);
                          setActiveCategory("surgical");
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="internal"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="contents"
                >
                  {internalSpecialties.map((spec, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      className="glass-panel border rounded-2xl p-5 hover:border-primary/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
                          <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-primary leading-tight">
                            {unitLabel(spec, locale)}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                            Dahili Birim
                          </p>
                        </div>
                      </div>
                      <a
                        href="#doctors"
                        onClick={() => {
                          setSearchQuery(spec.tr);
                          setActiveCategory("internal");
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Doctors Catalog Directory Section */}
      <section id="doctors" className="py-24 bg-white/40 w-full relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              {t.doctorsTitle}
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {t.doctorsSubtitle}
            </p>
          </div>

          {/* Search bar & Category filters */}
          <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
            {/* Realtime Search bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none rounded-2xl text-xs font-bold transition-all shadow-2xs"
              />
            </div>

            {/* Specialty category selectors */}
            <div className="flex flex-wrap gap-2 items-center bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeCategory === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-500 hover:text-primary"
                  }`}
              >
                {t.allCategories}
              </button>
              <button
                onClick={() => setActiveCategory("surgical")}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeCategory === "surgical"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-500 hover:text-primary"
                  }`}
              >
                {t.filterSurgical}
              </button>
              <button
                onClick={() => setActiveCategory("internal")}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeCategory === "internal"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-500 hover:text-primary"
                  }`}
              >
                {t.filterInternal}
              </button>
            </div>
          </div>

          {/* Doctors Grid with Animation */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => {
                  const spec =
                    locale === "tr" ? doc.specialtyTr :
                    locale === "en" ? doc.specialtyEn :
                    locale === "ar" ? (doc.specialtyAr || doc.specialtyEn) :
                    locale === "ru" ? doc.specialtyRu :
                    doc.specialtyKa;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      key={doc.id}
                      className="glass-panel border rounded-3xl overflow-hidden flex flex-col justify-between h-[460px] shadow-2xs hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                    >
                      {/* Doctor Image Container */}
                      <div className="h-[320px] relative overflow-hidden bg-slate-50 border-b border-neutral-100 p-2">
                        <div className="w-full h-full rounded-2xl overflow-hidden relative">
                          <img
                            src={doc.image}
                            alt={formatDoctorName(doc.name, doc.title, locale)}
                            className="w-full h-full object-cover object-top hover:scale-[1.03] transition-all duration-500"
                          />
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex-1 flex flex-col justify-between text-left">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-secondary uppercase tracking-widest">
                              {doc.category === "surgical" ? t.filterSurgical : t.filterInternal}
                            </span>
                            <span className="text-[9px] text-neutral-400 font-bold">
                              {doc.stats.experience} {t.experienceYears}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-primary leading-tight mt-1 truncate">
                            {formatDoctorName(doc.name, doc.title, locale)}
                          </h4>
                          <p className="text-[11px] text-neutral-400 font-semibold line-clamp-2 min-h-[2rem]">
                            {spec}
                          </p>
                        </div>

                        {/* Direct Link to detail pages */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                          <Link
                            href={`/doctors/${doc.id}`}
                            className="flex items-center space-x-1.5 px-4 py-2 bg-primary text-white hover:bg-primary/95 text-[10px] font-extrabold rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                          >
                            <span>{t.doctorDetailsBtn}</span>
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center text-slate-400 font-semibold text-sm">
                  {t.noDoctorsFound}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Announcements Bento Board Section */}
      <section id="announcements" className="py-24 bg-white/60 w-full relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              {t.announcementsTitle}
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {t.announcementsSubtitle}
            </p>
          </div>

          <div className="flex items-center justify-center relative bg-[#f8fafc]/50 p-6 sm:p-12 rounded-[2.5rem] border border-neutral-200/50 shadow-2xs">
            <CircularTestimonials
              testimonials={activeNews}
              autoplay={true}
              colors={{
                name: "#002d62", // Brand Primary Navy
                designation: "#f5a623", // Brand Secondary Gold
                testimony: "#4b5563",
                arrowBackground: "#002d62",
                arrowForeground: "#ffffff",
                arrowHoverBackground: "#f5a623",
              }}
              fontSizes={{
                name: "24px",
                designation: "13px",
                quote: "15px",
              }}
            />
          </div>
        </div>
      </section>

      {/* Accreditation Certificate Section */}
      <section id="accreditation" className="py-24 bg-slate-50/50 w-full relative border-t border-neutral-200/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              {t.aboutTitle}
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {t.accreditationTitle}
            </p>
          </div>

          <div className="max-w-xl mx-auto glass-panel border border-primary/10 rounded-[2.5rem] p-3.5 shadow-md bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-500 cursor-pointer">
            <div className="rounded-[2rem] overflow-hidden border border-slate-100 relative bg-slate-50">
              <img
                src="/assets/akre.jpg"
                alt={t.accreditationTitle}
                className="w-full h-auto object-cover transform hover:scale-[1.03] transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Forms & Map Grid columns */}
      <section id="contact" className="py-24 bg-background w-full relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              {t.aboutTitle}
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {t.contactTitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Info Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="glass-panel border border-primary/10 rounded-[2.5rem] p-8 shadow-md space-y-6 bg-white">
                <h3 className="text-lg font-black text-primary uppercase tracking-wider mb-2">
                  {t.contactTitle}
                </h3>

                {/* Working Hours */}
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 border border-primary/20">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {t.workingHours}
                    </h4>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      {t.workingHoursVal}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 border border-primary/20 mt-0.5">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {t.aboutTitle}
                    </h4>
                    <p className="text-xs font-bold text-primary mt-0.5 leading-relaxed">
                      KTÜ Farabi Hastanesi, Üniversite Mahallesi, Farabi Caddesi No:46, 61080 Ortahisar/Trabzon, Türkiye
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* WhatsApp Line */}
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 border border-primary/20">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 448 512"
                      className="h-5 w-5 text-[#25D366]"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      WhatsApp Support
                    </h4>
                    <a
                      href="https://wa.me/905529029764"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:text-secondary transition-colors block mt-0.5 cursor-pointer"
                    >
                      0552 902 97 64
                    </a>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Info Line */}
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 border border-primary/20">
                    <Phone className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {t.contactFormPhone}
                    </h4>
                    <a
                      href="tel:+904623775464"
                      className="text-xs font-bold text-primary hover:text-secondary transition-colors block mt-0.5 cursor-pointer"
                    >
                      0462 377 54 64
                    </a>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* E-Mail Address */}
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 border border-primary/20">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {t.contactFormEmail}
                    </h4>
                    <a
                      href="mailto:farabihospital@ktu.edu.tr"
                      className="text-xs font-bold text-primary hover:text-secondary transition-colors block mt-0.5 cursor-pointer"
                    >
                      farabihospital@ktu.edu.tr
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-primary/15 shadow-sm relative p-2 bg-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.505707744315!2d39.7712391!3d41.003309999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406e67ee1c002237%3A0xe54d5885c4ad20d6!2sKT%C3%9C%20Farabi%20Hastanesi!5e0!3m2!1str!2str!4v1718545800000!5m2!1str!2str"
                  className="w-full h-full rounded-2xl border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="text-right">
                <a
                  href="https://maps.app.goo.gl/5RQzj5bS9gBcHBY57"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-black text-primary hover:text-secondary uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Google Maps ile Aç</span>
                  <ArrowRight className="h-3.5 w-3.5 text-secondary" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Informational Footer */}
      <Footer currentLocale={locale} />



      {/* Dynamic Live Chat support bubble widget */}
      <ChatWidget currentLocale={locale} />
    </div>
  );
}
