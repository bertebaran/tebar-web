"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function ReturnContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isSuccess = status === "success";
  const isPending = status === "pending";

  return (
    <div className="min-h-screen bg-neutral/5 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl text-center border border-neutral/10">
        
        {isSuccess ? (
          <>
            <div className="w-20 h-20 bg-indigo-100 text-[#4F46E5] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-neutral-600 mb-6">
              Terima kasih! Pembayaran Anda telah kami terima dan paket Anda sedang diaktifkan.
            </p>
          </>
        ) : isPending ? (
          <>
            <div className="w-20 h-20 bg-amber-100 text-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Menunggu Pembayaran</h1>
            <p className="text-neutral-600 mb-6">
              Silakan selesaikan instruksi pembayaran yang telah diberikan. Kami sedang menunggu konfirmasi pembayaran Anda.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Status Tidak Dikenal</h1>
            <p className="text-neutral-600 mb-6">
              Maaf, kami tidak dapat memverifikasi status pembayaran ini secara langsung.
            </p>
          </>
        )}

        <div className="bg-neutral-50 rounded-xl p-4 mb-8 text-sm text-neutral-500 border border-neutral-100">
          <p>
            <strong>Catatan:</strong> Status final langganan Anda selalu mengikuti informasi resmi di Dashboard. Proses aktivasi sistem mungkin membutuhkan waktu beberapa menit.
          </p>
        </div>

        <Link 
          href="/dashboard" 
          className="inline-flex w-full items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 px-6 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-700/20"
        >
          Ke Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral/5"><div className="w-8 h-8 animate-spin border-4 border-[#4F46E5] border-t-transparent rounded-full"></div></div>}>
      <ReturnContent />
    </Suspense>
  );
}
