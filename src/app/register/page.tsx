"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          payload: formData,
        }),
      });

      const data = await res.json();
      if (!data.status) {
        setError(data.message || "Gagal mendaftar. Email mungkin sudah dipakai.");
      } else {
        // Auto-login setelah register
        const loginRes = await fetch("/api/supabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "check-access",
            payload: { username: formData.email, password: formData.password },
          }),
        });
        const loginData = await loginRes.json();
        
        if (loginData.status && loginData.data?.token) {
          localStorage.setItem("tebar_token", loginData.data.token);
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
          // Fallback jika auto-login gagal
          setSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral/5">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-3xl">
            T
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
          Buat akun baru
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Masuk di sini
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-neutral/10">
          {success ? (
            <div className="text-center">
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-4 font-medium">
                Pendaftaran berhasil! Mengarahkan ke halaman login...
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleRegister}>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nama Lengkap
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-neutral/30 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-neutral/30 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent"
                    placeholder="budi@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-neutral/30 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Sekarang"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
