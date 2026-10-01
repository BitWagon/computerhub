"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProductImages({ product, images, productName }) {
  const imageList = useMemo(
  () =>
    images ||
    product?.images ||
    (product?.image ? [product.image] : []),
  [images, product?.images, product?.image]
);

  const title = productName || product?.name || "Product";

  const [selectedImage, setSelectedImage] = useState(imageList[0] || "");

  useEffect(() => {
    setSelectedImage(imageList[0] || "");
  }, [imageList]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="aspect-square bg-gray-100">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={title}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>
      </div>

      {imageList.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {imageList.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`overflow-hidden rounded-xl border-2 transition ${
                selectedImage === img
                  ? "border-blue-600"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={img}
                  alt={`${title} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}