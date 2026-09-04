import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/app/actions';
import { getBaseUrl } from '@/lib/baseUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl().replace(/\/+$/, '');

  const staticRoutes: MetadataRoute.Sitemap = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/about', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/projects', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/certificates', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { route: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency,
    priority,
  }));

  const socialProfiles: MetadataRoute.Sitemap = [
    'https://linkedin.com/in/jaishanth',
    'https://github.com/jaishanthm',
    'https://instagram.com/jaishanthh',
    'https://tryhackme.com/p/jaishanth',
    'https://discord.com/users/jaishanthm',
  ].map((url) => ({
    url,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  try {
    const posts = await getBlogPosts();
    const blogRoutes: MetadataRoute.Sitemap = Array.isArray(posts)
      ? posts
          .filter((post: any) => post && (post.slug || post._id))
          .map((post: any) => {
            const slugStr = String(post.slug || post._id).trim();
            const modDate = post.updatedAt ? new Date(post.updatedAt) : (post.createdAt ? new Date(post.createdAt) : new Date());
            return {
              url: `${baseUrl}/blog/${encodeURIComponent(slugStr)}`,
              lastModified: modDate.toISOString(),
              changeFrequency: 'monthly' as const,
              priority: 0.7,
            };
          })
      : [];

    return [...staticRoutes, ...blogRoutes, ...socialProfiles];
  } catch {
    return [...staticRoutes, ...socialProfiles];
  }
}



