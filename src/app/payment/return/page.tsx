"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

function ReturnContent() {
  const searchParams = useSearchParams();
  const merchantOrderId = searchParams.get("merchantOrderId");
  const resultCode = searchParams.get("resultCode");
  
  // Duitku resultCode: "00" = Success, "01" = Pending, etc.
  const isSuccess = resultCode === "00";
  const isPending = resultCode === "01";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-neutral/5 border border-neutral/10 w-full max-w-md text-center">
      <div className="flex justify-center mb-6">
        {isSuccess ? (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        ) : isPending ? (
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
            <Clock className="w-10 h-10" />
          </div>
        ) : (
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <XCircle className="w-10 h-10" />
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-2">
        {isSuccess ? "Pembayaran Berhasil" : isPending ? "Menunggu Pembayaran" : "Pembayaran Gagal"}
      </h1>
      
      <p className="text-neutral-500 mb-8">
        {isSuccess 
          ? "Terima kasih! Pembayaran Anda telah kami terima dan paket langganan Anda sedang diaktifkan." 
          : isPending 
          ? "Silakan selesaikan instruksi pembayaran Anda. Paket akan otomatis aktif setelah pembayaran dikonfirmasi."
          : "Maaf, transaksi Anda tidak dapat diproses atau telah dibatalkan."}
      </p>

      {merchantOrderId && (
        <div className="bg-neutral/5 p-4 rounded-xl mb-8">
          <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">ID Transaksi</p>
          <p className="font-mono text-sm">{merchantOrderId}</p>
        </div>
      )}

      <Link 
        href="/dashboard" 
        className="block w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <div className="min-h-screen bg-neutral/5 flex items-center justify-center p-4">
      <Suspense fallback={<div className="animate-pulse w-full max-w-md h-96 bg-white rounded-2xl"></div>}>
        <ReturnContent />
      </Suspense>
    </div>
  );
}
