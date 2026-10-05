import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import {
  requireAdmin,
  serializeAdminUser,
} from "@/lib/adminAuth";

const ALLOWED_ROLES = [
  "customer",
  "seller",
  "admin",
];

export async function GET() {
  try {
    await connectDB();

    const auth =
      await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authorization required.",
        },
        {
          status: 403,
        }
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

        users:
          users.map(
            serializeAdminUser
          ),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/users:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load users.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request
) {
  try {
    await connectDB();

    const auth =
      await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authorization required.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const userId =
      String(
        body.userId || ""
      ).trim();

    const role =
      body.role;

    const hasRole =
      role !== undefined;

    const hasActive =
      body.isActive !==
      undefined;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !hasRole &&
      !hasActive
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nothing to update.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      hasRole &&
      !ALLOWED_ROLES.includes(
        role
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid user role.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      hasActive &&
      typeof body.isActive !==
        "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "isActive must be true or false.",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const adminId =
      auth.user._id.toString();

    if (
      user._id.toString() ===
      adminId
    ) {
      if (
        hasRole &&
        role !== "admin"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You cannot remove your own administrator role.",
          },
          {
            status: 403,
          }
        );
      }

      if (
        hasActive &&
        body.isActive ===
          false
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You cannot deactivate your own account.",
          },
          {
            status: 403,
          }
        );
      }
    }

    /*
     * Never allow the last active admin
     * to be removed.
     */

    if (
      user.role === "admin" &&
      (
        (
          hasRole &&
          role !== "admin"
        ) ||
        (
          hasActive &&
          body.isActive ===
            false
        )
      )
    ) {
      const activeAdmins =
        await User.countDocuments({
          role: "admin",
          isActive: true,
        });

      if (
        activeAdmins <= 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The last active administrator cannot be removed or deactivated.",
          },
          {
            status: 403,
          }
        );
      }
    }

    if (hasRole) {
      user.role = role;
    }

    if (hasActive) {
      user.isActive =
        body.isActive;
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,

        message:
          "User updated successfully.",

        user:
          serializeAdminUser(
            user
          ),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH /api/admin/users:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update user.",
      },
      {
        status: 500,
      }
    );
  }
}