'use client';

/**
 * Root-level error boundary. Next.js "missing required error components" hatasını
 * önlemek için gerekli. Root layout'taki hataları yakalar.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-zinc-950 text-white antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
          <h1 className="text-4xl font-semibold text-white">Hata</h1>
          <p className="max-w-md text-lg text-zinc-300">
            Üzgünüz, bir sorun oluştu. Lütfen sayfayı yenileyin.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white"
            >
              Tekrar Dene
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="rounded-full border border-white/20 px-6 py-3 text-sm text-white"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
