import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const secret = process.env.JWT_SEC;

  if (!secret) {
    console.warn(
      "JWT_SEC is not configured. Skipping admin auth verification to avoid a runtime crash.",
    );
    return NextResponse.next();
  }

  const cookieToken = req.cookies.get("X-AS-Token")?.value;
  const authHeader = req.headers.get("authorization") || "";
  const headerToken = authHeader.startsWith("Bearer ")
    ? authHeader.replace(/^Bearer\s+/i, "")
    : "";
  const token = cookieToken || headerToken;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    const role = typeof payload?.role === "string" ? payload.role : "";

    if (!["admin", "editor"].includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Admin auth check failed:", error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = { matcher: ["/admin/:path*"] };
