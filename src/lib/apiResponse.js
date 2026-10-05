import { NextResponse } from "next/server";

export function successResponse(
  data = {},
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
}

export function errorResponse(
  message,
  status = 500,
  extra = {}
) {
  return NextResponse.json(
    {
      success: false,
      message:
        message ||
        "Something went wrong.",
      ...extra,
    },
    { status }
  );
}

export function unauthorizedResponse(
  message = "You must be logged in."
) {
  return errorResponse(
    message,
    401
  );
}

export function forbiddenResponse(
  message = "You do not have permission to perform this action."
) {
  return errorResponse(
    message,
    403
  );
}

export function notFoundResponse(
  message = "Resource not found."
) {
  return errorResponse(
    message,
    404
  );
}

export function badRequestResponse(
  message = "Invalid request."
) {
  return errorResponse(
    message,
    400
  );
}