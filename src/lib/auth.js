import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Please define JWT_SECRET inside .env.local"
  );
}

const AUTH_COOKIE_NAME = "computerhub_token";

export function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export function setAuthCookie(token, remember = true) {
  const cookieStore = cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember
      ? 60 * 60 * 24 * 7
      : 60 * 60 * 24,
  });
}

export function clearAuthCookie() {
  const cookieStore = cookies();

  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getAuthToken() {
  const cookieStore = cookies();

  return cookieStore.get(
    AUTH_COOKIE_NAME
  )?.value;
}

export function verifyToken(token) {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(
      token,
      JWT_SECRET
    );
  } catch (error) {
    console.error(
      "JWT verification failed:",
      error
    );

    return null;
  }
}

export function getCurrentUserToken() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  return verifyToken(token);
}