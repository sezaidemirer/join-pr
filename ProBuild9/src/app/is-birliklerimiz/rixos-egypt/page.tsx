'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Şablon: boş profil avatarı (harf yerine ikon)
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

// Profil fotoğrafı veya placeholder
function CreatorAvatar({ name, imagePath, size = 48 }: { name: string; imagePath?: string; size?: number }) {
  if (imagePath) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full bg-zinc-800"
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagePath}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return <PlaceholderAvatar size={size} />;
}

/** Videodan ilk saniyelerden bir kare alıp thumbnail gibi gösterir; oynatılınca kare gizlenir. Özel kontroller: play, ses, progress. Sağ üstte dikey tam ekran butonu. */
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
    if (video.readyState >= 2) {
      video.currentTime = 0.5;
    }

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
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
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
      {/* Sağ üst: dikey tam ekran butonu */}
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
      {/* Alt kontrol çubuğu */}
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
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={onSeek}
          className="h-1 flex-1 min-w-0 accent-white"
        />
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? 'flex min-h-screen min-w-full items-center justify-center bg-black'
          : 'relative h-full w-full bg-black'
      }
    >
      <div
        className={
          isFullscreen
            ? 'relative h-full max-h-[100vh] w-auto max-w-full shrink-0 aspect-[9/16]'
            : 'relative h-full w-full'
        }
      >
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="none"
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
      </div>
    </div>
  );
}

// PDF: Rixos Mısır Genel (Oyuncular).pdf – Performans Özeti
const RIXOS_KPIS = {
  campaigns: 18,
  influencers: 63,
  engagement: '9.95M',
  value: '$9.5M',
};

const RIXOS_PERFORMANCE = {
  posts: 370,
  creators: 63,
  views: '91.58M',
  engagements: '9.95M',
  engagementRate: '2.8%',
  reach: '68.75M',
  emv: '$9.5M',
  dateRange: '5 Mar 2023 - 24 Oca 2026',
};

const RIXOS_CREATORS = [
  // PDF "Rixos Mısır Genel (Oyuncular).pdf" – görüntülenmeye göre ilk 3 (+ eklenen creator kartları)
  { name: 'Gizem Güneş', handle: 'gizemgunes', image: '/rixos-infleuncers/gizem_gunes.webp', posts: 50, views: '15.78M', engagementRate: '1.48%', reach: '11.96M', emv: '$1.5M' },
  { name: 'Gökçe Akyıldız', handle: 'gokceakyildiz', image: '/rixos-infleuncers/gokce_akyildiz.webp', posts: 8, views: '7.83M', engagementRate: '4.47%', reach: '6.25M', emv: '$788K' },
  { name: 'Gökberk Demirci', handle: 'gokberkdemirci', image: '/rixos-infleuncers/gokberk_demirci.webp', posts: 8, views: '6.77M', engagementRate: '10.31%', reach: '3M', emv: '$278.5K' },
  { name: 'Valentina Raso', handle: 'valentinaraso', image: '/rixos-infleuncers/valentin_araso.webp', posts: 2, views: '105.49K', engagementRate: '0.49%', reach: '81.39K', emv: '$15.7K' },
  { name: 'Fabio De Vivo', handle: 'fabio_devivo', image: '/rixos-infleuncers/fabio_devivo_profil.webp', posts: 4, views: '1.23M', engagementRate: '1.12%', reach: '867.3K', emv: '$55.6K' },
  { name: 'Diego Fusina', handle: 'diegofusina', image: '/rixos-infleuncers/diego_fusina.webp', posts: 6, views: '195.18K', engagementRate: '0.49%', reach: '142.53K', emv: '$12.9K' },
];

const RIXOS_FEATURED_CONTENT = [
  { src: '/rixos-content/fabio_devivo.mp4', label: 'Fabio De Vivo' },
  { src: '/rixos-content/valentin_araso.mp4', label: 'Valentina Raso' },
  { src: '/rixos-content/diego_fusina.mp4', label: 'Diego Fusina' },
  { src: '/rixos-content/pelin_akil.mp4', label: 'Pelin Akil Altan' },
  { src: '/rixos-content/gokberk_demirci.mp4', label: 'Gökberk Demirci' },
  { src: '/rixos-content/gizem_gunes.mp4', label: 'Gizem Güneş' },
];

