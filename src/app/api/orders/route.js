import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUserToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const tokenData = getCurrentUserToken();

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to place an order.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    console.log("====================================");
    console.log("🛒 NEW ORDER REQUEST");
    console.log("User ID:", tokenData.userId);
    console.log("Email:", tokenData.email);
    console.log("====================================");

    const customer = body.customer || {};

    const items = Array.isArray(body.items)
      ? body.items
      : [];

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    /*
     * CUSTOMER INFORMATION
     */

    const firstName = customer.firstName || "";

    const lastName = customer.lastName || "";

    const fullName =
      customer.fullName ||
      customer.name ||
      `${firstName} ${lastName}`.trim();

    const email =
      customer.email ||
      tokenData.email ||
      "";

    const phone =
      customer.phone ||
      "";

    const country =
      customer.country ||
      "";

    const city =
      customer.city ||
      "";

    const state =
      customer.state ||
      "";

    const postalCode =
      customer.postalCode ||
      "";

    const address =
      customer.address ||
      "";

    const notes =
      customer.notes ||
      "";

    /*
     * VALIDATE CUSTOMER INFORMATION
     */

    if (!fullName.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name is required.",
        },
        { status: 400 }
      );
    }

    if (!email.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    if (!phone.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required.",
        },
        { status: 400 }
      );
    }

    if (!country.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Country is required.",
        },
        { status: 400 }
      );
    }

    if (!city.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "City is required.",
        },
        { status: 400 }
      );
    }

    if (!state.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "State is required.",
        },
        { status: 400 }
      );
    }

    if (!postalCode.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Postal code is required.",
        },
        { status: 400 }
      );
    }

    if (!address.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Address is required.",
        },
        { status: 400 }
      );
    }

    /*
     * FORMAT ORDER ITEMS
     */

    const formattedItems = items.map((item) => {
      const productId =
        item.productId ||
        item._id ||
        item.id ||
        "";

      const price =
        Number(item.price) || 0;

      const quantity =
        Number(item.quantity) || 1;

      const total =
        price * quantity;

      return {
        productId: String(productId),

        name:
          item.name ||
          "Product",

        image:
          item.image ||
          item.images?.[0] ||
          "",

        price,

        quantity,

        total,
      };
    });

    /*
     * MAKE SURE PRODUCTS HAVE IDs
     */

    const invalidItem =
      formattedItems.find(
        (item) => !item.productId
      );

    if (invalidItem) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more products are missing a product ID.",
        },
        { status: 400 }
      );
    }

    /*
     * CALCULATE TOTALS
     */

    const subtotal =
      formattedItems.reduce(
        (sum, item) =>
          sum + item.total,
        0
      );

    const delivery =
      subtotal >= 500
        ? 0
        : 15;

    const total =
      subtotal + delivery;

    /*
     * PAYMENT METHOD
     */

    const paymentMethod =
      body.paymentMethod ||
      "cod";

    const allowedPaymentMethods = [
      "card",
      "cod",
      "wallet",
    ];

    if (
      !allowedPaymentMethods.includes(
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

    /*
     * CREATE ORDER NUMBER
     */

    const orderNumber =
      `CH-${Date.now()}-${Math.floor(
        1000 +
          Math.random() * 9000
      )}`;

    /*
     * CREATE ORDER
     */

    const order =
      await Order.create({
        userId:
          tokenData.userId,

        orderNumber,

        customer: {
          fullName:
            fullName.trim(),

          email:
            email
              .trim()
              .toLowerCase(),

          phone:
            phone.trim(),

          country:
            country.trim(),

          city:
            city.trim(),

          state:
            state.trim(),

          postalCode:
            postalCode.trim(),

          address:
            address.trim(),

          notes:
            notes.trim(),
        },

        items:
          formattedItems,

        subtotal,

        delivery,

        total,

        paymentMethod,

        paymentStatus:
          "pending",

        orderStatus:
          "pending",
      });

    /*
     * TERMINAL LOG
     */

    console.log("====================================");
    console.log(
      "✅ ORDER CREATED SUCCESSFULLY"
    );

    console.log(
      "Order ID:",
      order._id.toString()
    );

    console.log(
      "Order Number:",
      order.orderNumber
    );

    console.log(
      "User ID:",
      tokenData.userId
    );

    console.log(
      "Customer:",
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

    console.log("====================================");

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        order: {
          _id:
            order._id.toString(),

          orderNumber:
            order.orderNumber,

          userId:
            order.userId.toString(),

          customer:
            order.customer,

          items:
            order.items,

          subtotal:
            order.subtotal,

          delivery:
            order.delivery,

          total:
            order.total,

          paymentMethod:
            order.paymentMethod,

          paymentStatus:
            order.paymentStatus,

          orderStatus:
            order.orderStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("====================================");
    console.error(
      "❌ CREATE ORDER ERROR"
    );
    console.error(error);
    console.error("====================================");

    return NextResponse.json(
      {
        success: false,

        message:
          error.message ||
          "Unable to create order.",
      },
      { status: 500 }
    );
  }
}


/*
 * GET ORDERS
 *
 * Customer:
 * - sees their own orders
 *
 * Admin:
 * - sees all orders
 */

export async function GET() {
  try {
    await connectDB();

    const tokenData =
      getCurrentUserToken();

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in.",
          orders: [],
        },
        { status: 401 }
      );
    }

    console.log("====================================");
    console.log("📦 GET ORDERS");
    console.log(
      "User ID:",
      tokenData.userId
    );
    console.log(
      "Role:",
      tokenData.role
    );
    console.log("====================================");

    let orders;

    if (
      tokenData.role === "admin"
    ) {
      orders =
        await Order.find({})
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .lean();
    } else {
      orders =
        await Order.find({
          userId:
            tokenData.userId,
        })
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .lean();
    }

    return NextResponse.json(
      {
        success: true,
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ GET ORDERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to get orders.",
        orders: [],
      },
      { status: 500 }
    );
  }
}


/*
 * PATCH ORDER
 *
 * Admin only.
 */

export async function PATCH(request) {
  try {
    await connectDB();

    const tokenData =
      getCurrentUserToken();

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (
      tokenData.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin access required.",
        },
        { status: 403 }
      );
    }

    const body =
      await request.json();

    const {
      orderId,
      orderStatus,
      paymentStatus,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order ID is required.",
        },
        { status: 400 }
      );
    }

    const allowedOrderStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    const updateData = {};

    if (
      orderStatus !== undefined
    ) {
      if (
        !allowedOrderStatuses.includes(
          orderStatus
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid order status.",
          },
          { status: 400 }
        );
      }

      updateData.orderStatus =
        orderStatus;
    }

    if (
      paymentStatus !== undefined
    ) {
      if (
        !allowedPaymentStatuses.includes(
          paymentStatus
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid payment status.",
          },
          { status: 400 }
        );
      }

      updateData.paymentStatus =
        paymentStatus;
    }

    if (
      Object.keys(updateData)
        .length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nothing to update.",
        },
        { status: 400 }
      );
    }

    const order =
      await Order.findByIdAndUpdate(
        orderId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        { status: 404 }
      );
    }

    console.log("====================================");
    console.log(
      "✅ ORDER UPDATED"
    );
    console.log(
      "Order ID:",
      order._id.toString()
    );
    console.log(
      "Order Status:",
      order.orderStatus
    );
    console.log(
      "Payment Status:",
      order.paymentStatus
    );
    console.log("====================================");

    return NextResponse.json(
      {
        success: true,
        message:
          "Order updated successfully.",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ UPDATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to update order.",
      },
      { status: 500 }
    );
  }
}