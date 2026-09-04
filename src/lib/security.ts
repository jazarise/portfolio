import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { UserRole, UserPermissions } from '@/types/next-auth';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  permissions: UserPermissions;
}

/** Centralized helper to extract and validate the authenticated session user */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;

    const role = (session.user.role as UserRole) || 'VIEWER';
    const userId = session.user.userId || session.user.id || '';

    return {
      id: userId,
      email: session.user.email || '',
      name: session.user.name || undefined,
      role,
      permissions: session.user.permissions || {},
    };
  } catch (err) {
    console.error('[SECURITY] Failed to retrieve session:', err);
    return null;
  }
}

/** Enforces Admin-only access */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('Unauthorized: Please sign in');
  }
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}

/** Enforces Editor or Admin access */
export async function requireEditorOrAdmin(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('Unauthorized: Please sign in');
  }
  if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
    throw new Error('Forbidden: Editor or Admin access required');
  }
  return user;
}
