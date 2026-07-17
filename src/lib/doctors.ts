export function getCleanName(name: string, title?: string): string {
  let clean = name;
  
  const prefixes = [
    "Prof. Dr. ",
    "Prof. Dr.",
    "Assoc. Prof. ",
    "Assoc. Prof.",
    "Asst. Prof. ",
    "Asst. Prof.",
    "Assist. Prof. ",
    "Assist. Prof.",
    "Doç. Dr. ",
    "Doç. Dr.",
    "Dr. Öğr. Üyesi ",
    "Dr. Öğr. Üyesi",
    "Yrd. Doç. Dr. ",
    "Yrd. Doç. Dr.",
    "Yrd. Doç. ",
    "Yrd. Doç.",
    "Dr. ",
    "Dr."
  ];

  if (title) {
    const trimmedTitle = title.trim();
    if (clean.startsWith(trimmedTitle)) {
      clean = clean.substring(trimmedTitle.length).trim();
    }
  }

  for (const prefix of prefixes) {
    if (clean.startsWith(prefix)) {
      clean = clean.substring(prefix.length).trim();
      break;
    }
  }

  return clean;
}

export function formatDoctorName(name: string, title: string, locale: string): string {
  const cleanName = getCleanName(name, title);
  let translatedTitle = title;
  const normalizedTitle = title ? title.trim().toLowerCase() : "";

  if (normalizedTitle.includes("assoc") || normalizedTitle.includes("doç") || normalizedTitle.includes("doc")) {
    if (locale === "tr") translatedTitle = "Doç. Dr.";
    else if (locale === "en") translatedTitle = "Assoc. Prof.";
    else if (locale === "ar") translatedTitle = "أ. م. د.";
    else if (locale === "ru") translatedTitle = "Доц. др";
    else if (locale === "ka") translatedTitle = "ასოც. პროფ.";
  } else if (
    normalizedTitle.includes("asst") ||
    normalizedTitle.includes("assist") ||
    normalizedTitle.includes("yrd") ||
    normalizedTitle.includes("öğr")
  ) {
    if (locale === "tr") translatedTitle = "Dr. Öğr. Üyesi";
    else if (locale === "en") translatedTitle = "Asst. Prof.";
    else if (locale === "ar") translatedTitle = "أ. مس. د.";
    else if (locale === "ru") translatedTitle = "Ассист. др";
    else if (locale === "ka") translatedTitle = "ასისტ. პროფ.";
  } else if (normalizedTitle.includes("prof")) {
    if (locale === "tr") translatedTitle = "Prof. Dr.";
    else if (locale === "en") translatedTitle = "Prof. Dr.";
    else if (locale === "ar") translatedTitle = "أ. د.";
    else if (locale === "ru") translatedTitle = "Проф. др";
    else if (locale === "ka") translatedTitle = "პროფ. დოქტ.";
  } else if (normalizedTitle.includes("dr") || normalizedTitle.startsWith("dr")) {
    if (locale === "tr") translatedTitle = "Dr.";
    else if (locale === "en") translatedTitle = "Dr.";
    else if (locale === "ar") translatedTitle = "د.";
    else if (locale === "ru") translatedTitle = "Др";
    else if (locale === "ka") translatedTitle = "დოქტ.";
  }

  return `${translatedTitle} ${cleanName}`;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  image: string;
  specialtyTr: string;
  specialtyEn: string;
  specialtyAr?: string;
  specialtyRu: string;
  specialtyKa: string;
  category: "surgical" | "internal";
  stats: {
    patients: number;
    surgeries?: number;
    experience: number;
  };
  email: string;
  educationTr: string[];
  educationEn: string[];
  educationAr?: string[];
  bioTr: string;
  bioEn: string;
  bioAr?: string;
  bioRu: string;
  bioKa: string;
}

