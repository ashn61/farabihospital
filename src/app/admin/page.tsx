"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Newspaper,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Search,
  Stethoscope,
  Activity,
  Check,
  RotateCcw,
  ArrowLeft,
  UserCheck,
  Edit,
  Globe
} from "lucide-react";
import Navbar, { Locale } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Doctor, doctorsData, getCleanName, formatDoctorName } from "@/lib/doctors";
import { NewsData, NewsItem, newsData } from "@/lib/news";

const generateRandomId = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function AdminPage() {
  const [locale, setLocale] = useState<Locale>("tr");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Core Dynamic States
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData);
  const [news, setNews] = useState<NewsData>(newsData);

  // UI States
  const [activeTab, setActiveTab] = useState<"doctors" | "news" | "settings">("doctors");
  const [doctorFormTab, setDoctorFormTab] = useState<"basic" | "langs" | "edu">("basic");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchNewsTerm, setSearchNewsTerm] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Edit States
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editingNewsIndex, setEditingNewsIndex] = useState<number | null>(null);
  const [newsFormActiveLang, setNewsFormActiveLang] = useState<"tr" | "en" | "ar" | "ru" | "ka">("tr");

  // Form States - Doctor
  const [docName, setDocName] = useState("");
  const [docTitle, setDocTitle] = useState("Prof. Dr.");
  const [docCategory, setDocCategory] = useState<"surgical" | "internal">("surgical");
  const [docEmail, setDocEmail] = useState("");
  const [docImage, setDocImage] = useState("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400");
  const [docStats, setDocStats] = useState({ experience: 10, patients: 1200, surgeries: 100 });
  const [docSpec, setDocSpec] = useState({ tr: "", en: "", ar: "", ru: "", ka: "" });
  const [docBio, setDocBio] = useState({ tr: "", en: "", ar: "", ru: "", ka: "" });
  const [docEduTr, setDocEduTr] = useState("");
  const [docEduEn, setDocEduEn] = useState("");
  const [docEduAr, setDocEduAr] = useState("");

  // Form States - News
  const [newsImage, setNewsImage] = useState("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200");
  const [newsLangs, setNewsLangs] = useState({
    tr: { name: "", designation: "Kurumsal | Duyuru", quote: "" },
    en: { name: "", designation: "Corporate | Announcement", quote: "" },
    ar: { name: "", designation: "مؤسسي | إعلان", quote: "" },
    ru: { name: "", designation: "Корпоративный | Объявление", quote: "" },
    ka: { name: "", designation: "კორპორატიული | განცხადება", quote: "" }
  });

  // Sync state with LocalStorage on mount
  useEffect(() => {
    const checkLogin = localStorage.getItem("farabi_admin_logged");
    if (checkLogin === "true") {
      setTimeout(() => setIsLoggedIn(true), 0);
    }

    const localDocs = localStorage.getItem("farabi_doctors");
    if (localDocs) {
      try {
        const parsed = JSON.parse(localDocs);
        setTimeout(() => setDoctors(parsed), 0);
      } catch (e) {
        console.error(e);
      }
    }

    const localNews = localStorage.getItem("farabi_news");
    if (localNews) {
      try {
        const parsed = JSON.parse(localNews);
        setTimeout(() => setNews(parsed), 0);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
      localStorage.setItem("farabi_admin_logged", "true");
      setLoginError("");
      showNotification("Yönetici girişi başarıyla sağlandı.");
    } else {
      setLoginError("Geçersiz kullanıcı adı veya şifre!");
      showNotification("Giriş başarısız.", "error");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("farabi_admin_logged");
    showNotification("Çıkış yapıldı.");
  };

  const handleResetData = () => {
    if (window.confirm("Tüm hekim ve haber verilerini fabrika ayarlarına sıfırlamak istediğinizden emin misiniz? Özel eklediğiniz tüm kayıtlar silinecektir.")) {
      setDoctors(doctorsData);
      setNews(newsData);
      localStorage.setItem("farabi_doctors", JSON.stringify(doctorsData));
      localStorage.setItem("farabi_news", JSON.stringify(newsData));
      showNotification("Sistem verileri başarıyla sıfırlandı.");
      handleCancelEditDoctor();
      handleCancelEditNews();
    }
  };

  // Add / Edit Doctor Handler
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docEmail || !docSpec.tr || !docBio.tr) {
      showNotification("Lütfen temel hekim bilgilerini ve Türkçe karşılıklarını doldurun.", "error");
      return;
    }

    if (editingDoctorId) {
      const updatedDocs = doctors.map(doc => {
        if (doc.id === editingDoctorId) {
          return {
            ...doc,
            name: getCleanName(docName, docTitle),
            title: docTitle,
            image: docImage,
            specialtyTr: docSpec.tr,
            specialtyEn: docSpec.en || docSpec.tr,
            specialtyAr: docSpec.ar || docSpec.en || docSpec.tr,
            specialtyRu: docSpec.ru || docSpec.tr,
            specialtyKa: docSpec.ka || docSpec.tr,
            category: docCategory,
            stats: {
              patients: Number(docStats.patients) || 0,
              experience: Number(docStats.experience) || 0,
              surgeries: docCategory === "surgical" ? Number(docStats.surgeries) || 0 : undefined
            },
            email: docEmail,
            educationTr: docEduTr ? docEduTr.split(",").map(item => item.trim()) : ["KTÜ Tıp Fakültesi"],
            educationEn: docEduEn ? docEduEn.split(",").map(item => item.trim()) : ["KTÜ Faculty of Medicine"],
            educationAr: docEduAr ? docEduAr.split(",").map(item => item.trim()) : undefined,
            bioTr: docBio.tr,
            bioEn: docBio.en || docBio.tr,
            bioAr: docBio.ar || docBio.en || docBio.tr,
            bioRu: docBio.ru || docBio.tr,
            bioKa: docBio.ka || docBio.tr
          };
        }
        return doc;
      });
      setDoctors(updatedDocs);
      localStorage.setItem("farabi_doctors", JSON.stringify(updatedDocs));
      showNotification(`${formatDoctorName(docName, docTitle, locale)} hekim bilgileri başarıyla güncellendi.`);
      handleCancelEditDoctor();
      return;
    }

    const newDoctor: Doctor = {
      id: generateRandomId(),
      name: getCleanName(docName, docTitle),
      title: docTitle,
      image: docImage,
      specialtyTr: docSpec.tr,
      specialtyEn: docSpec.en || docSpec.tr,
      specialtyAr: docSpec.ar || docSpec.en || docSpec.tr,
      specialtyRu: docSpec.ru || docSpec.tr,
      specialtyKa: docSpec.ka || docSpec.tr,
      category: docCategory,
      stats: {
        patients: Number(docStats.patients) || 0,
        experience: Number(docStats.experience) || 0,
        surgeries: docCategory === "surgical" ? Number(docStats.surgeries) || 0 : undefined
      },
      email: docEmail,
      educationTr: docEduTr ? docEduTr.split(",").map(item => item.trim()) : ["KTÜ Tıp Fakültesi"],
      educationEn: docEduEn ? docEduEn.split(",").map(item => item.trim()) : ["KTÜ Faculty of Medicine"],
      educationAr: docEduAr ? docEduAr.split(",").map(item => item.trim()) : undefined,
      bioTr: docBio.tr,
      bioEn: docBio.en || docBio.tr,
      bioAr: docBio.ar || docBio.en || docBio.tr,
      bioRu: docBio.ru || docBio.tr,
      bioKa: docBio.ka || docBio.tr
    };

    const updatedDocs = [newDoctor, ...doctors];
    setDoctors(updatedDocs);
    localStorage.setItem("farabi_doctors", JSON.stringify(updatedDocs));
    showNotification(`${formatDoctorName(docName, docTitle, locale)} başarıyla hekim listesine eklendi.`);
    handleCancelEditDoctor();
  };

  const handleStartEditDoctor = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setDocName(getCleanName(doc.name, doc.title));
    setDocTitle(doc.title);
    setDocCategory(doc.category);
    setDocEmail(doc.email);
    setDocImage(doc.image);
    setDocStats({
      experience: doc.stats.experience,
      patients: doc.stats.patients,
      surgeries: doc.stats.surgeries || 0
    });
    setDocSpec({
      tr: doc.specialtyTr || "",
      en: doc.specialtyEn || "",
      ar: doc.specialtyAr || "",
      ru: doc.specialtyRu || "",
      ka: doc.specialtyKa || ""
    });
    setDocBio({
      tr: doc.bioTr || "",
      en: doc.bioEn || "",
      ar: doc.bioAr || "",
      ru: doc.bioRu || "",
      ka: doc.bioKa || ""
    });
    setDocEduTr(doc.educationTr ? doc.educationTr.join(", ") : "");
    setDocEduEn(doc.educationEn ? doc.educationEn.join(", ") : "");
    setDocEduAr(doc.educationAr ? doc.educationAr.join(", ") : "");
    setDoctorFormTab("basic");

    const formElement = document.getElementById("doctor-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEditDoctor = () => {
    setEditingDoctorId(null);
    setDocName("");
    setDocEmail("");
    setDocSpec({ tr: "", en: "", ar: "", ru: "", ka: "" });
    setDocBio({ tr: "", en: "", ar: "", ru: "", ka: "" });
    setDocEduTr("");
    setDocEduEn("");
    setDocEduAr("");
    setDoctorFormTab("basic");
  };

  // Delete Doctor Handler
  const handleDeleteDoctor = (id: string, name: string) => {
    if (window.confirm(`${name} hekimini silmek istediğinizden emin misiniz?`)) {
      const updatedDocs = doctors.filter(doc => doc.id !== id);
      setDoctors(updatedDocs);
      localStorage.setItem("farabi_doctors", JSON.stringify(updatedDocs));
      showNotification("Hekim başarıyla silindi.");
      if (editingDoctorId === id) {
        handleCancelEditDoctor();
      }
    }
  };

  // Add / Edit News Handler
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsLangs.tr.name || !newsLangs.tr.quote) {
      showNotification("Lütfen en azından Türkçe haber başlığını ve açıklamasını doldurun.", "error");
      return;
    }

    if (editingNewsIndex !== null) {
      const updateNewsArray = (langArray: NewsItem[], lang: keyof typeof newsLangs) => {
        return langArray.map((item, idx) => {
          if (idx === editingNewsIndex) {
            return {
              name: newsLangs[lang].name || newsLangs.tr.name,
              designation: newsLangs[lang].designation || newsLangs.tr.designation,
              quote: newsLangs[lang].quote || newsLangs.tr.quote,
              src: newsImage
            };
          }
          return item;
        });
      };

      const updatedNews: NewsData = {
        tr: updateNewsArray(news.tr, "tr"),
        en: updateNewsArray(news.en, "en"),
        ar: updateNewsArray(news.ar, "ar"),
        ru: updateNewsArray(news.ru, "ru"),
        ka: updateNewsArray(news.ka, "ka")
      };

      setNews(updatedNews);
      localStorage.setItem("farabi_news", JSON.stringify(updatedNews));
      showNotification("Haber başarıyla güncellendi.");
      handleCancelEditNews();
      return;
    }

    const updatedNews: NewsData = {
      tr: [
        {
          name: newsLangs.tr.name,
          designation: newsLangs.tr.designation,
          quote: newsLangs.tr.quote,
          src: newsImage
        },
        ...news.tr
      ],
      en: [
        {
          name: newsLangs.en.name || newsLangs.tr.name,
          designation: newsLangs.en.designation || newsLangs.tr.designation,
          quote: newsLangs.en.quote || newsLangs.tr.quote,
          src: newsImage
        },
        ...news.en
      ],
      ar: [
        {
          name: newsLangs.ar.name || newsLangs.tr.name,
          designation: newsLangs.ar.designation || newsLangs.tr.designation,
          quote: newsLangs.ar.quote || newsLangs.tr.quote,
          src: newsImage
        },
        ...news.ar
      ],
      ru: [
        {
          name: newsLangs.ru.name || newsLangs.tr.name,
          designation: newsLangs.ru.designation || newsLangs.tr.designation,
          quote: newsLangs.ru.quote || newsLangs.tr.quote,
          src: newsImage
        },
        ...news.ru
      ],
      ka: [
        {
          name: newsLangs.ka.name || newsLangs.tr.name,
          designation: newsLangs.ka.designation || newsLangs.tr.designation,
          quote: newsLangs.ka.quote || newsLangs.tr.quote,
          src: newsImage
        },
        ...news.ka
      ]
    };

    setNews(updatedNews);
    localStorage.setItem("farabi_news", JSON.stringify(updatedNews));
    showNotification("Haber başarıyla eklendi.");
    handleCancelEditNews();
  };

  const handleStartEditNews = (index: number) => {
    setEditingNewsIndex(index);
    setNewsImage(news.tr[index]?.src || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200");
    setNewsLangs({
      tr: {
        name: news.tr[index]?.name || "",
        designation: news.tr[index]?.designation || "Kurumsal | Duyuru",
        quote: news.tr[index]?.quote || ""
      },
      en: {
        name: news.en[index]?.name || "",
        designation: news.en[index]?.designation || "Corporate | Announcement",
        quote: news.en[index]?.quote || ""
      },
      ar: {
        name: news.ar[index]?.name || "",
        designation: news.ar[index]?.designation || "مؤسسي | إعلان",
        quote: news.ar[index]?.quote || ""
      },
      ru: {
        name: news.ru[index]?.name || "",
        designation: news.ru[index]?.designation || "Корпоративный | Объявление",
        quote: news.ru[index]?.quote || ""
      },
      ka: {
        name: news.ka[index]?.name || "",
        designation: news.ka[index]?.designation || "კორპორატიული | განცხადება",
        quote: news.ka[index]?.quote || ""
      }
    });
    setNewsFormActiveLang("tr");

    const formElement = document.getElementById("news-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEditNews = () => {
    setEditingNewsIndex(null);
    setNewsImage("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200");
    setNewsLangs({
      tr: { name: "", designation: "Kurumsal | Duyuru", quote: "" },
      en: { name: "", designation: "Corporate | Announcement", quote: "" },
      ar: { name: "", designation: "مؤسسي | إعلان", quote: "" },
      ru: { name: "", designation: "Корпоративный | Объявление", quote: "" },
      ka: { name: "", designation: "კორპორატიული | განცხადება", quote: "" }
    });
  };

  // Delete News Handler
  const handleDeleteNews = (index: number, name: string) => {
    if (window.confirm(`"${name}" haberini silmek istediğinizden emin misiniz?`)) {
      const updatedNews: NewsData = {
        tr: news.tr.filter((_, idx) => idx !== index),
        en: news.en.filter((_, idx) => idx !== index),
        ar: news.ar.filter((_, idx) => idx !== index),
        ru: news.ru.filter((_, idx) => idx !== index),
        ka: news.ka.filter((_, idx) => idx !== index)
      };
      setNews(updatedNews);
      localStorage.setItem("farabi_news", JSON.stringify(updatedNews));
      showNotification("Haber başarıyla silindi.");
      if (editingNewsIndex === index) {
        handleCancelEditNews();
      }
    }
  };

  // Filtering
  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialtyTr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNews = news.tr.filter(n =>
    n.name.toLowerCase().includes(searchNewsTerm.toLowerCase()) ||
    n.designation.toLowerCase().includes(searchNewsTerm.toLowerCase())
  );

  // Authentication wrapper check
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 justify-between">
        <Navbar currentLocale={locale} onLocaleChange={(l) => setLocale(l)} />
        
        <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />
            
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-secondary/20 mb-4">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-primary tracking-tight">Yönetim Paneli Girişi</h2>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">KTÜ FARABİ HASTANESİ</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-primary uppercase tracking-wider mb-2">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-primary"
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-primary uppercase tracking-wider mb-2">Şifre</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-primary"
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg text-center">{loginError}</p>
              )}

              <button 
                type="submit" 
                className="w-full bg-primary text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-wider shadow-md hover:bg-primary/95 transition-all mt-4 cursor-pointer"
              >
                Giriş Yap
              </button>
            </form>
          </motion.div>
        </main>

        <Footer currentLocale={locale} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Global Navbar */}
      <Navbar currentLocale={locale} onLocaleChange={(l) => setLocale(l)} />

      {/* Admin Panel Main Board */}
      <main className="flex-1 pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link 
            href="/"
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200/60 rounded-full text-[11px] font-black text-primary uppercase hover:shadow-xs transition-all hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-secondary" />
            <span>Kullanıcı Arayüzüne Dön</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 border border-red-200/60 rounded-full text-[11px] font-black text-red-500 uppercase hover:shadow-xs transition-all hover:bg-red-100 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>

        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-primary tracking-tight">Yönetim Paneli</h1>
          <p className="text-slate-500 font-semibold text-sm">Hekim kadrosunu ve haber duyurularını yönetin.</p>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3.5 rounded-full shadow-lg border text-xs font-bold uppercase tracking-wider flex items-center space-x-2 ${
                notification.type === "success" 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              <Check className="h-4 w-4" />
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel border rounded-3xl p-5 shadow-2xs">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>Toplam Hekim</span>
            </p>
            <p className="text-2xl font-black text-primary mt-1">{doctors.length}</p>
          </div>
          <div className="glass-panel border rounded-3xl p-5 shadow-2xs">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1">
              <Stethoscope className="h-3.5 w-3.5 text-primary" />
              <span>Cerrahi Hekimler</span>
            </p>
            <p className="text-2xl font-black text-primary mt-1">
              {doctors.filter(d => d.category === "surgical").length}
            </p>
          </div>
          <div className="glass-panel border rounded-3xl p-5 shadow-2xs">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>Dahili Hekimler</span>
            </p>
            <p className="text-2xl font-black text-primary mt-1">
              {doctors.filter(d => d.category === "internal").length}
            </p>
          </div>
          <div className="glass-panel border rounded-3xl p-5 shadow-2xs">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1">
              <Newspaper className="h-3.5 w-3.5 text-primary" />
              <span>Toplam Haber</span>
            </p>
            <p className="text-2xl font-black text-primary mt-1">{news.tr.length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 space-x-4">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "doctors" 
                ? "border-b-2 border-primary text-primary" 
                : "text-slate-400 hover:text-primary"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Hekim Yönetimi</span>
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "news" 
                ? "border-b-2 border-primary text-primary" 
                : "text-slate-400 hover:text-primary"
            }`}
          >
            <Newspaper className="h-4 w-4" />
            <span>Haber Yönetimi</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "settings" 
                ? "border-b-2 border-primary text-primary" 
                : "text-slate-400 hover:text-primary"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Sistem Ayarları</span>
          </button>
        </div>

        {/* Active Tab Panel */}
        <div className="w-full">
          
          {/* TAB 1: DOCTORS MANAGEMENT */}
          {activeTab === "doctors" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Doctor List (Left) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-black text-primary uppercase tracking-wider">Hekim Listesi</h3>
                    
                    {/* Search Field */}
                    <div className="relative max-w-xs w-full">
                      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Hekim ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-primary"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doc) => (
                        <div key={doc.id} className="py-4 flex items-center justify-between group">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img src={doc.image} alt={formatDoctorName(doc.name, doc.title, locale)} className="h-full w-full object-cover object-top" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-primary leading-tight">{formatDoctorName(doc.name, doc.title, locale)}</p>
                              <p className="text-[10px] text-neutral-400 font-bold mt-0.5">{doc.specialtyTr}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  doc.category === "surgical" 
                                    ? "bg-orange-50 text-orange-600 border border-orange-200" 
                                    : "bg-blue-50 text-blue-600 border border-blue-200"
                                }`}>
                                  {doc.category === "surgical" ? "Cerrahi" : "Dahili"}
                                </span>
                                <span className="text-[8px] font-black text-slate-400">ID: {doc.id}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEditDoctor(doc)}
                              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all border border-blue-200 cursor-pointer"
                              title="Hekimi Düzenle"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doc.id, formatDoctorName(doc.name, doc.title, locale))}
                              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all border border-red-200 cursor-pointer"
                              title="Hekimi Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 font-semibold py-8 text-center">Aranan kriterlere uygun hekim bulunamadı.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Doctor Form (Right) */}
              <div id="doctor-form-container" className="lg:col-span-5">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
                  
                  <h3 className="text-base font-black text-primary uppercase tracking-wider mb-6 flex items-center space-x-2">
                    {editingDoctorId ? (
                      <>
                        <Edit className="h-5 w-5 text-blue-600" />
                        <span>Hekim Düzenle</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 text-secondary" />
                        <span>Yeni Hekim Ekle</span>
                      </>
                    )}
                  </h3>

                  {/* Form Step Nav */}
                  <div className="flex border-b border-slate-100 mb-6 gap-2">
                    <button 
                      onClick={() => setDoctorFormTab("basic")}
                      className={`pb-2.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        doctorFormTab === "basic" ? "border-b border-primary text-primary" : "text-slate-400"
                      }`}
                    >
                      Temel
                    </button>
                    <button 
                      onClick={() => setDoctorFormTab("langs")}
                      className={`pb-2.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        doctorFormTab === "langs" ? "border-b border-primary text-primary" : "text-slate-400"
                      }`}
                    >
                      Birim & Biyo
                    </button>
                    <button 
                      onClick={() => setDoctorFormTab("edu")}
                      className={`pb-2.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        doctorFormTab === "edu" ? "border-b border-primary text-primary" : "text-slate-400"
                      }`}
                    >
                      Eğitim
                    </button>
                  </div>

                  <form onSubmit={handleAddDoctor} className="space-y-4">
                    
                    {/* Basic Info Tab */}
                    {doctorFormTab === "basic" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1.5">Unvan & İsim</label>
                          <div className="flex gap-2">
                            <select 
                              value={docTitle} 
                              onChange={(e) => setDocTitle(e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            >
                              <option value="Prof. Dr.">Prof. Dr.</option>
                              <option value="Assoc. Prof.">Doç. Dr.</option>
                              <option value="Assist. Prof.">Yrd. Doç.</option>
                              <option value="Dr.">Dr.</option>
                            </select>
                            <input 
                              type="text" 
                              required
                              placeholder="Celal TEKİNBAŞ"
                              value={docName}
                              onChange={(e) => setDocName(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1.5">Kategori</label>
                            <select 
                              value={docCategory} 
                              onChange={(e) => setDocCategory(e.target.value as "surgical" | "internal")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            >
                              <option value="surgical">Cerrahi Birim</option>
                              <option value="internal">Dahili Birim</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1.5">E-posta</label>
                            <input 
                              type="email" 
                              required
                              placeholder="hekim@ktu.edu.tr"
                              value={docEmail}
                              onChange={(e) => setDocEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1.5">Hekim Fotoğrafı URL</label>
                          <input 
                            type="text" 
                            required
                            value={docImage}
                            onChange={(e) => setDocImage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <label className="block text-xs font-black text-primary uppercase tracking-wider mb-3">Hekim İstatistikleri</label>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 mb-1">Deneyim (Yıl)</label>
                              <input 
                                type="number" 
                                value={docStats.experience}
                                onChange={(e) => setDocStats({...docStats, experience: Number(e.target.value)})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs font-semibold text-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 mb-1">Hasta Sayısı</label>
                              <input 
                                type="number" 
                                value={docStats.patients}
                                onChange={(e) => setDocStats({...docStats, patients: Number(e.target.value)})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs font-semibold text-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 mb-1">Ameliyat</label>
                              <input 
                                type="number" 
                                disabled={docCategory === "internal"}
                                value={docCategory === "internal" ? "" : docStats.surgeries}
                                onChange={(e) => setDocStats({...docStats, surgeries: Number(e.target.value)})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs font-semibold text-primary disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          type="button" 
                          onClick={() => setDoctorFormTab("langs")}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-primary py-2.5 rounded-xl text-xs font-black uppercase tracking-wider mt-4 transition-all cursor-pointer"
                        >
                          Sonraki Adım
                        </button>
                      </div>
                    )}

                    {/* Specialty & Bio languages Tab */}
                    {doctorFormTab === "langs" && (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-primary uppercase tracking-wider">Uzmanlık Alanı (Birim)</h4>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">Türkçe (TR) *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Göğüs Cerrahisi"
                              value={docSpec.tr}
                              onChange={(e) => setDocSpec({...docSpec, tr: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">İngilizce (EN)</label>
                            <input 
                              type="text" 
                              placeholder="Thoracic Surgery"
                              value={docSpec.en}
                              onChange={(e) => setDocSpec({...docSpec, en: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">Arapça (AR)</label>
                            <input 
                              type="text" 
                              placeholder="جراحة الصدر"
                              value={docSpec.ar}
                              onChange={(e) => setDocSpec({...docSpec, ar: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">Rusça (RU)</label>
                            <input 
                              type="text" 
                              placeholder="Торакальная хирургия"
                              value={docSpec.ru}
                              onChange={(e) => setDocSpec({...docSpec, ru: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">Gürcüce (KA)</label>
                            <input 
                              type="text" 
                              placeholder="თორაკალური ქირურგია"
                              value={docSpec.ka}
                              onChange={(e) => setDocSpec({...docSpec, ka: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 border-t border-slate-100 pt-4">
                          <h4 className="text-xs font-black text-primary uppercase tracking-wider">Hekim Biyografisi</h4>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">Türkçe Biyografi (TR) *</label>
                            <textarea 
                              required
                              rows={3}
                              placeholder="Prof. Dr. Celal Tekinbaş lider bir cerrahtır..."
                              value={docBio.tr}
                              onChange={(e) => docBio && setDocBio({...docBio, tr: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">İngilizce Biyografi (EN)</label>
                            <textarea 
                              rows={3}
                              placeholder="Prof. Dr. Celal Tekinbaş is a leading thoracic surgeon..."
                              value={docBio.en}
                              onChange={(e) => docBio && setDocBio({...docBio, en: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">Arapça Biyografi (AR)</label>
                            <textarea 
                              rows={3}
                              placeholder="البروفيسور الدكتور جلال تيكينباش هو رئيس قسم..."
                              value={docBio.ar}
                              onChange={(e) => docBio && setDocBio({...docBio, ar: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">Rusça Biyografi (RU)</label>
                            <textarea 
                              rows={3}
                              placeholder="Профессор д-р Джелал..."
                              value={docBio.ru}
                              onChange={(e) => docBio && setDocBio({...docBio, ru: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 mb-1">Gürcüce Biyografi (KA)</label>
                            <textarea 
                              rows={3}
                              placeholder="პროფ. დოქტ. ჯელალ..."
                              value={docBio.ka}
                              onChange={(e) => docBio && setDocBio({...docBio, ka: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <button 
                          type="button" 
                          onClick={() => setDoctorFormTab("edu")}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-primary py-2.5 rounded-xl text-xs font-black uppercase tracking-wider mt-4 transition-all cursor-pointer"
                        >
                          Sonraki Adım
                        </button>
                      </div>
                    )}

                    {/* Education Credentials Tab */}
                    {doctorFormTab === "edu" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1">Eğitim Geçmişi (TR) (Virgülle Ayırın)</label>
                          <textarea 
                            rows={3}
                            placeholder="İstanbul Üniversitesi Tıp Fakültesi (Lisans), KTÜ Tıp Fakültesi (Uzmanlık)"
                            value={docEduTr}
                            onChange={(e) => setDocEduTr(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1">Eğitim Geçmişi (EN) (Virgülle Ayırın)</label>
                          <textarea 
                            rows={3}
                            placeholder="Istanbul University Faculty of Medicine (MD), KTÜ Faculty of Medicine (Residency)"
                            value={docEduEn}
                            onChange={(e) => setDocEduEn(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1">Eğitim Geçmişi (AR) (Virgülle Ayırın)</label>
                          <textarea 
                            rows={3}
                            placeholder="جامعة كارادينيز التقنية، كلية الطب (بكالوريوس)..."
                            value={docEduAr}
                            onChange={(e) => setDocEduAr(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-primary focus:outline-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-4">
                          <button 
                            type="button" 
                            onClick={() => setDoctorFormTab("langs")}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-primary py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Geri Git
                          </button>
                          {editingDoctorId && (
                            <button 
                              type="button" 
                              onClick={handleCancelEditDoctor}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Vazgeç
                            </button>
                          )}
                          <button 
                            type="submit" 
                            className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-primary/95 transition-all cursor-pointer"
                          >
                            {editingDoctorId ? "Güncelle" : "Kaydet"}
                          </button>
                        </div>
                      </div>
                    )}

                  </form>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: NEWS MANAGEMENT */}
          {activeTab === "news" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* News List (Left) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-black text-primary uppercase tracking-wider">Haber / Başarı Listesi</h3>
                    
                    {/* Search Field */}
                    <div className="relative max-w-xs w-full">
                      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Haber ara..."
                        value={searchNewsTerm}
                        onChange={(e) => setSearchNewsTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-primary"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
                    {filteredNews.length > 0 ? (
                      filteredNews.map((n, index) => (
                        <div key={index} className="py-4 flex items-center justify-between group">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img src={n.src} alt={n.name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-primary leading-tight">{n.name}</p>
                              <p className="text-[9px] text-orange-500 font-bold uppercase tracking-wider mt-0.5">{n.designation}</p>
                              <p className="text-[10px] text-neutral-400 font-semibold line-clamp-1 mt-0.5">{n.quote}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEditNews(index)}
                              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all border border-blue-200 cursor-pointer"
                              title="Haberi Düzenle"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNews(index, n.name)}
                              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all border border-red-200 cursor-pointer"
                              title="Haberi Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 font-semibold py-8 text-center">Kriterlere uygun haber kaydı bulunamadı.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Add News Form (Right) */}
              <div id="news-form-container" className="lg:col-span-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
                  
                  <h3 className="text-base font-black text-primary uppercase tracking-wider mb-6 flex items-center space-x-2">
                    {editingNewsIndex !== null ? (
                      <>
                        <Edit className="h-5 w-5 text-blue-600" />
                        <span>Haberi Düzenle</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 text-secondary" />
                        <span>Yeni Haber / Başarı Ekle</span>
                      </>
                    )}
                  </h3>

                  <form onSubmit={handleAddNews} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1.5">Görsel / Afiş URL</label>
                      <input 
                        type="text" 
                        required
                        value={newsImage}
                        onChange={(e) => setNewsImage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                      />
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-primary uppercase tracking-wider">Haber Detayları (Çok Dilli Giriş)</h4>
                        <div className="flex items-center space-x-1 text-[9px] font-bold text-slate-400">
                          <Globe className="h-3 w-3" />
                          <span>Çeviri Seçin</span>
                        </div>
                      </div>

                      {/* Language Selectors for News */}
                      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                        {(["tr", "en", "ar", "ru", "ka"] as const).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setNewsFormActiveLang(lang)}
                            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                              newsFormActiveLang === lang ? "bg-primary text-white" : "text-slate-500 hover:text-primary"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                      
                      {/* Active language news details */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3">
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider block border-b border-slate-200 pb-1">
                          {newsFormActiveLang === "tr" ? "TÜRKÇE (TR) *" :
                           newsFormActiveLang === "en" ? "İNGİLİZCE (EN)" :
                           newsFormActiveLang === "ar" ? "ARAPÇA (AR)" :
                           newsFormActiveLang === "ru" ? "RUSÇA (RU)" : "GÜRCÜCE (KA)"}
                        </span>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 mb-1">Haber Başlığı</label>
                          <input 
                            type="text" 
                            required={newsFormActiveLang === "tr"}
                            placeholder={
                              newsFormActiveLang === "tr" ? "Organ Naklinde Büyük Başarı" :
                              newsFormActiveLang === "en" ? "Major Kidney Transplant Success" :
                              newsFormActiveLang === "ar" ? "نجاح باهر في زراعة الأعضاء" :
                              newsFormActiveLang === "ru" ? "Успех трансплантации почки" : "თირკმლის გადანერგვის წარმატება"
                            }
                            value={newsLangs[newsFormActiveLang].name}
                            onChange={(e) => setNewsLangs({
                              ...newsLangs,
                              [newsFormActiveLang]: { ...newsLangs[newsFormActiveLang], name: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 mb-1">Alt Kategori (Örn: Cerrahi Başarı)</label>
                          <input 
                            type="text" 
                            placeholder={
                              newsFormActiveLang === "tr" ? "Cerrahi Başarı | Organ Nakli" :
                              newsFormActiveLang === "en" ? "Surgical Success | Kidney Transplant" :
                              newsFormActiveLang === "ar" ? "نجاح جراحي | زراعة الكلى" :
                              newsFormActiveLang === "ru" ? "Успех хирургии | Трансплантация почки" : "ქირურგიული წარმატება | თირკმლის გადანერგვა"
                            }
                            value={newsLangs[newsFormActiveLang].designation}
                            onChange={(e) => setNewsLangs({
                              ...newsLangs,
                              [newsFormActiveLang]: { ...newsLangs[newsFormActiveLang], designation: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 mb-1">Haber Özeti / Alıntı</label>
                          <textarea 
                            required={newsFormActiveLang === "tr"}
                            rows={3}
                            placeholder={
                              newsFormActiveLang === "tr" ? "Hastanemizde ilk laparoskopik nakil başarıyla gerçekleşti..." :
                              newsFormActiveLang === "en" ? "First successful laparoscopic organ transplant was done..." :
                              newsFormActiveLang === "ar" ? "نجاح أول عملية زراعة كلى بالمنظار في مستشفانا..." :
                              newsFormActiveLang === "ru" ? "Успешная межконтинентальная трансплантация почки..." : "თირკმლის წარმატებული გადანერგვა..."
                            }
                            value={newsLangs[newsFormActiveLang].quote}
                            onChange={(e) => setNewsLangs({
                              ...newsLangs,
                              [newsFormActiveLang]: { ...newsLangs[newsFormActiveLang], quote: e.target.value }
                            })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingNewsIndex !== null && (
                        <button 
                          type="button" 
                          onClick={handleCancelEditNews}
                          className="w-1/3 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Vazgeç
                        </button>
                      )}
                      <button 
                        type="submit" 
                        className="flex-1 bg-primary text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-primary/95 transition-all cursor-pointer"
                      >
                        {editingNewsIndex !== null ? "Haber Güncelle" : "Haber Kaydet"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SYSTEM SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                
                <h3 className="text-base font-black text-primary uppercase tracking-wider mb-6 flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-red-500" />
                  <span>Sistem Yönetim Ayarları</span>
                </h3>

                <div className="space-y-6">
                  
                  {/* Reset block */}
                  <div className="p-6 bg-red-50/50 border border-red-150 rounded-2xl space-y-4">
                    <div className="flex items-start space-x-3">
                      <RotateCcw className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-black text-primary">Verileri Fabrika Ayarlarına Sıfırla</h4>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                          Hekim listesi ve kurumsal duyurular/haberler veri setlerini varsayılan KTÜ Farabi veritabanı ayarlarına sıfırlayabilirsiniz. 
                          Özel eklediğiniz hekimler ve haberler tamamen silinecektir.
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleResetData}
                      className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Sıfırlama İşlemini Başlat
                    </button>
                  </div>

                  {/* Account settings block */}
                  <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
                    <div className="flex items-start space-x-3">
                      <UserCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-black text-primary">Yönetici Oturumu</h4>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                          Şu an yönetici kimliğiyle oturum açmış bulunmaktasınız. Oturumu sonlandırmak için çıkış tuşunu kullanabilirsiniz.
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-primary rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Oturumu Kapat (Çıkış)
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Global Footer */}
      <Footer currentLocale={locale} />
    </div>
  );
}
