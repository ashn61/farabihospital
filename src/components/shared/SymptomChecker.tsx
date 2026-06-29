"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, X, ArrowRight, ShieldCheck } from "lucide-react";
import { Locale } from "./Navbar";

const translations = {
  tr: {
    title: "AI Akıllı Klinik Yönlendirici",
    subtitle: "Şikayetinizi yazın, AI motorumuz sizi en doğru tıbbi birime yönlendirsin.",
    placeholder: "Örn: Göğsümde sıkışma ve koluma yayılan hafif ağrı var...",
    btnCheck: "Semptomları Analiz Et",
    analyzing: "Analiz Ediliyor...",
    warning: "Bu araç tıbbi bir teşhis koymaz. Acil durumlarda lütfen derhal 112 Acil Yardım hattını arayınız.",
    matchedDept: "Yönlendirilen Tıbbi Birim",
    suggestedDoc: "Önerilen Hekimlerimiz",
    btnAppt: "Klinikleri İncele",
  },
  en: {
    title: "AI Smart Clinic Router",
    subtitle: "Describe your symptoms, and our clinical AI will match you with the correct department.",
    placeholder: "E.g., I feel tightness in my chest and minor pain radiating down my left arm...",
    btnCheck: "Analyze Symptoms",
    analyzing: "Analyzing...",
    warning: "This tool does not replace professional medical diagnosis. In case of emergencies, call emergency services immediately.",
    matchedDept: "Recommended Department",
    suggestedDoc: "Suggested Physicians",
    btnAppt: "Explore Specialties",
  },
  ar: {
    title: "مساعد التوجيه الطبي الذكي AI",
    subtitle: "صف الأعراض التي تشعر بها، وسيقوم نظامنا بتوجيهك إلى العيادة المناسبة.",
    placeholder: "مثال: أشعر بضيق في صدري مع ألم خفيف يمتد إلى ذراعي الأيسر...",
    btnCheck: "تحليل الأعراض",
    analyzing: "جاري التحليل...",
    warning: "هذه الأداة لا تغني عن التشخيص الطبي المهني. في الحالات الطارئة، يرجى الاتصال بخدمات الطوارئ فوراً.",
    matchedDept: "القسم الطبي الموصى به",
    suggestedDoc: "الأطباء المقترحون",
    btnAppt: "استكشف التخصصات",
  },
  ru: {
    title: "Интеллектуальный маршрутизатор клиники AI",
    subtitle: "Опишите свои симптомы, и наш ИИ направит вас в соответствующее медицинское отделение.",
    placeholder: "Например: У меня сжатие в груди и легкая боль в левой руке...",
    btnCheck: "Анализировать симптомы",
    analyzing: "Анализ...",
    warning: "Этот инструмент не является медицинским диагнозом. В экстренных случаях немедленно звоните в службу спасения.",
    matchedDept: "Рекомендуемое отделение",
    suggestedDoc: "Рекомендуемые специалисты",
    btnAppt: "Подробнее о клиниках",
  },
  ka: {
    title: "AI კლინიკური მარშრუტიზატორი",
    subtitle: "აღწერეთ თქვენი სიმპტომები და ჩვენი ხელოვნური ინტელექტი მიგითითებთ შესაბამის სამედიცინო განყოფილებას.",
    placeholder: "მაგ: ვგრძნობ ზეწოლას გულმკერდის არეში და მსუბუქ ტკივილს მარცხენა ხელში...",
    btnCheck: "სიმპტომების ანალიზი",
    analyzing: "მიმდინარეობს ანალიზი...",
    warning: "ეს ინსტრუმენტი არ წარმოადგენს სამედიცინო დიაგნოზს. გადაუდებელ შემთხვევაში დაუყოვნებლივ დაუკავშირდით სასწრაფო დახმარებას.",
    matchedDept: "რეკომენდებული განყოფილება",
    suggestedDoc: "შემოთავაზებული ექიმები",
    btnAppt: "განყოფილებების დათვალიერება",
  }
};

interface SymptomCheckerProps {
  currentLocale: Locale;
  isOpen: boolean;
  onClose: () => void;
}

