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

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

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

    const normalizedEmail =
      email.trim().toLowerCase();

    // ==========================================
    // ENV ADMIN SETTINGS
    // ==========================================

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    // ==========================================
    // ENV ADMIN LOGIN
    // ==========================================
    //
    // If the entered email/password exactly
    // match ADMIN_EMAIL and ADMIN_PASSWORD,
    // automatically create/update that user
    // as an admin in MongoDB.
    //
    // The password is NEVER stored as plain text.
    // It is stored using bcrypt.
    // ==========================================

    if (
      adminEmail &&
      adminPassword &&
      normalizedEmail === adminEmail &&
      password === adminPassword
    ) {
      console.log("🔐 ENV ADMIN CREDENTIALS MATCHED");

      let adminUser =
        await User.findOne({
          email: adminEmail,
        });

      const hashedPassword =
        await bcrypt.hash(
          adminPassword,
          12
        );

      if (!adminUser) {
        adminUser =
          await User.create({
            firstName: "ComputerHub",
            lastName: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            isActive: true,
          });

        console.log(
          "✅ ADMIN USER CREATED FROM .env.local"
        );
      } else {
        adminUser.password =
          hashedPassword;

        adminUser.role = "admin";
        adminUser.isActive = true;

        await adminUser.save();

        console.log(
          "✅ ADMIN USER UPDATED FROM .env.local"
        );
      }

      const token =
        createToken(adminUser);

      setAuthCookie(
        token,
        remember !== false
      );

      console.log("====================================");
      console.log("✅ ADMIN LOGIN SUCCESS");
      console.log(
        "User:",
        `${adminUser.firstName} ${adminUser.lastName}`
      );
      console.log(
        "Email:",
        adminUser.email
      );
      console.log(
        "Role:",
        adminUser.role
      );
      console.log("====================================");

      return NextResponse.json(
        {
          success: true,
          message:
            "Admin login successful.",
          user: {
            id: adminUser._id.toString(),
            firstName:
              adminUser.firstName,
            lastName:
              adminUser.lastName,
            email:
              adminUser.email,
            role:
              adminUser.role,
          },
        },
        { status: 200 }
      );
    }

    // ==========================================
    // NORMAL USER LOGIN
    // ==========================================

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      console.log(
        "❌ USER NOT FOUND:",
        normalizedEmail
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // CHECK ACCOUNT STATUS
    // ==========================================

    if (!user.isActive) {
      console.log(
        "❌ ACCOUNT DISABLED:",
        user.email
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has been disabled.",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      console.log(
        "❌ PASSWORD DOES NOT MATCH:",
        user.email
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // CREATE NORMAL LOGIN TOKEN
    // ==========================================

    const token =
      createToken(user);

    setAuthCookie(
      token,
      remember !== false
    );

    console.log("====================================");
    console.log("✅ LOGIN SUCCESS");
    console.log(
      "User:",
      `${user.firstName} ${user.lastName}`
    );
    console.log(
      "Email:",
      user.email
    );
    console.log(
      "Role:",
      user.role
    );
    console.log("====================================");

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          firstName:
            user.firstName,
          lastName:
            user.lastName,
          email:
            user.email,
          role:
            user.role,
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