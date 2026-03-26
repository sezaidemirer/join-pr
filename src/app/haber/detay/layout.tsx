import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haber | Join PR',
  robots: { index: true, follow: true },
};

export default function HaberDetayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
