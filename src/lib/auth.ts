import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import clientPromise from '@/lib/mongodb-client';
import { authConfig } from '@/auth.config';
import { serverEnv } from '@/config/server-env';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: serverEnv.googleClientId,
      clientSecret: serverEnv.googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: serverEnv.nextAuthSecret,
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
});