export default function SymptomChecker({ currentLocale, isOpen, onClose }: SymptomCheckerProps) {
  const [symptomText, setSymptomText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ department: string; matchReason: string; doctors: string[] } | null>(null);

  const t = translations[currentLocale];
  const isAr = currentLocale === "ar";

  const handleAnalyze = () => {
    if (!symptomText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    // Mock AI Clinical routing matching rule sets based on legacy data
    setTimeout(() => {
      const text = symptomText.toLowerCase();
      let matched = {
        department: "General Medicine / Family Doctor (Genel Dahiliye)",
        matchReason: currentLocale === "ka"
          ? "თქვენი აღწერილი სიმპტომები საჭიროებს ზოგად სამედიცინო შეფასებას."
          : currentLocale === "ru"
          ? "Описанные вами симптомы требуют общей медицинской оценки."
          : "Açıklamalarınız genel tıbbi değerlendirme gerektiren bulgular içermektedir.",
        doctors: ["Prof. Dr. Ahmet Coşkun ÖZDEMİR"]
      };

      if (
        text.includes("göğüs") || text.includes("chest") || text.includes("kalp") || text.includes("heart") || text.includes("pain") ||
        text.includes("груд") || text.includes("серд") || text.includes("боль") || text.includes("გულ") || text.includes("ტკივილ") || text.includes("მკერდ")
      ) {
        matched = {
          department: "Angio-Cardiology & Cardiovascular Surgery (Kardiyoloji / Kalp Damar)",
          matchReason: currentLocale === "ka"
            ? "გულმკერდის ტკივილი, ზეწოლა ან გახშირებული გულისცემა მოითხოვს კარდიოლოგიურ კვლევას."
            : currentLocale === "ru"
            ? "Боль в груди, сжатие или учащенное сердцебиение требуют кардиологического обследования."
            : "Chest pain, compression or palpitations require urgent cardiology screening.",
          doctors: ["Prof. Dr. Merih KUTLU", "Prof. Dr. Celal TEKİNBAŞ"]
        };
      } else if (
        text.includes("çocuk") || text.includes("bebek") || text.includes("child") || text.includes("pediatric") ||
        text.includes("дет") || text.includes("ребен") || text.includes("ბავშვ") || text.includes("ჩვილ")
      ) {
        matched = {
          department: "Pediatrics & Pediatric Surgery (Çocuk Sağlığı / Cerrahi)",
          matchReason: currentLocale === "ka"
            ? "ბავშვთა ასაკის კლინიკური სიმპტომები უნდა შეფასდეს პედიატრიული სპეციალისტების მიერ."
            : currentLocale === "ru"
            ? "Клинические симптомы у детей должны оцениваться педиатрическими специалистами."
            : "Pediatric-onset clinical symptoms should be evaluated by pediatric specialists.",
          doctors: ["Prof. Dr. Erol ERDURAN", "Prof. Dr. Murat ÇAKIR"]
        };
      } else if (
        text.includes("baş ağrısı") || text.includes("sinir") || text.includes("spine") || text.includes("numbness") ||
        text.includes("голов") || text.includes("спин") || text.includes("нерв") || text.includes("თავ") || text.includes("ზურგ") || text.includes("ნერვ")
      ) {
        matched = {
          department: "Neurosurgery & Spine Disorders (Beyin ve Sinir Cerrahisi)",
          matchReason: currentLocale === "ka"
            ? "ნევროლოგიური პარამეტრები და ზურგის ლოკალიზებული პრობლემები საჭიროებს ნეიროქირურგიულ შეფასებას."
            : currentLocale === "ru"
            ? "Неврологические параметры и локализованные проблемы со спиной требуют нейрохирургического обследования."
            : "Neurological parameters and localized back issues point to Neurosurgical evaluation.",
          doctors: ["Prof. Dr. Erhan ARSLAN"]
        };
      }

      setResult(matched);
      setIsAnalyzing(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#002D62]/30 backdrop-blur-md" onClick={onClose} />

      {/* Main Dialogue Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl glass-panel border rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 overflow-hidden"
        style={{ direction: isAr ? "rtl" : "ltr" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs animate-pulse">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-extrabold text-primary">
              {t.title}
            </h3>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Healthcare AI Assistant
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed text-left">
          {t.subtitle}
        </p>

        {/* Input Text Area */}
        <textarea
          rows={4}
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          placeholder={t.placeholder}
          className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm font-semibold transition-all mb-4 shadow-2xs"
        />

        {/* Emergency Disclaimer Alert */}
        <div className="flex items-start space-x-2.5 p-3.5 bg-secondary/10 text-primary rounded-2xl border border-secondary/20 text-xs font-semibold mb-6 text-left">
          <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5 text-secondary" />
          <span>{t.warning}</span>
        </div>

        {/* AI Action trigger buttons */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !symptomText.trim()}
          className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-extrabold hover:bg-primary/95 hover:shadow-lg disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer transition-all flex items-center justify-center space-x-2 shadow-xs"
        >
          <span>{isAnalyzing ? t.analyzing : t.btnCheck}</span>
        </button>

        {/* Match Routing results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-slate-150 space-y-4 text-left"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.matchedDept}</p>
                <p className="text-base font-extrabold text-primary mt-1">
                  {result.department}
                </p>
                <p className="text-xs font-semibold text-primary/80 mt-1.5 leading-relaxed">
                  {result.matchReason}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{t.suggestedDoc}</p>
                <div className="space-y-2">
                  {result.doctors.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-150 rounded-2xl shadow-2xs">
                      <span className="text-xs font-bold text-primary">{doc}</span>
                      <a
                        href="#specialties"
                        onClick={onClose}
                        className="text-[10px] font-black text-primary hover:text-secondary uppercase flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {t.btnAppt} <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
