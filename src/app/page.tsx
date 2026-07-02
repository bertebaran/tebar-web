import Link from "next/link";
import { MessageCircle, Zap, Shield, ArrowRight } from "lucide-react";

export default function Home() {
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
      </main>

      <footer className="bg-background border-t border-neutral/20 py-8 text-center text-neutral-500">
        <p>© {new Date().getFullYear()} tebar.io. All rights reserved.</p>
      </footer>
    </div>
  );
}
