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
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role || 'user';
        session.user.active = user.active !== false; // Default to true if not set
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
};
