import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { z } from 'zod';

const createUserSchema = z.object({
  name:     z.string().min(1, 'Name is required'),
  email:    z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role:     z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
  permissions: z.object({
    createBlog:   z.boolean().optional(),
    editOwnPosts: z.boolean().optional(),
    editAllPosts: z.boolean().optional(),
    publishPosts: z.boolean().optional(),
    addProjects:  z.boolean().optional(),
    editProjects: z.boolean().optional(),
  }).optional(),
});

const updateUserSchema = z.object({
  id:    z.string().min(1),
  name:  z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role:  z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
  permissions: z.object({
    createBlog:   z.boolean().optional(),
    editOwnPosts: z.boolean().optional(),
    editAllPosts: z.boolean().optional(),
    publishPosts: z.boolean().optional(),
    addProjects:  z.boolean().optional(),
    editProjects: z.boolean().optional(),
  }).optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return { error: 'Unauthorized', status: 401, session: null };
  const role = (session.user as any)?.role;
  if (!role) return { error: 'Role missing in session. Please sign out and sign in again.', status: 403, session: null };
  if (role !== 'ADMIN') return { error: 'Forbidden: Admin access required', status: 403, session: null };
  return { error: null, status: 0, session };
}

// GET — List all users
export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const db = await dbConnect();
  if (!db) return NextResponse.json({ error: 'Database offline' }, { status: 503 });

  const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(users)));
}

// POST — Create user
export async function POST(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const db = await dbConnect();
  if (!db) return NextResponse.json({ error: 'Database offline' }, { status: 503 });

  try {
    const body = await req.json();
    const parsed = createUserSchema.parse(body);

    const existing = await User.findOne({ email: parsed.email.toLowerCase() });
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const hashedPassword = await bcrypt.hash(parsed.password, 12);
    const user = await User.create({
      ...parsed,
      email: parsed.email.toLowerCase(),
      password: hashedPassword,
    });

    const { password: _, ...safeUser } = user.toObject();
    return NextResponse.json(safeUser, { status: 201 });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      const msg = err.issues?.[0]?.message || err.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 });
  }
}

// PATCH — Update user
export async function PATCH(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const db = await dbConnect();
  if (!db) return NextResponse.json({ error: 'Database offline' }, { status: 503 });

  try {
    const body = await req.json();

    // ── Sanitize: strip empty/whitespace-only password before validation ──
    if (body.password === '' || body.password === undefined || body.password === null) {
      delete body.password;
    } else if (typeof body.password === 'string' && body.password.trim() === '') {
      delete body.password;
    }

    const parsed = updateUserSchema.parse(body);
    const { id, ...updates } = parsed;

    // ── Admin safety: prevent demoting the last admin ──
    if (updates.role && updates.role !== 'ADMIN') {
      const targetUser = await User.findById(id);
      if (targetUser && targetUser.role === 'ADMIN') {
        const adminCount = await User.countDocuments({ role: 'ADMIN' });
        if (adminCount <= 1) {
          return NextResponse.json(
            { error: 'Cannot change role: this is the last admin account. Promote another user first.' },
            { status: 400 }
          );
        }
      }
    }

    // ── Only hash password if actually provided ──
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(JSON.parse(JSON.stringify(user)));
  } catch (err: any) {
    if (err.name === 'ZodError') {
      const msg = err.issues?.[0]?.message || err.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 });
  }
}

// DELETE — Delete user
export async function DELETE(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const db = await dbConnect();
  if (!db) return NextResponse.json({ error: 'Database offline' }, { status: 503 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    // ── Admin safety: prevent deleting the last admin ──
    const targetUser = await User.findById(id);
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (targetUser.role === 'ADMIN') {
      const adminCount = await User.countDocuments({ role: 'ADMIN' });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin account. Promote another user to admin first.' },
          { status: 400 }
        );
      }
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete user' }, { status: 500 });
  }
}
