import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// GitHub-login admin gate. Access is governed purely by an allowlist of GitHub
// usernames (ADMIN_LOGINS, comma-separated) — anyone can authenticate with
// GitHub, but only allowlisted logins get a session. This is the whole reason
// the admin dashboard costs nothing per user: people log into *our* site, not
// into a paid Vercel team seat.
//
// Auth.js v5 auto-reads AUTH_SECRET, AUTH_GITHUB_ID and AUTH_GITHUB_SECRET from
// the environment, so the GitHub() provider needs no explicit config.

const ADMIN_LOGINS = (process.env.ADMIN_LOGINS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAllowed(login?: string | null): boolean {
  if (!login) return false;
  return ADMIN_LOGINS.includes(login.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // Reject non-allowlisted users at sign-in: no session is ever issued.
    signIn({ profile }) {
      return isAllowed(profile?.login as string | undefined);
    },
    // Carry the GitHub login + avatar onto the token so the UI can show "who".
    //
    // This callback also runs on EVERY session read (middleware, auth() in a
    // page or server action), not only at sign-in, so it is where a login
    // removed from ADMIN_LOGINS loses access: returning null makes Auth.js
    // clear the session cookie and report no session. Without it the JWT,
    // which is re-signed with a fresh expiry on each request, would keep a
    // removed admin signed in indefinitely.
    jwt({ token, profile }) {
      if (profile) {
        token.login = profile.login as string;
        token.avatarUrl = profile.avatar_url as string;
      }
      if (!isAllowed(token.login as string | undefined)) return null;
      return token;
    },
    session({ session, token }) {
      session.user.login = token.login as string | undefined;
      session.user.avatarUrl = token.avatarUrl as string | undefined;
      return session;
    },
    // Only consulted by the bare `export default auth` middleware form. When
    // middleware passes its own handler to auth() (as middleware.ts does), a
    // `false` here is ignored, so the jwt() check above and the explicit
    // check in middleware.ts are what enforce the allowlist.
    authorized({ auth }) {
      return isAllowed(auth?.user?.login);
    },
  },
  pages: {
    signIn: "/admin/signin",
  },
});
