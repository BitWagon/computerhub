
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
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

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [orderNumber, setOrderNumber] =
    useState("");

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
    subtotal >= 500 || subtotal === 0
      ? 0
      : 25;

  const total = subtotal + delivery;

  // ==========================================
  // LOAD SAVED CHECKOUT ADDRESS
  // ==========================================
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      const savedAddress =
        localStorage.getItem(
          "computerhub_checkout_address"
        );

      if (savedAddress) {
        const parsedAddress =
          JSON.parse(savedAddress);

        if (
          parsedAddress &&
          typeof parsedAddress === "object"
        ) {
          setAddress((current) => ({
            ...current,
            ...parsedAddress,
          }));
        }
      }
    } catch (error) {
      console.error(
        "Failed to load checkout address:",
        error
      );
    }
  }, [isLoaded]);

  // ==========================================
  // SAVE CHECKOUT ADDRESS
  // ==========================================
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        "computerhub_checkout_address",
        JSON.stringify(address)
      );
    } catch (error) {
      console.error(
        "Failed to save checkout address:",
        error
      );
    }
  }, [address, isLoaded]);

  // ==========================================
  // VALIDATE CHECKOUT
  // ==========================================
  const validateCheckout = () => {
    const requiredFields = [
      ["firstName", "First name"],
      ["lastName", "Last name"],
      ["email", "Email address"],
      ["phone", "Phone number"],
      ["country", "Country"],
      ["city", "City"],
      ["postalCode", "Postal code"],
      ["address", "Street address"],
    ];

    for (const [field, label] of requiredFields) {
      if (
        !String(
          address[field] || ""
        ).trim()
      ) {
        return `${label} is required.`;
      }
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        address.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    // Card payment is not connected yet.
    if (paymentMethod === "card") {
      return "Card payments are not connected to a live payment gateway yet. Please select Cash on Delivery.";
    }

    return "";
  };

  // ==========================================
  // STEP 6 + STEP 7
  // REAL ORDER CREATION
  // ==========================================
  const handlePlaceOrder = async () => {
    setError("");

    // Check cart
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      router.push("/cart");
      return;
    }

    // Validate customer information
    const validationError =
      validateCheckout();

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

      console.log(
        "📦 Sending order to MongoDB..."
      );

      // ======================================
      // SEND REAL ORDER TO API
      // ======================================
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customer: address,

            items: cartItems,

            subtotal,

            delivery,

            total,

            paymentMethod,
          }),
        }
      );

      // ======================================
      // READ API RESPONSE
      // ======================================
      const data =
        await response.json();

      console.log(
        "📦 Order API response:",
        data
      );

      // ======================================
      // CHECK API ERROR
      // ======================================
      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to create order."
        );
      }

      // ======================================
      // REAL ORDER SUCCESS
      // ======================================
      console.log(
        "✅ REAL COMPUTERHUB ORDER CREATED:"
      );

      console.log(
        data.order
      );

      const createdOrderNumber =
        data.order.orderNumber;

      // Save order number for confirmation screen
      setOrderNumber(
        createdOrderNumber
      );

      // Show confirmation
      setOrderPlaced(true);

      // Clear cart after MongoDB order succeeds
      clearCart();

      toast.success(
        `Order ${createdOrderNumber} placed successfully!`
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {
      console.error(
        "❌ Order creation error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to place order. Please try again.";

      setError(errorMessage);

      toast.error(errorMessage);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-main flex min-h-[60vh] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading checkout...
            </p>

          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ORDER CONFIRMATION
  // ==========================================
  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-main">

          <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                className="text-green-600"
                size={44}
              />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Order Confirmed
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Thank You for Your Order!
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Your ComputerHub order has
              been successfully placed.
              We will process your order
              and prepare it for delivery.
            </p>

            <div className="mx-auto mt-7 max-w-md rounded-2xl bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Order Number
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {orderNumber}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Payment Method
              </p>

              <p className="mt-1 font-semibold capitalize text-gray-900">
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : paymentMethod}
              </p>

            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <ShoppingBag
                  size={18}
                />

                Continue Shopping
              </Link>

              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                View My Orders
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back to Home
              </Link>

            </div>

          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-main">

          <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <ShoppingBag
                className="text-blue-600"
                size={40}
              />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Your Cart Is Empty
            </h1>

            <p className="mt-3 text-gray-500">
              Add some products to your
              cart before continuing to
              checkout.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <ShoppingBag
                size={18}
              />

              Browse Products
            </Link>

          </div>

        </div>
      </main>
    );
  }

  // ==========================================
  // CHECKOUT
  // ==========================================
  return (
    <main className="min-h-screen bg-gray-50 py-8 md:py-12">

      <div className="container-main">

        <div className="mb-8">

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
          >
            <ArrowLeft
              size={17}
            />

            Back to Cart
          </Link>

          <div className="mt-5">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Secure Checkout
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Complete Your Order
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Enter your delivery
              information and select your
              preferred payment method.
            </p>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

          {/* LEFT */}
          <div className="space-y-6">

            <AddressForm
              address={address}
              setAddress={setAddress}
            />

            <PaymentForm
              paymentMethod={
                paymentMethod
              }
              setPaymentMethod={
                setPaymentMethod
              }
            />

          </div>

          {/* RIGHT */}
          <div>

            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              delivery={delivery}
              total={total}
              onPlaceOrder={
                handlePlaceOrder
              }
              isPlacingOrder={
                isPlacingOrder
              }
            />

          </div>

        </div>

      </div>

    </main>
  );
}

