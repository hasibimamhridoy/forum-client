import { getToken } from "next-auth/jwt"; // ✅ next-auth helper
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // Must match your next-auth secret
  });

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/auth/login") && token) {
    return NextResponse.redirect(new URL("/forum", request.url));
  }

  if (pathname.startsWith("/forum") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/forum/:path*"],
};
