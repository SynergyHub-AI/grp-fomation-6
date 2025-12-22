import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // ✅ Import this
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // ✅ Import this for password checking

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Google Provider (Keep as is)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 2. Credentials Provider (Restores Email/Password Login)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // If user has no password, they likely signed up with Google
        if (!user.password) {
          throw new Error("This account uses Google Login. Please sign in with Google.");
        }

        // Verify Password
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user object if valid
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
        };
      },
    }),
  ],

  callbacks: {
    // 1. Handle Sign In (Create Google Users in DB)
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              avatarUrl: user.image,
              password: "", // Google users have no password
              hasCompletedOnboarding: false,
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false;
        }
      }
      return true;
    },

    // 2. Handle JWT (Add User ID to Token)
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Store MongoDB ID in token
      }
      return token;
    },

    // 3. Handle Session (Add User ID to Client Session)
    async session({ session, token }) {
      if (session.user) {
        // Option A: Fast way (read from token)
        (session.user as any).id = token.sub;

        // Option B: Accurate way (fetch fresh data from DB every time)
        // If you need real-time updates like 'hasCompletedOnboarding', keep this DB call:
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });

        if (dbUser) {
          (session.user as any).id = dbUser._id.toString();
          (session.user as any).hasCompletedOnboarding = dbUser.hasCompletedOnboarding;
          (session.user as any).jobTitle = dbUser.jobTitle;
          (session.user as any).avatarUrl = dbUser.avatarUrl || dbUser.image;
        } else {
          // Fallback if DB user not found (rare)
          (session.user as any).hasCompletedOnboarding = false;
        }
      }
      return session;
    },
  },

  // Ensure you use JWT strategy for Credentials + Google mix
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };