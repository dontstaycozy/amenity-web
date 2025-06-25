// src/lib/options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { adminDb } from "@/app/lib/firebaseadmin";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          const snapshot = await adminDb
            .collection("Users")
            .where("username", "==", credentials.username)
            .limit(1)
            .get();

          if (snapshot.empty) return null;

          const userDoc = snapshot.docs[0];
          const user = userDoc.data();

          if (user.password === credentials.password) {
            return {
              id: userDoc.id,
              name: user.username,
              email: user.email || null,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during Firestore auth:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  
  session: {
    strategy: "jwt",
  },

 
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id as string;
      }
      return session;
    },
  },
};
