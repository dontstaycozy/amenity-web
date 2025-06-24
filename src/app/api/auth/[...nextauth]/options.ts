// src/lib/options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import supabase from "@/app/lib/supabaseclient";
import GoogleProvider from "next-auth/providers/google";


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
          console.log("[Auth] Missing credentials");
          return null;
        }

        try {
          const { data, error } = await supabase
            .from("Users_Accounts")
            .select("id, username, password, email")
            .eq("username", credentials.username)
            .single();

          if (error || !data) {
            console.log("[Auth] User not found or Supabase error:", error?.message);
            return null;
          }

          const passwordsMatch = data.password === credentials.password;

          if (!passwordsMatch) {
            console.log("[Auth] Incorrect password");
            return null;
          }

          return {
            id: data.id,
            name: data.username,
            email: data.email ?? null,
          };
        } catch (err) {
          console.error("[Auth] Unexpected error:", err);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET!, 
    })
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
      if (token?.id) {
        session.id = token.id as string;
      }
      return session;
    },
  },
};
