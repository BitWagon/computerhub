"use client";

import { MapPin } from "lucide-react";

export default function AddressForm({ address, setAddress }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <MapPin size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Delivery Address
          </h2>

          <p className="text-sm text-gray-500">
            Where should we deliver your order?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Full Name
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            value={address.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={address.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={address.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Country
          </label>

          <input
            id="country"
            name="country"
            type="text"
            value={address.country}
            onChange={handleChange}
            placeholder="Enter country"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            City
          </label>

          <input
            id="city"
            name="city"
            type="text"
            value={address.city}
            onChange={handleChange}
            placeholder="Enter city"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            State / Province
          </label>

          <input
            id="state"
            name="state"
            type="text"
            value={address.state}
            onChange={handleChange}
            placeholder="Enter state or province"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Postal Code
          </label>

          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={address.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Street Address
          </label>

          <textarea
            id="address"
            name="address"
            rows={3}
            value={address.address}
            onChange={handleChange}
            placeholder="House number, street name, apartment, etc."
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Delivery Notes
            <span className="ml-1 font-normal text-gray-400">
              (Optional)
            </span>
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={address.notes}
            onChange={handleChange}
            placeholder="Add any special delivery instructions"
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
}