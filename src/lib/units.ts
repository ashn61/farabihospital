export type UnitType = "surgical" | "internal";

export interface Unit {
  tr: string;
  en: string;
  ar: string;
  ru: string;
  ka: string;
  type: UnitType;
}

export const units: Unit[] = [
  // --- Cerrahi (surgical) — 17 birim ---
  { tr: "Beyin Cerrahi Polikliniği", en: "Neurosurgery", ar: "جراحة الأعصاب", ru: "Нейрохирургия", ka: "ნეიროქირურგია", type: "surgical" },
  { tr: "Göz Polikliniği", en: "Ophthalmology", ar: "طب العيون", ru: "Офтальмология", ka: "ოფთალმოლოგია", type: "surgical" },
  { tr: "Plastik Cerrahi Polikliniği", en: "Plastic Surgery", ar: "الجراحة التجميلية", ru: "Пластическая хирургия", ka: "პლასტიკური ქირურგია", type: "surgical" },
  { tr: "Plastik Cerrahi Yanık Polikliniği", en: "Plastic Surgery & Burns", ar: "الجراحة التجميلية والحروق", ru: "Пластическая хирургия и ожоги", ka: "პლასტიკური ქირურგია და დამწვრობა", type: "surgical" },
  { tr: "Üroloji Polikliniği", en: "Urology", ar: "المسالك البولية", ru: "Урология", ka: "უროლოგია", type: "surgical" },
  { tr: "Çocuk Ürolojisi Polikliniği", en: "Pediatric Urology", ar: "مسالك بولية الأطفال", ru: "Детская урология", ka: "ბავშვთა უროლოგია", type: "surgical" },
  { tr: "Kulak-Burun-Boğaz Polikliniği", en: "Otorhinolaryngology (ENT)", ar: "أنف وأذن وحنجرة", ru: "Оториноларингология (ЛОР)", ka: "ყელ-ყურ-ცხვირი", type: "surgical" },
  { tr: "Girişimsel Radyoloji", en: "Interventional Radiology", ar: "الأشعة التداخلية", ru: "Интервенционная радиология", ka: "ინტერვენციული რადიოლოგია", type: "surgical" },
  { tr: "Algoloji Polikliniği", en: "Algology (Pain Medicine)", ar: "علاج الألم", ru: "Альгология (лечение боли)", ka: "ალგოლოგია (ტკივილის მედიცინა)", type: "surgical" },
  { tr: "Kalp-Damar Cerrahi Polikliniği", en: "Cardiovascular Surgery", ar: "جراحة القلب والأوعية", ru: "Сердечно-сосудистая хирургия", ka: "კარდიოვასკულური ქირურგია", type: "surgical" },
  { tr: "Organ Nakli Polikliniği", en: "Organ Transplantation", ar: "زراعة الأعضاء", ru: "Трансплантация органов", ka: "ორგანოთა ტრანსპლანტაცია", type: "surgical" },
  { tr: "Kadın-Doğum Polikliniği", en: "Obstetrics & Gynecology", ar: "النساء والتوليد", ru: "Акушерство и гинекология", ka: "მეანობა-გინეკოლოგია", type: "surgical" },
  { tr: "Çocuk Cerrahisi Polikliniği", en: "Pediatric Surgery", ar: "جراحة الأطفال", ru: "Детская хирургия", ka: "ბავშვთა ქირურგია", type: "surgical" },
  { tr: "Genel Cerrahi Polikliniği", en: "General Surgery", ar: "الجراحة العامة", ru: "Общая хирургия", ka: "ზოგადი ქირურგია", type: "surgical" },
  { tr: "Ortopedi Polikliniği", en: "Orthopedics", ar: "جراحة العظام", ru: "Ортопедия", ka: "ორთოპედია", type: "surgical" },
  { tr: "Perinatoloji Ünitesi", en: "Perinatology Unit", ar: "وحدة طب الأجنة", ru: "Отделение перинатологии", ka: "პერინატოლოგიის განყოფილება", type: "surgical" },
  { tr: "Göğüs Cerrahisi Polikliniği", en: "Thoracic Surgery", ar: "جراحة الصدر", ru: "Торакальная хирургия", ka: "თორაკალური ქირურგია", type: "surgical" },

  // --- Dahili (internal) — 39 birim ---
  { tr: "Cildiye Polikliniği", en: "Dermatology", ar: "الجلدية", ru: "Дерматология", ka: "დერმატოლოგია", type: "internal" },
  { tr: "Çocuk Psikiyatrisi Polikliniği", en: "Child Psychiatry", ar: "الطب النفسي للأطفال", ru: "Детская психиатрия", ka: "ბავშვთა ფსიქიატრია", type: "internal" },
  { tr: "Göğüs İmmünoloji ve Alerji Polikliniği", en: "Chest Immunology & Allergy", ar: "مناعة وحساسية الصدر", ru: "Иммунология и аллергология органов дыхания", ka: "გულმკერდის იმუნოლოგია და ალერგია", type: "internal" },
  { tr: "Gastroenteroloji Polikliniği", en: "Gastroenterology", ar: "أمراض الجهاز الهضمي", ru: "Гастроэнтерология", ka: "გასტროენტეროლოგია", type: "internal" },
  { tr: "Enfeksiyon Polikliniği", en: "Infectious Diseases", ar: "الأمراض المعدية", ru: "Инфекционные болезни", ka: "ინფექციური დაავადებები", type: "internal" },
  { tr: "Fizik Tedavi Polikliniği", en: "Physical Therapy", ar: "العلاج الطبيعي", ru: "Физиотерапия", ka: "ფიზიოთერაპია", type: "internal" },
  { tr: "Fizik Tedavi-Romatoloji Polikliniği", en: "Physical Therapy & Rheumatology", ar: "العلاج الطبيعي والروماتيزم", ru: "Физиотерапия и ревматология", ka: "ფიზიოთერაპია და რევმატოლოგია", type: "internal" },
  { tr: "Psikiyatri Polikliniği", en: "Psychiatry", ar: "الطب النفسي", ru: "Психиатрия", ka: "ფსიქიატრია", type: "internal" },
  { tr: "Radyasyon Onkolojisi Polikliniği", en: "Radiation Oncology", ar: "علاج الأورام بالإشعاع", ru: "Радиационная онкология", ka: "რადიაციული ონკოლოგია", type: "internal" },
  { tr: "Dahiliye Polikliniği", en: "Internal Medicine", ar: "الطب الباطني", ru: "Терапия", ka: "შინაგანი მედიცინა", type: "internal" },
  { tr: "Dahiliye Romatoloji Polikliniği", en: "Internal Medicine Rheumatology", ar: "باطنية روماتيزم", ru: "Терапия (ревматология)", ka: "შინაგანი მედიცინა – რევმატოლოგია", type: "internal" },
  { tr: "Nefroloji Polikliniği", en: "Nephrology", ar: "أمراض الكلى", ru: "Нефрология", ka: "ნეფროლოგია", type: "internal" },
  { tr: "Endokrinoloji Polikliniği", en: "Endocrinology", ar: "الغدد الصماء", ru: "Эндокринология", ka: "ენდოკრინოლოგია", type: "internal" },
  { tr: "Kardiyoloji Polikliniği", en: "Cardiology", ar: "أمراض القلب", ru: "Кардиология", ka: "კარდიოლოგია", type: "internal" },
  { tr: "Koroner Polikliniği", en: "Coronary Clinic", ar: "عيادة القلب التاجية", ru: "Коронарная клиника", ka: "კორონარული კლინიკა", type: "internal" },
  { tr: "Genel Pediatri Polikliniği", en: "General Pediatrics", ar: "طب الأطفال العام", ru: "Общая педиатрия", ka: "ზოგადი პედიატრია", type: "internal" },
  { tr: "Nöroloji Polikliniği", en: "Neurology", ar: "طب الأعصاب", ru: "Неврология", ka: "ნევროლოგია", type: "internal" },
  { tr: "Pediatri Kardiyoloji Polikliniği", en: "Pediatric Cardiology", ar: "قلب الأطفال", ru: "Детская кардиология", ka: "ბავშვთა კარდიოლოგია", type: "internal" },
  { tr: "Pediatri Endokrin Polikliniği", en: "Pediatric Endocrinology", ar: "غدد الأطفال الصماء", ru: "Детская эндокринология", ka: "ბავშვთა ენდოკრინოლოგია", type: "internal" },
  { tr: "Pediatri Hematoloji ve Onkoloji Polikliniği", en: "Pediatric Hematology & Oncology", ar: "أمراض دم وأورام الأطفال", ru: "Детская гематология и онкология", ka: "ბავშვთა ჰემატოლოგია და ონკოლოგია", type: "internal" },
  { tr: "Pediatri Nöroloji Polikliniği", en: "Pediatric Neurology", ar: "أعصاب الأطفال", ru: "Детская неврология", ka: "ბავშვთა ნევროლოგია", type: "internal" },
  { tr: "Pediatri İmmünoloji ve Alerji Polikliniği", en: "Pediatric Immunology & Allergy", ar: "مناعة وحساسية الأطفال", ru: "Детская иммунология и аллергология", ka: "ბავშვთა იმუნოლოგია და ალერგია", type: "internal" },
  { tr: "Pediatri Nefroloji Polikliniği", en: "Pediatric Nephrology", ar: "كلى الأطفال", ru: "Детская нефрология", ka: "ბავშვთა ნეფროლოგია", type: "internal" },
  { tr: "Pediatri Göğüs Hastalıkları Polikliniği", en: "Pediatric Pulmonology", ar: "أمراض صدر الأطفال", ru: "Детская пульмонология", ka: "ბავშვთა პულმონოლოგია", type: "internal" },
  { tr: "Pediatri Enfeksiyon Polikliniği", en: "Pediatric Infectious Diseases", ar: "أمراض معدية للأطفال", ru: "Детские инфекционные болезни", ka: "ბავშვთა ინფექციური დაავადებები", type: "internal" },
  { tr: "Pediatri Romatoloji Polikliniği", en: "Pediatric Rheumatology", ar: "روماتيزم الأطفال", ru: "Детская ревматология", ka: "ბავშვთა რევმატოლოგია", type: "internal" },
  { tr: "Pediatri Onkoloji Polikliniği", en: "Pediatric Oncology", ar: "أورام الأطفال", ru: "Детская онкология", ka: "ბავშვთა ონკოლოგია", type: "internal" },
  { tr: "Pediatri Gastroenteroloji Polikliniği", en: "Pediatric Gastroenterology", ar: "جهاز هضمي الأطفال", ru: "Детская гастроэнтерология", ka: "ბავშვთა გასტროენტეროლოგია", type: "internal" },
  { tr: "Pediatri KİT Polikliniği", en: "Pediatric Bone Marrow Transplant", ar: "زراعة نخاع الأطفال", ru: "Детская трансплантация костного мозга", ka: "ბავშვთა ძვლის ტვინის ტრანსპლანტაცია", type: "internal" },
  { tr: "Anesteziyoloji Polikliniği", en: "Anesthesiology", ar: "التخدير", ru: "Анестезиология", ka: "ანესთეზიოლოგია", type: "internal" },
  { tr: "Korona 19 Erişkin Poliklinik", en: "COVID-19 Adult Clinic", ar: "عيادة كوفيد-19 للبالغين", ru: "Клиника COVID-19 (взрослые)", ka: "COVID-19 ზრდასრულთა კლინიკა", type: "internal" },
  { tr: "Radyoloji Ünitesi", en: "Radiology Unit", ar: "وحدة الأشعة", ru: "Отделение радиологии", ka: "რადიოლოგიის განყოფილება", type: "internal" },
  { tr: "Medikal Onkoloji Polikliniği", en: "Medical Oncology", ar: "الأورام الطبية", ru: "Медицинская онкология", ka: "სამედიცინო ონკოლოგია", type: "internal" },
  { tr: "İmmünoloji Polikliniği", en: "Immunology", ar: "المناعة", ru: "Иммунология", ka: "იმუნოლოგია", type: "internal" },
  { tr: "Hematoloji Polikliniği", en: "Hematology", ar: "أمراض الدم", ru: "Гематология", ka: "ჰემატოლოგია", type: "internal" },
  { tr: "Yenidoğan Polikliniği", en: "Neonatology", ar: "حديثي الولادة", ru: "Неонатология", ka: "ნეონატოლოგია", type: "internal" },
  { tr: "Nükleer Tıp Polikliniği", en: "Nuclear Medicine", ar: "الطب النووي", ru: "Ядерная медицина", ka: "ბირთვული მედიცინა", type: "internal" },
  { tr: "Göğüs Hastalıkları Polikliniği", en: "Pulmonology (Chest Diseases)", ar: "أمراض الصدر", ru: "Пульмонология", ka: "პულმონოლოგია", type: "internal" },
  { tr: "Tıbbi Genetik Polikliniği", en: "Medical Genetics", ar: "الوراثة الطبية", ru: "Медицинская генетика", ka: "სამედიცინო გენეტიკა", type: "internal" },
];

export function findUnitByTr(tr: string): Unit | undefined {
  return units.find((u) => u.tr === tr);
}

export function unitLabel(u: Unit, locale: string): string {
  return (u as Record<string, string>)[locale] ?? u.tr;
}