// Kampanyaya Katılan Tüm Influencer&apos;lar – "Rixos Mısır Genel (Oyuncular).pdf" listesi; görseller sonra eklenebilir (imagePath opsiyonel)
type RixosParticipatingInfluencer = { name: string; imagePath?: string };
const RIXOS_ALL_INFLUENCERS: RixosParticipatingInfluencer[] = [
  { name: 'Valentina Raso', imagePath: '/rixos-infleuncers/valentin_araso.webp' },
  { name: 'Fabio De Vivo', imagePath: '/rixos-infleuncers/fabio_devivo_profil.webp' },
  { name: 'Diego Fusina', imagePath: '/rixos-infleuncers/diego_fusina.webp' },
  { name: 'Gizem Güneş', imagePath: '/rixos-infleuncers/gizem_gunes.webp' },
  { name: 'Gökçe Akyıldız', imagePath: '/rixos-infleuncers/gokce_akyildiz.webp' },
  { name: 'Gökberk Demirci', imagePath: '/rixos-infleuncers/gokberk_demirci.webp' },
  { name: 'Gokhan Alkan', imagePath: '/rixos-infleuncers/gokhan_alkan.webp' },
  { name: 'Cemre Baysel', imagePath: '/rixos-infleuncers/cemre_baysel.webp' },
  { name: 'Berk Oktay', imagePath: '/rixos-infleuncers/berk_oktay.webp' },
  { name: 'Çağla Şimşek', imagePath: '/rixos-infleuncers/cagla_simsek.webp' },
  { name: 'Barış Baktaş', imagePath: '/rixos-infleuncers/baris_baktas.webp' },
  { name: 'Yıldız Çağrı Atiksoy', imagePath: '/rixos-infleuncers/yildiz_cagri_atiksoy.webp' },
  { name: 'Emin Günenç', imagePath: '/rixos-infleuncers/emin_gunenc.webp' },
  { name: 'Simay Barlas', imagePath: '/rixos-infleuncers/simay_barlas.webp' },
  { name: 'Burcu Özberk', imagePath: '/rixos-infleuncers/burcu_ozberk.webp' },
  { name: 'Didem Balçın Aydın', imagePath: '/rixos-infleuncers/didem_balcin_aydin.webp' },
  { name: 'Gökberk Yıldırım', imagePath: '/rixos-infleuncers/gokberk_yildirim.webp' },
  { name: 'Lilya İrem Salman', imagePath: '/rixos-infleuncers/lilya_irem.webp' },
  { name: 'Berk Ali Çatal', imagePath: '/rixos-infleuncers/berk_ali_catal.webp' },
  { name: 'Gizem Karaca', imagePath: '/rixos-infleuncers/gizem_karaca.webp' },
  { name: 'Ayca Aysin Turan', imagePath: '/rixos-infleuncers/ayca_aysin_turan.webp' },
  { name: 'Baran Bölükbaşı', imagePath: '/rixos-infleuncers/baran_bolukbasi.webp' },
  { name: 'Pelin Akil Altan', imagePath: '/rixos-infleuncers/pelin_akil.webp' },
  { name: 'İlayda Ildır', imagePath: '/rixos-infleuncers/ilayda_ildir.webp' },
  { name: 'Burak Çelik', imagePath: '/rixos-infleuncers/burak_celik.webp' },
  { name: 'Nesrin Cavadzade', imagePath: '/rixos-infleuncers/nesrin_cavadzade.webp' },
  { name: 'Erdem Şanlı', imagePath: '/rixos-infleuncers/erdem_sanli.webp' },
  { name: 'Hülya Duyar', imagePath: '/rixos-infleuncers/hülya_duyar.webp' },
  { name: 'Nilsu Yılmaz', imagePath: '/rixos-infleuncers/Nilsu_yilmaz.webp' },
  { name: 'Burcu Kara', imagePath: '/rixos-infleuncers/burcu_kara.webp' },
  { name: 'Rojda Demirer', imagePath: '/rixos-infleuncers/rojda_demirer.webp' },
  { name: 'Ekin Mert Daymaz', imagePath: '/rixos-infleuncers/ekin_mert_daymaz.webp' },
  { name: 'Cemre Arda', imagePath: '/rixos-infleuncers/cemre_arda.webp' },
  { name: 'Emre Bulut', imagePath: '/rixos-infleuncers/emre_bulut.webp' },
  { name: 'Melisa Doğu', imagePath: '/rixos-infleuncers/melisa_dogu.webp' },
  { name: 'Tolga Mendi', imagePath: '/rixos-infleuncers/tolga_mendi.webp' },
  { name: 'Erdem Kaynarca', imagePath: '/rixos-infleuncers/erdem_kaynarca.webp' },
  { name: 'Hande Soral Demirci', imagePath: '/rixos-infleuncers/hande_soral.webp' },
  { name: 'Sitare Akbaş', imagePath: '/rixos-infleuncers/sitare_akbas.webp' },
  { name: 'Sera Kutlubey', imagePath: '/rixos-infleuncers/sera_kutlubey.webp' },
  { name: 'Ezgi Şenler', imagePath: '/rixos-infleuncers/ezgi_senler.webp' },
  { name: 'Müjde Uzman', imagePath: '/rixos-infleuncers/mujde_uzman.webp' },
  { name: 'Ceren Benderlioğlu', imagePath: '/rixos-infleuncers/ceren_benderlioglu.webp' },
  { name: 'Cansu Utosun', imagePath: '/rixos-infleuncers/cansu_tosun.webp' },
  { name: 'Belgin Şimşek', imagePath: '/rixos-infleuncers/belgin_simsek.webp' },
  { name: 'Çiğdem Batur', imagePath: '/rixos-infleuncers/cigdem_batur.webp' },
  { name: 'Alican Okumuş', imagePath: '/rixos-infleuncers/alican_okumus.webp' },
  { name: 'Yüsra Geyik', imagePath: '/rixos-infleuncers/yusra_geyik.webp' },
  { name: 'Doğan Bayraktar', imagePath: '/rixos-infleuncers/dogan_bayraktar.webp' },
  { name: 'Doğukan Polat', imagePath: '/rixos-infleuncers/dogukan_polat.webp' },
  { name: 'Serra Pirinç', imagePath: '/rixos-infleuncers/serra_pirinc.webp' },
  { name: 'Mehmet Yılmaz Ak', imagePath: '/rixos-infleuncers/mehmet_yilmaz_ak.webp' },
  { name: 'İsmail Demirci', imagePath: '/rixos-infleuncers/ismail_demirci.webp' },
  { name: 'Ali Gözüşirin', imagePath: '/rixos-infleuncers/ali_gozusirin.webp' },
  { name: 'Cihan Şimşek', imagePath: '/rixos-infleuncers/cihan_simsek.webp' },
  { name: 'Çağla Boz', imagePath: '/rixos-infleuncers/cagla_boz.webp' },
  { name: 'Taha Baran Özbek', imagePath: '/rixos-infleuncers/taha_baran.webp' },
  { name: 'Evrim Doğan', imagePath: '/rixos-infleuncers/evrim_dogan.webp' },
  { name: 'Tuğba Melis Türk', imagePath: '/rixos-infleuncers/tugba_melis.webp' },
  { name: 'Batuhan Ekşi', imagePath: '/rixos-infleuncers/batuhan_eksi.webp' },
  { name: 'Hasan Denizyaran', imagePath: '/rixos-infleuncers/hasan_denizyaran.webp' },
  { name: 'Burak Serdar Şanal', imagePath: '/rixos-infleuncers/burak_serdar_sanal.webp' },
  { name: 'Deniz Sarıkaş', imagePath: '/rixos-infleuncers/deniz_sarikas.webp' },
  { name: 'Mert Turak', imagePath: '/rixos-infleuncers/mert_turak.webp' },
  { name: 'Ahmet Kayakesen', imagePath: '/rixos-infleuncers/ahmet_kayakesen.webp' },
  { name: 'Hande Ataizi', imagePath: '/rixos-infleuncers/hande_ataizi.webp' },
  { name: 'Feyza Sevil Güngör', imagePath: '/rixos-infleuncers/feyza_gungor.webp' },
  // Görseller atıldığında imagePath eklenebilir, örn: { name: 'Gizem Güneş', imagePath: '/rixos-infleuncers/gizem_gunes.webp' }
];

