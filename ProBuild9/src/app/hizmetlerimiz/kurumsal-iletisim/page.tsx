import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { CorporateCommunicationView } from '@/components/views/CorporateCommunicationView';

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

export default function CorporateCommunicationPage() {
  return <CorporateCommunicationView />;
}



