'use client';

import { useParams } from 'next/navigation';

import { HaberDetayClient } from '@/components/news/HaberDetayClient';

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>();
  return <HaberDetayClient rawSlug={params.slug || ''} />;
}
