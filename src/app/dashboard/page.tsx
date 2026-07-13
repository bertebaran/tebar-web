"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, LogOut, X, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Script from "next/script";

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

type Plan = { id: string; name: string; price: number; priceText: string; period: string; max_devices: number; limitText: string; desc: string; recommended?: boolean; free?: boolean };

const PLANS: Plan[] = [
  { id: "gratis", name: "Gratis", price: 0, priceText: "Rp 0", period: "selamanya", max_devices: 1, limitText: "10 Nomor / hari", desc: "Cocok untuk mencoba tebar.io", free: true },
  { id: "1bulan", name: "1 Bulan", price: 25000, priceText: "Rp 25.000", period: "bulan", max_devices: 5, limitText: "Unlimited Kirim Pesan", desc: "Berlangganan bulanan fleksibel" },
  { id: "1tahun", name: "1 Tahun", price: 199000, priceText: "Rp 199.000", period: "tahun", max_devices: 5, limitText: "Unlimited Kirim Pesan", desc: "Lebih hemat untuk jangka panjang", recommended: true },
  { id: "lifetime", name: "Lifetime", price: 549000, priceText: "Rp 549.000", period: "selamanya", max_devices: 5, limitText: "Unlimited Kirim Pesan", desc: "Bayar sekali, pakai seumur hidup" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{ dailySent: number } | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
          return;
        }

        const resStats = await fetch("/api/supabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "stats", payload: { token } }),
        });
        const dataStats = await resStats.json();
        if (dataStats.status && dataStats.data) {
          setStats(dataStats.data);
        }
      } catch (err) {
        setError("Gagal memuat profil. Silakan muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleBuy = (planId: string) => {
    setCheckoutPlan(planId);
  };

  const handleProcessPayment = async () => {
    if (!checkoutPlan) return;
    const token = localStorage.getItem("tebar_token");
    if (!token) return;

    setIsProcessingPayment(true);
    setError("");

    try {
      const res = await fetch("/api/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-payment",
          payload: { token, plan: checkoutPlan },
        }),
      });

      const json = await res.json();
      const ref = json?.data?.reference;
      
      if (!ref) {
        alert(json?.message || "Gagal memulai pembayaran");
        setIsProcessingPayment(false);
        return;
      }

      // Tutup modal checkout branded kita
      setCheckoutPlan(null);
      setIsProcessingPayment(false);

      // Panggil popup Duitku
      (window as any).checkout.process(ref, {
        defaultLanguage: "id",
        successEvent: () => { window.location.href = "/payment/return?status=success"; },
        pendingEvent: () => { window.location.href = "/payment/return?status=pending"; },
        errorEvent:   () => { alert("Pembayaran gagal. Silakan coba lagi."); },
        closeEvent:   () => { /* user menutup popup tanpa bayar */ },
      });

    } catch (err) {
      alert("Kesalahan jaringan saat memproses pembayaran.");
      setIsProcessingPayment(false);
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
            <img src="/tebar-logo-horizontal.svg" alt="tebar.io" className="h-8 w-auto" />
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

        {/* Nudge Warning (Quota >= 80%) — hanya utk paket berlimit (bukan Unlimited) */}
        {user && user.broadcast_limit > 0 && user.broadcast_limit < 100000 && ((user.broadcast_used / user.broadcast_limit) >= 0.8) && (
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
              {user && user.broadcast_limit > 0 && user.broadcast_limit < 100000 ? (
                <>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">{user?.broadcast_used || 0}</p>
                    <p className="text-sm text-neutral-500 mb-1">/ {user?.broadcast_limit}</p>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div
                      className="bg-[#F59E0B] h-1.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, ((user?.broadcast_used || 0) / (user?.broadcast_limit || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <p className="text-2xl font-bold text-primary">Tak terbatas</p>
              )}
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

        {/* Analytics Card */}
        <div className="bg-white text-neutral-900 rounded-2xl shadow-sm border border-neutral/10 p-6 md:p-8 mb-10 relative overflow-hidden">
          <h2 className="text-2xl font-bold mb-6">Analytics (Hari Ini)</h2>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div className="bg-neutral/5 rounded-xl p-5 border border-neutral/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1 font-medium">Total Terkirim</p>
                <p className="text-3xl font-bold text-primary">{stats?.dailySent || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-neutral/5 rounded-xl p-5 border border-neutral/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1 font-medium">Sisa Kuota Harian (Batas Wajar)</p>
                <p className="text-3xl font-bold text-amber-500">Normal</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Investasi Terbaik untuk Bisnis Anda</h2>
          <p className="text-neutral-600">Mulai dari gratis, tingkatkan kapan saja sesuai dengan perkembangan bisnis Anda.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PLANS.map((plan) => {
            const isActive = user?.plan === plan.id;
            return (
            <div
              key={plan.id}
              className={`bg-white text-neutral-900 rounded-2xl border ${plan.recommended ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/10' : 'border-neutral/20 shadow-sm'} p-8 relative flex flex-col`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#3A2600] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Paling Populer
                </div>
              )}

              <h3 className="text-xl font-bold capitalize mb-2">{plan.name}</h3>
              <p className="text-neutral-500 text-sm h-10">{plan.desc}</p>

              <div className="my-6">
                <span className="text-3xl font-extrabold">{plan.priceText}</span>
                <span className="text-neutral-500"> / {plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{plan.limitText}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">Maksimal {plan.max_devices} Nomor WA</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">Jeda Dinamis & Personalisasi</span>
                </li>
              </ul>

              <button
                onClick={() => { if (!plan.free) handleBuy(plan.id); }}
                disabled={plan.free || isActive}
                className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${
                  plan.recommended
                    ? 'bg-[#F59E0B] text-[#3A2600] hover:bg-[#D97706] shadow-md'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isActive ? "Paket Aktif" : plan.free ? "Paket Gratis" : "Pilih Paket"}
              </button>
            </div>
            );
          })}
        </div>
      </main>

      {/* Branded Checkout Modal */}
      {checkoutPlan && (() => {
        const plan = PLANS.find(p => p.id === checkoutPlan);

        if (!plan) return null;
        
        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              
              <div className="bg-[#4F46E5] p-6 text-white relative">
                <button onClick={() => setCheckoutPlan(null)} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">T</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">tebar.io Checkout</h3>
                </div>
                <p className="text-indigo-100/80 text-sm">Selesaikan pembayaran untuk mengaktifkan paket Anda.</p>
              </div>
              
              <div className="p-6">
                <div className="bg-neutral/5 rounded-xl p-4 border border-neutral/10 mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">Paket Terpilih</p>
                      <h4 className="text-xl font-bold text-neutral-900 capitalize">{plan.name} <span className="text-sm font-normal text-neutral-500">({plan.period})</span></h4>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-[#F59E0B]">
                        {plan.priceText}
                      </p>
                    </div>
                  </div>
                  <hr className="border-neutral/10 my-3" />
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4F46E5]" /> {plan.limitText}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4F46E5]" /> Maks. {plan.max_devices} Nomor Terhubung</li>
                  </ul>
                </div>
                
                <button 
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#3A2600] py-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sedang Memproses...</>
                  ) : "Bayar Sekarang"}
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Pembayaran aman via <strong>Duitku</strong></span>
                </div>
              </div>
              
            </div>
          </div>
        );
      })()}

      {process.env.NEXT_PUBLIC_DUITKU_ENV === 'sandbox' ? (
        <Script src="https://app-sandbox.duitku.com/lib/js/duitku.js" strategy="afterInteractive" />
      ) : (
        <Script src="https://app-prod.duitku.com/lib/js/duitku.js" strategy="afterInteractive" />
      )}
    </div>
  );
}
