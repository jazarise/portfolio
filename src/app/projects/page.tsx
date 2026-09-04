import type { Metadata } from 'next';
import ProjectsContent from './ProjectsContent';
import { getProjects, getContentSection } from '@/app/actions';
import { getBaseUrl } from '@/lib/baseUrl';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const cfg = await getContentSection('projects');
  const pageTitle = 'Cybersecurity Projects & Security Tools';
  const ogTitle = 'Cybersecurity Projects & Tools | Jaishanth';
  const defaultDesc = 'Explore cybersecurity projects, custom security tools, penetration testing scripts, and ethical hacking projects built by Jaishanth M at MCET Pollachi.';
  const description = cfg.subtitle ? (cfg.subtitle.length > 155 ? cfg.subtitle.slice(0, 152) + '...' : cfg.subtitle) : defaultDesc;

  return {
    title: pageTitle,
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
      title: ogTitle,
      description,
      url: `${baseUrl}/projects`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Jaishanth Cybersecurity Projects & Security Tools',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default async function ProjectsPage() {
  const baseUrl = getBaseUrl();
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

