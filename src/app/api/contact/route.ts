import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const db = await dbConnect();
    if (!db) {
      // DB offline — still return success (message logged to console)
      console.log('[CONTACT] DB offline — message received:', { name, email, subject });
      return NextResponse.json({ success: true, offline: true });
    }

    await Contact.create({ name, email, subject, message });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[CONTACT] Error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}


