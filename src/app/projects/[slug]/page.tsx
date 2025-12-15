import { redirect } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  // Otomatik olarak ilk alt projeye yönlendir
  redirect(`/projects/${slug}/1`);
}

