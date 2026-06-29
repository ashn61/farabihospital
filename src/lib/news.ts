export interface NewsItem {
  name: string;
  designation: string;
  quote: string;
  src: string;
}

export interface NewsData {
  tr: NewsItem[];
  en: NewsItem[];
  ar: NewsItem[];
  ru: NewsItem[];
  ka: NewsItem[];
}

export const newsData: NewsData = {
  tr: [
    {
      name: "Batum'da Sağlık Turizmi Tanıtımı",
      designation: "Kurumsal | Sağlık Turizmi",
      quote: "Batum Sputnik Otel'de gerçekleştirilen tanıtım toplantısında, KTÜ Farabi Hastanesi uzman hekim kadrosu sağlık turizmi alanındaki imkanları tanıttı.",
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"
    },
    {
      name: "Kıtalararası Organ Nakli Başarısı",
      designation: "Cerrahi Başarı | Böbrek Nakli",
      quote: "Lübnan asıllı ABD vatandaşı hastaya, Paris'ten gelen kuzeninden alınan böbrek, kapalı laparoskopik closed surgery yöntemiyle başarıyla nakledildi.",
      src: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=1200"
    },
    {
      name: "14 Yaşındaki Skolyoz Hastası Kız Çocuğu Sağlığına Kavuştu",
      designation: "Cerrahi Başarı | Ortopedi",
      quote: "Hastanemizde gerçekleştirilen 5 saatlik başarılı skolyoz ameliyatıyla, 14 yaşındaki kız hastanın omurga eğriliği tamamen düzeltildi.",
      src: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=1200"
    },
    {
      name: "Trabzon'dan Afrika'ya Şifa Eli",
      designation: "Cerrahi Başarı | Beyin Cerrahisi",
      quote: "Mali'den gelen hastanın beynindeki büyük tümör kitlesi, beyin cerrahisi ekibimizin başarılı operasyonuyla tamamen temizlendi.",
      src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200"
    },
    {
      name: "Kalpten Ölümcül Kist Temizlendi",
      designation: "Cerrahi Başarı | Kalp Damar Cerrahisi",
      quote: "Hayvanlardan bulaşan parazit kaynaklı ve dünyada çok nadir görülen kalpteki ölümcül kist, 34 yaşındaki hastadan açık kalp ameliyatıyla çıkarıldı.",
      src: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1200"
    }
  ],
  en: [
    {
      name: "Batumi Health Tourism Promotion",
      designation: "Corporate | Health Tourism",
      quote: "The first promotional activity of KTU Farabi Hospital was held in Batumi Sputnik Hotel with over 50 specialist physicians and consul officials.",
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"
    },
    {
      name: "Intercontinental Organ Transplantation Success",
      designation: "Surgical Success | Kidney Transplant",
      quote: "Samer Ramadan, a 60-year-old Lebanese-born US citizen, received a successful kidney transplant from his French cousin Talat Kabbara.",
      src: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=1200"
    },
    {
      name: "14-year-old Girl Spine Scoliosis Recovery",
      designation: "Surgical Success | Orthopedics",
      quote: "A 14-year-old girl suffering from severe spinal curvature (scoliosis) recovered completely after a complex 5-hour surgery.",
      src: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=1200"
    },
    {
      name: "Healing Hand from Trabzon to Africa",
      designation: "Surgical Success | Neurosurgery",
      quote: "The mass in the brain of a patient coming from Mali was successfully removed by our neurosurgery team, extending a healing hand from Trabzon to Africa.",
      src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200"
    },
    {
      name: "Deadly Heart Cyst Successfully Removed",
      designation: "Surgical Success | Cardiovascular Surgery",
      quote: "A deadly echinococcus hydatid cyst filling the heart cavity of a 34-year-old patient was successfully removed via open heart surgery.",
      src: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1200"
    }
  ],
  ar: [
    {
      name: "الترويج للسياحة العلاجية في باتومي",
      designation: "مؤسسي | السياحة العلاجية",
      quote: "أقيم اللقاء التعريفي الأول لمستشفى فارابي للترويج للسياحة العلاجية في باتومي بمشاركة أكثر من ٥٠ طبيباً متخصصاً.",
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"
    },
    {
      name: "زرع الأعضاء عبر القارات في مستشفانا",
      designation: "نجاح جراحي | زراعة الكلى",
      quote: "مريض أمريكي من أصل لبناني يتلقى كلية من قريبه القادم من باريس بنجاح عبر جراحة المناظير المغلقة لأول مرة.",
      src: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=1200"
    },
    {
      name: "شفاء فتاة تبلغ من العمر ١٤ عاماً من انحناء العمود الفقري",
      designation: "نجاح جراحي | تقويم العظام",
      quote: "فتاة تبلغ من العمر ١٤ عاماً كانت تعاني من انحناء في العمود الفقري تتعافى تماماً بعد جراحة استغرقت ٥ ساعات.",
      src: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=1200"
    },
    {
      name: "يد الشفاء تمتد من طرابزون إلى أفريقيا",
      designation: "نجاح جراحي | جراحة الدماغ والأعصاب",
      quote: "إزالة ورم دماغى بنجاح لمريض قادم من مالي في مستشفانا بفضل الكادر الطبي المتخصص لجراحة الأعصاب.",
      src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200"
    },
    {
      name: "إزالة كيس طفيلي مميت في القلب بنجاح",
      designation: "نجاح جراحي | جراحة القلب والأوعية الدموية",
      quote: "إزالة كيس طفيلي مميت في القلب بنجاح لعدوى نادرة جداً في العالم لمريض يبلغ من العمر ٣٤ عاماً.",
      src: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1200"
    }
  ],
  ru: [
    {
      name: "Презентация медицинского туризма в Батуми",
      designation: "Корпоративный | Медицинский туризм",
      quote: "Первая презентация больницы KTU Farabi в рамках оздоровительного туризма прошла в Батуми Sputnik Hotel.",
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"
    },
    {
      name: "Межконтинентальная трансплантация почки",
      designation: "Успех хирургии | Трансплантация почки",
      quote: "Успешная межконтинентальная трансплантация почки гражданину США ливанского происхождения от донора-кузена из Парижа.",
      src: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=1200"
    },
    {
      name: "Выздоровление 14-летней девочки со сколиозом",
      designation: "Успех хирургии | Ортопедия",
      quote: "14-летняя девочка с искривлением позвоночника полностью выздоровела после успешной 5-часовой операции.",
      src: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=1200"
    },
    {
      name: "Рука исцеления от Трабзона до Африки",
      designation: "Успех хирургии | Нейрохирургия",
      quote: "Успешно удалена опухоль головного мозга у пациента, прибывшего из Мали. Исцеляющая рука простирается от Трабзона до Африки.",
      src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200"
    },
    {
      name: "Успешное удаление смертельной кисты в сердце",
      designation: "Успех хирургии | Кардиохирургия",
      quote: "Смертельная гидатидная киста в правом желудочке сердца успешно удалена у 34-летнего пациента методом открытой операции.",
      src: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1200"
    }
  ],
  ka: [
    {
      name: "სამედიცინო ტურიზმის პრეზენტაცია ბათუმში",
      designation: "კორპორატიული | სამედიცინო ტურიზმი",
      quote: "ბათუმში Sputnik სასტუმროში გაიმართა „ფარაბის“ საავადმყოფოსა და სამედიცინო ტურიზმის ერთობლივი საპრეზენტაციო შეხვედრა.",
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200"
    },
    {
      name: "ტრანსკონტინენტური ორგანოს გადანერგვა",
      designation: "ქირურგიული წარმატება | თირკმლის გადანერგვა",
      quote: "ამერიკის მოქალაქეს საფრანგეთიდან ჩამოსული ბიძაშვილის თირკმელი წარმატებით გადაუნერგეს closed surgery მეთოდით.",
      src: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=1200"
    },
    {
      name: "14 წლის სკოლიოზით დაავადებული გოგონას განკურნება",
      designation: "ქირურგიული წარმატება | ორთოპედია",
      quote: "14 წლის გოგონა ხერხემლის გამრუდებით (სკოლიოზით) სრულად გამოჯანმრთელდა 5-საათიანი ოპერაციის შემდეგ.",
      src: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=1200"
    },
    {
      name: "ტრაპიზონიდან აფრიკაში გაწვდილი სამკურნალო ხელი",
      designation: "ქირურგიული წარმატება | ნეიროქირურგია",
      quote: "მალიდან ჩამოსული პაციენტის ტვინში არსებული სიმსივნე წარმატებით იქნა ამოღებული ჩვენი ნეიროქირურგიული ჯგუფის მიერ.",
      src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200"
    },
    {
      name: "გულიდან სასიკვდილო კისტის წარმატებით ამოღება",
      designation: "ქირურგიული წარმატება | კარდიოვასკულური ქირურგია",
      quote: "34 წლის პაციენტის გულიდან წარმატებით იქნა ამოღებული სასიკვდილო კისტა, რომელიც გამოწვეული იყო პარაზიტით.",
      src: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1200"
    }
  ]
};
