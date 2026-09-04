import type { Metadata } from 'next';
import CertsContent from './CertsContent';
import { getCertificates, getContentSection } from '@/app/actions';
import { getBaseUrl } from '@/lib/baseUrl';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const cfg = await getContentSection('certs');
  const pageTitle = 'Cybersecurity Certifications & Badges';
  const ogTitle = 'Cybersecurity Certifications | Jaishanth';
  const defaultDesc = 'View verified cybersecurity certifications, TryHackMe achievements, security badges, and ethical hacking credentials earned by Jaishanth M.';
  const description = cfg.subtitle ? (cfg.subtitle.length > 155 ? cfg.subtitle.slice(0, 152) + '...' : cfg.subtitle) : defaultDesc;

  return {
    title: pageTitle,
    description,
    keywords: [
      'Jaishanth certifications',
      'Jaishanth TryHackMe',
      'Jaishanth cybersecurity badges',
      'ethical hacking certificates',
      'TryHackMe rank Jaishanth',
      'MCET Pollachi cybersecurity certifications'
    ],
    alternates: {
      canonical: `${baseUrl}/certificates`,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: `${baseUrl}/certificates`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Jaishanth Cybersecurity Certifications & Badges',
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

export default async function CertificatesPage() {
  const baseUrl = getBaseUrl();
  const dbCerts = await getCertificates();
  const cfg = await getContentSection('certs');

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
        name: 'Certifications',
        item: `${baseUrl}/certificates`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CertsContent dbCerts={dbCerts} cfg={cfg} />
    </>
  );
}

