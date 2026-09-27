import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "computerhub-secret-key"
);

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/products",
    "/categories",
    "/cart",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  // No token → Login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin protection
  if (pathname.startsWith("/admin")) {
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Seller protection
  if (pathname.startsWith("/seller")) {
    if (!["seller", "admin"].includes(user.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Customer protection
  if (pathname.startsWith("/account")) {
    if (!["customer", "seller", "admin"].includes(user.role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/account/:path*",
    "/orders/:path*",
    "/checkout/:path*",
  ],
};