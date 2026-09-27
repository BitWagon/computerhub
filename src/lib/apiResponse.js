export function successResponse(data = {}, message = "Success", status = 200) {
  return Response.json(
    {
      success: true,
      message,
      ...data,
    },
    { status }
  );
}

export function errorResponse(message = "Something went wrong", status = 500, extra = {}) {
  return Response.json(
    {
      success: false,
      message,
      ...extra,
    },
    { status }
  );
}

export function validationError(errors = {}) {
  return Response.json(
    {
      success: false,
      message: "Validation failed",
      errors,
    },
    { status: 400 }
  );
}

export function unauthorizedResponse() {
  return Response.json(
    {
      success: false,
      message: "Unauthorized",
    },
    { status: 401 }
  );
}

export function forbiddenResponse() {
  return Response.json(
    {
      success: false,
      message: "Forbidden",
    },
    { status: 403 }
  );
}

export function notFoundResponse(message = "Not found") {
  return Response.json(
    {
      success: false,
      message,
    },
    { status: 404 }
  );
}