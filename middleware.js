import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "computerhub_token";

function redirectToAdminLogin(request, reason = null) {
  const loginUrl = new URL(
    "/admin/login",
    request.url
  );

  const redirectPath =
    request.nextUrl.pathname +
    (request.nextUrl.search || "");

  loginUrl.searchParams.set(
    "redirect",
    redirectPath
  );

  if (reason) {
    loginUrl.searchParams.set(
      "reason",
      reason
    );
  }

  return NextResponse.redirect(
    loginUrl
  );
}

export function middleware(request) {
  const { pathname } =
    request.nextUrl;

  /*
   * Admin login is public.
   */
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/")
  ) {
    return NextResponse.next();
  }

  /*
   * Middleware only protects /admin.
   *
   * Customer and seller pages are handled by their
   * own page/API authorization.
   */
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(
      COOKIE_NAME
    )?.value;

  if (!token) {
    return redirectToAdminLogin(
      request
    );
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    console.error(
      "JWT_SECRET is not configured."
    );

    return redirectToAdminLogin(
      request
    );
  }

  try {
    const decoded =
      jwt.verify(
        token,
        secret
      );

    /*
     * Only a JWT containing role === "admin"
     * can enter /admin.
     *
     * IMPORTANT:
     * We do NOT send customers/sellers to /account
     * or /seller from middleware anymore.
     *
     * They go back to the admin login page instead.
     */
    if (
      !decoded ||
      typeof decoded !== "object" ||
      decoded.role !== "admin"
    ) {
      return redirectToAdminLogin(
        request,
        "forbidden"
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error(
      "Admin middleware authentication error:",
      error
    );

    return redirectToAdminLogin(
      request
    );
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};