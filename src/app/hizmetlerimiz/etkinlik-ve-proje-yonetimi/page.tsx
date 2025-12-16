import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { EventProjectManagementView } from '@/components/views/EventProjectManagementView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Event and Project Management | Join PR',
      description:
        "We provide comprehensive event and project management solutions aligned with brands' goals, positioning, and communication strategies.",
    };
  }

  return {
    title: 'Etkinlik ve Proje Yönetimi | Join PR',
    description:
      'Markaların hedeflerine, konumlandırmasına ve iletişim stratejisine uygun kapsamlı etkinlik ve proje yönetimi çözümleri sunarız.',
  };
}

export default function EventProjectManagementPage() {
  return <EventProjectManagementView />;
}

