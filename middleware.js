
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const AUTH_COOKIE_NAME = "computerhub_token";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ==========================================
  // GET AUTH COOKIE
  // ==========================================
  const token =
    request.cookies.get(
      AUTH_COOKIE_NAME
    )?.value;

  // ==========================================
  // PUBLIC ADMIN LOGIN PAGE
  // ==========================================
  if (
    pathname === "/admin/login"
  ) {
    // If there is no token, allow the
    // user to open the admin login page.
    if (!token) {
      return NextResponse.next();
    }

    // If token exists, check the role.
    try {
      if (!JWT_SECRET) {
        return NextResponse.next();
      }

      const decoded = jwt.verify(
        token,
        JWT_SECRET
      );

      // Admin is already logged in.
      // Send admin to dashboard.
      if (
        decoded.role === "admin"
      ) {
        return NextResponse.redirect(
          new URL(
            "/admin",
            request.url
          )
        );
      }

      // Non-admin users can still
      // open the admin login page.
      return NextResponse.next();
    } catch (error) {
      // Invalid/expired token.
      // Let the user log in again.
      return NextResponse.next();
    }
  }

  // ==========================================
  // PROTECT ADMIN ROUTES
  // ==========================================
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    // No token
    if (!token) {
      const loginUrl =
        new URL(
          "/admin/login",
          request.url
        );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }

    // Token exists
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

      // Only admin can access
      // admin pages.
      if (
        decoded.role !== "admin"
      ) {
        return NextResponse.redirect(
          new URL(
            "/account",
            request.url
          )
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.error(
        "Admin authorization error:",
        error
      );

      const loginUrl =
        new URL(
          "/admin/login",
          request.url
        );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }
  }

  // ==========================================
  // PROTECT SELLER ROUTES
  // ==========================================
  if (
    pathname === "/seller" ||
    pathname.startsWith("/seller/")
  ) {
    // No token
    if (!token) {
      const loginUrl =
        new URL(
          "/login",
          request.url
        );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }

    // Token exists
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

      // Only seller can access
      // seller dashboard.
      if (
        decoded.role !== "seller"
      ) {
        // Admin goes to admin dashboard.
        if (
          decoded.role === "admin"
        ) {
          return NextResponse.redirect(
            new URL(
              "/admin",
              request.url
            )
          );
        }

        // Customer goes to account.
        return NextResponse.redirect(
          new URL(
            "/account",
            request.url
          )
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.error(
        "Seller authorization error:",
        error
      );

      const loginUrl =
        new URL(
          "/login",
          request.url
        );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }
  }

  // ==========================================
  // ALL OTHER ROUTES
  // ==========================================
  return NextResponse.next();
}

// ==========================================
// MIDDLEWARE MATCHER
// ==========================================

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
  ],
};

