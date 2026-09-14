"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();

  const stock = Number(product?.stock || 0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = Number(product?.price || 0);
  const oldPrice = Number(product?.oldPrice || 0);
  const discount = Number(product?.discount || 0);

  const increaseQuantity = () => {
    setQuantity((current) => {
      if (stock > 0 && current >= stock) {
        return current;
      }

      return current + 1;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((current) => {
      if (current <= 1) {
        return 1;
      }

      return current - 1;
    });
  };

  const handleAddToCart = () => {
    if (!product || stock <= 0) {
      return;
    }

    const cartProduct = {
      ...product,
      id: product._id?.toString() || product.id?.toString(),
      _id: product._id?.toString() || product.id?.toString(),
      quantity,
      image:
        product.image ||
        product.images?.[0] ||
        "/placeholder-product.png",
      images: product.images || [],
      price,
      oldPrice,
      discount,
    };

    addToCart(cartProduct, quantity);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const productId =
    product?._id?.toString() ||
    product?.id?.toString();

  return (
    <div className="space-y-6">
      {/* PRODUCT NAME */}
      <div>
        {product?.brand && (
          <p className="mb-2 text-sm font-medium text-blue-600">
            {product.brand}
          </p>
        )}

        <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
          {product?.name}
        </h1>

        {product?.shortDescription && (
          <p className="mt-3 text-base leading-7 text-slate-600">
            {product.shortDescription}
          </p>
        )}
      </div>

      {/* RATING */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-lg text-yellow-500">★</span>
          <span className="font-semibold text-slate-900">
            {Number(product?.rating || 0).toFixed(1)}
          </span>
        </div>

        <span className="text-slate-300">|</span>

        <span className="text-sm text-slate-500">
          {Number(product?.reviews || 0)} reviews
        </span>

        {product?.sku && (
          <>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">
              SKU: {product.sku}
            </span>
          </>
        )}
      </div>

      {/* PRICE */}
      <div className="border-y border-slate-200 py-5">
        <div className="flex flex-wrap items-end gap-3">
          <span className="text-3xl font-bold text-slate-900">
            ${price.toLocaleString()}
          </span>

          {oldPrice > price && (
            <span className="pb-1 text-lg text-slate-400 line-through">
              ${oldPrice.toLocaleString()}
            </span>
          )}

          {discount > 0 && (
            <span className="mb-1 rounded-md bg-red-100 px-2.5 py-1 text-sm font-semibold text-red-600">
              {discount}% OFF
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Price includes standard product listing information.
        </p>
      </div>

      {/* STOCK */}
      <div>
        {stock > 0 ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            In Stock
            <span className="font-normal text-slate-500">
              ({stock} available)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Out of Stock
          </div>
        )}
      </div>

      {/* QUANTITY */}
      {stock > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Quantity
          </p>

          <div className="flex w-fit items-center overflow-hidden rounded-lg border border-slate-300">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>

            <div className="flex h-11 min-w-14 items-center justify-center border-x border-slate-300 px-4 font-semibold text-slate-900">
              {quantity}
            </div>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= stock}
              className="flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {added ? (
            <>
              <Check size={20} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={20} />
              Add to Cart
            </>
          )}
        </button>

        {productId && (
          <Link
            href={`/checkout?product=${productId}&quantity=${quantity}`}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-600 px-6 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50 ${
              stock <= 0
                ? "pointer-events-none border-slate-300 text-slate-400"
                : ""
            }`}
          >
            <Zap size={20} />
            Buy Now
          </Link>
        )}

        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <Heart size={20} />
        </button>
      </div>

      {/* ADDED MESSAGE */}
      {added && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          ✓ {quantity} {quantity === 1 ? "item" : "items"} added to your
          cart successfully.
        </div>
      )}

      {/* DELIVERY / FEATURES */}
      <div className="grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 text-blue-600" size={21} />

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Delivery
            </p>

            <p className="text-xs leading-5 text-slate-500">
              {product?.freeDelivery
                ? "Free delivery available"
                : "Delivery options available at checkout"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 text-blue-600" size={21} />

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Secure Shopping
            </p>

            <p className="text-xs leading-5 text-slate-500">
              Safe and secure checkout experience
            </p>
          </div>
        </div>
      </div>

      {/* SELLER */}
      {product?.sellerName && (
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Sold by
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {product.sellerName}
          </p>
        </div>
      )}
    </div>
  );
}