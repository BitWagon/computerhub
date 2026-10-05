import { NextResponse } from "next/server";

import {
  clearAuthCookie,
} from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookie();

    return NextResponse.json(
      {
        success: true,
        message:
          "Logout successful.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/auth/logout:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to logout.",
      },
      {
        status: 500,
      }
    );
  }
}