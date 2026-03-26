'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hataları logla (isteğe bağlı)
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="mb-4">
        <Link href="/" className="inline-block">
          <Image
            src="/join_pr_logo_offical2.png"
            alt="Join PR Logo"
            width={200}
            height={80}
            className="h-auto w-auto"
            priority
            unoptimized
          />
        </Link>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-white md:text-5xl">Hata</h1>
        <p className="max-w-md text-lg text-zinc-300 md:text-xl">
          Üzgünüz, şu an web sitemizde geçici bir sorun yaşıyoruz.
        </p>
        <p className="max-w-md text-base text-zinc-400 md:text-lg">
          Lütfen sayfayı yenileyin. Eğer sorun giderilmezse bir kaç dakika sonra tekrar deneyin.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:border-white/40 text-center"
        >
          Ana Sayfaya Dön
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:border-white/40"
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  );
}
