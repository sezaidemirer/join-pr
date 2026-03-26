import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thank you for contacting Join PR',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        {/* Logo */}
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

        {/* Thank You Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Thank You
          </h1>
          <p className="text-lg text-zinc-400 md:text-xl">
            We&apos;ll get back to you soon.
          </p>
        </div>
      </div>
    </div>
  );
}
