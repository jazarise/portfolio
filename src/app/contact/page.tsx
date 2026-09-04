import type { Metadata } from 'next';
import ContactContent from './ContactContent';
import { getContentSection, getSocialLinks } from '@/app/actions';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev';

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getContentSection('contact');
  const title = 'Contact Jaishanth | Cybersecurity Student & Ethical Hacker';
  const description = cfg.subtitle || 'Get in touch with Jaishanth M — Cybersecurity student at MCET Pollachi. Open to security research, penetration testing internships, and red teaming collaborations.';

  return {
    title,
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
      title,
      description,
      url: `${baseUrl}/contact`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'website',
    },
  };
}

export default async function ContactPage() {
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

