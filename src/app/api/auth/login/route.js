import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import {
  createToken,
  setAuthCookie,
  sanitizeUser,
} from "@/lib/auth";

function normalizeEmail(
  value
) {
  return String(
    value || ""
  )
    .trim()
    .toLowerCase();
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
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request data.",
        },
        {
          status: 400,
        }
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

    const remember =
      body.remember !== false;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email address is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Optional environment-based admin bootstrap.
     *
     * ADMIN_EMAIL and ADMIN_PASSWORD are used only
     * to create/update the admin account when an admin
     * logs in with those exact credentials.
     */

    const adminEmail =
      normalizeEmail(
        process.env.ADMIN_EMAIL
      );

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (
      adminEmail &&
      adminPassword &&
      email === adminEmail &&
      password === adminPassword
    ) {
      let admin =
        await User.findOne({
          email: adminEmail,
        });

      const passwordHash =
        await bcrypt.hash(
          adminPassword,
          12
        );

      if (!admin) {
        admin =
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
        admin.password =
          passwordHash;

        admin.role =
          "admin";

        admin.isActive =
          true;

        await admin.save();
      }

      const token =
        createToken(
          admin,
          remember
        );

      await setAuthCookie(
        token,
        remember
      );

      return NextResponse.json(
        {
          success: true,

          message:
            "Admin login successful.",

          user:
            sanitizeUser(admin),
        },
        {
          status: 200,
        }
      );
    }

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
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

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const token =
      createToken(
        user,
        remember
      );

    await setAuthCookie(
      token,
      remember
    );

    return NextResponse.json(
      {
        success: true,

        message:
          user.role === "admin"
            ? "Admin login successful."
            : "Login successful.",

        user:
          sanitizeUser(user),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/auth/login:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          "Unable to login.",
      },
      {
        status: 500,
      }
    );
  }
}