"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  plan: string;
  broadcast_used: number;
  broadcast_limit: number;
  limit: number;
  expires_at: string | null;
}

const PLANS = [
  { id: "starter", name: "Starter", price: 50000, priceYearly: 500000, max_devices: 1, limit: 1000, days: 30, desc: "Cocok untuk pemula dan bisnis kecil" },
  { id: "business", name: "Business", price: 150000, priceYearly: 1500000, max_devices: 3, limit: 10000, days: 30, desc: "Cocok untuk UMKM dan toko online", recommended: true },
  { id: "pro", name: "Pro", price: 300000, priceYearly: 3000000, max_devices: 5, limit: 50000, days: 30, desc: "Untuk perusahaan dengan volume tinggi" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("tebar_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/supabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "heartbeat",
            payload: { token },
          }),
        });
        const data = await res.json();
        
        if (data.status && data.data?.user) {
          setUser(data.data.user);
        } else {
          localStorage.removeItem("tebar_token");
          router.push("/login");
        }
      } catch (err) {
        setError("Gagal memuat profil. Silakan muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleBuy = async (planId: string) => {
    const token = localStorage.getItem("tebar_token");
    if (!token) return;

    setPaymentLoading(planId);
    setError("");

    try {
      const res = await fetch("/api/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-payment",
          payload: { token, plan: planId },
        }),
      });

      const data = await res.json();
      if (data.status && data.data?.paymentUrl) {
        window.location.href = data.data.paymentUrl; // Redirect ke Duitku
      } else {
        setError(data.message || "Gagal membuat transaksi. Coba beberapa saat lagi.");
      }
    } catch (err) {
      setError("Kesalahan jaringan saat memproses pembayaran.");
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tebar_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral/5 pb-20">
      <nav className="bg-white text-neutral-900 border-b border-neutral/10 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="text-xl font-bold tracking-tight">tebar.io</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-600 hidden sm:block">
              Halo, {user?.name || user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Nudge Warning (Quota >= 80%) */}
        {user && ((user.broadcast_used / user.broadcast_limit) >= 0.8) && (
          <div className="mb-8 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
            <p className="font-medium">⚠️ Kuota broadcast Anda hampir habis! Segera perpanjang atau upgrade paket agar promosi tidak terhenti.</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white text-neutral-900 rounded-2xl shadow-sm border border-neutral/10 p-6 md:p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <h1 className="text-2xl font-bold mb-6">Status Langganan Anda</h1>
          
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-neutral/5 rounded-xl p-5 border border-neutral/10">
              <p className="text-sm text-neutral-500 mb-1 font-medium">Paket Aktif</p>
              <p className="text-2xl font-bold text-primary capitalize">{user?.plan}</p>
              {user?.expires_at && (
                <p className="text-xs text-neutral-500 mt-2">
                  Berakhir pd {format(new Date(user.expires_at), "dd MMM yyyy", { locale: id })}
                </p>
              )}
            </div>

            <div className="bg-neutral/5 rounded-xl p-5 border border-neutral/10">
              <p className="text-sm text-neutral-500 mb-1 font-medium">Pemakaian Kuota Broadcast</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">
                  {user?.broadcast_used || 0}
                </p>
                <p className="text-sm text-neutral-500 mb-1">/ {user?.broadcast_limit || 100}</p>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className="bg-[#FF9800] h-1.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, ((user?.broadcast_used || 0) / (user?.broadcast_limit || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-neutral/5 rounded-xl p-5 border border-neutral/10">
              <p className="text-sm text-neutral-500 mb-1 font-medium">Limit Nomor WA</p>
              <p className="text-2xl font-bold">
                Maksimal {user?.limit} Nomor
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Dipakai bersama dalam 1 akun
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Tingkatkan Performa Anda</h2>
          <p className="text-neutral-600 mb-8">Pilih paket yang sesuai dengan kebutuhan bisnis Anda.</p>
          
          <div className="inline-flex items-center gap-3 bg-white p-1.5 rounded-full border border-neutral/20 shadow-sm mx-auto">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isYearly ? 'bg-primary text-white shadow' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              Bulanan
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isYearly ? 'bg-primary text-white shadow' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              Tahunan
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${isYearly ? 'bg-white/20' : 'bg-green-100 text-green-700'}`}>Hemat 2 Bulan</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white text-neutral-900 rounded-2xl border ${plan.recommended ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/10' : 'border-neutral/20 shadow-sm'} p-8 relative flex flex-col`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF9800] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Paling Laris
                </div>
              )}
              
              <h3 className="text-xl font-bold capitalize mb-2">{plan.name}</h3>
              <p className="text-neutral-500 text-sm h-10">{plan.desc}</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold">Rp {isYearly ? plan.priceYearly.toLocaleString("id-ID") : plan.price.toLocaleString("id-ID")}</span>
                <span className="text-neutral-500"> / {isYearly ? 'tahun' : 'bulan'}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">Limit {plan.limit.toLocaleString("id-ID")} Broadcast</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">Maksimal {plan.max_devices} Nomor WA Terhubung</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">Jeda dinamis & Personalisasi</span>
                </li>
              </ul>
              
              <button
                onClick={() => handleBuy(isYearly ? `${plan.id}_yearly` : plan.id)}
                disabled={paymentLoading === (isYearly ? `${plan.id}_yearly` : plan.id)}
                className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${
                  plan.recommended 
                    ? 'bg-[#FF9800] text-white hover:bg-[#e68900] shadow-md' 
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {paymentLoading === (isYearly ? `${plan.id}_yearly` : plan.id) ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                  </>
                ) : (
                  user?.plan === plan.id || user?.plan === `${plan.id}_yearly` ? "Perpanjang Paket" : "Pilih Paket"
                )}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
