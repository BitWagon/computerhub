"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Failed to send your message."
        );
      }

      toast.success(
        "Your message has been sent successfully."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send your message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="bg-slate-950 text-white">
        <div className="container-main py-12 sm:py-16">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              <MessageSquare size={14} />
              Contact ComputerHub
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              How can we help?
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Have a question about a product, order or your account?
              Send us a message and our team can review your request.
            </p>
          </div>
        </div>
      </section>

      <div className="container-main py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">

          {/* Support information */}
          <aside className="space-y-5">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Support
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Get in touch
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Use the contact form to send your enquiry directly to
                ComputerHub.
              </p>

              <div className="mt-7 space-y-5">
                <ContactItem
                  icon={Mail}
                  title="Email"
                  value="support@computerhub.com"
                />

                <ContactItem
                  icon={Phone}
                  title="Phone"
                  value="+1 000 000 0000"
                />

                <ContactItem
                  icon={MessageSquare}
                  title="Enquiries"
                  value="Products, orders & accounts"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-black text-blue-950">
                    Secure enquiry
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-blue-800">
                    Only provide the information needed to help us
                    understand your request.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Common Questions
              </p>

              <div className="mt-4 space-y-3">
                <Link
                  href="/faq"
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Frequently Asked Questions
                  <ArrowLeft
                    size={15}
                    className="rotate-180"
                  />
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Check My Orders
                  <ArrowLeft
                    size={15}
                    className="rotate-180"
                  />
                </Link>
              </div>
            </div>

          </aside>

          {/* Form */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-6 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Contact Form
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
                Send us a message
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fields marked with * are required.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8"
            >
              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  label="Name *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />

                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />

                <Input
                  label="Subject *"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What can we help with?"
                />

              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Message *
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <span>
                    Please provide accurate contact information so we
                    can respond to your enquiry.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={17} />

                  {isSubmitting
                    ? "Sending..."
                    : "Send Message"}
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function ContactItem({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}