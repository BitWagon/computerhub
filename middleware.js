import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "computerhub_token";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ============================================================
  // PUBLIC ROUTES
  // ============================================================

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

    // IMPORTANT:
    // Admin login must be accessible BEFORE authentication.
    "/admin/login",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ============================================================
  // READ AUTHENTICATION COOKIE
  // ============================================================

  const token = request.cookies.get(COOKIE_NAME)?.value;

  // ============================================================
  // PROTECTED ROUTES
  // ============================================================

  const isAdminRoute = pathname.startsWith("/admin");
  const isSellerRoute = pathname.startsWith("/seller");
  const isAccountRoute = pathname.startsWith("/account");
  const isOrdersRoute = pathname.startsWith("/orders");

  const isProtectedRoute =
    isAdminRoute ||
    isSellerRoute ||
    isAccountRoute ||
    isOrdersRoute;

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // ============================================================
  // USER IS NOT LOGGED IN
  // ============================================================

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // ============================================================
  // VERIFY JWT
  // ============================================================

  try {
    if (!process.env.JWT_SECRET) {
      console.error(
        "Middleware Error: JWT_SECRET is not configured."
      );

      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    const user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================================
    // INVALID USER DATA
    // ==========================================================

    if (
      !user ||
      typeof user !== "object" ||
      !user.role
    ) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    // ==========================================================
    // ADMIN ROUTES
    // ==========================================================

    if (isAdminRoute) {
      if (user.role !== "admin") {
        if (user.role === "seller") {
          return NextResponse.redirect(
            new URL("/seller", request.url)
          );
        }

        return NextResponse.redirect(
          new URL("/account", request.url)
        );
      }

      return NextResponse.next();
    }

    // ==========================================================
    // SELLER ROUTES
    // ==========================================================

    if (isSellerRoute) {
      if (user.role !== "seller") {
        if (user.role === "admin") {
          return NextResponse.redirect(
            new URL("/admin", request.url)
          );
        }

        return NextResponse.redirect(
          new URL("/account", request.url)
        );
      }

      return NextResponse.next();
    }

    // ==========================================================
    // CUSTOMER ACCOUNT / ORDERS ROUTES
    // ==========================================================

    if (
      isAccountRoute ||
      isOrdersRoute
    ) {
      if (user.role !== "customer") {
        if (user.role === "admin") {
          return NextResponse.redirect(
            new URL("/admin", request.url)
          );
        }

        if (user.role === "seller") {
          return NextResponse.redirect(
            new URL("/seller", request.url)
          );
        }

        return NextResponse.redirect(
          new URL("/login", request.url)
        );
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error(
      "Middleware JWT Error:",
      error
    );

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

// ============================================================
// MIDDLEWARE CONFIG
// ============================================================

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/account/:path*",
    "/orders/:path*",
  ],
};