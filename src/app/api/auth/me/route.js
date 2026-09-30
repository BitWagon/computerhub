import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUserToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const tokenData = await getCurrentUserToken();

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await User.findById(tokenData.id || tokenData.userId)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          name:
            user.name ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/auth/me error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load user.",
      },
      { status: 500 }
    );
  }
}