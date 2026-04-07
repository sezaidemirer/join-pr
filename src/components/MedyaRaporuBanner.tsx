'use client';

import Link from 'next/link';

interface MedyaRaporuBannerProps {
  /** Marka veya rapor sayfasındaysa breadcrumb göster */
  brandName?: string;
  projectName?: string;
  brandSlug?: string;
  logoUrl?: string | null;
  /** Alt marka rapor listesi sayfası: sağdaki logo ~%10 büyük */
  subBrandReportList?: boolean;
}

/** AJet logosu kutu içinde zaten geniş; %30 büyütme taşma yapar. */
function skipBannerLogoUpscale(logoUrl: string, brandName?: string, projectName?: string): boolean {
  if (logoUrl.toLowerCase().includes('ajet')) return true;
  const labels = `${brandName || ''} ${projectName || ''}`.toLowerCase();
  return /\bajet\b/.test(labels);
}

export function MedyaRaporuBanner({
  brandName,
  projectName,
  brandSlug,
  logoUrl,
  subBrandReportList = false,
}: MedyaRaporuBannerProps) {
  const noUpscale = logoUrl ? skipBannerLogoUpscale(logoUrl, brandName, projectName) : true;
  const logoScaleClass = subBrandReportList
    ? noUpscale
      ? 'max-h-full max-w-full scale-[1.936] object-contain'
      : 'max-h-full max-w-full origin-center scale-[2.42] object-contain'
    : noUpscale
      ? 'max-h-full max-w-full scale-[1.6] object-contain'
      : 'max-h-full max-w-full origin-center scale-[2] object-contain';
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-teal-500/15 via-sky-500/10 to-blue-600/10 px-6 py-8 sm:px-8 sm:py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.2),_transparent_50%)]" />
      <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
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
          {!projectName ? (
            <p className="mt-1 text-zinc-400">
              {brandName
                ? 'Marka ile ilgili haber yansıma raporlarını seçin.'
                : 'Markalarımız ile ilgili haber yansıma raporlarına aşağıdan erişebilirsiniz.'}
            </p>
          ) : null}
        </div>

        {logoUrl ? (
          <div className="mt-1 hidden h-[4.5rem] w-[7.5rem] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white px-3 py-2 sm:flex sm:h-24 sm:w-40 sm:px-4 sm:py-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt={projectName || brandName || 'Logo'} className={logoScaleClass} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
