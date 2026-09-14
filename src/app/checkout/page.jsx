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

  /*
   * Delivery:
   * $500 or more = FREE
   * Under $500 = $15
   */
  const delivery =
    subtotal >= 500 || subtotal === 0
      ? 0
      : 15;

  const total =
    subtotal + delivery;

  /*
   * Load saved checkout address.
   */
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

  /*
   * Save checkout address.
   */
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

  /*
   * Validate checkout information.
   */
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

    if (paymentMethod === "card") {
      return "Card payments are not connected to a live payment gateway yet. Please select Cash on Delivery.";
    }

    return "";
  };

  /*
   * Place order.
   */
  const handlePlaceOrder = async () => {
    setError("");

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      router.push("/cart");
      return;
    }

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

      /*
       * Send the COMPLETE customer information.
       */
      const customer = {
        fullName:
          `${address.firstName} ${address.lastName}`.trim(),

        email:
          address.email.trim().toLowerCase(),

        phone:
          address.phone.trim(),

        country:
          address.country.trim(),

        city:
          address.city.trim(),

        state:
          address.state.trim(),

        postalCode:
          address.postalCode.trim(),

        address:
          address.address.trim(),

        notes:
          address.notes.trim(),
      };

      /*
       * Send complete order items.
       *
       * The API will use these values and
       * calculate the final totals.
       */
      const items = cartItems.map((item) => {
        const price =
          Number(item?.price) || 0;

        const quantity =
          Math.max(
            1,
            Number(item?.quantity) || 1
          );

        return {
          productId:
            item?._id ||
            item?.id,

          name:
            item?.name || "",

          image:
            item?.image ||
            item?.images?.[0] ||
            "",

          price,

          quantity,

          total:
            price * quantity,
        };
      });

      /*
       * Make sure every product has an ID.
       */
      const invalidItem =
        items.find(
          (item) => !item.productId
        );

      if (invalidItem) {
        throw new Error(
          "One or more products are missing a product ID."
        );
      }

      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customer,

              items,

              subtotal,

              delivery,

              total,

              paymentMethod,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.message ||
            "Failed to create order."
        );
      }

      console.log(
        "===================================="
      );

      console.log(
        "✅ ComputerHub order created"
      );

      console.log(
        "Order:",
        data.order
      );

      console.log(
        "===================================="
      );

      /*
       * Support both response formats.
       */
      const createdOrderNumber =
        data?.order?.orderNumber ||
        data?.orderNumber ||
        "";

      setOrderNumber(
        createdOrderNumber
      );

      setOrderPlaced(true);

      /*
       * Clear cart only AFTER
       * successful order creation.
       */
      clearCart();

      toast.success(
        "Order placed successfully!"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Order creation error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to place order. Please try again.";

      setError(errorMessage);

      toast.error(
        errorMessage
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  /*
   * Loading screen.
   */
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

  /*
   * SUCCESS SCREEN.
   */
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

  /*
   * Empty cart.
   */
  if (
    !Array.isArray(cartItems) ||
    cartItems.length === 0
  ) {
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

  /*
   * CHECKOUT PAGE.
   */
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

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

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

          <div>

            <OrderSummary
              cartItems={
                cartItems
              }

              subtotal={
                subtotal
              }

              delivery={
                delivery
              }

              total={
                total
              }

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