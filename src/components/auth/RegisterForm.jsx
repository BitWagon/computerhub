"use client";

import Link from "next/link";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  UserPlus,
  Check,
} from "lucide-react";
import { useState } from "react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!formData.terms) {
      newErrors.terms =
        "You must accept the terms and conditions.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    /*
      Registration API will be connected in the
      backend/authentication phase.

      For now, this only validates the form.
    */

    setMessage(
      "Registration form is valid. Account creation will be connected to the backend in the next authentication phase."
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Name */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            First name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                errors.firstName
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.firstName && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Last name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                errors.lastName
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.lastName && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
              errors.email
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />
        </div>

        {errors.email && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="password"
            name="password"
            type={
              showPassword ? "text" : "password"
            }
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className={`w-full rounded-lg border bg-white py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
              errors.password
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.password}
          </p>
        )}

        <p className="mt-1.5 text-xs text-gray-400">
          Use at least 6 characters.
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Confirm password
        </label>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="confirmPassword"
            name="confirmPassword"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`w-full rounded-lg border bg-white py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
              errors.confirmPassword
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms */}
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          <span className="text-sm leading-6 text-gray-600">
            I agree to the{" "}
            <Link
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {errors.terms && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.terms}
          </p>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
          <Check
            size={18}
            className="mt-0.5 flex-shrink-0"
          />

          <span>{message}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
      >
        <UserPlus size={18} />
        Create Account
      </button>

      {/* Login */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Login
        </Link>
      </p>
    </form>
  );
}