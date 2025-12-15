import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectDetailView } from '@/components/views/ProjectDetailView';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';
import { getLocale } from '@/lib/metadata';

interface SubProjectPageProps {
  params: Promise<{
    slug: string;
    subproject: string;
  }>;
}

export async function generateStaticParams() {
  const projects = tr.homepage.projects.items;
  const params: Array<{ slug: string; subproject: string }> = [];

  Object.values(projects).forEach((project: any) => {
    if (project.subProjects && project.subProjects.length > 0) {
      project.subProjects.forEach((_: any, index: number) => {
        params.push({
          slug: project.slug,
          subproject: String(index + 1),
        });
      });
    } else {
      // Tek projesi olanlar için sadece 1
      params.push({
        slug: project.slug,
        subproject: '1',
      });
    }
  });

  return params;
}

export async function generateMetadata({ params }: SubProjectPageProps): Promise<Metadata> {
  const { slug, subproject } = await params;
  const locale = await getLocale();
  const baseUrl = 'https://www.joinpr.com';
  const pageUrl = `${baseUrl}/projects/${slug}/${subproject}`;
  
  const projects = locale === 'tr' ? tr.homepage.projects.items : en.homepage.projects.items;
  const project = Object.values(projects).find((p: any) => p.slug === slug) as any;
  
  if (!project) {
    const notFoundTitle = locale === 'tr' ? 'Proje Bulunamadı | Join PR Group' : 'Project Not Found | Join PR Group';
    const notFoundDesc = locale === 'tr' 
      ? 'İstenen proje bulunamadı.'
      : 'The requested project could not be found.';
    
    return {
      title: notFoundTitle,
      description: notFoundDesc,
    };
  }

  const subProjectIndex = parseInt(subproject) - 1;
  const currentProject = project.subProjects?.[subProjectIndex] || project;
  const title = currentProject.title || project.title;
  const description = project.description || (locale === 'tr'
    ? `${title} projesini Join PR Group'da keşfedin.`
    : `Discover ${title} project by Join PR Group.`);

  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';
  const altLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title: `${title} | Join PR Group`,
    description,
    keywords: [
      'destination PR',
      'influencer campaign',
      'travel marketing',
      'project case study',
      'PR project',
      'Join PR projects',
      title,
    ],
    openGraph: {
      title: `${title} | Join PR Group`,
      description,
      url: pageUrl,
      siteName: 'Join PR Group',
      locale: ogLocale,
      alternateLocale: altLocale,
      type: 'website',
      images: currentProject.report?.images?.[0]
        ? [
            {
              url: `${baseUrl}${currentProject.report.images[0]}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: `${baseUrl}/og-project.jpg`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Join PR Group`,
      description,
      images: currentProject.report?.images?.[0]
        ? [`${baseUrl}${currentProject.report.images[0]}`]
        : [`${baseUrl}/og-project.jpg`],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'tr-TR': pageUrl,
        'en-US': pageUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SubProjectPage({ params }: SubProjectPageProps) {
  const { slug, subproject } = await params;
  const subProjectIndex = parseInt(subproject) - 1;

  if (isNaN(subProjectIndex) || subProjectIndex < 0) {
    notFound();
  }

  return <ProjectDetailView projectSlug={slug} subProjectIndex={subProjectIndex} />;
}

