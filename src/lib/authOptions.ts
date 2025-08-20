import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { NextAuthOptions } from 'next-auth';
import { ObjectId } from 'mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on auth errors
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth account info and user info to the token right after signin
      if (account && user) {
        // First time user signs in
        token.id = user.id;
        token.role = user.role || 'user';
        token.active = user.active !== false;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.active = token.active as boolean;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Set default values for new users
      if (account?.provider === 'google') {
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Check if user exists, if not set defaults
        const existingUser = await usersCollection.findOne({
          email: user.email,
        });
        if (!existingUser) {
          // This will be handled by the MongoDB adapter, but we can set defaults here
          user.role = 'user';
          user.active = true;
        }
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Set defaults when user is created
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('users');

      await usersCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            role: 'user',
            active: true,
          },
        },
      );
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
