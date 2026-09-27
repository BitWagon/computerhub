// ================================
// ComputerHub Shared Validators
// src/lib/validators.js
// ================================

export function validateEmail(email) {
  if (!email) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email).trim()
  );
}

export function validatePassword(password) {
  if (!password) {
    return {
      valid: false,
      message: "Password is required.",
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}

export function validateName(name) {
  return (
    typeof name === "string" &&
    name.trim().length >= 2
  );
}

export function validatePrice(price) {
  const value = Number(price);

  return Number.isFinite(value) && value >= 0;
}

export function validateStock(stock) {
  const value = Number(stock);

  return Number.isInteger(value) && value >= 0;
}

export function validateSlug(slug) {
  if (!slug) return false;

  return /^[a-z0-9-]+$/.test(slug);
}

export function validateProduct(data) {
  const errors = {};

  if (!validateName(data.name))
    errors.name = "Product name is required.";

  if (!validatePrice(data.price))
    errors.price = "Invalid price.";

  if (!validateStock(data.stock))
    errors.stock = "Invalid stock.";

  if (!data.category)
    errors.category = "Category is required.";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCategory(data) {
  const errors = {};

  if (!validateName(data.name))
    errors.name = "Category name is required.";

  if (
    data.slug &&
    !validateSlug(data.slug)
  ) {
    errors.slug =
      "Slug can only contain lowercase letters, numbers and hyphens.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignup(data) {
  const errors = {};

  if (!validateName(data.firstName))
    errors.firstName = "First name is required.";

  if (!validateName(data.lastName))
    errors.lastName = "Last name is required.";

  if (!validateEmail(data.email))
    errors.email = "Invalid email.";

  const password =
    validatePassword(data.password);

  if (!password.valid)
    errors.password = password.message;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLogin(data) {
  const errors = {};

  if (!validateEmail(data.email))
    errors.email = "Invalid email.";

  if (!data.password)
    errors.password = "Password is required.";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}