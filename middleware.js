import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/products",
    "/search",
    "/contact",
    "/about",
    "/faq",
    "/privacy",
    "/cookies",
    "/terms",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If user is not logged in
  if (!token) {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/seller") ||
      pathname.startsWith("/account") ||
      pathname.startsWith("/orders")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Admin only
    if (pathname.startsWith("/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Seller only
    if (pathname.startsWith("/seller") && user.role !== "seller") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Customer only
    if (
      (pathname.startsWith("/account") || pathname.startsWith("/orders")) &&
      user.role !== "customer"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware JWT Error:", error);

    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/account/:path*",
    "/orders/:path*",
  ],
};