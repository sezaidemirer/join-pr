import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Teşekkürler',
  description: 'Formunuz başarıyla gönderildi.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TesekkurlerPage() {
  return (
    <>
      {/* Google tag */}
      <Script
        id="google-ads-thankyou-loader"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-1764167179"
      />
      <Script
        id="google-ads-thankyou-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-1764167179');
          `,
        }}
      />
      {/* Google Ads Conversion Event */}
      <Script
        id="google-ads-thankyou-conversion"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('event', 'conversion', {
              'send_to': 'AW-1764167179/mhIhCKrTxJscEVuJtxB'
            });
          `,
        }}
      />

      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="relative h-24 w-48 md:h-32 md:w-64">
            <Image
              src="/join_pr_logo_offical2.png"
              alt="Join PR Logo"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Teşekkürler
            </h1>
            <p className="text-lg text-zinc-400 md:text-xl">
              Formunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

