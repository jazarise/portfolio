import { getBlogPostBySlug } from '@/app/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  const title = `${post.title} | Jaishanth Cybersecurity Blog`;
  const description = post.excerpt || post.title;
  const url = `${baseUrl}/blog/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    keywords: [
      'Jaishanth security writeup',
      'Jaishanth blog',
      ...(post.tags || []),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.createdAt,
      authors: ['Jaishanth'],
      tags: post.tags || [],
      siteName: 'Jaishanth Cybersecurity Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${baseUrl}/blog/${encodeURIComponent(slug)}`;

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
          name: 'Blog',
          item: `${baseUrl}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: postUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${postUrl}/#article`,
      url: postUrl,
      headline: post.title,
      description: post.excerpt || post.title,
      datePublished: post.createdAt,
      dateModified: post.updatedAt || post.createdAt,
      author: {
        '@type': 'Person',
        name: 'Jaishanth',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Person',
        name: 'Jaishanth',
        url: baseUrl,
      },
      keywords: (post.tags || []).join(', '),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen pt-28 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-purple-400 hover:text-purple-300 transition-colors mb-6"
          >
            ← Back to All Articles
          </Link>
          <div className="flex items-center gap-3 text-xs font-mono text-gray-500 mb-3 flex-wrap">
            {post.createdAt && (
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
            {post.readTime && <span>· {post.readTime}</span>}
            {post.category && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950/50 text-purple-300 border border-purple-500/30">
                {post.category}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-gray-400 font-mono leading-relaxed border-l-2 border-purple-500/40 pl-4 py-1">
              {post.excerpt}
            </p>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-6">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 font-mono text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <article className="prose prose-invert max-w-none font-sans text-gray-300 leading-relaxed space-y-6">
          <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
            {post.content || post.excerpt}
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-gray-300 transition-all"
          >
            ← Return to Research & Writing
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 font-mono text-xs text-purple-200 transition-all"
          >
            Discuss this Article →
          </Link>
        </div>
      </main>
    </>
  );
}

