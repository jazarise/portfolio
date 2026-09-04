/**
 * Returns the canonical base URL for the application.
 * Priority:
 * 1. window.location.origin (client-side)
 * 2. NEXT_PUBLIC_SITE_URL env var
 * 3. VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL env vars
 * 4. Hardcoded domain fallback: https://jaiz.vercel.app
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    return url.startsWith('http') ? url : `https://${url}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }
  return 'https://jaiz.vercel.app';
}
