"use client";

import { useState } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";
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

      toast.success("Your message has been sent successfully.");

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
    <main className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="container-main">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Contact information */}
          <div className="rounded-3xl bg-slate-950 p-7 text-white md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">
              Contact ComputerHub
            </p>

            <h1 className="mt-3 text-3xl font-black">
              We're here to help.
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-300">
              Have a question about a product, order or your ComputerHub
              account? Send us a message and our team can review your
              enquiry.
            </p>

            <div className="mt-8 space-y-5">
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
                title="Support"
                value="Customer support enquiries"
              />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Send us a message
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Fields marked with * are required.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
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
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message *
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </form>
          </div>
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
        className="mb-2 block text-sm font-semibold text-gray-700"
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
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function ContactItem({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          {title}
        </p>

        <p className="mt-1 text-sm font-medium text-white">
          {value}
        </p>
      </div>
    </div>
  );
}