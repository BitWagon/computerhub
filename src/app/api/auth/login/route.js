import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import {
  createToken,
  setAuthCookie,
} from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      email,
      password,
      remember,
    } = body;

    console.log("====================================");
    console.log("🔐 LOGIN REQUEST");
    console.log("Email:", email);
    console.log("====================================");

    if (!email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email address is required.",
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has been disabled.",
        },
        { status: 403 }
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const token = createToken(user);

    setAuthCookie(
      token,
      Boolean(remember)
    );

    console.log("====================================");
    console.log("✅ LOGIN SUCCESS");
    console.log(
      "User:",
      `${user.firstName} ${user.lastName}`
    );
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("====================================");

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ LOGIN ERROR:"
    );
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to login.",
      },
      { status: 500 }
    );
  }
}