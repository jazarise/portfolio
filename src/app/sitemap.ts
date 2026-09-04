import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/app/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev';

  const staticRoutes = [
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
    const blogRoutes = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug || post._id)}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}

