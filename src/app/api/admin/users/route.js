import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUserToken } from "@/lib/auth";

const ALLOWED_ROLES = [
  "customer",
  "seller",
  "admin",
];

async function getAdminUser() {
  const token =
    getCurrentUserToken();

  if (!token?.userId) {
    return null;
  }

  const user =
    await User.findById(
      token.userId
    );

  if (
    !user ||
    user.role !== "admin" ||
    user.isActive === false
  ) {
    return null;
  }

  return user;
}

function formatUser(user) {
  return {
    id: user._id.toString(),
    _id: user._id.toString(),

    firstName:
      user.firstName,

    lastName:
      user.lastName,

    email:
      user.email,

    role:
      user.role,

    isActive:
      user.isActive !== false,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| GET /api/admin/users
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    await connectDB();

    const adminUser =
      await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authorization required.",
        },
        { status: 401 }
      );
    }

    const users =
      await User.find({})
        .select(
          "_id firstName lastName email role isActive createdAt updatedAt"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json(
      {
        success: true,
        users: users.map(formatUser),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN USERS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load users.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PATCH /api/admin/users
|--------------------------------------------------------------------------
|
| Supports:
|
| 1. { userId, role }
| 2. { userId, isActive }
|
*/

export async function PATCH(request) {
  try {
    await connectDB();

    const adminUser =
      await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authorization required.",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const {
      userId,
      role,
      isActive,
    } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User ID is required.",
        },
        { status: 400 }
      );
    }

    const user =
      await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ROLE UPDATE
    |--------------------------------------------------------------------------
    */

    if (role !== undefined) {
      if (
        !ALLOWED_ROLES.includes(role)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid role. Allowed roles are customer, seller, and admin.",
          },
          { status: 400 }
        );
      }

      if (
        adminUser._id.toString() ===
        userId
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You cannot change your own role.",
          },
          { status: 403 }
        );
      }

      if (
        user.role === "admin" &&
        role !== "admin"
      ) {
        const adminCount =
          await User.countDocuments({
            role: "admin",
            isActive: true,
          });

        if (adminCount <= 1) {
          return NextResponse.json(
            {
              success: false,
              message:
                "You cannot remove the last active administrator.",
            },
            { status: 403 }
          );
        }
      }

      user.role = role;
    }

    /*
    |--------------------------------------------------------------------------
    | ACTIVE / INACTIVE UPDATE
    |--------------------------------------------------------------------------
    */

    if (
      isActive !== undefined
    ) {
      if (
        typeof isActive !== "boolean"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "isActive must be true or false.",
          },
          { status: 400 }
        );
      }

      if (
        adminUser._id.toString() ===
        userId &&
        isActive === false
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You cannot deactivate your own account.",
          },
          { status: 403 }
        );
      }

      if (
        user.role === "admin" &&
        isActive === false
      ) {
        const activeAdminCount =
          await User.countDocuments({
            role: "admin",
            isActive: true,
          });

        if (activeAdminCount <= 1) {
          return NextResponse.json(
            {
              success: false,
              message:
                "You cannot deactivate the last active administrator.",
            },
            { status: 403 }
          );
        }
      }

      user.isActive =
        isActive;
    }

    if (
      role === undefined &&
      isActive === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nothing to update.",
        },
        { status: 400 }
      );
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "User updated successfully.",
        user: formatUser(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN USERS PATCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update user.",
      },
      { status: 500 }
    );
  }
}