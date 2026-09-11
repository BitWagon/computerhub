"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImages({
  images = [],
  productName = "Product",
}) {
  const validImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
        ];

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const selectedImage =
    validImages[selectedIndex] || validImages[0];

  const previousImage = () => {
    setSelectedIndex((current) =>
      current === 0
        ? validImages.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    setSelectedIndex((current) =>
      current === validImages.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="group relative flex h-[420px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-6">
        <Image
          src={selectedImage}
          alt={`${productName} image ${selectedIndex + 1}`}
          width={800}
          height={600}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
          priority
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous product image"
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next product image"
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Image Counter */}
      <div className="mt-3 text-center text-xs text-gray-500">
        Image {selectedIndex + 1} of {validImages.length}
      </div>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {validImages.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            onClick={() => setSelectedIndex(index)}
            aria-label={`View product image ${index + 1}`}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition ${
              selectedIndex === index
                ? "border-blue-600 shadow-sm"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              width={100}
              height={100}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}