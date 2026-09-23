import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  console.log("pathName :", pathname);

  if (pathname.startsWith("/admin")) {
    const secret = process.env.JWT_SEC;

    if (!secret) {
      console.warn(
        "JWT_SEC is not configured. Skipping admin auth verification to avoid a runtime crash.",
      );
      return NextResponse.next();
    }

    const token = req.cookies.get("X-AS-Token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
      );

      if (!["admin", "editor"].includes(payload.role)) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
