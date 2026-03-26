type SponsorshipHeroBannerProps = {
  projectTitle: string;
  summary?: string | null;
  participantsUrl?: string;
  pdfUrl?: string;
};

export function SponsorshipHeroBanner({
  projectTitle,
  summary,
  participantsUrl,
  pdfUrl,
}: SponsorshipHeroBannerProps) {
  const participants = (participantsUrl || '').trim();
  const pdf = (pdfUrl || '').trim();

  return (
    <header className="relative z-20 w-full border-b border-zinc-800/90 bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-40%,rgba(56,189,248,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" aria-hidden />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-7 px-4 py-8 sm:gap-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:justify-between md:gap-10 md:py-12 lg:px-10">
        <div className="flex min-w-0 flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6 md:items-center md:gap-8">
          <div className="shrink-0 rounded-xl border border-white/10 bg-zinc-900/60 px-5 py-2.5 shadow-lg shadow-black/20 backdrop-blur-sm sm:px-6 sm:py-3">
            <img src="/join_pr_logo_offical2.png" alt="Join PR" className="h-8 w-auto sm:h-10 md:h-11" />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400 sm:text-sm">
              Sponsorluk sunumu
            </p>
            <h1 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl md:text-3xl lg:text-[2rem]">
              {projectTitle}
            </h1>
            {summary ? (
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-white sm:text-lg">{summary}</p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 sm:justify-center md:justify-end">
          {participants ? (
            <a
              href={participants}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              Katılımcılar
            </a>
          ) : null}
          {pdf ? (
            <a
              href={pdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-zinc-500 bg-zinc-900/80 px-6 py-3 text-base font-semibold text-white transition hover:border-zinc-400 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
            >
              PDF indir
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
