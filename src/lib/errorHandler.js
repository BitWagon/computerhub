import { errorResponse } from "./apiResponse";

export function handleApiError(error, defaultMessage = "Internal Server Error") {
  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse(defaultMessage, 500);
}

export function handleValidation(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function asyncHandler(callback, defaultMessage = "Internal Server Error") {
  try {
    return await callback();
  } catch (error) {
    return handleApiError(error, defaultMessage);
  }
}

export function requireFields(body, fields = []) {
  const missing = [];

  for (const field of fields) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ""
    ) {
      missing.push(field);
    }
  }

  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}

export function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function safeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  return fallback;
}