import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import {
  getCurrentUserToken,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const tokenData =
      getCurrentUserToken();

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
          user: null,
        },
        { status: 401 }
      );
    }

    const user =
      await User.findById(
        tokenData.userId
      ).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
          user: null,
        },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has been disabled.",
          user: null,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ GET CURRENT USER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to get current user.",
        user: null,
      },
      { status: 500 }
    );
  }
}