'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

function PlaceholderAvatar({ size = 48 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-dashed border-zinc-500 bg-zinc-800/60 text-zinc-500"
      style={{ width: size, height: size }}
    >
      <span className="text-xl">?</span>
    </div>
  );
}

function CreatorAvatar({ name, imagePath, size = 48 }: { name: string; imagePath?: string; size?: number }) {
  if (imagePath) {
    return (
      <div className="relative shrink-0 overflow-hidden rounded-full bg-zinc-800" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagePath} alt={name} width={size} height={size} className="h-full w-full object-cover" />
      </div>
    );
  }
  return <PlaceholderAvatar size={size} />;
}

function VideoWithFirstFrame({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isVimeo = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+)/i.test(src);
  const baseVimeoSrc = isVimeo
    ? /player\.vimeo\.com\/video\/\d+/i.test(src)
      ? src
      : src.replace(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+).*/i, 'https://player.vimeo.com/video/$1')
    : '';
  const vimeoEmbedSrc = baseVimeoSrc
    ? `${baseVimeoSrc}${baseVimeoSrc.includes('?') ? '&' : '?'}badge=0&title=0&byline=0&portrait=0&dnt=1`
    : '';

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const captureFrame = () => {
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx || video.readyState < 2) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        setPosterReady(true);
      } catch {
        setPosterReady(false);
      }
    };

    const onSeeked = () => captureFrame();
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onLoaded = () => {
      video.currentTime = 0.5;
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('loadeddata', onLoaded);
    video.preload = 'metadata';
    if (video.readyState >= 2) video.currentTime = 0.5;

    return () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [src]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const t = Number(e.target.value);
    v.currentTime = t;
    setCurrentTime(t);
  };

  const controlsBar = (
    <>
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded text-white/90 hover:text-white"
        aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
      >
        {isFullscreen ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1 pt-6">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-white/90 hover:text-white"
          aria-label={playing ? 'Duraklat' : 'Oynat'}
        >
          {playing ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-white/90 hover:text-white"
          aria-label={muted ? 'Sesi aç' : 'Sesi kapat'}
        >
          {muted ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M11.293 4.293a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
        <input type="range" min={0} max={duration || 100} value={currentTime} onChange={onSeek} className="h-1 flex-1 min-w-0 accent-white" />
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={isFullscreen ? 'flex min-h-screen min-w-full items-center justify-center bg-black' : 'relative h-full w-full bg-black'}
    >
      <div className={isFullscreen ? 'relative h-full max-h-[100vh] w-auto max-w-full shrink-0 aspect-[9/16]' : 'relative h-full w-full'}>
        {isVimeo ? (
          <iframe
            src={vimeoEmbedSrc}
            className={`h-full w-full ${className ?? ''}`}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            title="Vimeo video"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={src}
              playsInline
              preload="metadata"
              muted={muted}
              onClick={togglePlay}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              className={`h-full w-full object-cover ${className ?? ''}`}
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{ display: posterReady && !playing ? 'block' : 'none' }}
              aria-hidden
            />
            {controlsBar}
          </>
        )}
      </div>
    </div>
  );
}

function FeaturedContentCell({ src, label }: { src?: string; label: string }) {
  const safeSrc = src
    ? src.startsWith('/')
      ? src
          .split('/')
          .map((part, index) => (index === 0 ? part : encodeURIComponent(part)))
          .join('/')
      : src
    : undefined;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
        <div className="aspect-[9/16] w-full">
          {safeSrc ? (
            <VideoWithFirstFrame src={safeSrc} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-900/80 px-3 text-center">
              <span className="text-xs text-zinc-500">Video</span>
              <span className="text-[11px] leading-tight text-zinc-400">{label}</span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-sm font-medium text-white">{label}</p>
    </div>
  );
}

/** public/pronto-influencer — profil dosya adları diske birebir (NFD ö, Türkçe ı) */
const PRONTO = '/pronto-influencer';
const PRONTO_FACE = {
  muratAygen: `${PRONTO}/murat_aygen.jpg`,
  emreKivilcim: `${PRONTO}/emre_kivilcim.jpg`,
  serhatOzcan: `${PRONTO}/serhat_o\u0308zcan.jpg`,
  aslihanKaralar: `${PRONTO}/aslihan_karalar.png`,
  tuvaUnal: `${PRONTO}/tuva_unal.jpg`,
  bilalYigitKocak: `${PRONTO}/bilal_yigit_kocak.jpg`,
  ferideHilalAkin: `${PRONTO}/feride_hilal_ak\u0131n.jpg`,
  feyyazYigit: `${PRONTO}/feyyaz_yigit.jpg`,
  barisYildiz: `${PRONTO}/baris_yildiz.jpg`,
  sercanBadur: `${PRONTO}/sercan_badur.jpg`,
  yasmine: `${PRONTO}/yasmin.jpg`,
  yelizYesilmen: `${PRONTO}/yeliz_yesilmen.jpg`,
  yagizCanKonyali: `${PRONTO}/yagiz_can_konyali.jpg`,
  firatAlbayram: `${PRONTO}/firat_albayram.jpg`,
  melisGur: `${PRONTO}/melis_gur.jpg`,
  nazCaglaIrmak: `${PRONTO}/naz_cagla_irmak.jpg`,
  selinSekerci: `${PRONTO}/selin_sekerci.jpg`,
  ilkerYasar: `${PRONTO}/ilker_yasar.jpg`,
  evrimErtekinErgun: `${PRONTO}/evrim_ertekin_ergu\u0308n.jpg`,
  gozdeKaya: `${PRONTO}/go\u0308zde_kaya.jpg`,
} as const;

// Prontotour.pdf – katılımcı ve ünlü isim pazarlama performans özeti
const PRONTOTOUR_KPIS = {
  posts: 661,
  influencers: 69,
  engagement: '5.59M',
  value: '$6.8M',
};

const PRONTOTOUR_PERFORMANCE = {
  posts: 661,
  creators: 69,
  views: '58.23M',
  engagements: '5.59M',
  engagementRate: '2.32%',
  reach: '43.45M',
  emv: '$6.8M',
  followers: '62.9M',
  shares: '31.87K',
  likes: '5.45M',
  comments: '112.22K',
  dateRange: '14 Nis 2023 – 14 Kas 2025',
};

const PRONTOTOUR_CREATORS = [
  {
    name: 'Gizem Güneş',
    handle: 'gizemgunes',
    image: '/rixos-infleuncers/gizem_gunes.webp',
    posts: '44',
    views: '10.67M',
    engagementRate: '1.23%',
    reach: '8.63M',
    emv: '$1.2M',
    comments: '43.4K',
  },
  {
    name: 'Gökberk Demirci',
    handle: 'gokberkdemirci',
    image: '/rixos-infleuncers/gokberk_demirci.webp',
    posts: '8',
    views: '6.77M',
    engagementRate: '10.31%',
    reach: '3M',
    emv: '$278.5K',
    comments: '25.96K',
  },
  {
    name: 'Gökhan Alkan',
    handle: 'gokhanalkan',
    image: '/rixos-infleuncers/gokhan_alkan.webp',
    posts: '41',
    views: '4.85M',
    engagementRate: '3.86%',
    reach: '2.93M',
    emv: '$675.1K',
    comments: '14.48K',
  },
  {
    name: 'Barış Baktaş',
    handle: 'barisbaktas',
    image: '/rixos-infleuncers/baris_baktas.webp',
    posts: '9',
    views: '3.36M',
    engagementRate: '13.1%',
    reach: '2.51M',
    emv: '$464.2K',
    comments: '30.66K',
  },
  {
    name: 'Çağla Şimşek',
    handle: 'caglasimsek',
    image: '/rixos-infleuncers/cagla_simsek.webp',
    posts: '7',
    views: '3.19M',
    engagementRate: '3.29%',
    reach: '2.25M',
    emv: '$213.7K',
    comments: '38.97K',
  },
  {
    name: 'Gökçe Akyıldız',
    handle: 'gokceakyildiz',
    image: '/rixos-infleuncers/gokce_akyildiz.webp',
    posts: '2',
    views: '2.32M',
    engagementRate: '3.83%',
    reach: '1.73M',
    emv: '$187.8K',
    comments: '60K',
  },
];

const PRONTOTOUR_FEATURED_CONTENT: { src?: string; label: string }[] = [
  { src: 'https://player.vimeo.com/video/1178990184?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Prontotour' },
  { src: 'https://player.vimeo.com/video/1178988925?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Gökberk Demirci' },
  { src: 'https://player.vimeo.com/video/1178986645?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Didem Balçın' },
];

type ParticipatingInfluencer = { name: string; imagePath?: string };

const PRONTOTOUR_ALL_INFLUENCERS: ParticipatingInfluencer[] = [
  { name: 'Gizem Güneş', imagePath: '/rixos-infleuncers/gizem_gunes.webp' },
  { name: 'Gökberk Demirci', imagePath: '/rixos-infleuncers/gokberk_demirci.webp' },
  { name: 'Gökhan Alkan', imagePath: '/rixos-infleuncers/gokhan_alkan.webp' },
  { name: 'Barış Baktaş', imagePath: '/rixos-infleuncers/baris_baktas.webp' },
  { name: 'Çağla Şimşek', imagePath: '/rixos-infleuncers/cagla_simsek.webp' },
  { name: 'Gökçe Akyıldız', imagePath: '/rixos-infleuncers/gokce_akyildiz.webp' },
  { name: 'Gökberk Yıldırım', imagePath: '/rixos-infleuncers/gokberk_yildirim.webp' },
  { name: 'Yıldız Çağrı Atiksoy', imagePath: '/rixos-infleuncers/yildiz_cagri_atiksoy.webp' },
  { name: 'Naz Çağla Irmak', imagePath: PRONTO_FACE.nazCaglaIrmak },
  { name: 'Nurdan Gürel', imagePath: '/ajet-influencers/nurdan_gurel.webp' },
  { name: 'Berk Ali Çatal', imagePath: '/rixos-infleuncers/berk_ali_catal.webp' },
  { name: 'Lilya İrem Salman', imagePath: '/rixos-infleuncers/lilya_irem.webp' },
  { name: 'Baran Bölükbaşı', imagePath: '/rixos-infleuncers/baran_bolukbasi.webp' },
  { name: 'İlayda Ildır', imagePath: '/rixos-infleuncers/ilayda_ildir.webp' },
  { name: 'Didem Balçın', imagePath: '/rixos-infleuncers/didem_balcin_aydin.webp' },
  { name: 'Nilsu Yılmaz', imagePath: '/rixos-infleuncers/Nilsu_yilmaz.webp' },
  { name: 'Rojda Demirer', imagePath: '/rixos-infleuncers/rojda_demirer.webp' },
  { name: 'Emre Bulut', imagePath: '/rixos-infleuncers/emre_bulut.webp' },
  { name: 'Melisadogu', imagePath: '/rixos-infleuncers/melisa_dogu.webp' },
  { name: 'Gülhan Şen', imagePath: '/pronto-influencer/gülhan_şen.jpg' },
  { name: 'Erdem Kaynarca', imagePath: '/rixos-infleuncers/erdem_kaynarca.webp' },
  { name: 'Cemre Arda', imagePath: '/rixos-infleuncers/cemre_arda.webp' },
  { name: 'Burcu Kara', imagePath: '/rixos-infleuncers/burcu_kara.webp' },
  { name: 'Burak Çelik', imagePath: '/rixos-infleuncers/burak_celik.webp' },
  { name: 'Nesrin Cavadzade', imagePath: '/rixos-infleuncers/nesrin_cavadzade.webp' },
  { name: 'Gizem Yüksel', imagePath: '/ajet-influencers/gizem-yuksel.webp' },
  { name: 'Damla Can', imagePath: '/ajet-influencers/damla_can.webp' },
  { name: 'Müjde Uzman', imagePath: '/rixos-infleuncers/mujde_uzman.webp' },
  { name: 'Sitare Akbaş', imagePath: '/rixos-infleuncers/sitare_akbas.webp' },
  { name: 'Selin Şekerci', imagePath: PRONTO_FACE.selinSekerci },
  { name: 'Ceren Benderlioğlu', imagePath: '/rixos-infleuncers/ceren_benderlioglu.webp' },
  { name: 'Sera Kutlubey', imagePath: '/rixos-infleuncers/sera_kutlubey.webp' },
  { name: 'Berk Oktay', imagePath: '/rixos-infleuncers/berk_oktay.webp' },
  { name: 'Belgin Şimşek', imagePath: '/rixos-infleuncers/belgin_simsek.webp' },
  { name: 'Ezgi Şenler', imagePath: '/rixos-infleuncers/ezgi_senler.webp' },
  { name: 'Çiğdem Batur', imagePath: '/rixos-infleuncers/cigdem_batur.webp' },
  { name: 'Doğukan Polat', imagePath: '/rixos-infleuncers/dogukan_polat.webp' },
  { name: 'Serra Pirinç', imagePath: '/rixos-infleuncers/serra_pirinc.webp' },
  { name: 'Alican Okumuş', imagePath: '/rixos-infleuncers/alican_okumus.webp' },
  { name: 'Zeynep Akdeniz', imagePath: '/ajet-influencers/zeynep_akdeniz.webp' },
  { name: 'Mehmet Yılmaz Ak', imagePath: '/rixos-infleuncers/mehmet_yilmaz_ak.webp' },
  { name: 'Şeyma Büşra Gözdeniz', imagePath: '/ajet-influencers/seyma-busra-gozdamga.webp' },
  { name: 'İlker Yaşar', imagePath: PRONTO_FACE.ilkerYasar },
  { name: 'Çağla Boz', imagePath: '/rixos-infleuncers/cagla_boz.webp' },
  { name: 'Sevil Mert Uzun', imagePath: '/ajet-influencers/sevil_mert_uzun.webp' },
  { name: 'Pelin Akil Altan', imagePath: '/rixos-infleuncers/pelin_akil.webp' },
  { name: 'Taha Baran Özbek', imagePath: '/rixos-infleuncers/taha_baran.webp' },
  { name: 'Evrim Doğan', imagePath: '/rixos-infleuncers/evrim_dogan.webp' },
  { name: 'Tuğba Melis Türk', imagePath: '/rixos-infleuncers/tugba_melis.webp' },
  { name: 'Batuhan Ekşi', imagePath: '/rixos-infleuncers/batuhan_eksi.webp' },
  { name: 'Deniz Sarıkaş', imagePath: '/rixos-infleuncers/deniz_sarikas.webp' },
  { name: 'Evrim Ertekin Ergün', imagePath: PRONTO_FACE.evrimErtekinErgun },
  { name: 'Mert Turak', imagePath: '/rixos-infleuncers/mert_turak.webp' },
  { name: 'Burak Serdar Şanal', imagePath: '/rixos-infleuncers/burak_serdar_sanal.webp' },
  { name: 'Ahmet Kayakesen', imagePath: '/rixos-infleuncers/ahmet_kayakesen.webp' },
  { name: 'Ali Gözüşirin', imagePath: '/rixos-infleuncers/ali_gozusirin.webp' },
  { name: 'Hasan Denizyaran', imagePath: '/rixos-infleuncers/hasan_denizyaran.webp' },
  { name: 'Damla Göregen', imagePath: '/ajet-influencers/damla_goregen.webp' },
  { name: 'Hande Ataizi', imagePath: '/rixos-infleuncers/hande_ataizi.webp' },
  { name: 'Feyza Sevil Güngör', imagePath: '/rixos-infleuncers/feyza_gungor.webp' },
  { name: 'Arzu Çetinkaya', imagePath: '/ajet-influencers/arzu_cetin_kaya.webp' },
  { name: 'Seda Pamukcu Öztürk', imagePath: '/ajet-influencers/seda_pamukcu_ozturk.webp' },
  { name: 'Doğan Bayraktar', imagePath: '/rixos-infleuncers/dogan_bayraktar.webp' },
  { name: 'Merve Nur Uğuz', imagePath: '/ajet-influencers/merve_nur_uguz.webp' },
  { name: 'Yüsra Geyik', imagePath: '/rixos-infleuncers/yusra_geyik.webp' },
  { name: 'Sabuha Öztürk', imagePath: '/ajet-influencers/sabuha_ozturk.webp' },
  { name: 'Gökçen Ay', imagePath: '/ajet-influencers/gokcen_ay.webp' },
  { name: 'Gözde Kaya', imagePath: PRONTO_FACE.gozdeKaya },
  { name: 'Sinem Parkan', imagePath: '/ajet-influencers/sinem_parkan.webp' },
];

export default function ProntotourPage() {
  const { translations } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white p-4">
            <img src="/marka-logolari/prontotour_logos.png" alt="Prontotour" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Prontotour İş Birliği Raporu</h1>
          <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
            Prontotour | Katılımcı ve ünlü isim odaklı pazarlama — Seyahati anlatmak yetmez; yaşatmak gerekir. Ünlü isimler ve katılımcılarla destinasyon ve tur paketlerini geniş kitlelere taşıdık.
          </p>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Gönderi</p>
            <p className="mt-1 text-3xl font-bold text-white">{PRONTOTOUR_KPIS.posts}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katılımcılar</p>
            <p className="mt-1 text-3xl font-bold text-white">{PRONTOTOUR_KPIS.influencers}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Etkileşim</p>
            <p className="mt-1 text-3xl font-bold text-sky-400">{PRONTOTOUR_KPIS.engagement}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katma Değer (EMV)</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{PRONTOTOUR_KPIS.value}</p>
          </div>
        </div>

        <section className="mb-12">
          <div className="space-y-10">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Kampanya Detayları</h3>
              <p className="whitespace-pre-line rounded-xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
                Prontotur için hayata geçirdiğimiz iletişim çalışmalarında, katılımcı iş birlikleri, oyuncu ve celebrity katılımları ile desteklenen deneyim odaklı seyahat içerikleri güçlü bir destinasyon hikayesine dönüştürdük. Seyahat deneyimleri yalnızca anlatılmadı; gerçek anlar, güçlü yüzler ve ilham veren rotalarla dijital dünyada geniş bir keşif atmosferi yaratıldı.{'\n\n'}
                “Seyahati Anlatma, Yaşat.” yaklaşımıyla şekillenen bu içerik ekosistemi; Prontotur&apos;u yalnızca bir tur operatörü markası değil, yeni rotalar keşfetmek isteyen kitleler için ilham veren bir seyahat platformu olarak konumlandırdık.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Performans Özeti</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Posts</p>
                  <p className="mt-1 text-xl font-bold text-white">{PRONTOTOUR_PERFORMANCE.posts}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Katılımcılar</p>
                  <p className="mt-1 text-xl font-bold text-white">{PRONTOTOUR_PERFORMANCE.creators}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Views</p>
                  <p className="mt-1 text-xl font-bold text-sky-400">{PRONTOTOUR_PERFORMANCE.views}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Engagements</p>
                  <p className="mt-1 text-xl font-bold text-white">{PRONTOTOUR_PERFORMANCE.engagements}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Engagement Rate</p>
                  <p className="mt-1 text-xl font-bold text-amber-400">{PRONTOTOUR_PERFORMANCE.engagementRate}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Reach</p>
                  <p className="mt-1 text-xl font-bold text-white">{PRONTOTOUR_PERFORMANCE.reach}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">EMV</p>
                  <p className="mt-1 text-xl font-bold text-emerald-400">{PRONTOTOUR_PERFORMANCE.emv}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Followers (kitlenin toplamı)</p>
                  <p className="mt-1 text-xl font-bold text-white">{PRONTOTOUR_PERFORMANCE.followers}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Shares</p>
                  <p className="mt-1 text-xl font-bold text-white">{PRONTOTOUR_PERFORMANCE.shares}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Likes</p>
                  <p className="mt-1 text-xl font-bold text-white">{PRONTOTOUR_PERFORMANCE.likes}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Comments</p>
                  <p className="mt-1 text-xl font-bold text-white">{PRONTOTOUR_PERFORMANCE.comments}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Tarih Aralığı</p>
                  <p className="mt-1 text-sm font-medium text-white">{PRONTOTOUR_PERFORMANCE.dateRange}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">En Çok Görüntülenme Alan Katılımcılar</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PRONTOTOUR_CREATORS.map((c) => (
                  <div key={c.handle} className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <CreatorAvatar name={c.name} imagePath={c.image} size={56} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="text-sm text-zinc-400">@{c.handle}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-zinc-400">Posts:</span>
                      <span className="text-white">{c.posts}</span>
                      <span className="text-zinc-400">Views:</span>
                      <span className="text-sky-400">{c.views}</span>
                      <span className="text-zinc-400">ER:</span>
                      <span className="text-white">{c.engagementRate}</span>
                      <span className="text-zinc-400">Yorum:</span>
                      <span className="text-white">{c.comments}</span>
                      <span className="text-zinc-400">Reach:</span>
                      <span className="text-white">{c.reach}</span>
                      <span className="text-zinc-400">EMV:</span>
                      <span className="text-emerald-400">{c.emv}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-white">Öne Çıkan İçerikler</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {PRONTOTOUR_FEATURED_CONTENT.map(({ src, label }, index) => (
                  <FeaturedContentCell key={`${label}-${src ?? 'video'}-${index}`} src={src} label={label} />
                ))}
              </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-10">
              <h3 className="mb-6 text-lg font-semibold text-white">Kampanyaya Katılan Tüm Katılımcılar</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6">
                {PRONTOTOUR_ALL_INFLUENCERS.map((person) => (
                  <div key={person.name} className="flex flex-col items-center gap-2">
                    <CreatorAvatar name={person.name} imagePath={person.imagePath} size={64} />
                    <p className="text-center text-sm font-medium text-white">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/is-birliklerimiz"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/40"
          >
            İşbirliklerimiz
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-800/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-700/80"
          >
            {translations.common.project.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
