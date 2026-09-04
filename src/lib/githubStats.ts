// Fetches lightweight public GitHub activity for the homepage "System Active" panel.
// Uses Next.js fetch caching (revalidate) so this is fetched at most once per hour
// total, regardless of visitor count — avoids GitHub's unauthenticated rate limit
// (60 req/hr per IP), which per-visitor client-side fetching would blow through instantly.

export interface GithubStats {
  username: string;
  repos: number;
  followers: number;
  lastActiveLabel: string;
  active: boolean;
  dailyActivity: number[]; // oldest → newest, one bucket per day
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export async function getGithubStats(username?: string): Promise<GithubStats | null> {
  if (!username || !username.trim()) return null;
  const user = username.trim().replace(/^@/, '');

  try {
    const headers = { Accept: 'application/vnd.github+json' };
    const [profileRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${user}/events/public?per_page=50`, { headers, next: { revalidate: 3600 } }),
    ]);

    if (!profileRes.ok) return null;
    const profile = await profileRes.json();
    const events = eventsRes.ok ? await eventsRes.json() : [];

    // Bucket public events into the last 14 UTC days for the activity bars.
    const DAYS = 14;
    const buckets = new Array(DAYS).fill(0);
    const todayUTC = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z').getTime();
    const DAY_MS = 86400000;

    if (Array.isArray(events)) {
      for (const ev of events) {
        if (!ev?.created_at) continue;
        const evDateUTC = new Date(new Date(ev.created_at).toISOString().slice(0, 10) + 'T00:00:00Z').getTime();
        const dayIndex = DAYS - 1 - Math.round((todayUTC - evDateUTC) / DAY_MS);
        if (dayIndex >= 0 && dayIndex < DAYS) buckets[dayIndex] += 1;
      }
    }

    const mostRecent = Array.isArray(events) && events.length > 0 ? events[0].created_at : profile.updated_at;
    const activeWithinDays = mostRecent ? (Date.now() - new Date(mostRecent).getTime()) / DAY_MS : 999;

    return {
      username: user,
      repos: profile.public_repos ?? 0,
      followers: profile.followers ?? 0,
      lastActiveLabel: mostRecent ? relativeTime(mostRecent) : 'Unknown',
      active: activeWithinDays <= 3,
      dailyActivity: buckets,
    };
  } catch {
    return null;
  }
}
