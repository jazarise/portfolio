import type { Metadata } from 'next';
import ProjectsContent from './ProjectsContent';
import { getProjects, getContentSection } from '@/app/actions';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev';

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getContentSection('projects');
  const title = 'Cybersecurity Projects & Tools | Jaishanth';
  const description = cfg.subtitle || 'Security tools, applications, penetration testing scripts, and research systems built by Jaishanth M.';

  return {
    title,
    description,
    keywords: [
      'Jaishanth projects',
      'Jaishanth security tools',
      'Jaishanth cybersecurity scripts',
      'ethical hacking projects',
      'penetration testing portfolio',
      'MCET Pollachi cybersecurity projects'
    ],
    alternates: {
      canonical: `${baseUrl}/projects`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/projects`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'website',
    },
  };
}

export default async function ProjectsPage() {
  const dbProjects = await getProjects();
  const cfg = await getContentSection('projects');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: `${baseUrl}/projects`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectsContent dbProjects={dbProjects} cfg={cfg} />
    </>
  );
}

