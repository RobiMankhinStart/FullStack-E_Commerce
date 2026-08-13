import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SEC);

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  console.log("pathName :", pathname);

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("X-AS-Token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    console.log("SECRET :", SECRET);

    try {
      //   verify JWT
      const { payload } = await jwtVerify(token, SECRET);

      // role based check
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
