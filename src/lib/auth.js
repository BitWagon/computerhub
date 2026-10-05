import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "computerhub_token";

const REMEMBER_MAX_AGE = 60 * 60 * 24 * 7;
const NORMAL_MAX_AGE = 60 * 60 * 24;

function getJWTSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  if (secret.length < 32) {
    throw new Error(
      "JWT_SECRET must contain at least 32 characters."
    );
  }

  return secret;
}

export function createToken(
  user,
  remember = true
) {
  const userId =
    user?._id?.toString?.() ||
    user?.id?.toString?.() ||
    user?.userId?.toString?.();

  if (!userId) {
    throw new Error(
      "Cannot create authentication token without a user ID."
    );
  }

  return jwt.sign(
    {
      id: userId,
      userId,
      email: user.email,
      role: user.role,
    },
    getJWTSecret(),
    {
      expiresIn: remember
        ? "7d"
        : "1d",
    }
  );
}

export function verifyToken(
  token
) {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(
      token,
      getJWTSecret()
    );
  } catch {
    return null;
  }
}

export async function getCurrentUserToken() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      COOKIE_NAME
    )?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function getCurrentUser() {
  return getCurrentUserToken();
}

export async function setAuthCookie(
  token,
  remember = true
) {
  const cookieStore =
    await cookies();

  cookieStore.set(
    COOKIE_NAME,
    token,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      maxAge: remember
        ? REMEMBER_MAX_AGE
        : NORMAL_MAX_AGE,
    }
  );
}

export async function clearAuthCookie() {
  const cookieStore =
    await cookies();

  cookieStore.set(
    COOKIE_NAME,
    "",
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      maxAge: 0,

      expires: new Date(0),
    }
  );
}

export function sanitizeUser(
  user
) {
  if (!user) {
    return null;
  }

  const id =
    user?._id?.toString?.() ||
    user?.id?.toString?.() ||
    user?.userId?.toString?.() ||
    null;

  const name =
    user.name ||
    `${user.firstName || ""} ${
      user.lastName || ""
    }`.trim();

  return {
    id,
    _id: id,

    firstName:
      user.firstName || "",

    lastName:
      user.lastName || "",

    name,

    email:
      user.email || "",

    role:
      user.role || "customer",

    isActive:
      user.isActive !== false,

    createdAt:
      user.createdAt || null,

    updatedAt:
      user.updatedAt || null,
  };
}