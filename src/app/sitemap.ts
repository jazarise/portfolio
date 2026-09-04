import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/app/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev';

  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/certificates',
    '/blog',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const posts = await getBlogPosts();
    const blogRoutes = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug || post._id)}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
