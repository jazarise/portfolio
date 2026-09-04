import type { Metadata } from 'next';
import BlogContent from './BlogContent';
import { getBlogPosts, getContentSection } from '@/app/actions';
import { getBaseUrl } from '@/lib/baseUrl';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const cfg = await getContentSection('blog');
  const title = 'Cybersecurity Blog & Security Write-ups | Jaishanth';
  const description = cfg.subtitle || 'Security write-ups, CTF solutions, vulnerability analyses, and research notes by Jaishanth M.';

  return {
    title,
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
      title,
      description,
      url: `${baseUrl}/blog`,
      siteName: 'Jaishanth Cybersecurity Portfolio',
      type: 'website',
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

