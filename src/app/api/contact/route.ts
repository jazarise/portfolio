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

// Sliding-window IP rate limiter
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit = 5, windowMs = 10 * 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  // Clean expired entries periodically
  if (ipRateLimitMap.size > 10_000) {
    for (const [k, v] of ipRateLimitMap.entries()) {
      if (now > v.resetTime) ipRateLimitMap.delete(k);
    }
  }

  if (!entry || now > entry.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (5 requests per 10 minutes)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many contact requests. Please wait 10 minutes before sending another message.' },
        { status: 429, headers: { 'Retry-After': '600' } }
      );
    }

    // 2. Request payload size check (16KB max)
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 16_384) {
      return NextResponse.json({ error: 'Payload too large. Maximum size is 16KB.' }, { status: 413 });
    }

    const body = await req.json();

    // 3. Honeypot check for spam bots
    if (body.website || body.address || body.confirm_email || body.fax) {
      // Pretend success so spam bots don't adapt
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    // 4. Zod Schema Validation
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Please provide valid contact details.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    const { name, email, subject, message } = parsed.data;

    // 5. Save to Database
    const db = await dbConnect();
    if (!db) {
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
