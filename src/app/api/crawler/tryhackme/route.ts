import { NextRequest, NextResponse } from 'next/server';
import { crawlTryHackMe, extractTHMUsername } from '@/lib/thmCrawler';
import { updateContentSection, getContentSection } from '@/app/actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const input = searchParams.get('url') || searchParams.get('username') || 'jaishanth';

  try {
    const data = await crawlTryHackMe(input);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate Admin or Editor session
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
    }
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const input = body.url || body.username || 'jaishanth';
    const crawlData = await crawlTryHackMe(input);

    // Save crawled TryHackMe stats to MongoDB home content section
    const currentHomeCfg = await getContentSection('home');
    const existingPlatforms = currentHomeCfg?.platforms || 'TryHackMe,Top 1%,#88cc14,https://tryhackme.com/p/jaishanth;HackerRank,Hacker,#00ea64,https://hackerrank.com';

    // Parse platforms list and update TryHackMe rank dynamically
    const username = extractTHMUsername(input);
    const profileLink = `https://tryhackme.com/p/${username || 'jaishanth'}`;
    
    const updatedPlatformsList = existingPlatforms.split(';').map((item: string) => {
      const parts = item.split(',');
      if (parts[0]?.trim().toLowerCase() === 'tryhackme') {
        return `TryHackMe,${crawlData.rank},#88cc14,${profileLink}`;
      }
      return item;
    });

    // If TryHackMe wasn't in platforms list, prepend it
    if (!existingPlatforms.toLowerCase().includes('tryhackme')) {
      updatedPlatformsList.unshift(`TryHackMe,${crawlData.rank},#88cc14,${profileLink}`);
    }

    const newPlatformsStr = updatedPlatformsList.join(';');
    await updateContentSection('home', {
      ...currentHomeCfg,
      platforms: newPlatformsStr,
      thmCrawledRank: crawlData.rank,
      thmLastCrawled: crawlData.lastCrawled,
      thmProfileUrl: profileLink,
    });

    return NextResponse.json({
      success: true,
      message: `Crawled & synced TryHackMe rank for ${crawlData.username}: ${crawlData.rank}`,
      crawlData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to crawl TryHackMe profile' }, { status: 500 });
  }
}
