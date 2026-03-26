import type { Metadata } from 'next';

const pageImages = Array.from({ length: 6 }, (_, i) => ({
  page: i + 1,
  src: `/royal-saray-resort-bahrain/page-${String(i + 1).padStart(2, '0')}.jpg`,
}));

export const metadata: Metadata = {
  title: 'Royal Saray Resort Bahrain Sunumu',
  description: 'Royal Saray Resort Bahrain - 6 sayfalik sunumun web versiyonu.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RoyalSarayResortBahrainPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="space-y-0">
        {pageImages.map((page) => (
          <section
            key={page.src}
            className={`relative border-b border-zinc-900 bg-zinc-950 md:flex md:min-h-screen md:items-center md:justify-center md:bg-black md:px-6 md:py-6 ${
              page.page === 1 ? 'pt-40 sm:pt-44 md:pt-48 lg:pt-52' : ''
            }`}
          >
            {page.page === 1 ? (
              <div className="absolute left-1/2 top-3 z-10 w-[92%] max-w-3xl -translate-x-1/2 rounded-xl border border-zinc-700/60 bg-black/55 px-4 py-3 text-center backdrop-blur-sm sm:top-4">
                <img src="/join_pr_logo_offical2.png" alt="Join PR" className="mx-auto h-7 w-auto sm:h-8" />
                <p className="mt-2 text-sm font-semibold text-zinc-100 sm:text-base">Royal Saray Resort Bahrain</p>
                <p className="text-[11px] text-zinc-300 sm:text-xs">Celebrity Marketing Presentation</p>
              </div>
            ) : null}

            <div className="w-full md:flex md:h-full md:items-center md:justify-center">
              <img
                src={page.src}
                alt={`Royal Saray PDF Sayfa ${page.page}`}
                className="h-auto w-full object-contain md:max-h-[92vh] md:w-auto md:max-w-full md:rounded-md"
              />
            </div>
            <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-[11px] tracking-wide text-zinc-200 sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
              Sayfa {page.page} / 6
            </span>
          </section>
        ))}
      </div>
    </main>
  );
}

