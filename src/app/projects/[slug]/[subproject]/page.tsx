import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectDetailView } from '@/components/views/ProjectDetailView';
import tr from '@/locales/tr.json';

interface SubProjectPageProps {
  params: {
    slug: string;
    subproject: string;
  };
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
  const { slug, subproject } = params;
  const projects = tr.homepage.projects.items;
  
  const project = Object.values(projects).find((p: any) => p.slug === slug) as any;
  
  if (!project) {
    return {};
  }

  const subProjectIndex = parseInt(subproject) - 1;
  const currentProject = project.subProjects?.[subProjectIndex] || project;
  const title = currentProject.title || project.title;
  const description = project.description;

  return {
    title: `${title} | Join PR`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.joinpr.com/projects/${slug}/${subproject}`,
    },
  };
}

export default function SubProjectPage({ params }: SubProjectPageProps) {
  const { slug, subproject } = params;
  const subProjectIndex = parseInt(subproject) - 1;

  if (isNaN(subProjectIndex) || subProjectIndex < 0) {
    notFound();
  }

  return <ProjectDetailView projectSlug={slug} subProjectIndex={subProjectIndex} />;
}

