import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getOfferByPath, inferProjectTypeFromBrandSlug } from '@/lib/offers';
import { listSponsorshipVideoUrls, parseSponsorshipNotes } from '@/lib/sponsorship-notes';
import { ProjectPhotoGallery } from '@/components/ProjectPhotoGallery';
import { ProjectVideoEmbed } from '@/components/ProjectVideoEmbed';
import { SponsorshipHeroBanner } from '@/components/SponsorshipHeroBanner';
import { SponsorshipPdfSlides } from '@/components/SponsorshipPdfSlides';

type PageParams = {
  params: {
    brand: string;
    date: string;
  };
};

type GalleryVideo = {
  url: string;
  title?: string;
  orientation?: 'horizontal' | 'vertical';
};

type GalleryPhoto = {
  url: string;
  caption?: string;
};

/** Ayni storage URL guncellense bile tarayici / CDN eski dosyayi vermesin. */
function cacheBustMediaUrl(url: string, token: string) {
  const u = (url || '').trim();
  if (!u || !token) return u;
  const sep = u.includes('?') ? '&' : '?';
  return `${u}${sep}cb=${encodeURIComponent(token)}`;
}

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

function isLikelyUrl(value?: string) {
  if (!value) return false;
  return /^https?:\/\//i.test(value) || value.includes('youtube.com') || value.includes('youtu.be');
}

function expandVideoItems(videos: GalleryVideo[]) {
  const expanded: GalleryVideo[] = [];
  for (const item of videos) {
    if (item?.url) expanded.push(item);
    // Backward compatibility: older mistaken saves may contain a second URL in title.
    if (item?.title && isYouTubeUrl(item.title)) {
      expanded.push({ url: item.title, orientation: item.orientation });
    }
  }
  return expanded;
}

