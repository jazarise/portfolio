import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
<<<<<<< HEAD
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
=======
import { updateAdminCredentials } from '@/lib/credentials-store';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

<<<<<<< HEAD
  const db = await dbConnect();
  if (!db) {
    return NextResponse.json({ error: 'Database offline' }, { status: 503 });
  }

  try {
    const { password } = await req.json();
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const userId = (session.user as any)?.userId;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
=======
  try {
    const { username, password } = await req.json();
    updateAdminCredentials(username, password);
    return NextResponse.json({ success: true, message: 'Credentials updated successfully.' });
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
