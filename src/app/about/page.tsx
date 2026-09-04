import type { Metadata } from 'next';
import AboutContent from './AboutContent';
import { getContentSection } from '@/app/actions';
import { getBaseUrl } from '@/lib/baseUrl';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const defaultTitle = 'About | Jaishanth | Cybersecurity Student @ MCET Pollachi';
  const defaultDesc = 'Jaishanth is a Cybersecurity student at Dr. Mahalingam College of Engineering and Technology (MCET), Pollachi, focused on ethical hacking, penetration testing, vulnerability assessment, web security, red teaming, and security research.';

  return {
    title: defaultTitle,
    description: defaultDesc,
    keywords: [
      'Jaishanth cybersecurity',
      'Jaishanth ethical hacker',
      'Jaishanth penetration testing',
      'Jaishanth MCET Pollachi',
      'Dr Mahalingam College of Engineering and Technology cybersecurity',
      'MCET Pollachi cybersecurity student',
      'offensive security',
      'red teaming',
      'vulnerability assessment',
      'web security'
    ],
    alternates: {
      canonical: `${baseUrl}/about`,
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: `${baseUrl}/about`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'profile',
      images: [
        {
          url: `${baseUrl}/profile.jpg`,
          width: 1200,
          height: 630,
          alt: 'Jaishanth - Cybersecurity Student at MCET Pollachi',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDesc,
      images: [`${baseUrl}/profile.jpg`],
    },
  };
}

export default async function AboutPage() {
  const baseUrl = getBaseUrl();
  const cfg = await getContentSection('about');
  const homeCfg = await getContentSection('home');

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
        name: 'About Jaishanth',
        item: `${baseUrl}/about`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent cfg={cfg} homeCfg={homeCfg} />
    </>
  );
}

