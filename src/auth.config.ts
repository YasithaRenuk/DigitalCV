import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnProtectedUserRoutes = ['/createcv', '/showcv'].includes(nextUrl.pathname);

      if (isOnAdmin) {
        if (isLoggedIn && auth?.user?.role === 'admin') return true;
        return false; // Redirect to login
      }

      if (isOnProtectedUserRoutes) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