export default function RixosEgyptPage() {
  const { translations } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12 pb-20">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white p-4">
            <img
              src="/Join Pr Marka Logoları/rixos_premium_seagate.png"
              alt="Rixos Egypt"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Rixos Egypt İş Birliği Raporu</h1>
        </div>

        {/* KPI Cards - PDF verisi */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Kampanya</p>
            <p className="mt-1 text-3xl font-bold text-white">{RIXOS_KPIS.campaigns}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katılımcı Influencer</p>
            <p className="mt-1 text-3xl font-bold text-white">{RIXOS_KPIS.influencers}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Etkileşim</p>
            <p className="mt-1 text-3xl font-bold text-sky-400">{RIXOS_KPIS.engagement}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katma Değer (EMV)</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{RIXOS_KPIS.value}</p>
          </div>
        </div>

        {/* Kampanya içeriği - şablon */}
        <section className="mb-12">
          <div className="space-y-10">
            {/* Kampanya Detayları */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Kampanya Detayları</h3>
              <p className="whitespace-pre-line rounded-xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
                Rixos Mısır otelleri için yürüttüğümüz PR çalışmalarında, Türkiye&apos;nin önde gelen dizi ve sinema oyuncuları ile gerçekleştirilen destinasyon odaklı içerikler markayı global sahnede güçlü bir yaşam tarzı ve tatil deneyimi olarak konumlandırdık. Ünlü isimlerin Rixos deneyimini milyonlarca takipçisiyle paylaşması sayesinde destinasyon görünürlüğü, marka prestiji ve uluslararası erişim aynı anda büyütüldü.{'\n\n'}
                Celebrity iş birlikleriyle desteklenen bu iletişim stratejisi, Rixos Mısır&apos;ı yalnızca bir tatil noktası değil; dünyanın farklı coğrafyalarından misafirleri buluşturan güçlü bir global destinasyon hikâyesine dönüştürdü.
              </p>
            </div>

            {/* Performans Özeti - PDF verisi */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Performans Özeti</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Posts</p>
                  <p className="mt-1 text-xl font-bold text-white">{RIXOS_PERFORMANCE.posts}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Creators</p>
                  <p className="mt-1 text-xl font-bold text-white">{RIXOS_PERFORMANCE.creators}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Views</p>
                  <p className="mt-1 text-xl font-bold text-sky-400">{RIXOS_PERFORMANCE.views}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Engagements</p>
                  <p className="mt-1 text-xl font-bold text-white">{RIXOS_PERFORMANCE.engagements}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Engagement Rate</p>
                  <p className="mt-1 text-xl font-bold text-amber-400">{RIXOS_PERFORMANCE.engagementRate}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Reach</p>
                  <p className="mt-1 text-xl font-bold text-white">{RIXOS_PERFORMANCE.reach}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">EMV</p>
                  <p className="mt-1 text-xl font-bold text-emerald-400">{RIXOS_PERFORMANCE.emv}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Tarih Aralığı</p>
                  <p className="mt-1 text-sm font-medium text-white">{RIXOS_PERFORMANCE.dateRange}</p>
                </div>
              </div>
            </div>

            {/* En Çok Görüntülenme Alan İçerik Üreticileri - 3 creator */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">En Çok Görüntülenme Alan İçerik Üreticileri</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {RIXOS_CREATORS.map((c) => (
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
                      <span className="text-zinc-400">Reach:</span>
                      <span className="text-white">{c.reach}</span>
                      <span className="text-zinc-400">EMV:</span>
                      <span className="text-emerald-400">{c.emv}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Öne Çıkan İçerikler - 3 video */}
            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-white">Öne Çıkan İçerikler</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {RIXOS_FEATURED_CONTENT.map(({ src, label }) => (
                  <div key={src} className="flex flex-col items-center gap-2">
                    <div className="w-full max-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                      <div className="aspect-[9/16] w-full">
                        <VideoWithFirstFrame src={src} />
                      </div>
                    </div>
                    <p className="text-center text-sm font-medium text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kampanyaya Katılan Tüm Influencer&apos;lar – AJet ile aynı yapı */}
            <div className="mt-12 border-t border-white/10 pt-10">
              <h3 className="mb-6 text-lg font-semibold text-white">Kampanyaya Katılan Tüm Influencer&apos;lar</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6">
                {RIXOS_ALL_INFLUENCERS.map((person) => (
                  <div key={person.name} className="flex flex-col items-center gap-2">
                    <CreatorAvatar name={person.name} imagePath={person.imagePath} size={64} />
                    <p className="text-center text-sm font-medium text-white">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
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
