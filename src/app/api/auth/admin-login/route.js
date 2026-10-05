import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import {
  createToken,
  setAuthCookie,
  sanitizeUser,
} from "@/lib/auth";

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function noStoreJson(
  body,
  status = 200
) {
  return NextResponse.json(
    body,
    {
      status,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

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
      return noStoreJson(
        {
          success: false,
          message:
            "Invalid request data.",
        },
        400
      );
    }

    const email =
      normalizeEmail(
        body.email
      );

    const password =
      typeof body.password ===
      "string"
        ? body.password
        : "";

    if (!email) {
      return noStoreJson(
        {
          success: false,
          message:
            "Email address is required.",
        },
        400
      );
    }

    if (!password) {
      return noStoreJson(
        {
          success: false,
          message:
            "Password is required.",
        },
        400
      );
    }

    /*
     * First find the account in MongoDB.
     */
    let user =
      await User.findOne({
        email,
      });

    /*
     * Existing environment-based admin bootstrap
     * remains available.
     *
     * We are NOT changing .env.local.
     */
    const adminEmail =
      normalizeEmail(
        process.env.ADMIN_EMAIL
      );

    const adminPassword =
      typeof process.env.ADMIN_PASSWORD ===
      "string"
        ? process.env.ADMIN_PASSWORD
        : "";

    if (
      adminEmail &&
      adminPassword &&
      email === adminEmail &&
      password === adminPassword
    ) {
      const passwordHash =
        await bcrypt.hash(
          adminPassword,
          12
        );

      if (!user) {
        user =
          await User.create({
            firstName:
              "ComputerHub",

            lastName:
              "Admin",

            email:
              adminEmail,

            password:
              passwordHash,

            role: "admin",

            isActive: true,
          });
      } else {
        user.password =
          passwordHash;

        user.role =
          "admin";

        user.isActive =
          true;

        await user.save();
      }
    }

    /*
     * No account.
     */
    if (!user) {
      return noStoreJson(
        {
          success: false,
          message:
            "Invalid admin email or password.",
        },
        401
      );
    }

    /*
     * Disabled account.
     */
    if (
      user.isActive === false
    ) {
      return noStoreJson(
        {
          success: false,
          message:
            "This admin account is disabled.",
        },
        403
      );
    }

    /*
     * CRITICAL ADMIN ISOLATION:
     *
     * A customer or seller can NEVER log in
     * through the admin login endpoint.
     */
    if (
      user.role !== "admin"
    ) {
      return noStoreJson(
        {
          success: false,
          message:
            "Access denied. This account is not an administrator.",
        },
        403
      );
    }

    /*
     * Verify password against the actual
     * administrator account.
     */
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return noStoreJson(
        {
          success: false,
          message:
            "Invalid admin email or password.",
        },
        401
      );
    }

    /*
     * Create a completely new authentication
     * token for this admin.
     *
     * This replaces any existing customer/seller
     * computerhub_token cookie.
     */
    const token =
      createToken(
        user,
        true
      );

    await setAuthCookie(
      token,
      true
    );

    return noStoreJson(
      {
        success: true,

        message:
          "Admin login successful.",

        user:
          sanitizeUser(user),
      },
      200
    );
  } catch (error) {
    console.error(
      "POST /api/auth/admin-login:",
      error
    );

    return noStoreJson(
      {
        success: false,

        message:
          error?.message ||
          "Unable to complete admin login.",
      },
      500
    );
  }
}