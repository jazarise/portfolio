import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { updateAdminCredentials } from '@/lib/credentials-store';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { username, password } = await req.json();
    updateAdminCredentials(username, password);
    return NextResponse.json({ success: true, message: 'Credentials updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