function SponsorshipContentExamples({
  projectTitle,
  videoUrls,
  photoUrls,
}: {
  projectTitle: string;
  videoUrls: string[];
  photoUrls: string[];
}) {
  const videos = videoUrls.slice(0, 4).filter(Boolean);
  const photos = photoUrls.slice(0, 4);
  if (videos.length === 0 && photos.length === 0) return null;
  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
        <h2 className="mb-6 text-xl font-semibold text-zinc-100">Sponsorlu İçerik Örnekleri</h2>
        {videos.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-zinc-200">Video</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {videos.map((url, idx) => (
                <div key={`${idx}-${url}`} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70">
                  {isYouTubeUrl(url) ? (
                    <ProjectVideoEmbed
                      url={url}
                      title={`${projectTitle} Video ${idx + 1}`}
                      className="aspect-video"
                    />
                  ) : (
                    <video src={url} controls className="aspect-video w-full rounded-lg bg-black object-contain" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {photos.length > 0 ? (
          <div className={videos.length > 0 ? 'mt-8 space-y-3' : 'space-y-3'}>
            <h3 className="text-base font-semibold text-zinc-200">Fotoğraf</h3>
            <ProjectPhotoGallery photos={photos.map((src) => ({ url: src }))} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const offer = await getOfferByPath(params.brand, params.date);

  if (!offer) {
    return {
      title: 'Teklif Bulunamadi',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${offer.brand_name} - ${offer.project_title}`,
    description: offer.summary ?? undefined,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function OfferPublicPage({ params }: PageParams) {
  const offer = await getOfferByPath(params.brand, params.date);
  if (!offer) notFound();
  const projectType = inferProjectTypeFromBrandSlug(offer.brand_slug);

  if (projectType === 'sponsorship') {
    const sponsorship = parseSponsorshipNotes(offer.notes);
    const pdfUrl = (sponsorship.pdfUrl || '').trim();
    const slideUrls = sponsorship.slideUrls || [];
    const participantsUrl = (sponsorship.participantsUrl || '').trim();
    const sponsorshipVideoUrls = listSponsorshipVideoUrls(sponsorship);
    const sponsorshipPhotos = (sponsorship.photoUrls || []).slice(0, 4);
    const cacheToken = `${offer.updated_at || ''}-${offer.id || ''}`.trim() || offer.id || '1';

    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <SponsorshipHeroBanner
          projectTitle={offer.project_title}
          summary={offer.summary}
          participantsUrl={participantsUrl}
          pdfUrl={cacheBustMediaUrl(pdfUrl, cacheToken)}
        />
        {slideUrls.length > 0 ? (
          <div className="space-y-0">
            {slideUrls.map((src, idx) => (
              <section
                key={`${idx}-${src}`}
                className="relative border-b border-zinc-900 bg-zinc-950 md:flex md:min-h-screen md:items-center md:justify-center md:bg-black md:px-6 md:py-6"
              >
                <div className="w-full md:flex md:h-full md:items-center md:justify-center">
                  <img
                    src={src}
                    alt={`${offer.project_title} sayfa ${idx + 1}`}
                    className="mx-auto h-auto w-[92%] object-contain sm:w-[90%] md:w-auto md:max-h-[86vh] md:max-w-[80vw] md:rounded-md lg:max-w-[78vw]"
                  />
                </div>
                <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-[11px] tracking-wide text-zinc-200 sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
                  Sayfa {idx + 1} / {slideUrls.length}
                </span>
              </section>
            ))}
          </div>
        ) : pdfUrl ? (
          <SponsorshipPdfSlides
            pdfUrl={pdfUrl}
            cacheBust={cacheToken}
            projectTitle={offer.project_title}
          />
        ) : (
          <div className="mx-auto max-w-4xl px-6 py-12">
            <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-center text-zinc-400">
              PDF eklenmemis.
            </p>
          </div>
        )}
        <SponsorshipContentExamples
          projectTitle={offer.project_title}
          videoUrls={sponsorshipVideoUrls}
          photoUrls={sponsorshipPhotos.map((u) => cacheBustMediaUrl(u, cacheToken))}
        />
      </main>
    );
  }

  const photos = ((offer.photo_gallery ?? []) as GalleryPhoto[]).filter(
    (photo) => photo?.url && (photo.url.startsWith('/') || /^https?:\/\//i.test(photo.url))
  );
  const videos = expandVideoItems((offer.video_gallery ?? []) as GalleryVideo[]);
  const horizontalVideos = videos.filter((x) => (x.orientation || 'horizontal') === 'horizontal');
  const verticalVideos = videos.filter((x) => x.orientation === 'vertical');

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex justify-center">
          <img src="/join_pr_logo_offical2.png" alt="Join PR" className="h-10 w-auto opacity-95" />
        </div>

        <header className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Join PR - Projeniz Icin Dusunulen Ornek Icerikler
          </p>
          <h1 className="text-3xl font-semibold">{offer.project_title}</h1>
          <p className="text-zinc-300">
            <span className="font-medium">{offer.brand_name}</span> | {offer.offer_date}
          </p>
          {offer.summary ? <p className="text-zinc-200">{offer.summary}</p> : null}
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="mb-4 text-xl font-semibold">Ornek Icerikler</h2>
          <ul className="list-disc space-y-2 pl-5 text-zinc-200">
            {(offer.sample_contents ?? []).map((item, idx) => (
              <li key={`${idx}-${item.slice(0, 20)}`}>{item}</li>
            ))}
            {(offer.sample_contents ?? []).length === 0 ? (
              <li className="text-zinc-500">Henuz icerik eklenmedi.</li>
            ) : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="mb-4 text-xl font-semibold">Foto Galeri</h2>
          {photos.length === 0 ? (
            <p className="text-zinc-500">Henuz foto galeri eklenmedi.</p>
          ) : (
            <ProjectPhotoGallery photos={photos} />
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="mb-4 text-xl font-semibold">Yatay Video Galeri</h2>
          {horizontalVideos.length === 0 ? (
            <p className="text-zinc-500">Henuz yatay video eklenmedi.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {horizontalVideos.map((video, idx) => (
                <div key={`h-${idx}-${video.url}`} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70">
                  <ProjectVideoEmbed
                    url={video.url}
                    title={video.title || `Yatay Video ${idx + 1}`}
                    className="h-56"
                  />
                  {video.title && !isLikelyUrl(video.title) ? (
                    <p className="px-3 py-2 text-sm text-zinc-200">{video.title}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="mb-4 text-xl font-semibold">Dikey Video Galeri</h2>
          {verticalVideos.length === 0 ? (
            <p className="text-zinc-500">Henuz dikey video eklenmedi.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {verticalVideos.map((video, idx) => (
                <div
                  key={`v-${idx}-${video.url}`}
                  className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70"
                >
                  <ProjectVideoEmbed
                    url={video.url}
                    title={video.title || `Dikey Video ${idx + 1}`}
                    className="aspect-[9/16]"
                  />
                  {video.title && !isLikelyUrl(video.title) ? (
                    <p className="px-3 py-2 text-sm text-zinc-200">{video.title}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        {offer.notes ? (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="mb-4 text-xl font-semibold">Notlar</h2>
            <p className="whitespace-pre-wrap text-zinc-200">{offer.notes}</p>
          </section>
        ) : null}

        <div className="flex justify-center pt-2">
          <a
            href="https://www.canva.com/design/DAG9Tr_az1w/AoG7e612B38ZkmhqxVRgtg/edit?utm_content=DAG9Tr_az1w&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Sponsorluk Icin Tiklayiniz
          </a>
        </div>
      </div>
    </main>
  );
}

