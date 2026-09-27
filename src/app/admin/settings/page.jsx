"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Settings,
  Store,
  Shield,
  Mail,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "",
    storeEmail: "",
    supportEmail: "",
    currency: "PKR",
    country: "Pakistan",
    maintenanceMode: false,
    allowSellerRegistration: true,
    allowCustomerRegistration: true,
    requireReviewApproval: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/settings", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load settings."
        );
      }

      setSettings((current) => ({
        ...current,
        ...(data.settings || {}),
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function saveSettings() {
    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save settings."
        );
      }

      toast.success("Settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings."
      );

      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Admin
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Settings
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your ComputerHub store settings.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSettings}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STORE INFORMATION */}
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Store className="text-blue-600" />

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Store Information
              </h2>

              <p className="text-sm text-gray-500">
                Basic marketplace details.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Store Name
              </label>

              <input
                type="text"
                value={settings.storeName}
                onChange={(e) =>
                  updateField("storeName", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Store Email
              </label>

              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) =>
                  updateField("storeEmail", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
                {/* CONTACT SETTINGS */}
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Mail className="text-blue-600" />

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Contact Settings
              </h2>

              <p className="text-sm text-gray-500">
                Customer support information.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Support Email
              </label>

              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) =>
                  updateField("supportEmail", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Currency
              </label>

              <select
                value={settings.currency}
                onChange={(e) =>
                  updateField("currency", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Country
              </label>

              <input
                type="text"
                value={settings.country}
                onChange={(e) =>
                  updateField("country", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* PLATFORM SETTINGS */}
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Globe className="text-blue-600" />

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Platform Settings
              </h2>

              <p className="text-sm text-gray-500">
                Registration and review controls.
              </p>
            </div>
          </div>

          <div className="space-y-5">

            <label className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-semibold text-gray-900">
                  Allow Seller Registration
                </p>

                <p className="text-sm text-gray-500">
                  New sellers can create accounts.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.allowSellerRegistration}
                onChange={(e) =>
                  updateField(
                    "allowSellerRegistration",
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-semibold text-gray-900">
                  Allow Customer Registration
                </p>

                <p className="text-sm text-gray-500">
                  Customers can create new accounts.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.allowCustomerRegistration}
                onChange={(e) =>
                  updateField(
                    "allowCustomerRegistration",
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-semibold text-gray-900">
                  Require Review Approval
                </p>

                <p className="text-sm text-gray-500">
                  Reviews require admin approval before appearing.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.requireReviewApproval}
                onChange={(e) =>
                  updateField(
                    "requireReviewApproval",
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>

          </div>
        </div>

        {/* SECURITY SETTINGS */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Shield className="text-blue-600" />

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Security Settings
              </h2>

              <p className="text-sm text-gray-500">
                Marketplace protection options.
              </p>
            </div>
          </div>

          <label className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-semibold text-gray-900">
                Maintenance Mode
              </p>

              <p className="text-sm text-gray-500">
                Temporarily disable public access.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                updateField(
                  "maintenanceMode",
                  e.target.checked
                )
              }
              className="h-5 w-5"
            />
          </label>
        </div>
                {/* SAVE BUTTON */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* SYSTEM INFORMATION */}
        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Settings className="text-blue-600" />

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                System Information
              </h2>

              <p className="text-sm text-gray-500">
                ComputerHub marketplace status.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Platform
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                ComputerHub
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Environment
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                Production
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Default Currency
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {settings.currency}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Country
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {settings.country}
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}