import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  let rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'https://jaishanth.dev';
  if (!rawBaseUrl.startsWith('http://') && !rawBaseUrl.startsWith('https://')) {
    rawBaseUrl = `https://${rawBaseUrl}`;
  }
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

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
