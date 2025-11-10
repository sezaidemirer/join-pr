import type { Metadata } from 'next';

import en from '@/locales/en.json';
import { ContactView } from '@/components/views/ContactView';

export const metadata: Metadata = {
  title: en.contact.seo.title,
  description: en.contact.seo.description,
  openGraph: {
    title: en.contact.seo.title,
    description: en.contact.seo.description,
    url: 'https://www.joinpr.com/contact',
  },
};

export default function ContactPage() {
  return <ContactView />;
}

