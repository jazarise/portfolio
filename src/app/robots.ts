import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/baseUrl';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl().replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
