import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

function getBaseUrl(host?: string | null, protocol: string = 'https'): string {
  let domain = (host ? `${protocol}://${host}` : '') ||
               process.env.NEXT_PUBLIC_SITE_URL ||
               (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
               (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
               'https://portfolio-v2-fixed.vercel.app';
  domain = domain.trim();
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    domain = `https://${domain}`;
  }
  return domain.replace(/\/+$/, '');
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';

  const baseUrl = getBaseUrl(host, protocol);

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
