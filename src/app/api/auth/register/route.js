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
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      terms,
    } = body;

    console.log("====================================");
    console.log("📝 NEW REGISTRATION REQUEST");
    console.log("Email:", email);
    console.log("====================================");

    if (!firstName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "First name is required.",
        },
        { status: 400 }
      );
    }

    if (!lastName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Last name is required.",
        },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
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

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    if (!terms) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must accept the terms and conditions.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "customer",
      isActive: true,
    });

    const token = createToken(user);

    setAuthCookie(token, true);

    console.log("====================================");
    console.log("✅ NEW COMPUTERHUB USER");
    console.log("User ID:", user._id.toString());
    console.log(
      "Name:",
      `${user.firstName} ${user.lastName}`
    );
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("====================================");

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully.",
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "❌ REGISTER ERROR:"
    );
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to create account.",
      },
      { status: 500 }
    );
  }
}