import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "polar-swirl-admin";

function getSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ?? "development-session-secret-change-me",
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page, actions, and API through
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/actions") || pathname.startsWith("/admin/api")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
