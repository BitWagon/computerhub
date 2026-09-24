import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const AUTH_COOKIE_NAME = "computerhub_token";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // =========================================================
  // ADMIN LOGIN PAGE
  // =========================================================

  if (pathname === "/admin/login") {
    if (!token) {
      return NextResponse.next();
    }

    try {
      if (!JWT_SECRET) {
        return NextResponse.next();
      }

      const decoded = jwt.verify(
        token,
        JWT_SECRET
      );

      if (decoded.role === "admin") {
        return NextResponse.redirect(
          new URL("/admin", request.url)
        );
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.next();
    }
  }

  // =========================================================
  // ADMIN ROUTES
  // ONLY ADMIN CAN ACCESS
  // =========================================================

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    if (!token) {
      const loginUrl = new URL(
        "/admin/login",
        request.url
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    try {
      if (!JWT_SECRET) {
        console.error(
          "JWT_SECRET is missing."
        );

        return NextResponse.redirect(
          new URL(
            "/admin/login",
            request.url
          )
        );
      }

      const decoded = jwt.verify(
        token,
        JWT_SECRET
      );

      if (decoded.role !== "admin") {
        return NextResponse.redirect(
          new URL("/account", request.url)
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.error(
        "Admin authorization error:",
        error
      );

      const loginUrl = new URL(
        "/admin/login",
        request.url
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  // =========================================================
  // SELLER ROUTES
  //
  // SELLERS ARE NO LONGER ALLOWED TO MANAGE PRODUCTS.
  //
  // ADMIN CAN STILL OPEN THE OLD SELLER PRODUCT PAGES.
  // This lets us reuse your existing product add/edit pages
  // without rebuilding them.
  // =========================================================

  if (
    pathname === "/seller" ||
    pathname.startsWith("/seller/")
  ) {
    if (!token) {
      const loginUrl = new URL(
        "/login",
        request.url
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    try {
      if (!JWT_SECRET) {
        console.error(
          "JWT_SECRET is missing."
        );

        return NextResponse.redirect(
          new URL(
            "/login",
            request.url
          )
        );
      }

      const decoded = jwt.verify(
        token,
        JWT_SECRET
      );

      // =====================================================
      // ADMIN
      // Admin is allowed to use the existing product
      // management pages under /seller/products.
      // =====================================================

      if (decoded.role === "admin") {
        return NextResponse.next();
      }

      // =====================================================
      // SELLER
      // Sellers can no longer access seller dashboard.
      // =====================================================

      if (decoded.role === "seller") {
        return NextResponse.redirect(
          new URL("/account", request.url)
        );
      }

      // =====================================================
      // CUSTOMER
      // =====================================================

      return NextResponse.redirect(
        new URL("/account", request.url)
      );
    } catch (error) {
      console.error(
        "Seller authorization error:",
        error
      );

      const loginUrl = new URL(
        "/login",
        request.url
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// =========================================================
// MIDDLEWARE MATCHER
// =========================================================

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
  ],
};