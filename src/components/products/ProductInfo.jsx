"use client";

import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [addedMessage, setAddedMessage] =
    useState("");

  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const {
    name,
    price,
    oldPrice,
    discount,
    rating,
    reviews,
    seller,
    stock,
    freeDelivery,
    description,
  } = product;

  const increaseQuantity = () => {
    if (stock && quantity < stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const handleAddToCart = () => {
    if (!stock || stock <= 0) {
      return;
    }

    addToCart(product, quantity);

    setAddedMessage(
      `${quantity} ${
        quantity === 1 ? "item" : "items"
      } added to your cart.`
    );

    setTimeout(() => {
      setAddedMessage("");
    }, 3000);
  };

  const savings =
    Number(oldPrice || 0) -
    Number(price || 0);

  return (
    <div className="flex h-full flex-col">
      {/* Product Name */}
      <h1 className="text-2xl font-bold leading-9 text-gray-900 md:text-3xl">
        {name}
      </h1>

      {/* Rating */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-semibold text-gray-800">
            {rating || "0.0"}
          </span>
        </div>

        <span className="text-sm text-gray-500">
          {reviews || 0} reviews
        </span>

        <span className="text-gray-300">
          •
        </span>

        <span className="text-sm text-gray-500">
          Verified product
        </span>
      </div>

      {/* Seller */}
      {seller && (
        <p className="mt-3 text-sm text-gray-500">
          Sold by{" "}
          <span className="font-semibold text-gray-700">
            {seller}
          </span>
        </p>
      )}

      <div className="my-5 border-t border-gray-200" />

      {/* Price */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            ${Number(price || 0).toLocaleString()}
          </span>

          {oldPrice && (
            <span className="text-lg text-gray-400 line-through">
              ${Number(oldPrice).toLocaleString()}
            </span>
          )}

          {discount && (
            <span className="rounded-md bg-red-100 px-2 py-1 text-sm font-bold text-red-600">
              {discount}% OFF
            </span>
          )}
        </div>

        {savings > 0 && (
          <p className="mt-1 text-sm font-medium text-green-600">
            You save $
            {savings.toLocaleString()}
          </p>
        )}
      </div>

      {/* Delivery */}
      <div className="mt-5 rounded-lg bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <Truck
            size={21}
            className="mt-0.5 flex-shrink-0 text-green-600"
          />

          <div>
            <p className="font-semibold text-green-700">
              {freeDelivery
                ? "Free delivery"
                : "Delivery available"}
            </p>

            <p className="mt-1 text-sm leading-5 text-green-600">
              Fast and secure delivery available
              for this product.
            </p>
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="mt-4">
        {stock > 0 ? (
          <p className="text-sm font-semibold text-green-600">
            In stock — {stock} available
          </p>
        ) : (
          <p className="text-sm font-semibold text-red-600">
            Out of stock
          </p>
        )}
      </div>

      {/* Quantity */}
      {stock > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-gray-800">
            Quantity
          </p>

          <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-300">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={16} />
            </button>

            <span className="flex h-10 w-12 items-center justify-center border-x border-gray-300 text-sm font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={
                quantity >= stock
              }
              className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Added Message */}
      {addedMessage && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {addedMessage}
          <div className="mt-1">
            <Link
              href="/cart"
              className="font-bold underline"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!stock}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <ShoppingCart size={19} />
          Add to Cart
        </button>

        <Link
          href={stock ? "/checkout" : "#"}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-100 px-5 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-200 ${
            !stock
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          <Zap size={19} />
          Buy Now
        </Link>
      </div>

      {/* Wishlist */}
      <button
        type="button"
        onClick={() =>
          setFavorite(!favorite)
        }
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <Heart
          size={19}
          className={
            favorite
              ? "fill-red-500 text-red-500"
              : ""
          }
        />

        {favorite
          ? "Added to Wishlist"
          : "Add to Wishlist"}
      </button>

      {/* Description */}
      {description && (
        <div className="mt-7 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-bold text-gray-900">
            Product Description
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}