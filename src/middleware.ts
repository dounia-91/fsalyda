import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) {
    if (!req.nextUrl.pathname.startsWith("/signin")) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }
  if (token && req.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (token && req.nextUrl.pathname.startsWith("/dashboard")) {
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/adminDashboard", req.url));
    } else if (token.role === "manager") {
      return NextResponse.redirect(new URL("/managerDashboard", req.url));
    }
  }
  if (token && req.nextUrl.pathname.startsWith("/adminDashboard")) {
    if (token.role === "user") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    } else if (token.role === "manager") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
  }
  if (token && req.nextUrl.pathname.startsWith("/managerDashboard")) {
    if (token.role === "user") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
  }
}
export const config = {
  matcher: [
    "/signin",
    "/adminDashboard/:path*",
    "/dashboard/:path*",
    "/managerDashboard/:path*",
  ],
};
