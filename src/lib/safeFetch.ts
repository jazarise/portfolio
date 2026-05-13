/**
 * Safe fetch wrapper that prevents the "Unexpected token '<'" error.
 * Ensures the response is JSON before parsing, and throws a clean error otherwise.
 */
export async function safeFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(url, options);
  } catch (err: any) {
    throw new Error(`Network error: ${err.message || 'Failed to connect to server'}`);
  }

  const contentType = res.headers.get('content-type') || '';

  // If the server returned HTML instead of JSON (e.g. Next.js error page), throw a clean error
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      throw new Error(
        `Server returned an HTML error page (${res.status}). This usually means the server crashed or the route doesn't exist.`
      );
    }
    throw new Error(`Unexpected response format (${res.status}): ${text.slice(0, 200)}`);
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Failed to parse server response as JSON (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }

  return data as T;
}
