import mongoose from "mongoose";
import {
  errorResponse,
} from "@/lib/apiResponse";

export function handleApiError(
  error,
  context = "API"
) {
  console.error(
    `${context} error:`,
    error
  );

  if (
    error instanceof mongoose.Error.ValidationError
  ) {
    const messages =
      Object.values(error.errors)
        .map(
          (item) => item.message
        )
        .filter(Boolean);

    return errorResponse(
      messages.join(", ") ||
        "Validation failed.",
      400
    );
  }

  if (
    error?.code === 11000
  ) {
    const fields =
      Object.keys(
        error.keyPattern || {}
      );

    return errorResponse(
      fields.length
        ? `${fields.join(
            ", "
          )} already exists.`
        : "A record with the same value already exists.",
      409
    );
  }

  if (
    error instanceof mongoose.Error.CastError
  ) {
    return errorResponse(
      "Invalid ID.",
      400
    );
  }

  if (
    error?.name ===
    "JsonWebTokenError"
  ) {
    return errorResponse(
      "Invalid authentication token.",
      401
    );
  }

  return errorResponse(
    process.env.NODE_ENV ===
      "development"
      ? error?.message ||
          "Internal server error."
      : "Internal server error.",
    500
  );
}