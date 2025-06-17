// src/lib/options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { adminDb } from "@/app/lib/firebaseadmin"; // ✅ import your Firestore instance

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
          // ✅ Query Firestore for a user with matching username
          const snapshot = await adminDb
            .collection("Users")
            .where("username", "==", credentials.username)
            .limit(1)
            .get();

          if (snapshot.empty) return null;

          const userDoc = snapshot.docs[0];
          const user = userDoc.data();

          // ⚠️ WARNING: This assumes passwords are stored in plain text — avoid this in production.
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
};
