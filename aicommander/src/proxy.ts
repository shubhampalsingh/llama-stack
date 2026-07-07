import { NextRequest, NextResponse } from "next/server";

// Lightweight cookie-presence redirect. Real authorization happens server-side
// via auth() in layouts and API routes — this only improves UX for signed-out users.
export function proxy(req: NextRequest) {
  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token");

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/agents/:path*", "/missions/:path*", "/settings/:path*"],
};
