"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setError("");

    // ============================================================
    // VALIDATION
    // ============================================================

    const email = formData.email.trim().toLowerCase();

    if (!email) {
      const message = "Please enter your email address.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!formData.password) {
      const message = "Please enter your password.";
      setError(message);
      toast.error(message);
      return;
    }

    // ============================================================
    // LOGIN
    // ============================================================

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        /*
         * Make sure browser cookies are included and
         * the authentication cookie returned by the API
         * is accepted by the browser.
         */
        credentials: "include",

        cache: "no-store",

        body: JSON.stringify({
          email,
          password: formData.password,
          remember: formData.remember,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid login response."
        );
      }

      console.log("====================================");
      console.log("LOGIN FORM RESPONSE");
      console.log("Status:", response.status);
      console.log("Success:", data?.success);
      console.log("User:", data?.user);
      console.log("Role:", data?.user?.role);
      console.log("====================================");

      // ==========================================================
      // LOGIN FAILED
      // ==========================================================

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to login."
        );
      }

      // ==========================================================
      // USER DATA CHECK
      // ==========================================================

      if (!data.user) {
        throw new Error(
          "Login succeeded, but the server did not return user information."
        );
      }

      const user = data.user;

      // ==========================================================
      // SAVE USER FOR CLIENT UI
      // ==========================================================

      try {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        window.dispatchEvent(
          new Event("storage")
        );
      } catch (storageError) {
        console.warn(
          "Could not update localStorage:",
          storageError
        );
      }

      toast.success("Login successful!");

      // ==========================================================
      // DETERMINE DESTINATION
      // ==========================================================

      let destination = "/account";

      if (user.role === "admin") {
        destination = "/admin";
      } else if (user.role === "seller") {
        destination = "/seller";
      } else {
        destination = "/account";
      }

      console.log(
        "LOGIN REDIRECT:",
        destination
      );

      // ==========================================================
      // IMPORTANT:
      //
      // Use full browser navigation instead of router.push().
      //
      // This makes the browser request /admin again after the
      // authentication cookie has been received from the login
      // response.
      // ==========================================================

      await new Promise((resolve) =>
        setTimeout(resolve, 150)
      );

      window.location.href = destination;
    } catch (error) {
      console.error(
        "LOGIN FORM ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to login.";

      setError(message);
      toast.error(message);

      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ======================================================
          EMAIL
      ======================================================= */}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* ======================================================
          PASSWORD
      ======================================================= */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <Link
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            disabled={isLoading}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
      </div>

      {/* ======================================================
          REMEMBER ME
      ======================================================= */}

      <label className="flex items-center gap-3 text-sm text-slate-600">
        <input
          name="remember"
          type="checkbox"
          checked={formData.remember}
          onChange={handleChange}
          disabled={isLoading}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />

        Remember me
      </label>

      {/* ======================================================
          SUBMIT
      ======================================================= */}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading && (
          <Loader2
            size={19}
            className="animate-spin"
          />
        )}

        {isLoading
          ? "Signing in..."
          : "Sign In"}
      </button>

      {/* ======================================================
          REGISTER
      ======================================================= */}

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{" "}

        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}