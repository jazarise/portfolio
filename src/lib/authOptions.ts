import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'jaishanth-portfolio-jwt-secret-key-prod-fallback-2026';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email:    { label: 'Email',    type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const envUser = process.env.ADMIN_USERNAME;
        const envPass = process.env.ADMIN_PASSWORD;

        // 1. Check environment variables first (guaranteed admin access even if DB is empty)
        if (envUser && envPass && credentials.email === envUser && credentials.password === envPass) {
          return { id: 'env-admin', name: envUser, email: `${envUser}@admin.local`, role: 'ADMIN', permissions: {} };
        }

        // 2. Check Database
        const db = await dbConnect();
        if (!db) {
          return null;
        }

        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions ? user.permissions.toObject() : {},
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
    updateAge: 15 * 60,
  },

  jwt: {
    maxAge: 8 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role || 'VIEWER';
        token.permissions = user.permissions || {};
        token.loginAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string;
        session.user.role = token.role;
        session.user.userId = token.id;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },

  pages: {
    signIn: '/dashboard',
    error: '/dashboard',
  },

  secret: AUTH_SECRET || 'build-phase-evaluation-secret',

  debug: false,
};
