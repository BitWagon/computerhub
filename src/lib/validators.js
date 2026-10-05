export function cleanString(
  value,
  fallback = ""
) {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value).trim();
}

export function normalizeEmail(
  email
) {
  return cleanString(email)
    .toLowerCase();
}

export function isValidEmail(
  email
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    normalizeEmail(email)
  );
}

export function isValidObjectId(
  value
) {
  return /^[a-f\d]{24}$/i.test(
    String(value || "")
  );
}

export function positiveNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return fallback;
  }

  return number;
}

export function positiveInteger(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  if (
    !Number.isInteger(number) ||
    number < 0
  ) {
    return fallback;
  }

  return number;
}

export function createSlug(
  value
) {
  return cleanString(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeImages(
  images
) {
  if (!Array.isArray(images)) {
    if (
      typeof images ===
      "string"
    ) {
      return images
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);
    }

    return [];
  }

  return images
    .map((item) =>
      typeof item ===
      "string"
        ? item.trim()
        : ""
    )
    .filter(Boolean);
}

export function calculateDiscount(
  price,
  oldPrice
) {
  const current =
    Number(price) || 0;

  const previous =
    Number(oldPrice) || 0;

  if (
    previous <= 0 ||
    current >= previous
  ) {
    return 0;
  }

  return Math.round(
    ((previous - current) /
      previous) *
      100
  );
}

export function sanitizePagination(
  searchParams
) {
  const pageValue =
    Number(
      searchParams.get("page")
    );

  const limitValue =
    Number(
      searchParams.get("limit")
    );

  const page =
    Number.isInteger(pageValue) &&
    pageValue > 0
      ? pageValue
      : 1;

  const limit =
    Number.isInteger(limitValue) &&
    limitValue > 0
      ? Math.min(
          limitValue,
          100
        )
      : 24;

  return {
    page,
    limit,
    skip:
      (page - 1) * limit,
  };
}