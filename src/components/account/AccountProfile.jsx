"use client";

import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AccountProfile({
  user,
}) {
  if (!user) {
    return null;
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Customer";

  const isActive =
    user.isActive !== false;

  const createdAt =
    user.createdAt || user.created_at;

  function formatDate(date) {
    if (!date) {
      return "Not available";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Account
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Profile Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your ComputerHub account details.
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <User className="h-7 w-7 text-blue-600" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <User size={16} />

            <span>Full Name</span>
          </div>

          <p className="font-semibold text-gray-900">
            {fullName}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Mail size={16} />

            <span>Email Address</span>
          </div>

          <p className="break-all font-semibold text-gray-900">
            {user.email || "Not available"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={16} />

            <span>Account Role</span>
          </div>

          <p className="font-semibold capitalize text-gray-900">
            {user.role || "customer"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            {isActive ? (
              <CheckCircle2
                size={16}
                className="text-green-600"
              />
            ) : (
              <XCircle
                size={16}
                className="text-red-600"
              />
            )}

            <span>Account Status</span>
          </div>

          <p
            className={`font-semibold ${
              isActive
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {isActive
              ? "Active"
              : "Disabled"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 sm:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={16} />

            <span>Member Since</span>
          </div>

          <p className="font-semibold text-gray-900">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </section>
  );
}