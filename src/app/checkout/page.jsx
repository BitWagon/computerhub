"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  LockKeyhole,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import AddressForm from "@/components/checkout/AddressForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cartItems,
    subtotal,
    isLoaded,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
    address: "",
    notes: "",
  });

  const delivery =
    subtotal >= 500 || subtotal === 0 ? 0 : 15;

  const total = subtotal + delivery;

  useEffect(() => {
    if (!isLoaded) return;

    try {
      const saved = localStorage.getItem(
        "computerhub_checkout_address"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed && typeof parsed === "object") {
          setAddress((current) => ({
            ...current,
            ...parsed,
          }));
        }
      }
    } catch {}
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        "computerhub_checkout_address",
        JSON.stringify(address)
      );
    } catch {}
  }, [address, isLoaded]);

  const validateCheckout = () => {
    const requiredFields = [
      ["firstName", "First name"],
      ["lastName", "Last name"],
      ["email", "Email address"],
      ["phone", "Phone number"],
      ["country", "Country"],
      ["city", "City"],
      ["state", "State / Province"],
      ["postalCode", "Postal code"],
      ["address", "Street address"],
    ];

    for (const [field, label] of requiredFields) {
      if (!String(address[field] || "").trim()) {
        return `${label} is required.`;
      }
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(address.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (paymentMethod === "card") {
      return "Card payments are not connected yet. Please select Cash on Delivery.";
    }

    return "";
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      router.push("/cart");
      return;
    }

    const validationError = validateCheckout();

    if (validationError) {
      setError(validationError);
      toast.error(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setIsPlacingOrder(true);

      const customer = {
        firstName: address.firstName.trim(),
        lastName: address.lastName.trim(),
        email: address.email.trim().toLowerCase(),
        phone: address.phone.trim(),
        address: address.address.trim(),
        city: address.city.trim(),
        postalCode: address.postalCode.trim(),
      };

      const items = cartItems.map((item) => {
        const price = Number(item?.price) || 0;

        const quantity = Math.max(
          1,
          Number(item?.quantity) || 1
        );

        return {
          productId: item?._id || item?.id,
          name: item?.name || "",
          image:
            item?.image ||
            item?.images?.[0] ||
            "",
          price,
          quantity,
          total: price * quantity,
        };
      });

      const invalidItem = items.find(
        (item) => !item.productId
      );

      if (invalidItem) {
        throw new Error(
          "One or more products are missing a product ID."
        );
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          items,
          subtotal,
          deliveryFee: delivery,
          total,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Failed to create order."
        );
      }

      const createdOrderNumber =
        data?.order?.orderNumber ||
        data?.orderNumber ||
        "";

      setOrderNumber(createdOrderNumber);
      setOrderPlaced(true);

      clearCart();

      toast.success("Order placed successfully!");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to place order. Please try again.";

      setError(message);
      toast.error(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  /* Loading */
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main flex min-h-[65vh] items-center justify-center">
          <div className="rounded-3xl border border-slate-200 bg-white px-10 py-8 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Preparing secure checkout...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* Order Success */
  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
        <div className="container-main">

          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-6 py-12 text-center sm:px-10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2
                  size={44}
                  className="text-emerald-600"
                />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Order Confirmed
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Thank You for Your Order
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Your ComputerHub order has been successfully placed.
                We will process your order and prepare it for delivery.
              </p>
            </div>

            <div className="p-6 sm:p-10">

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Order Number
                  </p>

                  <p className="mt-2 break-all text-xl font-black text-slate-950">
                    {orderNumber}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Payment Method
                  </p>

                  <p className="mt-2 text-xl font-black text-slate-950">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : paymentMethod}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <Truck
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-sm font-bold text-blue-900">
                    What happens next?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    Your order will be processed and prepared for delivery.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <ShoppingBag size={18} />
                  Continue Shopping
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* Empty Cart */
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="container-main">

          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">
              <ShoppingBag
                className="text-blue-600"
                size={40}
              />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Checkout
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Your Cart Is Empty
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Add products to your cart before continuing to checkout.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <ShoppingBag size={18} />
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* Checkout */
  return (
    <main className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container-main">

        {/* Header */}
        <div className="mb-8">

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    <LockKeyhole
                      size={23}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                      ComputerHub
                    </p>

                    <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                      Secure Checkout
                    </h1>
                  </div>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Enter your delivery information and confirm your order.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                  <ShieldCheck
                    size={18}
                    className="text-emerald-600"
                  />

                  <span className="text-xs font-bold text-slate-700">
                    Secure Checkout
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                  <Truck
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="text-xs font-bold text-slate-700">
                    Reliable Delivery
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-bold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Checkout Content */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

          <div className="space-y-6">

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Step 1
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Delivery Information
                </h2>
              </div>

              <div className="p-5 sm:p-7">
                <AddressForm
                  address={address}
                  setAddress={setAddress}
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Step 2
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Payment Method
                </h2>
              </div>

              <div className="p-5 sm:p-7">
                <PaymentForm
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              </div>
            </section>

          </div>

          {/* Existing Order Summary */}
          <div>
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              delivery={delivery}
              total={total}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
            />
          </div>

        </div>
      </div>
    </main>
  );
}