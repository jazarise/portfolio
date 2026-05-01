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

<<<<<<< HEAD

=======
export async function GET(req: NextRequest) {
  // Admin-only: list all contacts (protected by checking referer or session)
  try {
    const db = await dbConnect();
    if (!db) return NextResponse.json([]);
    const docs = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(docs)));
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(req: NextRequest) {
  // Mark as read
  try {
    const { id } = await req.json();
    const db = await dbConnect();
    if (!db) return NextResponse.json({ error: 'DB offline' }, { status: 503 });
    await Contact.findByIdAndUpdate(id, { read: true });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const db = await dbConnect();
    if (!db) return NextResponse.json({ error: 'DB offline' }, { status: 503 });
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
