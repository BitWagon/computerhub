export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatCurrency(
  value = 0,
  currency = "PKR"
) {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat(
    "en-PK",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(amount);
}

export function formatNumber(
  value = 0
) {
  return Number(value || 0).toLocaleString(
    "en-PK"
  );
}

export function toSafeNumber(
  value,
  fallback = 0
) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

export function calculateSubtotal(
  price,
  quantity
) {
  const safePrice =
    toSafeNumber(price);

  const safeQuantity = Math.max(
    1,
    Math.floor(
      toSafeNumber(quantity, 1)
    )
  );

  return safePrice * safeQuantity;
}

export function calculateDiscount(
  price,
  discount = 0
) {
  const safePrice =
    toSafeNumber(price);

  const safeDiscount = Math.min(
    100,
    Math.max(
      0,
      toSafeNumber(discount)
    )
  );

  return safePrice -
    safePrice *
      (safeDiscount / 100);
}

export function generateOrderNumber() {
  const timestamp =
    Date.now().toString(36);

  const randomPart = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `CH-${timestamp}-${randomPart}`;
}

export function isValidObjectId(
  value
) {
  if (!value) {
    return false;
  }

  return /^[a-f\d]{24}$/i.test(
    String(value)
  );
}

export function getProductImage(
  product
) {
  if (
    Array.isArray(product?.images) &&
    product.images.length > 0
  ) {
    return product.images[0];
  }

  return "";
}

export function calculateCartTotals(
  items = [],
  deliveryFee = 0
) {
  const subtotal = items.reduce(
    (total, item) => {
      const price =
        toSafeNumber(item?.price);

      const quantity = Math.max(
        0,
        toSafeNumber(
          item?.quantity
        )
      );

      return (
        total +
        price * quantity
      );
    },
    0
  );

  const safeDeliveryFee =
    Math.max(
      0,
      toSafeNumber(
        deliveryFee
      )
    );

  return {
    subtotal,
    deliveryFee:
      safeDeliveryFee,
    total:
      subtotal +
      safeDeliveryFee,
  };
}