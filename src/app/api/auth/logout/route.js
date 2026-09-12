import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    clearAuthCookie();

    console.log(
      "✅ USER LOGGED OUT"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Logout successful.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ LOGOUT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to logout.",
      },
      { status: 500 }
    );
  }
}