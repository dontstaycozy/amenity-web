// src/lib/options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import supadata from "@/app/lib/supabaseclient";
import GoogleProvider from "next-auth/providers/google";


export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        email: {label:"Email", type :"email"},
        mode: {label:"Mode", type: "text"},
      },
      async authorize(credentials) {
         const { username, password, email, mode } = credentials as any;
  console.log("Received credentials in authorize:", credentials);
    // 🔁 If user is resetting password
    if (mode === "resetpassword") {
      try {
        const { error } = await supadata.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword`,
        });

        if (error) {
          console.error("[ResetPassword] Supabase error:", error.message);
          throw new Error(error.message);
        }

        console.log("[ResetPassword] Email sent");
        return null; // Don't create a session
      } catch (err) {
        console.error("[ResetPassword] Unexpected error:", err);
        throw new Error("Something went wrong while sending reset email.");
      }
    }

  // 🔐 Regular login flow
  if (!username || !password) {
    console.log("[Auth] Missing credentials");
    return null;
  }

  try {
    const { data, error } = await supadata
      .from("Users_Accounts")
      .select("userId, username, password, email, role")
      .eq("username", username)
      .single();

    if (error || !data) {
      console.log("[Auth] User not found or Supabase error:", error?.message);
      return null;
    }

    const passwordsMatch = data.password === password;

    if (!passwordsMatch) {
      console.log("[Auth] Incorrect password");
      return null;
    }

    // Update last_login timestamp
    await supadata
      .from("Users_Accounts")
      .update({ last_login: new Date().toISOString() })
      .eq("userId", data.userId);

    return {
      id: data.userId,
      name: data.username,
      email: data.email ?? null,
      role: data.role ?? "user",
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
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token?.id) {
        session.user.id = token.id as string;
        (session.user as any).role = (token as any).role as string;
      }
      return session;
    },
  },
};
