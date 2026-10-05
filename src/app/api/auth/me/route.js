import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import {
  getCurrentUserToken,
  sanitizeUser,
} from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const token =
      await getCurrentUserToken();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const userId =
      token.userId ||
      token.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid authentication token.",
        },
        {
          status: 401,
        }
      );
    }

    const user =
      await User.findById(
        userId
      ).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User account not found.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      user.isActive === false
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has been disabled.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user:
          sanitizeUser(user),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/auth/me:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load your account.",
      },
      {
        status: 500,
      }
    );
  }
}