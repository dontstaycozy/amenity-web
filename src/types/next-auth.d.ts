// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user:{
    id: string;
    name:string;
    image_url?: string | null;
  }
}

  interface User {
    id: string;
    image_url?: string | null;
  }
}
