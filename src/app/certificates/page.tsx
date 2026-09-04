import type { Metadata } from 'next';
import CertsContent from './CertsContent';
import { getCertificates, getContentSection } from '@/app/actions';
import { getBaseUrl } from '@/lib/baseUrl';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const cfg = await getContentSection('certs');
  const title = 'Cybersecurity Certifications | Jaishanth';
  const description = cfg.subtitle || 'Verified cybersecurity certifications, badges, and training achievements earned by Jaishanth M.';

  return {
    title,
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
      title,
      description,
      url: `${baseUrl}/certificates`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'website',
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

