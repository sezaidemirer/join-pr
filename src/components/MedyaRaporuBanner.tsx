'use client';

import Link from 'next/link';

interface MedyaRaporuBannerProps {
  /** Marka veya rapor sayfasındaysa breadcrumb göster */
  brandName?: string;
  projectName?: string;
  brandSlug?: string;
}

export function MedyaRaporuBanner({ brandName, projectName, brandSlug }: MedyaRaporuBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-teal-500/15 via-sky-500/10 to-blue-600/10 px-6 py-8 sm:px-8 sm:py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.2),_transparent_50%)]" />
      <div className="mx-auto max-w-4xl">
        {(brandName || projectName) ? (
          <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <Link href="/medya-yansima-raporu" className="hover:text-teal-400 transition-colors">
              Medya Yansıma Raporu
            </Link>
            {brandName && brandSlug && (
              <>
                <span aria-hidden>/</span>
                {projectName ? (
                  <Link href={`/medya-yansima-raporu/${brandSlug}`} className="hover:text-teal-400 transition-colors">
                    {brandName}
                  </Link>
                ) : (
                  <span className="text-white">{brandName}</span>
                )}
              </>
            )}
            {projectName && (
              <>
                <span aria-hidden>/</span>
                <span className="text-white">{projectName}</span>
              </>
            )}
          </nav>
        ) : null}
        <h1 className={brandName || projectName ? 'mt-3 text-2xl font-semibold text-white sm:text-3xl' : 'text-2xl font-semibold text-white sm:text-3xl'}>
          {projectName ? projectName : brandName ? brandName : 'Medya Yansıma Raporu'}
        </h1>
        <p className="mt-1 text-zinc-400">
          {projectName
            ? 'Bu rapor için aşağıdaki içeriği görüntüleyebilirsiniz.'
            : brandName
              ? 'Marka ile ilgili haber yansıma raporlarını seçin.'
              : 'Markalarımız ile ilgili haber yansıma raporlarına aşağıdan erişebilirsiniz.'}
        </p>
      </div>
    </div>
  );
}
