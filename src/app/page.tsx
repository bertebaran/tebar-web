"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Zap, Shield, ArrowRight } from "lucide-react";

const PLANS = [
  { id: "starter", name: "Starter", price: 50000, priceYearly: 500000, max_devices: 1, limit: 1000, desc: "Cocok untuk pemula dan bisnis kecil" },
  { id: "business", name: "Business", price: 150000, priceYearly: 1500000, max_devices: 3, limit: 10000, desc: "Cocok untuk UMKM dan toko online", recommended: true },
  { id: "pro", name: "Pro", price: 300000, priceYearly: 3000000, max_devices: 5, limit: 50000, desc: "Untuk perusahaan dengan volume tinggi" },
];

export default function Home() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-neutral/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="text-xl font-bold tracking-tight">tebar.io</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium">Platform Broadcast WhatsApp No. 1</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-neutral-800 dark:text-neutral-100">
              Kirim Pesan Massal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Lebih Mudah & Cepat
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-10">
              Tingkatkan omset bisnis Anda dengan tebar.io. Kirim pesan promosi ke ribuan pelanggan dalam hitungan menit secara otomatis tanpa takut terblokir.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/register" 
                className="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
              >
                Mulai Sekarang Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-neutral/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan tebar.io</h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Semua yang Anda butuhkan untuk mengelola broadcast WhatsApp dengan aman dan efisien.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-accent" />,
                  title: "Kirim Super Cepat",
                  desc: "Sistem pengiriman otomatis yang dioptimalkan untuk kecepatan dan efisiensi waktu Anda."
                },
                {
                  icon: <Shield className="w-8 h-8 text-primary" />,
                  title: "Anti Banned",
                  desc: "Dilengkapi fitur jeda dinamis dan pengaturan delay cerdas untuk meminimalkan risiko blokir."
                },
                {
                  icon: <MessageCircle className="w-8 h-8 text-neutral" />,
                  title: "Personalisasi Pesan",
                  desc: "Sapa pelanggan Anda dengan nama mereka untuk interaksi yang lebih personal dan konversi tinggi."
                }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-2xl bg-background border border-neutral/10 shadow-lg shadow-neutral/5 hover:shadow-xl transition-shadow group">
                  <div className="w-14 h-14 rounded-xl bg-neutral/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Investasi Terbaik untuk Bisnis Anda</h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
                Mulai dari gratis, tingkatkan kapan saja sesuai dengan perkembangan bisnis Anda.
              </p>
              
              <div className="inline-flex items-center gap-3 bg-neutral/5 p-1.5 rounded-full border border-neutral/10 shadow-sm mx-auto">
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
                  className={`bg-background rounded-2xl border ${plan.recommended ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/10' : 'border-neutral/10 shadow-sm'} p-8 relative flex flex-col hover:shadow-xl transition-shadow`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Paling Populer
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
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm font-medium">Limit {plan.limit.toLocaleString("id-ID")} Broadcast</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm font-medium">Maksimal {plan.max_devices} Nomor WA</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm font-medium">Jeda Dinamis & Personalisasi</span>
                    </li>
                  </ul>
                  
                  <Link
                    href="/register"
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all text-center ${
                      plan.recommended 
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg' 
                        : 'bg-neutral/10 text-neutral-800 hover:bg-neutral/20'
                    }`}
                  >
                    Mulai Gratis
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-neutral-500 mt-8">
              Tidak perlu kartu kredit. Langsung dapat 100 limit gratis selamanya.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-neutral/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h2>
            </div>
            <div className="space-y-6">
              {[
                { q: "Apakah akun WhatsApp saya aman dari blokir?", a: "Sistem kami menggunakan algoritma jeda dinamis (delay antar pesan yang natural) sehingga meminimalkan risiko blokir. Namun, kami tetap menyarankan untuk tidak mengirim pesan spam dan mematuhi pedoman WhatsApp." },
                { q: "Apakah ada batasan waktu untuk paket Gratis?", a: "Tidak ada! Paket Free berlaku selamanya. Anda bisa menggunakannya untuk mengetes sistem, dan baru upgrade ketika bisnis Anda sudah membutuhkan limit yang lebih besar." },
                { q: "Bagaimana cara pembayarannya?", a: "Kami mendukung berbagai metode pembayaran melalui Duitku, termasuk QRIS, Virtual Account bank besar, e-Wallet, dan kartu kredit. Pembayaran akan terkonfirmasi secara otomatis." }
              ].map((faq, i) => (
                <div key={i} className="bg-background rounded-2xl p-6 shadow-sm border border-neutral/10">
                  <h4 className="text-lg font-bold mb-2">{faq.q}</h4>
                  <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-neutral/20 py-8 text-center text-neutral-500">
        <p>© {new Date().getFullYear()} tebar.io. All rights reserved.</p>
      </footer>
    </div>
  );
}
