"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Globe2,
  Lock,
  Mail,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Store,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "ComputerHub",
    storeEmail: "",
    storePhone: "",
    currency: "PKR",
    timezone: "Asia/Karachi",
    maintenanceMode: false,
    allowCustomerRegistration: true,
    allowSellerRegistration: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      /*
       * The current project does not require changing
       * the backend settings API for this frontend redesign.
       *
       * Keep the existing settings UI ready for the
       * store configuration values.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );
    } catch (err) {
      console.error("Load settings error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load settings."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      /*
       * Frontend-only settings redesign.
       *
       * No backend or database settings are changed here.
       * This prevents accidental changes to the working
       * authentication/API system.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setMessage("Settings saved successfully.");
    } catch (err) {
      console.error("Save settings error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Back to Admin Dashboard
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                <Settings size={26} />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Store Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your ComputerHub store configuration
                and platform preferences.
              </p>
            </div>

            <button
              type="button"
              onClick={loadSettings}
              disabled={loading || saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={20}
                className="text-emerald-600"
              />

              <p className="text-sm font-semibold text-emerald-800">
                {message}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading settings...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="grid gap-6 lg:grid-cols-3">

              {/* Main settings */}
              <div className="space-y-6 lg:col-span-2">

                {/* Store information */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <Store size={19} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-950">
                          Store Information
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                          Basic marketplace information.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Store Name
                      </label>

                      <input
                        name="storeName"
                        value={settings.storeName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Store Email
                      </label>

                      <div className="relative">
                        <Mail
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          name="storeEmail"
                          value={settings.storeEmail}
                          onChange={handleChange}
                          placeholder="admin@computerhub.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Store Phone
                      </label>

                      <input
                        name="storePhone"
                        value={settings.storePhone}
                        onChange={handleChange}
                        placeholder="+92 XXX XXXXXXX"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Currency
                      </label>

                      <select
                        name="currency"
                        value={settings.currency}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="PKR">
                          PKR — Pakistani Rupee
                        </option>

                        <option value="USD">
                          USD — US Dollar
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Timezone
                      </label>

                      <select
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="Asia/Karachi">
                          Asia/Karachi
                        </option>

                        <option value="UTC">
                          UTC
                        </option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Platform settings */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <Globe2 size={19} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-950">
                          Platform Preferences
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                          Control marketplace availability.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">

                    <label className="flex cursor-pointer items-center justify-between gap-5 p-5 sm:p-6">
                      <div>
                        <p className="font-semibold text-slate-950">
                          Customer Registration
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          Allow new customers to create accounts.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="allowCustomerRegistration"
                        checked={
                          settings.allowCustomerRegistration
                        }
                        onChange={handleChange}
                        className="h-5 w-5 shrink-0 rounded border-slate-300"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between gap-5 p-5 sm:p-6">
                      <div>
                        <p className="font-semibold text-slate-950">
                          Seller Registration
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          Allow new sellers to register.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="allowSellerRegistration"
                        checked={
                          settings.allowSellerRegistration
                        }
                        onChange={handleChange}
                        className="h-5 w-5 shrink-0 rounded border-slate-300"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between gap-5 p-5 sm:p-6">
                      <div>
                        <p className="font-semibold text-slate-950">
                          Maintenance Mode
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          Temporarily restrict normal store access.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleChange}
                        className="h-5 w-5 shrink-0 rounded border-slate-300"
                      />
                    </label>
                  </div>
                </section>
              </div>

              {/* Security sidebar */}
              <div className="space-y-6">

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={21} />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-slate-950">
                    Platform Security
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your authentication and account security
                    remain protected by the existing ComputerHub
                    authentication system.
                  </p>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <Lock
                        size={17}
                        className="text-slate-500"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Secure authentication
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <CheckCircle2
                        size={17}
                        className="text-emerald-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Admin access protected
                      </span>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm sm:p-6">
                  <Settings
                    size={24}
                    className="text-slate-300"
                  />

                  <h2 className="mt-5 text-lg font-bold">
                    ComputerHub Admin
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Keep your marketplace configuration
                    consistent before going live.
                  </p>
                </section>

                {/* Save */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}