import type { Metadata } from 'next';
import ContactContent from './ContactContent';
import { getContentSection, getSocialLinks } from '@/app/actions';
import { getBaseUrl } from '@/lib/baseUrl';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const cfg = await getContentSection('contact');
  const pageTitle = 'Contact Me - Security & Hiring';
  const ogTitle = 'Contact Jaishanth | Cybersecurity & Red Teaming';
  const defaultDesc = 'Get in touch with Jaishanth M, Cybersecurity student at MCET Pollachi. Open to security research, penetration testing, and red teaming projects.';
  const description = cfg.subtitle ? (cfg.subtitle.length > 155 ? cfg.subtitle.slice(0, 152) + '...' : cfg.subtitle) : defaultDesc;

  return {
    title: pageTitle,
    description,
    keywords: [
      'Contact Jaishanth',
      'Jaishanth email',
      'Jaishanth LinkedIn',
      'Jaishanth MCET Pollachi contact',
      'hire cybersecurity student India',
      'penetration testing intern'
    ],
    alternates: {
      canonical: `${baseUrl}/contact`,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: `${baseUrl}/contact`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Contact Jaishanth - Cybersecurity Student & Ethical Hacker',
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

export default async function ContactPage() {
  const baseUrl = getBaseUrl();
  const cfg = await getContentSection('contact');
  const homeCfg = await getContentSection('home');
  const socialLinks = await getSocialLinks();

  const jsonLd = [
    {
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
          name: 'Contact',
          item: `${baseUrl}/contact`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: `${baseUrl}/contact`,
      name: 'Contact Jaishanth',
      description: 'Contact Jaishanth for cybersecurity research, penetration testing, and red teaming projects.',
      mainEntity: {
        '@type': 'Person',
        name: 'Jaishanth',
        url: baseUrl,
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent cfg={cfg} homeCfg={homeCfg} socialLinks={socialLinks} />
    </>
  );
}

