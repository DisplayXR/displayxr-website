import { auth, isAllowed } from "@/lib/auth";

// Guard every /admin route: no session, or a login that is no longer in
// ADMIN_LOGINS, goes to the sign-in page. (With a handler passed to auth(),
// Auth.js ignores a false from the authorized() callback, so the allowlist is
// checked here explicitly.) /admin/signin is public so the gate itself stays
// reachable.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/signin")) return;
  if (!req.auth || !isAllowed(req.auth.user?.login)) {
    const url = new URL("/admin/signin", req.nextUrl.origin);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
