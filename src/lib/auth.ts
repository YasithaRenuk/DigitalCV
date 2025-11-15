import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import clientPromise from '@/lib/mongodb-client';

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  allowDangerousEmailAccountLinking: true,
  events: {
    async createUser({ user }: { user: { email?: string | null; name?: string | null; image?: string | null } }) {
      // Set default role when user is created by the adapter
      try {
        await connectDB();
        // Create or update user in our User model with default role
        await User.findOneAndUpdate(
          { email: user.email },
          { 
            email: user.email!,
            name: user.name!,
            image: user.image,
            role: 'user' // Default role
          },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error('Error setting default role:', error);
      }
    },
  },
  callbacks: {
    async signIn() {
      // Allow sign in - let the adapter handle user creation
      return true;
    },
    async session({ session }: { session: { user?: { email?: string | null; name?: string | null; image?: string | null } } }) {
      if (session.user) {
        try {
          await connectDB();
          // Ensure user exists in our User model, create if not
          let dbUser = await User.findOne({ email: session.user.email });
          if (!dbUser) {
            // Create user if it doesn't exist (fallback for existing sessions)
            dbUser = await User.create({
              email: session.user.email!,
              name: session.user.name!,
              image: session.user.image,
              role: 'user', // Default role
            });
          }
          // Add role and id to session
          const userWithRole = session.user as typeof session.user & { role: string; id: string };
          userWithRole.role = dbUser.role;
          userWithRole.id = String(dbUser._id);
        } catch (error) {
          console.error('Error fetching user role:', error);
          const userWithRole = session.user as typeof session.user & { role: string };
          userWithRole.role = 'user';
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'database',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig as any);

