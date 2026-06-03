import { auth } from "@/lib/auth";

// Guard every /admin route. Auth.js redirects unauthenticated (or
// non-allowlisted, via the authorized() callback) requests to the signIn page.
// /admin/signin is public so the gate itself stays reachable.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/signin")) return;
  if (!req.auth) {
    const url = new URL("/admin/signin", req.nextUrl.origin);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
