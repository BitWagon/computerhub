import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUserToken } from "@/lib/auth";

const ALLOWED_ROLES = ["customer", "seller", "admin"];

async function getAdminUser() {
  const token = getCurrentUserToken();

  if (!token?.userId) {
    return null;
  }

  const user = await User.findById(token.userId);

  if (!user || user.role !== "admin" || !user.isActive) {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    await connectDB();

    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authorization required.",
        },
        { status: 401 }
      );
    }

    const users = await User.find({})
      .select(
        "_id firstName lastName email role isActive createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error("❌ ADMIN USERS GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load users.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authorization required.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { userId, role } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid role. Allowed roles are customer, seller, and admin.",
        },
        { status: 400 }
      );
    }

    if (adminUser._id.toString() === userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot change your own role.",
        },
        { status: 403 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (user.role === "admin" && role !== "admin") {
      const adminCount = await User.countDocuments({
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

    await user.save();

    console.log("====================================");
    console.log("🛡️ ADMIN ROLE UPDATE");
    console.log("Changed by:", adminUser.email);
    console.log("User:", user.email);
    console.log("New role:", user.role);
    console.log("====================================");

    return NextResponse.json({
      success: true,
      message: `User role changed to ${role}.`,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("❌ ADMIN ROLE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update user role.",
      },
      { status: 500 }
    );
  }
}