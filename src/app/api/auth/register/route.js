import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import {
  createToken,
  setAuthCookie,
  sanitizeUser,
} from "@/lib/auth";

import {
  normalizeEmail,
  isValidEmail,
  cleanString,
} from "@/lib/validators";

export async function POST(
  request
) {
  try {
    await connectDB();

    let body;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request data.",
        },
        { status: 400 }
      );
    }

    const firstName =
      cleanString(
        body.firstName
      );

    const lastName =
      cleanString(
        body.lastName
      );

    const email =
      normalizeEmail(
        body.email
      );

    const password =
      typeof body.password ===
      "string"
        ? body.password
        : "";

    const confirmPassword =
      typeof body.confirmPassword ===
      "string"
        ? body.confirmPassword
        : "";

    const terms =
      body.terms === true;

    if (!firstName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "First name is required.",
        },
        { status: 400 }
      );
    }

    if (!lastName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Last name is required.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email address is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password is required.",
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

    if (
      password !==
      confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Passwords do not match.",
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

    const existingUser =
      await User.findOne({
        email,
      })
        .select("_id")
        .lean();

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
      await bcrypt.hash(
        password,
        12
      );

    const user =
      await User.create({
        firstName,
        lastName,
        email,
        password:
          hashedPassword,
        role: "customer",
        isActive: true,
      });

    const token =
      createToken(user, true);

    await setAuthCookie(
      token,
      true
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Account created successfully.",

        user:
          sanitizeUser(user),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/auth/register:",
      error
    );

    if (
      error?.code ===
      11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}