import { redirect } from 'next/navigation';

interface ProjectPageProps {
  params: {
    slug: string;
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
  // Otomatik olarak ilk alt projeye yönlendir
  redirect(`/projects/${params.slug}/1`);
}

