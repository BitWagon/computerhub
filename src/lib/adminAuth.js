import User from "@/models/User";
import {
  getCurrentUserToken,
} from "@/lib/auth";

export async function getAdminUser() {
  const token =
    await getCurrentUserToken();

  if (!token) {
    return null;
  }

  const userId =
    token.userId ||
    token.id;

  if (!userId) {
    return null;
  }

  const user =
    await User.findById(
      userId
    );

  if (!user) {
    return null;
  }

  if (
    user.role !== "admin"
  ) {
    return null;
  }

  if (
    user.isActive === false
  ) {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user =
    await getAdminUser();

  if (!user) {
    return {
      authorized: false,
      user: null,
    };
  }

  return {
    authorized: true,
    user,
  };
}

export function serializeAdminUser(
  user
) {
  return {
    id: user._id.toString(),

    _id: user._id.toString(),

    firstName:
      user.firstName || "",

    lastName:
      user.lastName || "",

    name:
      `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim(),

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