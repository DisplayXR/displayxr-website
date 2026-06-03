import type { DefaultSession } from "next-auth";

// Augment Auth.js types with the GitHub fields we carry through the JWT/session.
declare module "next-auth" {
  interface Session {
    user: {
      login?: string;
      avatarUrl?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    login?: string;
    avatarUrl?: string;
  }
}
