"use client";

import { useState } from "react";
import { signIn } from "@/app/admin/actions";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setError("");
    const res = await signIn(formData);
    setPending(false);
    if (res.error) setError("Giriş başarısız: kullanıcı adı veya şifre hatalı.");
    // On success the server revalidates /admin and the panel renders.
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <form
        action={action}
        className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden space-y-5"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

        <div className="text-center mb-2">
          <h1 className="text-2xl font-black text-primary tracking-tight">Yönetim Paneli Girişi</h1>
          <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">KTÜ FARABİ HASTANESİ</p>
        </div>

        <div>
          <label className="block text-xs font-black text-primary uppercase tracking-wider mb-2">Kullanıcı Adı</label>
          <input
            name="username"
            type="text"
            required
            placeholder="ktufarabiadmin"
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-primary uppercase tracking-wider mb-2">Şifre</label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-primary"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-wider shadow-md hover:bg-primary/95 transition-all disabled:opacity-60 cursor-pointer"
        >
          {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
