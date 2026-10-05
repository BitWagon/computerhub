import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME =
  "computerhub_token";

function redirectToLogin(
  request
) {
  const loginUrl =
    new URL(
      "/admin/login",
      request.url
    );

  loginUrl.searchParams.set(
    "redirect",
    request.nextUrl.pathname
  );

  return NextResponse.redirect(
    loginUrl
  );
}

export function middleware(
  request
) {
  const { pathname } =
    request.nextUrl;

  /*
   * Admin login must remain public.
   */

  if (
    pathname ===
      "/admin/login" ||
    pathname.startsWith(
      "/admin/login/"
    )
  ) {
    return NextResponse.next();
  }

  /*
   * Only admin pages are handled here.
   *
   * The API performs its own authorization
   * checks as well.
   */

  const isAdminRoute =
    pathname.startsWith(
      "/admin"
    );

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(
      COOKIE_NAME
    )?.value;

  if (!token) {
    return redirectToLogin(
      request
    );
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    console.error(
      "JWT_SECRET is not configured."
    );

    return redirectToLogin(
      request
    );
  }

  try {
    const decoded =
      jwt.verify(
        token,
        secret
      );

    if (
      !decoded ||
      typeof decoded !==
        "object"
    ) {
      return redirectToLogin(
        request
      );
    }

    if (
      decoded.role !==
      "admin"
    ) {
      const destination =
        decoded.role ===
        "seller"
          ? "/seller"
          : "/account";

      return NextResponse.redirect(
        new URL(
          destination,
          request.url
        )
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error(
      "Admin middleware authentication error:",
      error
    );

    return redirectToLogin(
      request
    );
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};