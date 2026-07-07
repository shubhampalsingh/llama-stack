import { NextRequest, NextResponse } from "next/server";

// Lightweight cookie-presence redirect for owner pages. Public bot pages
// (/b, /embed) and the chat API are intentionally NOT matched here.
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
  matcher: ["/app/:path*", "/bot/:path*", "/settings/:path*"],
};
