import { Metadata } from 'next';

import { ProjectDetailView } from '@/components/views/ProjectDetailView';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = params;
  
  const projectTitles: Record<string, { tr: string; en: string }> = {
    'bahrain': { tr: 'Bahrain Projesi', en: 'Bahrain Project' },
    'sharm-el-sheikh': { tr: 'Sharm El Sheikh Projesi', en: 'Sharm El Sheikh Project' },
    'hurghada': { tr: 'Hurghada Projesi', en: 'Hurghada Project' },
    'fas': { tr: 'Fas Projesi', en: 'Morocco Project' },
    'urdun': { tr: 'Ürdün Projesi', en: 'Jordan Project' },
    'karadag': { tr: 'Karadağ Projesi', en: 'Montenegro Project' },
  };

  const title = projectTitles[slug]?.tr || 'Proje Detayı';
  const description = 'Join PR dünya çapında gerçekleştirdiği influencer ve medya projelerini keşfedin.';

  return {
    title: `${title} | Join PR`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return [
    { slug: 'bahrain' },
    { slug: 'sharm-el-sheikh' },
    { slug: 'hurghada' },
    { slug: 'fas' },
    { slug: 'urdun' },
    { slug: 'karadag' },
  ];
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ProjectDetailView projectSlug={params.slug} />;
}