export const doctorsData: Doctor[] = [
  {
    id: "4177",
    name: "Prof. Dr. Celal TEKİNBAŞ",
    title: "Prof. Dr.",
    image: "/assets/doctors/celal_tekinbas.jpg",
    specialtyTr: "Göğüs Cerrahisi Polikliniği",
    specialtyEn: "Thoracic Surgery",
    specialtyAr: "جراحة الصدر",
    specialtyRu: "Торакальная хирургия",
    specialtyKa: "თორაკალური ქირურგია",
    category: "surgical",
    stats: { patients: 14200, surgeries: 4500, experience: 28 },
    email: "celal.tekinbas@ktu.edu.tr",
    educationTr: [
      "Karadeniz Teknik Üniversitesi Tıp Fakültesi (Lisans)",
      "KTÜ Tıp Fakültesi Göğüs Cerrahisi Anabilim Dalı (Uzmanlık)"
    ],
    educationEn: [
      "Karadeniz Technical University Faculty of Medicine (MD)",
      "KTÜ Faculty of Medicine, Dept of Thoracic Surgery (Residency)"
    ],
    educationAr: [
      "جامعة كارادينيز التقنية، كلية الطب (بكالوريوس)",
      "قسم جراحة الصدر بكلية طب جامعة كارادينيز التقنية (تخصص)"
    ],
    bioTr: "Prof. Dr. Celal Tekinbaş, KTÜ Farabi Hastanesi Başhekimi ve Göğüs Cerrahisi Anabilim Dalı Başkanıdır. Akciğer kanseri cerrahisi ve trakea rezeksiyonları konusunda uluslararası düzeyde tanınmaktadır.",
    bioEn: "Prof. Dr. Celal Tekinbaş is the Chief Physician of KTÜ Farabi Hospital and Head of the Thoracic Surgery Department. He is internationally recognized for his work in lung cancer surgery and tracheal resections.",
    bioAr: "البروفيسور الدكتور جلال تيكينباش هو كبير الأطباء ورئيس قسم جراحة الصدر في مستشفى الفارابي بجامعة KTÜ. يحظى بشهرة دولية في مجال جراحة سرطان الرئة واستئصال القصبة الهوائية.",
    bioRu: "Профессор др Джелал Текинбаш — главный врач больницы КТУ Фараби и заведующий отделением торакальной хирургии. Он признан на международном уровне благодаря своим работам в области хирургии рака легких.",
    bioKa: "პროფ. დოქტ. ჯელალ ტეკინბაში არის კტუ ფარაბის ჰოსპიტალის მთავარი ექიმი და თორაკალური ქირურგიის დეპარტამენტის ხელმძღვანელი. იგი საერთაშორისოდ აღიარებულია ფილტვის კიბოს ქირურგიაში."
  },
  {
    id: "4190",
    name: "Assoc. Prof. Ayşenur BAHADIR",
    title: "Assoc. Prof.",
    image: "/assets/doctors/aysenur_bahadir.jpg",
    specialtyTr: "Genel Pediatri Polikliniği",
    specialtyEn: "General Pediatrics",
    specialtyAr: "طب الأطفال العام",
    specialtyRu: "Общая педиатрия",
    specialtyKa: "ზოგადი პედიატრია",
    category: "internal",
    stats: { patients: 9800, experience: 16 },
    email: "aysenur.bahadir@ktu.edu.tr",
    educationTr: [
      "Hacettepe Üniversitesi Tıp Fakültesi",
      "KTÜ Tıp Fakültesi Çocuk Sağlığı Anabilim Dalı"
    ],
    educationEn: [
      "Hacettepe University Faculty of Medicine",
      "KTÜ Faculty of Medicine, Dept of Pediatrics"
    ],
    educationAr: [
      "جامعة هاسيتيبي، كلية الطب",
      "قسم صحة الأطفال بكلية طب جامعة كارادينيز التقنية"
    ],
    bioTr: "Doç. Dr. Ayşenur Bahadır, çocuk sağlığı, gelişimi ve genel çocuk hastalıkları alanında uzmanlaşmıştır. Özellikle çocuk hematolojisi ve gelişimsel pediatri alanlarında akademik çalışmalar yürütmektedir.",
    bioEn: "Assoc. Prof. Ayşenur Bahadir specializes in pediatric health, child development, and general childhood illnesses. She conducts academic research in pediatric hematology and developmental pediatrics.",
    bioAr: "تتخصص الأستاذة المشاركة الدكتورة آيشنور بهادير في صحة الأطفال ونموهم وأمراض الطفولة العامة. وتقوم بإجراء أبحاث أكاديمية في مجال أمراض دم الأطفال وطب الأطفال النمائي.",
    bioRu: "Доцент Айшенур Бахадыр специализируется на здоровье детей, развитии и общих детских болезнях. Она проводит академические исследования в области детской гематологии.",
    bioKa: "ასოც. პროფ. აიშენურ ბაჰადირი სპეციალიზდება ბავშვთა ჯანმრთელობაზე, ბავშვის განვითარებასა და ზოგად ბავშვთა დაავადებებზე. ატარებს აკადემიურ კვლევებს პედიატრიულ ჰემატოლოგიაში."
  },
  {
    id: "4201",
    name: "Assoc. Prof. Bircan SÖNMEZ",
    title: "Assoc. Prof.",
    image: "/assets/doctors/bircan_sonmez.jpg",
    specialtyTr: "Pediatri Hematoloji ve Onkoloji Polikliniği",
    specialtyEn: "Pediatric Hematology & Oncology",
    specialtyAr: "أمراض دم وأورام الأطفال",
    specialtyRu: "Детская гематология и онкология",
    specialtyKa: "ბავშვთა ჰემატოლოგია და ონკოლოგია",
    category: "internal",
    stats: { patients: 5400, experience: 14 },
    email: "bircan.sonmez@ktu.edu.tr",
    educationTr: [
      "Ege Üniversitesi Tıp Fakültesi",
      "KTÜ Çocuk Onkolojisi Yandal Uzmanlığı"
    ],
    educationEn: [
      "Ege University Faculty of Medicine",
      "KTÜ Pediatric Oncology Fellowship"
    ],
    bioTr: "Doç. Dr. Bircan Sönmez, çocukluk çağı kanserleri, lösemi, lenfoma ve kan hastalıkları tedavilerinde uzman klinik kadromuzun değerli bir üyesidir.",
    bioEn: "Assoc. Prof. Bircan Sönmez is a valuable member of our clinical team specializing in childhood cancers, leukemia, lymphoma, and blood disorders treatments.",
    bioRu: "Доцент Бирджан Сёнмез — ценный член нашей клинической команды, специализирующийся на лечении детского рака, лейкемии, лимфомы и заболеваний крови.",
    bioKa: "ასოც. პროფ. ბირჯან სონმეზი არის ჩვენი კლინიკური გუნდის წევრი, რომელიც სპეციალიზდება ბავშვთა კიბოს, ლეიკემიის, ლიმფომისა და სისხლის დაავადებების მკურნალობაზე."
  },
  {
    id: "4204",
    name: "Assoc. Prof. Deniz AKSU ARICA",
    title: "Assoc. Prof.",
    image: "/assets/doctors/deniz_aksu_arica.jpg",
    specialtyTr: "Cildiye Polikliniği",
    specialtyEn: "Dermatology",
    specialtyAr: "الجلدية",
    specialtyRu: "Дерматология",
    specialtyKa: "დერმატოლოგია",
    category: "internal",
    stats: { patients: 11200, experience: 15 },
    email: "deniz.arica@ktu.edu.tr",
    educationTr: [
      "Ankara Üniversitesi Tıp Fakültesi",
      "Gazi Üniversitesi Tıp Fakültesi Dermatoloji AD"
    ],
    educationEn: [
      "Ankara University Faculty of Medicine",
      "Gazi University Dept of Dermatology"
    ],
    bioTr: "Doç. Dr. Deniz Aksu Arıca, akne, sedef hastalığı, egzama, cilt kanserlerinin erken teşhisi ve dermokozmetik uygulamalarda derin bir uzmanlığa sahiptir.",
    bioEn: "Assoc. Prof. Deniz Aksu Arica has deep expertise in acne, psoriasis, eczema, early diagnosis of skin cancers, and dermocosmetic applications.",
    bioRu: "Доцент Дениз Аксу Арыджа обладает глубоким опытом в лечении акне, псориаза, экземы, ранней диагностики рака кожи и дермокосметических процедур.",
    bioKa: "ასოც. პროფ. დენიზ აქსუ არიჯას აქვს დიდი გამოცდილება აკნეს, ფსორიაზის, ეგზემის, კანის კიბოს ადრეული დიაგნოსტიკისა და დერმოკოსმეტიკური მიმართულებით."
  },
  {
    id: "4202",
    name: "Assoc. Prof. Elif ACAR ARSLAN",
    title: "Assoc. Prof.",
    image: "/assets/doctors/elif_acar_arslan.png",
    specialtyTr: "Pediatri Nöroloji Polikliniği",
    specialtyEn: "Pediatric Neurology",
    specialtyAr: "أعصاب الأطفال",
    specialtyRu: "Детская неврология",
    specialtyKa: "ბავშვთა ნევროლოგია",
    category: "internal",
    stats: { patients: 7600, experience: 14 },
    email: "elif.acar@ktu.edu.tr",
    educationTr: [
      "Atatürk Üniversitesi Tıp Fakültesi",
      "KTÜ Çocuk Sağlığı ve Hastalıkları AD",
      "Çocuk Nörolojisi Yandal Uzmanlığı"
    ],
    educationEn: [
      "Atatürk University Faculty of Medicine",
      "KTÜ Dept of Pediatrics",
      "Pediatric Neurology Fellowship"
    ],
    bioTr: "Doç. Dr. Elif Acar Arslan, çocuklarda epilepsi, gelişimsel gerilikler, serebral palsi ve nöromusküler hastalıkların tanı ve takibinde öncüdür.",
    bioEn: "Assoc. Prof. Elif Acar Arslan is a pioneer in the diagnosis and follow-up of epilepsy, developmental delays, cerebral palsy, and neuromuscular disorders in children.",
    bioRu: "Доцент Элиф Аджар Арслан — пионер в диагностике и лечении эпилепсии, задержек развития, ДЦП и нервно-мышечных заболеваний у детей.",
    bioKa: "ასოც. პროფ. ელეფ აქარ არსლანი არის პიონერი ბავშვებში ეპილეფსიის, განვითარების შეფერხებების, ცერებრალური დამბლისა და ნეიროკუნთოვანი დაავადებების დიაგნოსტიკაში."
  },
  {
    id: "4208",
    name: "Assoc. Prof. Hatice Bengü YALDIZ ÇOBANOĞLU",
    title: "Assoc. Prof.",
    image: "/assets/doctors/bengu_cobanoglu.jpg",
    specialtyTr: "Kulak-Burun-Boğaz Polikliniği",
    specialtyEn: "Otorhinolaryngology (ENT)",
    specialtyAr: "أنف وأذن وحنجرة",
    specialtyRu: "Оториноларингология (ЛОР)",
    specialtyKa: "ყელ-ყურ-ცხვირი",
    category: "surgical",
    stats: { patients: 8400, surgeries: 1900, experience: 13 },
    email: "bengu.cobanoglu@ktu.edu.tr",
    educationTr: [
      "İstanbul Üniversitesi Cerrahpaşa Tıp Fakültesi",
      "KTÜ KBB Anabilim Dalı Uzmanlık"
    ],
    educationEn: [
      "Istanbul University Cerrahpasa Faculty of Medicine",
      "KTÜ Dept of ENT Residency"
    ],
    bioTr: "Doç. Dr. Hatice Bengü Yaldız Çobanoğlu, ses bozuklukları, sinüzit cerrahisi, rinoplasti ve pediatrik KBB hastalıkları üzerine odaklanmaktadır.",
    bioEn: "Assoc. Prof. Hatice Bengu Yaldiz Cobanoglu focuses on voice disorders, sinusitis surgery, rhinoplasty, and pediatric ENT diseases.",
    bioRu: "Доцент Хатидже Бенгю Ялдыз Чобаноглу специализируется на голосовых расстройствах, хирургии синусита, ринопластике и детских ЛОР-заболеваниях.",
    bioKa: "ასოც. პროფ. ჰატიჯე ბენგო იალდიზ ჩობანოღლუ ყურადღებას ამახვილებს ხმის დარღვევებზე, სინუსიტის ქირურგიაზე, რინოპლასტიკასა და პედიატრიულ ყელ-ყურ-ცხვირის დაავადებებზე."
  },
  {
    id: "4207",
    name: "Assoc. Prof. Selçuk ARSLAN",
    title: "Assoc. Prof.",
    image: "/assets/doctors/selcuk_arslan.jpg",
    specialtyTr: "Tıbbi Genetik Polikliniği",
    specialtyEn: "Medical Genetics",
    specialtyAr: "الوراثة الطبية",
    specialtyRu: "Медицинская генетика",
    specialtyKa: "სამედიცინო გენეტიკა",
    category: "internal",
    stats: { patients: 4800, experience: 12 },
    email: "selcuk.arslan@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "Ankara Dışkapı Hastanesi Genetik Birimi"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "Ankara Diskapi Hospital Genetics Unit"
    ],
    bioTr: "Doç. Dr. Selçuk Arslan, kalıtsal hastalıklar, kanser genetiği, prenatal tanı ve nadir hastalıkların genetik taramaları konusunda hastanemizin baş genetik uzmanıdır.",
    bioEn: "Assoc. Prof. Selçuk Arslan is our hospital's chief geneticist, focusing on inherited diseases, cancer genetics, prenatal diagnosis, and genetic screenings for rare diseases.",
    bioRu: "Доцент Сельчук Арслан — главный генетик нашей больницы, специализирующийся на наследственных заболеваниях, генетике рака и пренатальной диагностике.",
    bioKa: "ასოც. პროფ. სელჩუკ არსლანი არის ჩვენი კლინიკის წამყვანი გენეტიკოსი, რომელიც ორიენტირებულია მემკვიდრეობით დაავადებებზე, კიბოს გენეტიკასა და პრენატალურ დიაგნოსტიკაზე."
  },
  {
    id: "4183",
    name: "Assoc. Prof. İlke Onur KAZAZ",
    title: "Assoc. Prof.",
    image: "/assets/doctors/onur_kazaz.png",
    specialtyTr: "Üroloji Polikliniği",
    specialtyEn: "Urology",
    specialtyAr: "المسالك البولية",
    specialtyRu: "Урология",
    specialtyKa: "უროლოგია",
    category: "surgical",
    stats: { patients: 9200, surgeries: 2600, experience: 15 },
    email: "onur.kazaz@ktu.edu.tr",
    educationTr: [
      "Hacettepe Üniversitesi Tıp Fakültesi",
      "KTÜ Üroloji Anabilim Dalı Uzmanlık"
    ],
    educationEn: [
      "Hacettepe University Faculty of Medicine",
      "KTÜ Dept of Urology Residency"
    ],
    bioTr: "Doç. Dr. İlke Onur Kazaz, ürolojik onkoloji (prostat, böbrek ve mesane kanserleri), endoüroloji ve laparoskopik cerrahi tekniklerinde seçkin bir cerrahtır.",
    bioEn: "Assoc. Prof. İlke Onur Kazaz is an outstanding surgeon in urological oncology (prostate, kidney, and bladder cancers), endourology, and laparoscopic surgical techniques.",
    bioRu: "Доцент Ильке Онур Казаз — выдающийся хирург в области урологической онкологии (рак простаты, почек и мочевого пузыря), эндоурологии и лапароскопических методов.",
    bioKa: "ასოც. პროფ. ილქე ონურ კაზაზი არის გამორჩეული ქირურგი უროლოგიურ ონკოლოგიაში (პროსტატის, თირკმლის და შარდის ბუშტის კიბო), ენდოუროლოგიასა და ლაპაროსკოპიულ მეთოდებში."
  },
  {
    id: "4187",
    name: "Asst. Prof. Fatih ÇOLAK",
    title: "Asst. Prof.",
    image: "/assets/doctors/fatih_colak.jpg",
    specialtyTr: "Göğüs Cerrahisi Polikliniği",
    specialtyEn: "Thoracic Surgery",
    specialtyAr: "جراحة الصدر",
    specialtyRu: "Торакальная хирургия",
    specialtyKa: "თორაკალური ქირურგია",
    category: "surgical",
    stats: { patients: 5100, surgeries: 1200, experience: 10 },
    email: "fatih.colak@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi (Lisans)",
      "KTÜ Göğüs Cerrahisi AD (Tıpta Uzmanlık)"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine (MD)",
      "KTÜ Dept of Thoracic Surgery (Residency)"
    ],
    bioTr: "Dr. Öğr. Üyesi Fatih Çolak, minimal invaziv göğüs cerrahisi (VATS), akciğer rezeksiyonları ve göğüs duvarı deformitelerinin düzeltilmesi konularında uzmanlaşmıştır.",
    bioEn: "Asst. Prof. Fatih Colak specializes in minimally invasive thoracic surgery (VATS), lung resections, and the correction of chest wall deformities.",
    bioRu: "Доцент Фатих Чолак специализируется на минимально инвазивной торакальной хирургии (VATS), резекции легких и коррекции деформаций грудной клетки.",
    bioKa: "ასისტ. პროფ. ფათიჰ ჩოლაქი სპეციალიზდება მინიმალურად ინვაზიურ თორაკალურ ქირურგიაზე (VATS), ფილტვის რეზექციასა და გულმკერდის კედლის დეფორმაციების კორექციაზე."
  },
  {
    id: "4193",
    name: "Asst. Prof. Kerim ÖNER",
    title: "Asst. Prof.",
    image: "/assets/doctors/kerim_oner.jpg",
    specialtyTr: "Genel Pediatri Polikliniği",
    specialtyEn: "General Pediatrics",
    specialtyAr: "طب الأطفال العام",
    specialtyRu: "Общая педиатрия",
    specialtyKa: "ზოგადი პედიატრია",
    category: "internal",
    stats: { patients: 6300, experience: 9 },
    email: "kerim.oner@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "Erciyes Üniversitesi Çocuk Sağlığı AD"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "Erciyes University Dept of Pediatrics"
    ],
    bioTr: "Dr. Öğr. Üyesi Kerim Öner, çocuklarda enfeksiyon hastalıkları, büyüme gelişme takibi ve çocukluk çağı aşılamaları üzerine yoğunlaşmaktadır.",
    bioEn: "Asst. Prof. Kerim Öner focuses on pediatric infectious diseases, growth and development monitoring, and childhood immunizations.",
    bioRu: "Доцент Керим Онер специализируется на инфекционных заболеваниях у детей, мониторинге роста и развития, а также детской вакцинации.",
    bioKa: "ასისტ. პროფ. ქერიმ ონერი ყურადღებას ამახვილებს ბავშვთა ინფექციურ დაავადებებზე, ზრდა-განვითარების მონიტორინგსა და ბავშვთა იმუნიზაციაზე."
  },
  {
    id: "4205",
    name: "Asst. Prof. Leyla BAYKAL SELÇUK",
    title: "Asst. Prof.",
    image: "/assets/doctors/leyla_baykal_selcuk.png",
    specialtyTr: "Cildiye Polikliniği",
    specialtyEn: "Dermatology",
    specialtyAr: "الجلدية",
    specialtyRu: "Дерматология",
    specialtyKa: "დერმატოლოგია",
    category: "internal",
    stats: { patients: 7800, experience: 11 },
    email: "leyla.baykal@ktu.edu.tr",
    educationTr: [
      "Hacettepe Tıp Fakültesi",
      "KTÜ Dermatoloji AD Uzmanlık"
    ],
    educationEn: [
      "Hacettepe Faculty of Medicine",
      "KTÜ Dept of Dermatology Residency"
    ],
    bioTr: "Dr. Öğr. Üyesi Leyla Baykal Selçuk, saç dökülmesi tedavileri, tırnak cerrahisi, sedef hastalığı yönetimi ve dermatolojik lazer uygulamalarında uzmandır.",
    bioEn: "Asst. Prof. Leyla Baykal Selçuk is an expert in hair loss treatments, nail surgery, psoriasis management, and dermatological laser applications.",
    bioRu: "Доцент Лейла Байкал Сельчук является экспертом в лечении выпадения волос, хирургии ногтей, ведении псориаза и лазерной дерматологии.",
    bioKa: "ასისტ. პროფ. ლეილა ბაიკალ სელჩუკი არის ექსპერტი თმის ცვენის მკურნალობაში, ფრჩხილის ქირურგიაში, ფსორიაზის მართვასა და დერმატოლოგიურ ლაზერულ პროცედურებში."
  },
  {
    id: "4199",
    name: "Asst. Prof. Mürsel ŞAHİN",
    title: "Asst. Prof.",
    image: "/assets/doctors/mursel_sahin.jpg",
    specialtyTr: "Kardiyoloji Polikliniği",
    specialtyEn: "Cardiology",
    specialtyAr: "أمراض القلب",
    specialtyRu: "Кардиология",
    specialtyKa: "კარდიოლოგია",
    category: "internal",
    stats: { patients: 8200, experience: 12 },
    email: "mursel.sahin@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "KTÜ Kardiyoloji AD Uzmanlık"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "KTÜ Dept of Cardiology Residency"
    ],
    bioTr: "Dr. Öğr. Üyesi Mürsel Şahin, koroner arter hastalıkları, kalp yetmezliği tedavileri ve koroner anjiyografi/stent uygulamalarında yüksek klinik başarıya sahiptir.",
    bioEn: "Asst. Prof. Mürsel Şahin has high clinical success in coronary artery disease, heart failure treatments, and coronary angiography/stenting procedures.",
    bioRu: "Доцент Мюрсель Шахин имеет высокие успехи в лечении ишемической болезни сердца, сердечной недостаточности и выполнении коронарной ангиографии.",
    bioKa: "ასისტ. პროფ. მურსელ შაჰინს აქვს დიდი კლინიკური წარმატება კორონარული არტერიის დაავადების, გულის უკმარისობის მკურნალობისა და კორონარული ანგიოგრაფიის მიმართულებით."
  },
  {
    id: "4209",
    name: "Asst. Prof. Seher Nazlı KAZAZ",
    title: "Asst. Prof.",
    image: "/assets/doctors/seher_nazli_kazaz.jpg",
    specialtyTr: "Göğüs Hastalıkları Polikliniği",
    specialtyEn: "Pulmonology (Chest Diseases)",
    specialtyAr: "أمراض الصدر",
    specialtyRu: "Пульмонология",
    specialtyKa: "პულმონოლოგია",
    category: "internal",
    stats: { patients: 5900, experience: 10 },
    email: "seher.kazaz@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "KTÜ Göğüs Hastalıkları AD Uzmanlık"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "KTÜ Dept of Pulmonary Diseases Residency"
    ],
    bioTr: "Dr. Öğr. Üyesi Seher Nazlı Kazaz, astım, KOAH, uykuda solunum bozuklukları ve tüberküloz tedavilerinde kapsamlı takip sunmaktadır.",
    bioEn: "Asst. Prof. Seher Nazlı Kazaz offers comprehensive follow-up in asthma, COPD, sleep apnea, and tuberculosis treatments.",
    bioRu: "Доцент Сехер Назлы Казаз предлагает комплексное лечение астмы, ХОБЛ, нарушений дыхания во сне и туберкулеза.",
    bioKa: "ასისტ. პროფ. სეჰერ ნაზლი კაზაზი სთავაზობს პაციენტებს კომპლექსურ მკურნალობას ასთმის, ფილტვების ქრონიკული ობსტრუქციული დაავადებისა და ძილის აპნოეს მიმართულებით."
  },
  {
    id: "4206",
    name: "Prof. Dr. Abdülcemal Ümit IŞIK",
    title: "Prof. Dr.",
    image: "/assets/doctors/abdulcemal_umit_isik.jpg",
    specialtyTr: "Gastroenteroloji Polikliniği",
    specialtyEn: "Gastroenterology",
    specialtyAr: "أمراض الجهاز الهضمي",
    specialtyRu: "Гастроэнтерология",
    specialtyKa: "გასტროენტეროლოგია",
    category: "internal",
    stats: { patients: 15400, experience: 29 },
    email: "umit.isik@ktu.edu.tr",
    educationTr: [
      "Ankara Üniversitesi Tıp Fakültesi",
      "Hacettepe Üniversitesi Gastroenteroloji Yandal Uzmanlığı"
    ],
    educationEn: [
      "Ankara University Faculty of Medicine",
      "Hacettepe University Gastroenterology Fellowship"
    ],
    bioTr: "Prof. Dr. Abdülcemal Ümit Işık, mide, bağırsak, karaciğer ve safra yolları hastalıklarının tanı ve tedavisinde (endoskopi, kolonoskopi) önde gelen akademisyen hekimlerimizdendir.",
    bioEn: "Prof. Dr. Abdülcemal Ümit Işık is one of our leading academic physicians in the diagnosis and treatment of stomach, bowel, liver, and biliary tract diseases (endoscopy, colonoscopy).",
    bioRu: "Профессор др Абдульджемаль Умит Ишик — один из наших ведущих врачей в области диагностики и лечения заболеваний желудка, кишечника, печени и желчевыводящих путей.",
    bioKa: "პროფ. დოქტ. აბდულჯემალ უმიტ იშიკი არის ჩვენი ერთ-ერთი წამყვანი აკადემიური ექიმი კუჭის, ნაწლავების, ღვიძლისა და სანაღვლე გზების დაავადებების დიაგნოსტიკასა და მკურნალობაში."
  },
  {
    id: "4188",
    name: "Prof. Dr. Adnan ÇALIK",
    title: "Prof. Dr.",
    image: "/assets/doctors/adnan_calik.jpg",
    specialtyTr: "Genel Cerrahi Polikliniği",
    specialtyEn: "General Surgery",
    specialtyAr: "الجراحة العامة",
    specialtyRu: "Общая хирургия",
    specialtyKa: "ზოგადი ქირურგია",
    category: "surgical",
    stats: { patients: 12100, surgeries: 3900, experience: 27 },
    email: "adnan.calik@ktu.edu.tr",
    educationTr: [
      "İstanbul Üniversitesi Cerrahpaşa Tıp Fakültesi",
      "KTÜ Genel Cerrahi AD Uzmanlık"
    ],
    educationEn: [
      "Istanbul University Cerrahpasa Faculty of Medicine",
      "KTÜ Dept of General Surgery Residency"
    ],
    bioTr: "Prof. Dr. Adnan Çalık, kolon, rektum kanserleri cerrahisi, laparoskopik fıtık cerrahisi ve obezite cerrahisinde önde gelen cerrahlarımızdan biridir.",
    bioEn: "Prof. Dr. Adnan Çalık is one of our leading surgeons in colon and rectal cancer surgery, laparoscopic hernia surgery, and bariatric (obesity) surgery.",
    bioRu: "Профессор др Аднан Чалык — один из наших ведущих хирургов в области хирургии рака толстой и прямой кишки, лапароскопической герниопластики и хирургии ожирения.",
    bioKa: "პროფ. დოქტ. ადნან ჩალიქი არის ჩვენი ერთ-ერთი წამყვანი ქირურგი მსხვილი და სწორი ნაწლავის კიბოს ქირურგიაში, ლაპაროსკოპიულ თიაქარპლასტიკასა და ბარიატრიულ ქირურგიაში."
  },
  {
    id: "4192",
    name: "Prof. Dr. Ahmet Coşkun ÖZDEMİR",
    title: "Prof. Dr.",
    image: "/assets/doctors/ahmet_coskun_ozdemir.jpg",
    specialtyTr: "Dahiliye Polikliniği",
    specialtyEn: "Internal Medicine",
    specialtyAr: "الطب الباطني",
    specialtyRu: "Терапия",
    specialtyKa: "შინაგანი მედიცინა",
    category: "internal",
    stats: { patients: 18900, experience: 32 },
    email: "coskun.ozdemir@ktu.edu.tr",
    educationTr: [
      "Ankara Üniversitesi Tıp Fakültesi",
      "KTÜ İç Hastalıkları Anabilim Dalı"
    ],
    educationEn: [
      "Ankara University Faculty of Medicine",
      "KTÜ Dept of Internal Medicine"
    ],
    bioTr: "Prof. Dr. Ahmet Coşkun Özdemir, hipertansiyon, diyabet, sistemik otoimmün bozukluklar ve yaşlı sağlığı konularında 30 yılı aşkın klinik tecrübeye sahiptir.",
    bioEn: "Prof. Dr. Ahmet Coşkun Özdemir has more than 30 years of clinical experience in hypertension, diabetes, systemic autoimmune disorders, and geriatric health.",
    bioRu: "Профессор др Ахмет Джошкун Оздемир имеет более 30 лет клинического опыта в лечении гипертонии, диабета, системных аутоиммунных заболеваний.",
    bioKa: "პროფ. დოქტ. აჰმედ ჯოშკუნ ოზდემირს აქვს 30 წელზე მეტი კლინიკური გამოცდილება ჰიპერტენზიის, დიაბეტის, სისტემური აუტოიმუნური დარღვევების მკურნალობაში."
  },
  {
    id: "4178",
    name: "Prof. Dr. Atila TÜRKYILMAZ",
    title: "Prof. Dr.",
    image: "/assets/doctors/atila_turkyilmaz.jpg",
    specialtyTr: "Göğüs Cerrahisi Polikliniği",
    specialtyEn: "Thoracic Surgery",
    specialtyAr: "جراحة الصدر",
    specialtyRu: "Торакальная хирургия",
    specialtyKa: "თორაკალური ქირურგია",
    category: "surgical",
    stats: { patients: 11000, surgeries: 3800, experience: 24 },
    email: "atila.turkyilmaz@ktu.edu.tr",
    educationTr: [
      "Atatürk Üniversitesi Tıp Fakültesi",
      "Atatürk Üniversitesi Göğüs Cerrahisi AD Uzmanlık"
    ],
    educationEn: [
      "Ataturk University Faculty of Medicine",
      "Ataturk University Dept of Thoracic Surgery Residency"
    ],
    bioTr: "Prof. Dr. Atila Türkyılmaz, özofagus (yemek borusu) kanseri cerrahisi, mediasten tümörleri ve akciğer transplantasyonu hazırlık/nakil süreçlerinde uzmandır.",
    bioEn: "Prof. Dr. Atila Türkyılmaz is an expert in esophageal cancer surgery, mediastinal tumors, and lung transplantation preparation and procedures.",
    bioRu: "Профессор др Атила Тюркйылмаз — эксперт в области хирургии рака пищевода, опухолей средостения и подготовки к трансплантации легких.",
    bioKa: "პროფ. დოქტ. ატილა თურქიილმაზი არის ექსპერტი საყლაპავი მილის კიბოს ქირურგიაში, შუასაყრის სიმსივნეებსა და ფილტვის ტრანსპლანტაციის მომზადების პროცესებში."
  },
  {
    id: "4196",
    name: "Prof. Dr. Erhan ARSLAN",
    title: "Prof. Dr.",
    image: "/assets/doctors/erhan_arslan.jpg",
    specialtyTr: "Beyin Cerrahi Polikliniği",
    specialtyEn: "Neurosurgery",
    specialtyAr: "جراحة الأعصاب",
    specialtyRu: "Нейрохирургия",
    specialtyKa: "ნეიროქირურგია",
    category: "surgical",
    stats: { patients: 10400, surgeries: 3100, experience: 22 },
    email: "erhan.arslan@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "KTÜ Beyin ve Sinir Cerrahisi AD Uzmanlık"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "KTÜ Dept of Neurosurgery Residency"
    ],
    bioTr: "Prof. Dr. Erhan Arslan, beyin tümörleri mikrocerrahisi, spinal dekompresyon, bel-boyun fıtıkları ve hidrosefali ameliyatlarında uzmanlaşmış kıdemli bir hekimdir.",
    bioEn: "Prof. Dr. Erhan Arslan is a senior physician specializing in brain tumor microsurgery, spinal decompression, lumbar-cervical disc herniation surgeries, and hydrocephalus.",
    bioRu: "Профессор др Эрхан Арслан — ведущий специалист в области микрохирургии опухолей головного мозга, спинальной декомпрессии и хирургии грыж.",
    bioKa: "პროფ. დოქტ. ერჰან არსლანი არის უფროსი ექიმი, რომელიც სპეციალიზდება თავის ტვინის სიმსივნეების მიკროქირურგიაზე, ხერხემლის დეკომპრესიაზე, თიაქრის ქირურგიაზე."
  },
  {
    id: "4179",
    name: "Prof. Dr. Erol ERDURAN",
    title: "Prof. Dr.",
    image: "/assets/doctors/erol_erduran.jpg",
    specialtyTr: "Pediatri Hematoloji ve Onkoloji Polikliniği",
    specialtyEn: "Pediatric Hematology & Oncology",
    specialtyAr: "أمراض دم وأورام الأطفال",
    specialtyRu: "Детская гематология и онкология",
    specialtyKa: "ბავშვთა ჰემატოლოგია და ონკოლოგია",
    category: "internal",
    stats: { patients: 13900, experience: 28 },
    email: "erol.erduran@ktu.edu.tr",
    educationTr: [
      "Hacettepe Üniversitesi Tıp Fakültesi",
      "Akdeniz Üniversitesi Çocuk Hematolojisi Bilim Dalı Uzmanlık"
    ],
    educationEn: [
      "Hacettepe University Faculty of Medicine",
      "Akdeniz University Dept of Pediatric Hematology Fellowship"
    ],
    bioTr: "Prof. Dr. Erol Erduran, Akdeniz anemisi (Talasemi), çocukluk çağı kanama bozuklukları, hemofili ve kemik iliği yetmezliklerinin tedavisinde bölgesel ve ulusal çapta otoritelerdendir.",
    bioEn: "Prof. Dr. Erol Erduran is a regional and national authority in the treatment of Mediterranean anemia (Thalassemia), childhood bleeding disorders, hemophilia, and bone marrow failures.",
    bioRu: "Профессор др Эрол Эрдуран является авторитетным специалистом в лечении средиземноморской анемии (талассемии), детских кровотечений и гемофилии.",
    bioKa: "პროფ. დოქტ. ეროლ ერდურანი არის რეგიონული და ეროვნული ავტორიტეტი ხმელთაშუა ზღვის ანემიის (თალასემია), ბავშვთა სისხლდენის დარღვევებისა და ჰემოფილიის მკურნალობაში."
  },
  {
    id: "4184",
    name: "Prof. Dr. Ersagun KARAGÜZEL",
    title: "Prof. Dr.",
    image: "/assets/doctors/ersagun_karaguzel.jpg",
    specialtyTr: "Çocuk Ürolojisi Polikliniği",
    specialtyEn: "Pediatric Urology",
    specialtyAr: "مسالك بولية الأطفال",
    specialtyRu: "Детская урология",
    specialtyKa: "ბავშვთა უროლოგია",
    category: "surgical",
    stats: { patients: 9500, surgeries: 2800, experience: 19 },
    email: "ersagun.karaguzel@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "KTÜ Üroloji AD, Çocuk Ürolojisi Yandal Uzmanlığı"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "KTÜ Dept of Urology, Pediatric Urology Fellowship"
    ],
    bioTr: "Prof. Dr. Ersagun Karagüzel, hipospadias (peygamber sünneti) onarımı, inmemiş testis, vezikoureteral reflü ve pediatrik üriner taş hastalıkları cerrahisinde öncü çalışmalar yapmıştır.",
    bioEn: "Prof. Dr. Ersagun Karagüzel has conducted pioneering studies in hypospadias repair, undescended testis, vesicoureteral reflux, and pediatric urinary stone surgeries.",
    bioRu: "Профессор др Эрсагун Карагюзель провел новаторские исследования в области пластики гипоспадии, неопущения яичка и детской мочекаменной болезни.",
    bioKa: "პროფ. დოქტ. ერსაგუნ ქარაგუზელმა ჩაატარა პიონერული კვლევები ჰიპოსპადიის პლასტიკაში, კრიპტორქიზმსა და ბავშვთა შარდკენჭოვან დაავადებებში."
  },
  {
    id: "4195",
    name: "Prof. Dr. Ertuğrul ÇAKIR",
    title: "Prof. Dr.",
    image: "/assets/doctors/ertugrul_cakir.png",
    specialtyTr: "Beyin Cerrahi Polikliniği",
    specialtyEn: "Neurosurgery",
    specialtyAr: "جراحة الأعصاب",
    specialtyRu: "Нейрохирургия",
    specialtyKa: "ნეიროქირურგია",
    category: "surgical",
    stats: { patients: 11500, surgeries: 3400, experience: 25 },
    email: "ertugrul.cakir@ktu.edu.tr",
    educationTr: [
      "Ankara Tıp Fakültesi",
      "KTÜ Nöroşirürji AD Uzmanlık"
    ],
    educationEn: [
      "Ankara Faculty of Medicine",
      "KTÜ Dept of Neurosurgery Residency"
    ],
    bioTr: "Prof. Dr. Ertuğrul Çakır, spinal enstrümantasyon (platin yerleştirilmesi), kafa tabanı cerrahisi ve pediatrik nöroşirürji girişimlerinde yüksek uzmanlık sahibidir.",
    bioEn: "Prof. Dr. Ertuğrul Çakır has high expertise in spinal instrumentation (hardware placement), skull base surgery, and pediatric neurosurgical interventions.",
    bioRu: "Профессор др Эртугрул Чакыр обладает высокой квалификацией в области спинальной инструментации, хирургии основания черепа и детской нейрохирургии.",
    bioKa: "პროფ. დოქტ. ერტუგრულ ჩაქირს აქვს დიდი გამოცდილება ხერხემლის ინსტრუმენტაციაში, თავის ქალას ფუძის ქირურგიასა და პედიატრიულ ნეიროქირურგიაში."
  },
  {
    id: "4180",
    name: "Prof. Dr. Fazıl ORHAN",
    title: "Prof. Dr.",
    image: "/assets/doctors/fazil_orhan.jpg",
    specialtyTr: "Pediatri İmmünoloji ve Alerji Polikliniği",
    specialtyEn: "Pediatric Immunology & Allergy",
    specialtyAr: "مناعة وحساسية الأطفال",
    specialtyRu: "Детская иммунология и аллергология",
    specialtyKa: "ბავშვთა იმუნოლოგია და ალერგია",
    category: "internal",
    stats: { patients: 14700, experience: 24 },
    email: "fazil.orhan@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "Hacettepe Üniversitesi Çocuk Alerjisi Yandal Uzmanlığı"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "Hacettepe University Pediatric Allergy Fellowship"
    ],
    bioTr: "Prof. Dr. Fazıl Orhan, çocuklarda astım, besin alerjileri, egzama (atopik dermatit) ve bağışıklık sistemi yetmezliklerinin tanı ve tedavisinde geniş kapsamlı akademik ve klinik hizmet sunmaktadır.",
    bioEn: "Prof. Dr. Fazıl Orhan provides comprehensive academic and clinical services in the diagnosis and treatment of pediatric asthma, food allergies, eczema, and immunodeficiencies.",
    bioRu: "Профессор др Фазыл Орхан предлагает комплексные академические и клинические услуги в диагностике и лечении детской астмы, пищевой аллергии, экземы.",
    bioKa: "პროფ. დოქტ. ფაზილ ორჰანი სთავაზობს პაციენტებს კომპლექსურ აკადემიურ და კლინიკურ მომსახურებას ბავშვთა ასთმის, კვებითი ალერგიების, ეგზემისა და იმუნოდეფიციტების მიმართულებით."
  },
  {
    id: "4176",
    name: "Prof. Dr. Hidayet ERDÖL",
    title: "Prof. Dr.",
    image: "/assets/doctors/hidayet_erdol.jpg",
    specialtyTr: "Göz Polikliniği",
    specialtyEn: "Ophthalmology",
    specialtyAr: "طب العيون",
    specialtyRu: "Офтальмология",
    specialtyKa: "ოფთალმოლოგია",
    category: "surgical",
    stats: { patients: 17200, surgeries: 5200, experience: 28 },
    email: "hidayet.erdol@ktu.edu.tr",
    educationTr: [
      "Atatürk Üniversitesi Tıp Fakültesi",
      "KTÜ Göz Hastalıkları AD Uzmanlık"
    ],
    educationEn: [
      "Ataturk University Faculty of Medicine",
      "KTÜ Dept of Ophthalmology Residency"
    ],
    bioTr: "Prof. Dr. Hidayet Erdöl, katarakt cerrahisi, retina dekolmanı tedavileri, şaşılık düzeltmeleri ve glokom (göz tansiyonu) cerrahisinde derin bir tecrübeye sahiptir.",
    bioEn: "Prof. Dr. Hidayet Erdöl has deep experience in cataract surgery, retinal detachment treatments, strabismus corrections, and glaucoma surgeries.",
    bioRu: "Профессор др Хидает Эрдоль обладает глубоким опытом в хирургии катаракты, лечении отслойки сетчатки, коррекции косоглазия и хирургии глаукомы.",
    bioKa: "პროფ. დოქტ. ჰიდაიეთ ერდოლს აქვს დიდი გამოცდილება კატარაქტის ქირურგიაში, ბადურის აცლის მკურნალობაში, სიელმის კორექციასა და გლაუკომის ქირურგიაში."
  },
  {
    id: "4175",
    name: "Prof. Dr. Mehmet SÖNMEZ",
    title: "Prof. Dr.",
    image: "/assets/doctors/mehmet_sonmez.jpg",
    specialtyTr: "Hematoloji Polikliniği",
    specialtyEn: "Hematology",
    specialtyAr: "أمراض الدم",
    specialtyRu: "Гематология",
    specialtyKa: "ჰემატოლოგია",
    category: "internal",
    stats: { patients: 16100, experience: 26 },
    email: "mehmet.sonmez@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "Ankara Üniversitesi Hematoloji Yandal Uzmanlığı"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "Ankara University Hematology Fellowship"
    ],
    bioTr: "Prof. Dr. Mehmet Sönmez, lösemi, lenfoma, multipl miyelom tedavileri ve kemik iliği nakli (aferez ünitesi koordinasyonu) alanlarında bölgenin en yetkin uzmanlarındandır.",
    bioEn: "Prof. Dr. Mehmet Sönmez is one of the region's most competent specialists in leukemia, lymphoma, multiple myeloma treatments, and bone marrow transplantation.",
    bioRu: "Профессор др Мехмет Сёнмез — один из самых компетентных специалистов региона в области лечения лейкемии, лимфомы, миеломы и трансплантации костного мозга.",
    bioKa: "პროფ. დოქტ. მეჰმედ სონმეზი არის რეგიონის ერთ-ერთი ყველაზე კომპეტენტური სპეციალისტი ლეიკემიის, ლიმფომის, მრავლობითი მიელომის მკურნალობასა და ძვლის ტვინის ტრანსპლანტაციაში."
  },
  {
    id: "4198",
    name: "Prof. Dr. Merih KUTLU",
    title: "Prof. Dr.",
    image: "/assets/doctors/merih_kutlu.png",
    specialtyTr: "Kardiyoloji Polikliniği",
    specialtyEn: "Cardiology",
    specialtyAr: "أمراض القلب",
    specialtyRu: "Кардиология",
    specialtyKa: "კარდიოლოგია",
    category: "internal",
    stats: { patients: 19500, experience: 30 },
    email: "merih.kutlu@ktu.edu.tr",
    educationTr: [
      "İstanbul Üniversitesi İstanbul Tıp Fakültesi",
      "KTÜ Kardiyoloji AD Uzmanlık"
    ],
    educationEn: [
      "Istanbul University Istanbul Faculty of Medicine",
      "KTÜ Dept of Cardiology Residency"
    ],
    bioTr: "Prof. Dr. Merih Kutlu, kompleks koroner girişimler, kalp pilleri, kapak hastalıkları transkateter tedavileri (TAVI) ve hipertansiyon yönetiminde ulusal düzeyde bir otoritedir.",
    bioEn: "Prof. Dr. Merih Kutlu is a national authority in complex coronary interventions, cardiac pacemakers, transcatheter valve therapies (TAVI), and hypertension management.",
    bioRu: "Профессор др Мерих Кутлу — национальный авторитет в области сложных коронарных вмешательств, кардиостимуляторов, транскатетерной терапии клапанов (TAVI).",
    bioKa: "პროფ. დოქტ. მერიჰ ქუთლუ არის ეროვნული ავტორიტეტი რთულ კორონარულ ინტერვენციებში, კარდიოსტიმულატორებში, სარქვლოვან ტრანსკათეტერულ თერაპიაში (TAVI)."
  },
  {
    id: "4104",
    name: "Prof. Dr. Muhammet URALOĞLU",
    title: "Prof. Dr.",
    image: "/assets/doctors/muhammet_uraloglu.jpg",
    specialtyTr: "Plastik Cerrahi Polikliniği",
    specialtyEn: "Plastic Surgery",
    specialtyAr: "الجراحة التجميلية",
    specialtyRu: "Пластическая хирургия",
    specialtyKa: "პლასტიკური ქირურგია",
    category: "surgical",
    stats: { patients: 8100, surgeries: 3200, experience: 18 },
    email: "muhammet.uraloglu@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "Gazi Üniversitesi Plastik ve Rekonstrüktif Cerrahi AD"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "Gazi University Dept of Plastic & Reconstructive Surgery"
    ],
    bioTr: "Prof. Dr. Muhammet Uraloğlu, el cerrahisi, mikrocerrahi, dudak-damak yarıkları rekonstrüksiyonu ve estetik yüz/vücut cerrahisinde lider klinik profillerimizdendir.",
    bioEn: "Prof. Dr. Muhammet Uraloğlu is one of our leading clinical profiles in hand surgery, microsurgery, cleft lip-palate reconstructions, and aesthetic face/body surgery.",
    bioRu: "Профессор др Мухаммет Уралоглу — один из наших ведущих специалистов в области хирургии кисти, микрохирургии, пластики расщелины губы и нёба.",
    bioKa: "პროფ. დოქტ. მუჰამედ ურალოღლუ არის ჩვენი წამყვანი კლინიკური პროფილი მტევნის ქირურგიაში, მიკროქირურგიაში, კურდღლის ტუჩისა და მგლის ხახის რეკონსტრუქციასა და ესთეტიკურ ქირურგიაში."
  },
  {
    id: "4182",
    name: "Prof. Dr. Murat ÇAKIR",
    title: "Prof. Dr.",
    image: "/assets/doctors/murat_cakir.jpg",
    specialtyTr: "Pediatri Gastroenteroloji Polikliniği",
    specialtyEn: "Pediatric Gastroenterology",
    specialtyAr: "جهاز هضمي الأطفال",
    specialtyRu: "Детская гастроэнтерология",
    specialtyKa: "ბავშვთა გასტროენტეროლოგია",
    category: "internal",
    stats: { patients: 11200, experience: 20 },
    email: "murat.cakir@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "Hacettepe Üniversitesi Çocuk Gastroenteroloji Yandal Uzmanlığı"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "Hacettepe University Pediatric Gastroenterology Fellowship"
    ],
    bioTr: "Prof. Dr. Murat Çakır, çocuklarda çölyak hastalığı, inflamatuar bağırsak hastalıkları, karaciğer yetmezlikleri ve pediatrik endoskopi işlemlerinde derin bilgiye sahiptir.",
    bioEn: "Prof. Dr. Murat Çakır has deep knowledge in pediatric celiac disease, inflammatory bowel diseases, liver failures, and pediatric endoscopy procedures.",
    bioRu: "Профессор др Мурат Чакыр обладает глубокими знаниями в области детской целиакии, воспалительных заболеваний кишечника, печеночной недостаточности.",
    bioKa: "პროფ. დოქტ. მურატ ჩაქირს აქვს დიდი გამოცდილება ბავშვთა ცელიაკიის, ნაწლავის ანთებითი დაავადებების, ღვიძლის უკმარისობისა და პედიატრიული ენდოსკოპიის მიმართულებით."
  },
  {
    id: "4172",
    name: "Prof. Dr. Murat LİVAOĞLU",
    title: "Prof. Dr.",
    image: "/assets/doctors/murat_livaoglu.jpg",
    specialtyTr: "Plastik Cerrahi Polikliniği",
    specialtyEn: "Plastic Surgery",
    specialtyAr: "الجراحة التجميلية",
    specialtyRu: "Пластическая хирургия",
    specialtyKa: "პლასტიკური ქირურგია",
    category: "surgical",
    stats: { patients: 9800, surgeries: 3700, experience: 21 },
    email: "murat.livaoglu@ktu.edu.tr",
    educationTr: [
      "Hacettepe Üniversitesi Tıp Fakültesi",
      "KTÜ Plastik, Rekonstrüktif ve Estetik Cerrahi AD"
    ],
    educationEn: [
      "Hacettepe University Faculty of Medicine",
      "KTÜ Dept of Plastic, Reconstructive and Aesthetic Surgery"
    ],
    bioTr: "Prof. Dr. Murat Livaoğlu, meme rekonstrüksiyonu, maksillofasiyal cerrahi, yanık tedavileri ve rinoplasti ameliyatlarında geniş bir hasta portföyüne ve klinik tecrübeye sahiptir.",
    bioEn: "Prof. Dr. Murat Livaoğlu has a broad patient portfolio and clinical experience in breast reconstruction, maxillofacial surgery, burn treatments, and rhinoplasty.",
    bioRu: "Профессор др Мурат Ливаоглу имеет широкий клинический опыт в области реконструкции молочной железы, челюстно-лицевой хирургии, лечения ожогов.",
    bioKa: "პროფ. დოქტ. მურატ ლივაოღლუს აქვს დიდი კლინიკური გამოცდილება ძუძუს რეკონსტრუქციაში, ყბა-სახის ქირურგიაში, დამწვრობის მკურნალობასა და რინოპლასტიკაში."
  },
  {
    id: "4181",
    name: "Prof. Dr. Mustafa İMAMOĞLU",
    title: "Prof. Dr.",
    image: "/assets/doctors/mustafa_imamoglu.png",
    specialtyTr: "Çocuk Cerrahisi Polikliniği",
    specialtyEn: "Pediatric Surgery",
    specialtyAr: "جراحة الأطفال",
    specialtyRu: "Детская хирургия",
    specialtyKa: "ბავშვთა ქირურგია",
    category: "surgical",
    stats: { patients: 13200, surgeries: 4100, experience: 26 },
    email: "mustafa.imamoglu@ktu.edu.tr",
    educationTr: [
      "Ankara Üniversitesi Tıp Fakültesi",
      "KTÜ Çocuk Cerrahisi Anabilim Dalı"
    ],
    educationEn: [
      "Ankara University Faculty of Medicine",
      "KTÜ Dept of Pediatric Surgery"
    ],
    bioTr: "Prof. Dr. Mustafa İmamoğlu, yenidoğan cerrahisi, çocukluk çağı tümörleri, göğüs duvarı deformiteleri ve pediatrik laparoskopik/torakoskopik cerrahide öncü bir otoritedir.",
    bioEn: "Prof. Dr. Mustafa İmamoğlu is a leading authority in neonatal surgery, childhood tumors, chest wall deformities, and pediatric laparoscopic/thoracoscopic surgery.",
    bioRu: "Профессор др Мустафа Имамоглу — ведущий специалист в области хирургии новорожденных, опухолей детского возраста и педиатрической лапароскопии.",
    bioKa: "პროფ. დოქტ. მუსტაფა იმამოღლუ არის წამყვანი ავტორიტეტი ახალშობილთა ქირურგიაში, ბავშვთა ასაკის სიმსივნეებსა და პედიატრიულ ლაპაროსკოპიულ ქირურგიაში."
  },
  {
    id: "4200",
    name: "Prof. Dr. Ömer GEDİKLİ",
    title: "Prof. Dr.",
    image: "/assets/doctors/omer_gedikli.jpg",
    specialtyTr: "Kulak-Burun-Boğaz Polikliniği",
    specialtyEn: "Otorhinolaryngology (ENT)",
    specialtyAr: "أنف وأذن وحنجرة",
    specialtyRu: "Оториноларингология (ЛОР)",
    specialtyKa: "ყელ-ყურ-ცხვირი",
    category: "surgical",
    stats: { patients: 14000, surgeries: 3900, experience: 23 },
    email: "omer.gedikli@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "Gazi Üniversitesi KBB Anabilim Dalı Uzmanlık"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "Gazi University Dept of ENT Residency"
    ],
    bioTr: "Prof. Dr. Ömer Gedikli, kulak hastalıkları cerrahisi (otoloji/nörotoloji), koklear implant (biyonik kulak) uygulamaları ve baş boyun tümörleri cerrahisinde uzmandır.",
    bioEn: "Prof. Dr. Ömer Gedikli specializes in ear surgery (otology/neurotology), cochlear implant (bionic ear) applications, and head and neck tumor surgeries.",
    bioRu: "Профессор др Омер Гедикли специализируется на хирургии уха (отология/невротология), кохлеарной имплантации и хирургии опухолей головы и шеи.",
    bioKa: "პროფ. დოქტ. ომერ გედიქლი სპეციალიზდება ყურის ქირურგიაზე (ოტოპლასტიკა), კოხლეარულ იმპლანტაციასა და თავ-კისრის სიმსივნეების ქირურგიაზე."
  },
  {
    id: "4207-duplicate-avoided", // Selçuk Arslan is already added above (Doç. Dr. Selçuk Arslan, ID: 4207)
    name: "Assoc. Prof. Selçuk ARSLAN",
    title: "Assoc. Prof.",
    image: "/assets/doctors/selcuk_arslan.jpg",
    specialtyTr: "Tıbbi Genetik Polikliniği",
    specialtyEn: "Medical Genetics",
    specialtyAr: "الوراثة الطبية",
    specialtyRu: "Медицинская генетика",
    specialtyKa: "სამედიცინო გენეტიკა",
    category: "internal",
    stats: { patients: 4800, experience: 12 },
    email: "selcuk.arslan@ktu.edu.tr",
    educationTr: ["KTÜ Tıp Fakültesi"],
    educationEn: ["KTÜ Faculty of Medicine"],
    bioTr: "Doç. Dr. Selçuk Arslan, tıbbi genetik alanında akademik ve klinik tarama çalışmalarını koordine etmektedir.",
    bioEn: "Assoc. Prof. Selçuk Arslan coordinates academic and clinical screening in the field of medical genetics.",
    bioRu: "Доцент Сельчук Арслан координирует академические и клинические скрининги в области медицинской генетики.",
    bioKa: "ასოც. პროფ. სელჩუკ არსლანი კოორდინაციას უწევს აკადემიურ და კლინიკურ სკრინინგებს სამედიცინო გენეტიკის სფეროში."
  },
  {
    id: "4203",
    name: "Prof. Dr. Selçuk KAYA",
    title: "Prof. Dr.",
    image: "/assets/doctors/selcuk_kaya.png",
    specialtyTr: "Enfeksiyon Polikliniği",
    specialtyEn: "Infectious Diseases",
    specialtyAr: "الأمراض المعدية",
    specialtyRu: "Инфекционные болезни",
    specialtyKa: "ინფექციური დაავადებები",
    category: "internal",
    stats: { patients: 16800, experience: 24 },
    email: "selcuk.kaya@ktu.edu.tr",
    educationTr: [
      "Ege Üniversitesi Tıp Fakültesi",
      "KTÜ Enfeksiyon Hastalıkları AD Uzmanlık"
    ],
    educationEn: [
      "Ege University Faculty of Medicine",
      "KTÜ Dept of Infectious Diseases Residency"
    ],
    bioTr: "Prof. Dr. Selçuk Kaya, viral hepatitler, hastane enfeksiyonları, HIV/AIDS tedavileri ve seyahat sağlığı/enfeksiyonları yönetiminde uluslararası yayınlara sahip kıdemli bir akademisyendir.",
    bioEn: "Prof. Dr. Selçuk Kaya is a senior academic with international publications in viral hepatitis, hospital-acquired infections, HIV/AIDS, and travel medicine.",
    bioRu: "Профессор др Сельчук Кая — ведущий академик с международными публикациями в области вирусных гепатитов, госпитальных инфекций, ВИЧ/СПИДа.",
    bioKa: "პროფ. დოქტ. სელჩუკ კაია არის უფროსი აკადემიკოსი საერთაშორისო პუბლიკაციებით ვირუსული ჰეპატიტების, ჰოსპიტალური ინფექციებისა და აივ/შიდსის მიმართულებით."
  },
  {
    id: "4189",
    name: "Prof. Dr. Serdar TÜRKYILMAZ",
    title: "Prof. Dr.",
    image: "/assets/doctors/serdar_turkyilmaz.jpg",
    specialtyTr: "Genel Cerrahi Polikliniği",
    specialtyEn: "General Surgery",
    specialtyAr: "الجراحة العامة",
    specialtyRu: "Общая хирургия",
    specialtyKa: "ზოგადი ქირურგია",
    category: "surgical",
    stats: { patients: 14800, surgeries: 4300, experience: 26 },
    email: "serdar.turkyilmaz@ktu.edu.tr",
    educationTr: [
      "Hacettepe Üniversitesi Tıp Fakültesi",
      "KTÜ Genel Cerrahi AD Uzmanlık"
    ],
    educationEn: [
      "Hacettepe University Faculty of Medicine",
      "KTÜ Dept of General Surgery Residency"
    ],
    bioTr: "Prof. Dr. Serdar Türkyılmaz, meme kanseri cerrahisi (meme koruyucu yaklaşımlar), tiroid ve paratiroid cerrahisi, laparoskopik adrenalektomi konularında uzmandır.",
    bioEn: "Prof. Dr. Serdar Türkyılmaz specializes in breast cancer surgery (breast-conserving approaches), thyroid and parathyroid surgery, and laparoscopic adrenalectomy.",
    bioRu: "Профессор др Сердар Тюркйылмаз специализируется на хирургии рака молочной железы, щитовидной и околощитовидных желез.",
    bioKa: "პროფ. დოქტ. სერდარ თურქიილმაზი სპეციალიზდება ძუძუს კიბოს ქირურგიაზე, ფარისებრი და ფარისებრახლო ჯირკვლების ქირურგიაზე."
  },
  {
    id: "4194",
    name: "Prof. Dr. Süleyman BAYKAL",
    title: "Prof. Dr.",
    image: "/assets/doctors/suleyman_baykal.jpg",
    specialtyTr: "Beyin Cerrahi Polikliniği",
    specialtyEn: "Neurosurgery",
    specialtyAr: "جراحة الأعصاب",
    specialtyRu: "Нейрохирургия",
    specialtyKa: "ნეიროქირურგია",
    category: "surgical",
    stats: { patients: 18400, surgeries: 4900, experience: 31 },
    email: "suleyman.baykal@ktu.edu.tr",
    educationTr: [
      "Ankara Tıp Fakültesi",
      "KTÜ Nöroşirürji Anabilim Dalı Uzmanlık"
    ],
    educationEn: [
      "Ankara Faculty of Medicine",
      "KTÜ Dept of Neurosurgery Residency"
    ],
    bioTr: "Prof. Dr. Süleyman Baykal, beyin tümörleri, anevrizma cerrahisi, kafa tabanı yaklaşımları ve omurga patolojileri cerrahisinde 30 yılı aşkın süredir bölgemize hizmet vermektedir.",
    bioEn: "Prof. Dr. Süleyman Baykal has been serving our region for over 30 years in brain tumors, aneurysm surgery, skull base approaches, and spinal pathology surgeries.",
    bioRu: "Профессор др Сулейман Байкал уже более 30 лет оказывает услуги в лечении опухолей головного мозга, аневризм и патологий позвоночника.",
    bioKa: "პროფ. დოქტ. სულეიმან ბაიკალი 30 წელზე მეტია ემსახურება ჩვენს რეგიონს თავის ტვინის სიმსივნეების, ანევრიზმის ქირურგიისა და ხერხემლის პათოლოგიების მიმართულებით."
  },
  {
    id: "4191",
    name: "Prof. Dr. Süleyman GUVEN",
    title: "Prof. Dr.",
    image: "/assets/doctors/suleyman_guven.png",
    specialtyTr: "Kadın-Doğum Polikliniği",
    specialtyEn: "Obstetrics & Gynecology",
    specialtyAr: "النساء والتوليد",
    specialtyRu: "Акушерство и гинекология",
    specialtyKa: "მეანობა-გინეკოლოგია",
    category: "surgical",
    stats: { patients: 15900, surgeries: 3800, experience: 25 },
    email: "suleyman.guven@ktu.edu.tr",
    educationTr: [
      "KTÜ Tıp Fakültesi",
      "Hacettepe Üniversitesi Kadın Hastalıkları AD Yandal (Tüp Bebek)"
    ],
    educationEn: [
      "KTÜ Faculty of Medicine",
      "Hacettepe University Dept of OB/GYN Fellowship (IVF)"
    ],
    bioTr: "Prof. Dr. Süleyman Güven, infertilite (kısırlık) tedavileri, tüp bebek (IVF) uygulamaları, riskli gebelik takipleri ve jinekolojik kanser cerrahilerinde uluslararası ölçekte hastalar kabul etmektedir.",
    bioEn: "Prof. Dr. Süleyman Güven accepts international patients for infertility treatments, IVF applications, high-risk pregnancy monitoring, and gynecological cancer surgeries.",
    bioRu: "Профессор др Сулейман Гювен принимает иностранных пациентов для лечения бесплодия, проведения ЭКО, ведения беременностей высокого риска.",
    bioKa: "პროფ. დოქტ. სულეიმან გუვენი იღებს საერთაშორისო პაციენტებს უნაყოფობის მკურნალობის, IVF პროცედურების, მაღალი რისკის ორსულობისა და გინეკოლოგიური კიბოს ქირურგიის მიმართულებით."
  },
  {
    id: "4197",
    name: "Prof. Dr. Yılmaz BÜLBÜL",
    title: "Prof. Dr.",
    image: "/assets/doctors/yilmaz_bulbul.jpg",
    specialtyTr: "Göğüs Hastalıkları Polikliniği",
    specialtyEn: "Pulmonology (Chest Diseases)",
    specialtyAr: "أمراض الصدر",
    specialtyRu: "Пульмонология",
    specialtyKa: "პულმონოლოგია",
    category: "internal",
    stats: { patients: 19800, experience: 28 },
    email: "yilmaz.bulbul@ktu.edu.tr",
    educationTr: [
      "İstanbul Üniversitesi İstanbul Tıp Fakültesi",
      "KTÜ Göğüs Hastalıkları AD Uzmanlık"
    ],
    educationEn: [
      "Istanbul University Faculty of Medicine",
      "KTÜ Dept of Pulmonary Diseases Residency"
    ],
    bioTr: "Prof. Dr. Yılmaz Bülbül, KOAH, astım, pulmoner rehabilitasyon, akciğer embolisi ve uyku apne sendromu konularında öncü klinik ve akademik çalışmalara imza atmıştır.",
    bioEn: "Prof. Dr. Yılmaz Bülbül has led pioneering clinical and academic studies in COPD, asthma, pulmonary rehabilitation, lung embolism, and sleep apnea syndrome.",
    bioRu: "Профессор др Йылмаз Бюльбюль провел ведущие клинические и академические исследования в области ХОБЛ, астмы, пульмонологической реабилитации.",
    bioKa: "პროფ. დოქტ. ილმაზ ბულბულმა ჩაატარა პიონერული კლინიკური და აკადემიური კვლევები ფილტვების ქრონიკული ობსტრუქციული დაავადების, ასთმისა და ძილის აპნოეს მიმართულებით."
  }
];
