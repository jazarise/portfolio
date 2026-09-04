import type { Metadata } from 'next';
import BlogContent from './BlogContent';
import { getBlogPosts, getContentSection } from '@/app/actions';
import { getBaseUrl } from '@/lib/baseUrl';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const cfg = await getContentSection('blog');
  const pageTitle = 'Cybersecurity Blog & CTF Write-ups';
  const ogTitle = 'Cybersecurity Blog & Write-ups | Jaishanth';
  const defaultDesc = 'Read cybersecurity write-ups, CTF walkthroughs, vulnerability analyses, and ethical hacking research notes written by Jaishanth M at MCET Pollachi.';
  const description = cfg.subtitle ? (cfg.subtitle.length > 155 ? cfg.subtitle.slice(0, 152) + '...' : cfg.subtitle) : defaultDesc;

  return {
    title: pageTitle,
    description,
    keywords: [
      'Jaishanth blog',
      'Jaishanth security writeups',
      'cybersecurity blog India',
      'CTF writeups Jaishanth',
      'ethical hacking blog',
      'penetration testing tutorials'
    ],
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: `${baseUrl}/blog`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Jaishanth Cybersecurity Blog & CTF Write-ups',
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

export default async function BlogPage() {
  const baseUrl = getBaseUrl();
  const dbPosts = await getBlogPosts();
  const cfg = await getContentSection('blog');

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
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogContent dbPosts={dbPosts} cfg={cfg} />
    </>
  );
}

