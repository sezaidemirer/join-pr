'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { CTASection } from '@/components/CTASection';
import { useLanguage } from '@/context/LanguageContext';
import {
  reportMeta,
  summary,
  aiScore,
  featuredOutlets,
  onlineCoverage,
  socialCoverage,
} from '@/data/lara-fabian-coverage';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'medya_raporu_auth';

type AuthMode = 'signin' | 'signup';

export function MedyaYansimaRaporuView() {
  const { translations } = useLanguage();
  const page = translations.pages?.medyaYansimaRaporu;
  const heroTitle = page?.hero?.title ?? 'Medya Yansıma Raporu';
  const heroSubtitle = page?.hero?.subtitle ?? '';

  const useSupabaseAuth = !!supabase;
  const fallbackPassword = process.env.NEXT_PUBLIC_MEDYA_RAPORU_PASSWORD ?? '';

  const [unlocked, setUnlocked] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePwError, setChangePwError] = useState('');
  const [changePwMessage, setChangePwMessage] = useState('');
  const [changePwLoading, setChangePwLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!useSupabaseAuth) {
      if (typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === '1') {
        setUnlocked(true);
      }
      return;
    }
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setUnlocked(!!session);
    });
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setUnlocked(!!session);
    });
    return () => subscription.unsubscribe();
  }, [useSupabaseAuth]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim() ?? '';
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value ?? '';
    if (!email || !password) {
      setError('E-posta ve şifre giriniz.');
      setLoading(false);
      return;
    }
    const { data, error: err } = await supabase!.auth.signUp({ email, password });
    setLoading(false);
    if (err) {
      const msg = err.message || 'Kayıt başarısız.';
      // SMTP / e-posta gönderim hatalarında kullanıcıyı yönlendir
      const isEmailError = /email|smtp|mail|rate limit|confirmation/i.test(msg);
      setError(isEmailError ? `${msg} (SMTP ayarlarınızı ve Uygulama Şifresi kullanımını kontrol edin.)` : msg);
      return;
    }
    if (data.user && !data.session) {
      setMessage('Kayıt oldunuz. E-posta doğrulama linki gönderildi (gerekirse spam klasörüne bakın). Doğruladıktan sonra giriş yapabilirsiniz.');
    } else {
      setMessage('Kayıt başarılı. Yönlendiriliyorsunuz...');
      setUnlocked(true);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim() ?? '';
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value ?? '';
    if (!email || !password) {
      setError('E-posta ve şifre giriniz.');
      setLoading(false);
      return;
    }
    const { error: err } = await supabase!.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message || 'Giriş başarısız.');
      return;
    }
    setUnlocked(true);
  };

  const handleFallbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value ?? '';
    if (!fallbackPassword) {
      setUnlocked(true);
      if (typeof window !== 'undefined') sessionStorage.setItem(STORAGE_KEY, '1');
      return;
    }
    if (password === fallbackPassword) {
      setUnlocked(true);
      if (typeof window !== 'undefined') sessionStorage.setItem(STORAGE_KEY, '1');
    } else {
      setError('Yanlış şifre. Lütfen tekrar deneyin.');
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUnlocked(false);
    } else {
      if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
      setUnlocked(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setChangePwError('');
    setChangePwMessage('');
    setChangePwLoading(true);
    const form = e.currentTarget;
    const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement)?.value ?? '';
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement)?.value ?? '';
    const newPasswordConfirm = (form.elements.namedItem('newPasswordConfirm') as HTMLInputElement)?.value ?? '';
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setChangePwError('Tüm alanları doldurun.');
      setChangePwLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setChangePwError('Yeni şifre en az 6 karakter olmalıdır.');
      setChangePwLoading(false);
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setChangePwError('Yeni şifreler eşleşmiyor.');
      setChangePwLoading(false);
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) {
      setChangePwError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      setChangePwLoading(false);
      return;
    }
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: currentPassword,
    });
    if (signInErr) {
      setChangePwError('Mevcut şifre hatalı.');
      setChangePwLoading(false);
      return;
    }
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
    setChangePwLoading(false);
    if (updateErr) {
      setChangePwError(updateErr.message || 'Şifre güncellenemedi.');
      return;
    }
    setChangePwMessage('Şifreniz güncellendi.');
    form.reset();
    setShowChangePassword(false);
  };

  if (!mounted) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 pb-16 pt-12">
        <p className="text-zinc-400">Yükleniyor...</p>
      </div>
    );
  }

  if (useSupabaseAuth && !unlocked) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
        <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-center text-xl font-semibold text-white">
            Medya Yansıma Raporu
          </h1>
          <p className="text-center text-sm text-zinc-400">
            Raporu görüntülemek için giriş yapın veya üye olun.
          </p>
          <div className="flex gap-2 rounded-lg bg-white/5 p-1">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setError(''); setMessage(''); }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${authMode === 'signin' ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Giriş
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setError(''); setMessage(''); }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${authMode === 'signup' ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Üye ol
            </button>
          </div>
          <form onSubmit={authMode === 'signup' ? handleSignUp : handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="medya-email" className="sr-only">E-posta</label>
              <input
                id="medya-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="E-posta"
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label htmlFor="medya-password" className="sr-only">Şifre</label>
              <input
                id="medya-password"
                name="password"
                type="password"
                autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="Şifre"
                required
                minLength={6}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {authMode === 'signup' && (
                <p className="mt-1 text-xs text-zinc-500">En az 6 karakter</p>
              )}
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {message && <p className="text-sm text-teal-400">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
            >
              {loading ? '...' : authMode === 'signup' ? 'Üye ol' : 'Giriş'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (fallbackPassword && !unlocked) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
        <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-center text-xl font-semibold text-white">
            Medya Yansıma Raporu
          </h1>
          <p className="text-center text-sm text-zinc-400">
            Bu sayfayı görüntülemek için şifrenizi girin.
          </p>
          <form onSubmit={handleFallbackSubmit} className="space-y-4">
            <div>
              <label htmlFor="medya-password" className="sr-only">
                Şifre
              </label>
              <input
                id="medya-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Şifre"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-500"
            >
              Giriş
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      {/* Hero */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">
              {translations.common?.menu?.home ?? 'Ana Sayfa'}
            </p>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              {heroTitle}
            </h1>
          </div>
          {(useSupabaseAuth || fallbackPassword) && (
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
              {useSupabaseAuth && (
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword((v) => !v);
                    setChangePwError('');
                    setChangePwMessage('');
                  }}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
                >
                  Şifre değiştir
                </button>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
              >
                Çıkış
              </button>
            </div>
          )}
        </div>
        {heroSubtitle && (
          <p className="text-lg leading-relaxed text-zinc-300 md:text-xl">
            {heroSubtitle}
          </p>
        )}
        {useSupabaseAuth && showChangePassword && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Şifre değiştir</h3>
            <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
              <div>
                <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-zinc-300">
                  Mevcut şifre
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Mevcut şifreniz"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-zinc-300">
                  Yeni şifre
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="En az 6 karakter"
                />
              </div>
              <div>
                <label htmlFor="newPasswordConfirm" className="mb-1 block text-sm font-medium text-zinc-300">
                  Yeni şifre (tekrar)
                </label>
                <input
                  id="newPasswordConfirm"
                  name="newPasswordConfirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Yeni şifreyi tekrar girin"
                />
              </div>
              {changePwError && <p className="text-sm text-red-400">{changePwError}</p>}
              {changePwMessage && <p className="text-sm text-teal-400">{changePwMessage}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={changePwLoading}
                  className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
                >
                  {changePwLoading ? '...' : 'Şifreyi güncelle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setChangePwError('');
                    setChangePwMessage('');
                  }}
                  className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-400">
            Basın bülteni
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
            {reportMeta.title}
          </h2>
          <p className="mt-3 text-zinc-400">
            Dağıtım tarihi: {reportMeta.date} · Hedef ülke: {reportMeta.targetCountry} · Dil: {reportMeta.language}
          </p>
        </div>
      </div>

      {/* I. Genel Özet */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          Genel basın yansıma özeti
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">En çok kişiye ulaştıran</p>
            <p className="mt-1 text-lg font-semibold text-white">{summary.topReach}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Yansıma sayısı</p>
            <p className="mt-1 text-lg font-semibold text-white">{summary.coverageCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Reklam eşdeğeri</p>
            <p className="mt-1 text-lg font-semibold text-white">${summary.adValue.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Gazeteciye ulaştırıldı</p>
            <p className="mt-1 text-lg font-semibold text-white">{summary.journalistsReached.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* II. AI Görünürlük Puanı */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          AI Görünürlük Puanı
        </h2>
        <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-sky-500/10 p-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-shrink-0 items-center justify-center rounded-2xl bg-teal-500/20 px-6 py-4 text-2xl font-bold tabular-nums text-teal-300 whitespace-nowrap md:text-3xl">
              {aiScore.value} / {aiScore.max}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-zinc-300">{aiScore.description}</p>
              <p className="text-sm text-zinc-400">
                <strong className="text-zinc-300">Nasıl hesaplanır?</strong> {aiScore.howCalculated}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* III. Öne çıkan online yansımalar */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          Öne çıkan online basın yansımaları
        </h2>
        <p className="text-zinc-400">
          Basın bülteninizi web sitesinde görüntülemek için bir yayına tıklayabilirsiniz.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {featuredOutlets.map((outlet) => (
            <a
              key={outlet.name}
              href={outlet.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-teal-500/30 hover:bg-white/10"
            >
              <div className="flex items-start gap-4">
                {outlet.logo && (
                  <div className="flex h-14 w-28 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white p-2">
                    <Image
                      src={outlet.logo}
                      alt={outlet.name}
                      width={112}
                      height={56}
                      className="h-10 w-auto max-w-[6rem] object-contain object-center"
                      unoptimized
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-teal-400">{outlet.country}</p>
                  <h3 className="mt-1 font-semibold text-white group-hover:text-teal-300">
                    {outlet.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">Aylık trafik: {outlet.traffic}</p>
                </div>
                <span className="flex-shrink-0 text-sm font-medium text-teal-400 group-hover:underline">
                  Görüntüle →
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                {outlet.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* IV. Tüm online yansımalar */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          Online yansımalar
        </h2>
        <p className="text-zinc-400">
          Bu liste basın bülteninin yayınlandığı tüm web sitelerini içerir ({onlineCoverage.length} yayın).
        </p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {onlineCoverage.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="flex-shrink-0 font-mono text-zinc-500">{i + 1}.</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-teal-400 hover:underline"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* V. Sosyal medya yansımaları */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          Sosyal medya yansımaları
        </h2>
        <p className="text-zinc-400">
          Basın bülteninin yanı sıra sosyal medya paylaşımları.
        </p>
        <ul className="space-y-2">
          {socialCoverage.map((item, i) => (
            <li key={i}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition-colors hover:border-teal-500/20 hover:bg-white/10 hover:text-teal-400"
              >
                <span>{item.outlet}</span>
                <span className="text-teal-400">→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <CTASection
        title={translations.contact?.hero?.title ?? 'Birlikte fark yaratalım.'}
        description={translations.contact?.hero?.description ?? 'Hedeflerini ve projeni paylaş, Join ekibi 24 saat içinde seninle iletişime geçsin.'}
        buttonLabel={translations.common?.cta?.contactUs ?? 'İletişime Geç'}
        href="/iletisim"
      />
    </div>
  );
}
