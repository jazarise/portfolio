import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/ogg',
  'application/pdf',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function jsonResponse(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ──
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch {
      return jsonResponse({ success: false, error: 'Auth service unavailable' }, 503);
    }

    const role = (session?.user as any)?.role;
    if (role !== 'ADMIN' && role !== 'EDITOR') {
      return jsonResponse({ success: false, error: 'Unauthorized to upload files' }, 403);
    }

    // ── Parse form data ──
    let data: FormData;
    try {
      data = await req.formData();
    } catch {
      return jsonResponse({ success: false, error: 'Invalid form data. Ensure multipart/form-data encoding.' }, 400);
    }

    const file: File | null = data.get('file') as unknown as File;
    if (!file || !file.name || file.size === 0) {
      return jsonResponse({ success: false, error: 'No file uploaded or file is empty' }, 400);
    }

    // ── Validate type ──
    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonResponse({
        success: false,
        error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}`,
      }, 400);
    }

    // ── Validate size ──
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({
        success: false,
        error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      }, 413);
    }

    // ── Read file bytes ──
    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch {
      return jsonResponse({ success: false, error: 'Failed to read file data' }, 500);
    }

    // ── Create unique filename ──
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.name.split('.').pop() || 'bin';
    const sanitizedExt = ext.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    const filename = `${uniqueSuffix}.${sanitizedExt}`;

    // ── Ensure upload directory exists ──
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e: any) {
      console.error('[UPLOAD] Failed to create upload directory:', e.message);
      return jsonResponse({
        success: false,
        error: 'Failed to create upload directory. Check filesystem permissions.',
      }, 500);
    }

    // ── Write file ──
    const filepath = join(uploadDir, filename);
    try {
      await writeFile(filepath, buffer);
    } catch (e: any) {
      console.error('[UPLOAD] Failed to write file:', e.message);
      return jsonResponse({
        success: false,
        error: 'Failed to save file to disk. This may happen on serverless platforms (use Cloudinary instead).',
      }, 500);
    }

    const url = `/uploads/${filename}`;
    return jsonResponse({
      success: true,
      message: 'Upload successful',
      data: { url, filename, size: file.size, type: file.type },
    });
  } catch (error: any) {
    console.error('[UPLOAD] Unexpected error:', error);
    return jsonResponse({
      success: false,
      error: 'An unexpected error occurred during upload',
    }, 500);
  }
}
