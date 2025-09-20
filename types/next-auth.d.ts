// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    groups?: string[];
  }

  interface Session {
    user?: {
      groups?: string[];
    } & DefaultSession["user"];
  }
}