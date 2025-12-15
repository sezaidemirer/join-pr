import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Corporate Communications | Join PR',
      description:
        'Join PR provides integrated corporate communications strategies that strengthen reputation, align messaging and create lasting stakeholder impact.',
    };
  }

  return {
    title: 'Kurumsal İletişim | Join PR',
    description:
      'Join PR, kurumsal iletişim stratejileriyle marka itibarını güçlendiren, mesaj mimarisini hizalayan ve paydaşlar üzerinde kalıcı etki yaratan çözümler sunar.',
  };
}

export default async function CorporateCommunicationPage() {
  const locale = await getLocale();
  const isEn = locale === 'en';

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">
          {isEn ? 'Services' : 'Hizmetlerimiz'}
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          {isEn ? 'Corporate Communications' : 'Kurumsal İletişim'}
        </h1>
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-zinc-200 shadow-xl shadow-black/30 space-y-4">
        <p className="text-base leading-relaxed md:text-lg">
          {isEn
            ? 'We design corporate communication architectures that keep your brand’s narrative consistent across all channels, align leadership messaging and protect long-term reputation.'
            : 'Markanızın anlatısını tüm kanallarda tutarlı kılan, liderlik iletişimini hizalayan ve uzun vadeli itibarı koruyan kurumsal iletişim mimarileri tasarlıyoruz.'}
        </p>
        <p className="text-base leading-relaxed md:text-lg">
          {isEn
            ? 'From strategic positioning and narrative design to media relations, internal communications and executive visibility, we build 360° programs tailored to your business goals.'
            : 'Stratejik konumlandırma ve hikâye kurgusundan medya ilişkilerine, iç iletişimden liderlik görünürlüğüne kadar uzanan 360° programlar geliştirerek iş hedeflerinize özel çözümler üretiyoruz.'}
        </p>
      </div>
    </div>
  );
}


