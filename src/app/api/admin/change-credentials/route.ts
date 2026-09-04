import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/security';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  let adminUser;
  try {
    adminUser = await requireAdmin();
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : 403;
    return NextResponse.json({ error: err.message || 'Forbidden' }, { status });
  }

  const db = await dbConnect();
  if (!db) {
    return NextResponse.json({ error: 'Database offline' }, { status: 503 });
  }

  try {
    const { password } = await req.json();
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    if (!adminUser.id || adminUser.id === 'env-admin') {
      return NextResponse.json(
        { error: 'Environment-based admin accounts cannot change passwords. Update your ADMIN_PASSWORD environment variable instead.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const updated = await User.findByIdAndUpdate(adminUser.id, { password: hashedPassword }, { returnDocument: 'after' });
    if (!updated) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
