"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { toast } from "sonner";

import {
  useCart,
} from "@/context/CartContext";

import {
  useWishlist,
} from "@/context/WishlistContext";

export default function ProductCard({
  product,
}) {
  const {
    id,
    _id,
    name,
    image,
    images,
    price,
    oldPrice,
    discount,
    rating,
    reviews,
    seller,
    sellerName,
    freeDelivery,
    stock,
  } = product;

  const {
    addToCart,
    isLoaded,
  } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const [
    addingToCart,
    setAddingToCart,
  ] = useState(false);

  /*
   * SUPPORT BOTH id AND _id.
   */
  const productId =
    id ||
    _id?.toString();

  /*
   * PRODUCT IMAGE.
   */
  const productImage =
    image ||
    (Array.isArray(images) &&
    images.length > 0
      ? images[0]
      : "");

  /*
   * PRICE.
   */
  const currentPrice =
    Number(price) || 0;

  const originalPrice =
    Number(oldPrice) || 0;

  /*
   * DISCOUNT.
   */
  let discountPercentage =
    Number(discount) || 0;

  if (
    discountPercentage <= 0 &&
    originalPrice >
      currentPrice &&
    originalPrice > 0
  ) {
    discountPercentage =
      Math.round(
        ((originalPrice -
          currentPrice) /
          originalPrice) *
          100
      );
  }

  /*
   * SAVINGS.
   */
  const savings =
    originalPrice >
    currentPrice
      ? originalPrice -
        currentPrice
      : 0;

  /*
   * RATING.
   */
  const productRating =
    Number(rating) || 0;

  const reviewCount =
    Number(reviews) || 0;

  /*
   * STOCK.
   *
   * IMPORTANT:
   * This value is now also passed
   * into CartContext.
   */
  const productStock =
    Number(stock) || 0;

  const isOutOfStock =
    productStock <= 0;

  /*
   * SELLER.
   */
  const productSeller =
    sellerName ||
    seller ||
    "ComputerHub Official";

  const isWishlisted =
    isInWishlist(
      productId
    );

  /*
   * ADD TO CART.
   */
  function handleAddToCart(
    event
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoaded) {
      toast.error(
        "Please wait while your cart loads."
      );

      return;
    }

    if (!productId) {
      toast.error(
        "Unable to identify this product."
      );

      return;
    }

    if (isOutOfStock) {
      toast.error(
        "Product is out of stock."
      );

      return;
    }

    setAddingToCart(true);

    try {
      /*
       * IMPORTANT FIX:
       *
       * stock is included here.
       *
       * The previous code did NOT send
       * stock, so CartContext received
       * stock = 0 and refused to add
       * the product.
       */
      const added =
        addToCart(
          {
            id: productId,

            _id: productId,

            name,

            image:
              productImage,

            images:
              Array.isArray(
                images
              )
                ? images
                : productImage
                  ? [
                      productImage,
                    ]
                  : [],

            price:
              currentPrice,

            oldPrice:
              originalPrice,

            originalPrice:
              originalPrice,

            discount:
              discountPercentage,

            stock:
              productStock,

            seller:
              productSeller,

            sellerName:
              productSeller,

            freeDelivery:
              freeDelivery !==
              false,
          },
          1
        );

      if (!added) {
        toast.error(
          "Unable to add this product to your cart."
        );

        return;
      }

      toast.success(
        "Added to cart."
      );
    } finally {
      setTimeout(() => {
        setAddingToCart(
          false
        );
      }, 400);
    }
  }

  /*
   * WISHLIST.
   */
  function handleWishlist(
    event
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!productId) {
      return;
    }

    toggleWishlist({
      id: productId,

      _id: productId,

      name,

      image:
        productImage,

      images:
        Array.isArray(images)
          ? images
          : productImage
            ? [productImage]
            : [],

      price:
        currentPrice,

      oldPrice:
        originalPrice,

      discount:
        discountPercentage,

      stock:
        productStock,

      seller:
        productSeller,

      sellerName:
        productSeller,

      freeDelivery:
        freeDelivery !==
        false,
    });

    toast.success(
      isWishlisted
        ? "Removed from wishlist."
        : "Added to wishlist."
    );
  }

  return (
    <Link
      href={`/products/${productId}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="relative overflow-hidden">

        <div className="aspect-square bg-gray-100">
          {productImage ? (
            <img
              src={productImage}
              alt={name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={
            handleWishlist
          }
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-white"
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }
          />
        </button>

        {discountPercentage >
          0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            -
            {
              discountPercentage
            }
            %
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">

        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {
            productSeller
          }
        </p>

        <h3 className="line-clamp-2 min-h-[48px] font-semibold text-gray-900 transition group-hover:text-blue-600">
          {name}
        </h3>

        <div className="flex items-center gap-2">

          <div className="flex items-center gap-1">
            <Star
              size={16}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="text-sm font-medium text-gray-800">
              {productRating.toFixed(
                1
              )}
            </span>
          </div>

          <span className="text-sm text-gray-500">
            (
            {
              reviewCount
            }
            )
          </span>

        </div>

        {/* PRICE */}
        <div className="space-y-1">

          <div className="flex items-center gap-2">

            <span className="text-2xl font-bold text-blue-600">
              PKR{" "}
              {currentPrice.toLocaleString()}
            </span>

            {originalPrice >
              currentPrice && (
              <span className="text-sm text-gray-400 line-through">
                PKR{" "}
                {originalPrice.toLocaleString()}
              </span>
            )}

          </div>

          {savings > 0 && (
            <p className="text-xs font-medium text-green-600">
              You save PKR{" "}
              {savings.toLocaleString()}
            </p>
          )}

        </div>

        {/* FREE DELIVERY */}
        {freeDelivery && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">

            <Truck
              size={16}
              className="text-green-600"
            />

            <span className="text-xs font-semibold text-green-700">
              Free Delivery
            </span>

          </div>
        )}

        {/* STOCK */}
        <div className="flex items-center justify-between text-sm">

          <span className="text-gray-500">
            Availability
          </span>

          <span
            className={
              isOutOfStock
                ? "font-semibold text-red-600"
                : "font-semibold text-green-600"
            }
          >
            {isOutOfStock
              ? "Out of Stock"
              : `${productStock} in stock`}
          </span>

        </div>

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={
            handleAddToCart
          }
          disabled={
            addingToCart ||
            isOutOfStock ||
            !isLoaded
          }
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : addingToCart
                ? "cursor-wait bg-blue-500 text-white"
                : !isLoaded
                  ? "cursor-wait bg-gray-300 text-gray-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {addingToCart ? (
            "Adding..."
          ) : !isLoaded ? (
            "Loading cart..."
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart
                size={18}
              />
              Add to Cart
            </>
          )}
        </button>

      </div>
    </Link>
  );
}