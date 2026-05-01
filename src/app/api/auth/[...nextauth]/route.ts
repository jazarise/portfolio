import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

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

        const db = await dbConnect();
        if (!db) {
          // Fallback for when DB is offline — use env vars
          const envUser = process.env.ADMIN_USERNAME;
          const envPass = process.env.ADMIN_PASSWORD;
          if (credentials.email === envUser && credentials.password === envPass) {
            return { id: 'env-admin', name: envUser, email: `${envUser}@admin.local`, role: 'ADMIN', permissions: {} };
          }
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
        token.role = (user as any).role || 'VIEWER';
        token.permissions = (user as any).permissions || {};
        token.loginAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string;
        // ── CRITICAL: Put role and userId on session.user so getServerSession
        //    reliably returns them in both API routes and server actions ──
        (session.user as any).role = token.role;
        (session.user as any).userId = token.id;
        (session.user as any).permissions = token.permissions;
      }
      return session;
    },
  },

  pages: {
    signIn: '/dashboard',
    error: '/dashboard',
  },

  secret: process.env.NEXTAUTH_SECRET || 'supersecretneonkey2026',

  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
