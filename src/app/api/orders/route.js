import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

function createOrderNumber() {
  const timestamp = Date.now()
    .toString()
    .slice(-8);

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `CH-${timestamp}-${random}`;
}

export async function POST(request) {
  try {
    // Connect MongoDB
    await connectDB();

    // Read request body
    const body = await request.json();

    const {
      customer,
      items,
      paymentMethod,
    } = body;

    // ------------------------------------
    // CUSTOMER VALIDATION
    // ------------------------------------

    if (
      !customer ||
      typeof customer !== "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer information is required.",
        },
        { status: 400 }
      );
    }

    // Checkout sends firstName + lastName
    // Convert them into fullName.
    const firstName = String(
      customer.firstName || ""
    ).trim();

    const lastName = String(
      customer.lastName || ""
    ).trim();

    const fullName =
      String(
        customer.fullName || ""
      ).trim() ||
      `${firstName} ${lastName}`.trim();

    // ------------------------------------
    // CUSTOMER FIELDS
    // ------------------------------------

    const email = String(
      customer.email || ""
    )
      .trim()
      .toLowerCase();

    const phone = String(
      customer.phone || ""
    ).trim();

    const country = String(
      customer.country || ""
    ).trim();

    const city = String(
      customer.city || ""
    ).trim();

    const state = String(
      customer.state || ""
    ).trim();

    const postalCode = String(
      customer.postalCode || ""
    ).trim();

    const address = String(
      customer.address || ""
    ).trim();

    const notes = String(
      customer.notes || ""
    ).trim();

    // ------------------------------------
    // REQUIRED CUSTOMER FIELDS
    // ------------------------------------

    const requiredFields = [
      ["fullName", fullName],
      ["email", email],
      ["phone", phone],
      ["country", country],
      ["city", city],
      ["state", state],
      ["postalCode", postalCode],
      ["address", address],
    ];

    for (const [field, value] of requiredFields) {
      if (!value) {
        return NextResponse.json(
          {
            success: false,
            message:
              `${field} is required.`,
          },
          { status: 400 }
        );
      }
    }

    // ------------------------------------
    // EMAIL VALIDATION
    // ------------------------------------

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------
    // ITEMS VALIDATION
    // ------------------------------------

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order must contain at least one product.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------
    // FORMAT ITEMS
    // ------------------------------------

    const formattedItems = [];

    for (const item of items) {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid product data.",
          },
          { status: 400 }
        );
      }

      const productId = String(
        item.id ||
          item.productId ||
          ""
      ).trim();

      const name = String(
        item.name || ""
      ).trim();

      const price = Number(
        item.price
      );

      const quantity = Number(
        item.quantity
      );

      const image =
        item.images?.[0] ||
        item.image ||
        "";

      // Product ID
      if (!productId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A product is missing its product ID.",
          },
          { status: 400 }
        );
      }

      // Product name
      if (!name) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A product is missing its name.",
          },
          { status: 400 }
        );
      }

      // Price
      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid price for "${name}".`,
          },
          { status: 400 }
        );
      }

      // Quantity
      if (
        !Number.isFinite(quantity) ||
        quantity < 1 ||
        !Number.isInteger(quantity)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid quantity for "${name}".`,
          },
          { status: 400 }
        );
      }

      const itemTotal =
        price * quantity;

      formattedItems.push({
        productId,
        name,
        image: String(image || ""),
        price,
        quantity,
        total: itemTotal,
      });
    }

    // ------------------------------------
    // CALCULATE SUBTOTAL
    // ------------------------------------

    const calculatedSubtotal =
      formattedItems.reduce(
        (sum, item) =>
          sum + item.total,
        0
      );

    // ------------------------------------
    // CALCULATE DELIVERY
    // ------------------------------------

    const calculatedDelivery =
      calculatedSubtotal >= 500
        ? 0
        : 25;

    // ------------------------------------
    // CALCULATE TOTAL
    // ------------------------------------

    const calculatedTotal =
      calculatedSubtotal +
      calculatedDelivery;

    // ------------------------------------
    // PAYMENT METHOD
    // ------------------------------------

    if (
      !paymentMethod ||
      !["card", "cod", "wallet"].includes(
        paymentMethod
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------
    // CREATE ORDER
    // ------------------------------------

    const order =
      await Order.create({
        orderNumber:
          createOrderNumber(),

        customer: {
          fullName,

          email,

          phone,

          country,

          city,

          state,

          postalCode,

          address,

          notes,
        },

        items: formattedItems,

        subtotal:
          calculatedSubtotal,

        delivery:
          calculatedDelivery,

        total:
          calculatedTotal,

        paymentMethod,

        paymentStatus:
          "pending",

        orderStatus:
          "pending",
      });

    // ------------------------------------
    // SUCCESS LOG
    // ------------------------------------

    console.log(
      "===================================="
    );

    console.log(
      "🛒 NEW COMPUTERHUB ORDER"
    );

    console.log(
      "Order Number:",
      order.orderNumber
    );

    console.log(
      "Customer:",
      order.customer.fullName
    );

    console.log(
      "Email:",
      order.customer.email
    );

    console.log(
      "Subtotal:",
      order.subtotal
    );

    console.log(
      "Delivery:",
      order.delivery
    );

    console.log(
      "Total:",
      order.total
    );

    console.log(
      "Payment:",
      order.paymentMethod
    );

    console.log(
      "Status:",
      order.orderStatus
    );

    console.log(
      "===================================="
    );

    // ------------------------------------
    // RETURN SUCCESS
    // ------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        order: {
          id: order._id.toString(),

          orderNumber:
            order.orderNumber,

          subtotal:
            order.subtotal,

          delivery:
            order.delivery,

          total:
            order.total,

          status:
            order.orderStatus,

          paymentMethod:
            order.paymentMethod,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "❌ Create order error:",
      error
    );

    // ------------------------------------
    // MONGOOSE VALIDATION ERROR
    // ------------------------------------

    if (
      error?.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors || {}
        ).map(
          (item) =>
            item.message
        );

      return NextResponse.json(
        {
          success: false,

          message:
            messages.length > 0
              ? messages.join(", ")
              : "Order validation failed.",
        },
        {
          status: 400,
        }
      );
    }

    // ------------------------------------
    // DUPLICATE ORDER NUMBER
    // ------------------------------------

    if (
      error?.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order number already exists. Please try again.",
        },
        {
          status: 409,
        }
      );
    }

    // ------------------------------------
    // GENERAL ERROR
    // ------------------------------------

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          "Unable to create order. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
