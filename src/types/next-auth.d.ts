import { DefaultSession } from 'next-auth';

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface UserPermissions {
  [key: string]: boolean | undefined;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      userId?: string;
      role?: UserRole;
      permissions?: UserPermissions;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role?: UserRole;
    permissions?: UserPermissions;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserRole;
    permissions?: UserPermissions;
    loginAt?: number;
  }
}
