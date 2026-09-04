import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().trim().email('Invalid email address').max(254, 'Email too long'),
  subject: z.string().trim().min(1, 'Subject is required').max(200, 'Subject too long'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message too long'),
});

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 16_384) {
      return NextResponse.json({ error: 'Payload too large. Maximum size is 16KB.' }, { status: 413 });
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Please provide valid contact details.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    const { name, email, subject, message } = parsed.data;

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
