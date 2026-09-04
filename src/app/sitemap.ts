import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/app/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

  const staticRoutes: MetadataRoute.Sitemap = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/about', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/projects', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/certificates', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { route: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  try {
    const posts = await getBlogPosts();
    if (!Array.isArray(posts)) {
      return staticRoutes;
    }

    const blogRoutes: MetadataRoute.Sitemap = posts
      .filter((post: any) => post && (post.slug || post._id))
      .map((post: any) => {
        const slugStr = String(post.slug || post._id).trim();
        return {
          url: `${baseUrl}/blog/${encodeURIComponent(slugStr)}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : (post.createdAt ? new Date(post.createdAt) : new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });

    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}


