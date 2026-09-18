import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCurrentUserToken } from "@/lib/auth";


// ============================================================
// POST /api/orders
// Create a new order
// ============================================================

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

    // --------------------------------------------------------
    // Check cart
    // --------------------------------------------------------

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }


    // ========================================================
    // CUSTOMER INFORMATION
    // ========================================================

    let firstName = customer.firstName || "";
    let lastName = customer.lastName || "";

    const fullName =
      customer.fullName ||
      customer.name ||
      `${firstName} ${lastName}`.trim();

    if (!firstName && fullName) {
      const nameParts = fullName.trim().split(/\s+/);

      firstName = nameParts.shift() || "";
      lastName = nameParts.join(" ") || "";
    }

    if (!lastName) {
      lastName = "Customer";
    }

    const email =
      customer.email ||
      tokenData.email ||
      "";

    const phone =
      customer.phone ||
      "";

    const address =
      customer.address ||
      "";

    const city =
      customer.city ||
      "";

    const postalCode =
      customer.postalCode ||
      "";


    // ========================================================
    // VALIDATE CUSTOMER INFORMATION
    // ========================================================

    if (!firstName.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "First name is required.",
        },
        { status: 400 }
      );
    }

    if (!lastName.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Last name is required.",
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

    if (!address.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Address is required.",
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


    // ========================================================
    // FORMAT ORDER ITEMS
    // ========================================================

    const formattedItems = items.map((item) => {
      const productId =
        item.productId ||
        item._id ||
        item.id ||
        "";

      const price =
        Number(item.price) || 0;

      const quantity =
        Math.max(
          1,
          Number(item.quantity) || 1
        );

      const itemSubtotal =
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

        subtotal: itemSubtotal,
      };
    });


    // ========================================================
    // MAKE SURE PRODUCTS HAVE IDs
    // ========================================================

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


    // ========================================================
    // VALIDATE ITEM PRICES
    // ========================================================

    const invalidPrice =
      formattedItems.find(
        (item) =>
          !Number.isFinite(item.price) ||
          item.price < 0
      );

    if (invalidPrice) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more products have an invalid price.",
        },
        { status: 400 }
      );
    }


    // ========================================================
    // CALCULATE TOTALS
    // ========================================================

    const subtotal =
      formattedItems.reduce(
        (sum, item) =>
          sum + item.subtotal,
        0
      );

    /*
     * Delivery rule:
     * Orders of 500 or more = free delivery
     * Orders below 500 = 15 delivery fee
     */

    const deliveryFee =
      subtotal >= 500
        ? 0
        : 15;

    const total =
      subtotal + deliveryFee;


    // ========================================================
    // PAYMENT METHOD
    // ========================================================

    const paymentMethod =
      body.paymentMethod || "cod";

    if (paymentMethod !== "cod") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only Cash on Delivery is currently available.",
        },
        { status: 400 }
      );
    }


    // ========================================================
    // CREATE ORDER NUMBER
    // ========================================================

    const orderNumber =
      `CH-${Date.now()}-${Math.floor(
        1000 +
        Math.random() * 9000
      )}`;


    // ========================================================
    // CREATE ORDER
    // ========================================================

    const order =
      await Order.create({
        userId:
          tokenData.userId,

        orderNumber,

        customer: {
          firstName:
            firstName.trim(),

          lastName:
            lastName.trim(),

          email:
            email
              .trim()
              .toLowerCase(),

          phone:
            phone.trim(),

          address:
            address.trim(),

          city:
            city.trim(),

          postalCode:
            postalCode.trim(),
        },

        items:
          formattedItems,

        subtotal,

        deliveryFee,

        total,

        paymentMethod,

        paymentStatus:
          "pending",

        orderStatus:
          "pending",
      });


    // ========================================================
    // TERMINAL LOG
    // ========================================================

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
      "Delivery Fee:",
      order.deliveryFee
    );

    console.log(
      "Total:",
      order.total
    );

    console.log("====================================");


    // ========================================================
    // RESPONSE
    // ========================================================

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
            order.userId
              ? order.userId.toString()
              : null,

          customer:
            order.customer,

          items:
            order.items,

          subtotal:
            order.subtotal,

          deliveryFee:
            order.deliveryFee,

          total:
            order.total,

          paymentMethod:
            order.paymentMethod,

          paymentStatus:
            order.paymentStatus,

          orderStatus:
            order.orderStatus,

          createdAt:
            order.createdAt,
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


// ============================================================
// GET /api/orders
//
// Customer:
//   - Own orders
//
// Admin:
//   - All orders
//
// Seller:
//   - Orders containing the seller's products
// ============================================================

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


    // ========================================================
    // ADMIN
    // ========================================================

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
    }


    // ========================================================
    // SELLER
    // ========================================================

    else if (
      tokenData.role === "seller"
    ) {
      /*
       * Find all products belonging to
       * the currently logged-in seller.
       */

      const sellerProducts =
        await Product.find({
          sellerId:
            tokenData.userId,
        })
          .select("_id")
          .lean();

      const sellerProductIds =
        sellerProducts.map(
          (product) =>
            product._id
        );


      /*
       * No products means no seller orders.
       */

      if (
        sellerProductIds.length === 0
      ) {
        return NextResponse.json(
          {
            success: true,
            orders: [],
          },
          { status: 200 }
        );
      }


      /*
       * Find orders containing at least
       * one product owned by this seller.
       */

      orders =
        await Order.find({
          "items.productId": {
            $in:
              sellerProductIds,
          },
        })
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .lean();


      /*
       * Only return the seller's own
       * products inside each order.
       *
       * This is important if an order contains
       * products from more than one seller.
       */

      const sellerProductIdSet =
        new Set(
          sellerProductIds.map(
            (id) =>
              id.toString()
          )
        );


      orders =
        orders.map((order) => {
          const sellerItems =
            Array.isArray(order.items)
              ? order.items.filter(
                  (item) =>
                    sellerProductIdSet.has(
                      String(
                        item.productId
                      )
                    )
                )
              : [];


          const sellerSubtotal =
            sellerItems.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.subtotal || 0
                ),
              0
            );


          return {
            ...order,

            items:
              sellerItems,

            sellerSubtotal,

            /*
             * Keep the original order total
             * available for reference.
             *
             * sellerSubtotal is the amount
             * belonging to this seller.
             */

            originalOrderSubtotal:
              order.subtotal,

            originalOrderTotal:
              order.total,
          };
        });
    }


    // ========================================================
    // CUSTOMER
    // ========================================================

    else {
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


    // ========================================================
    // RESPONSE
    // ========================================================

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


// ============================================================
// PATCH /api/orders
//
// Admin:
//   - Can update any order
//
// Seller:
//   - Can update an order containing their product
// ============================================================

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


    // ========================================================
    // ALLOWED STATUSES
    // ========================================================

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
    ];


    // ========================================================
    // VALIDATE STATUS VALUES
    // ========================================================

    if (
      orderStatus !== undefined &&
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


    if (
      paymentStatus !== undefined &&
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


    // ========================================================
    // NOTHING TO UPDATE
    // ========================================================

    if (
      orderStatus === undefined &&
      paymentStatus === undefined
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


    // ========================================================
    // ADMIN
    // ========================================================

    if (
      tokenData.role === "admin"
    ) {
      const updateData = {};


      if (
        orderStatus !== undefined
      ) {
        updateData.orderStatus =
          orderStatus;
      }


      if (
        paymentStatus !== undefined
      ) {
        updateData.paymentStatus =
          paymentStatus;
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
        "✅ ADMIN UPDATED ORDER"
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
    }


    // ========================================================
    // SELLER
    // ========================================================

    if (
      tokenData.role === "seller"
    ) {
      /*
       * Find products owned by this seller.
       */

      const sellerProducts =
        await Product.find({
          sellerId:
            tokenData.userId,
        })
          .select("_id")
          .lean();


      const sellerProductIds =
        sellerProducts.map(
          (product) =>
            product._id
        );


      if (
        sellerProductIds.length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You do not have any products.",
          },
          { status: 403 }
        );
      }


      /*
       * Make sure this order contains
       * at least one of the seller's products.
       */

      const sellerOrder =
        await Order.findOne({
          _id: orderId,

          "items.productId": {
            $in:
              sellerProductIds,
          },
        });


      if (!sellerOrder) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You are not authorized to update this order.",
          },
          { status: 403 }
        );
      }


      /*
       * Seller can update the order status.
       *
       * Payment status is intentionally
       * restricted to admin because payment
       * records should not be changed by sellers.
       */

      if (
        paymentStatus !== undefined
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Only administrators can update payment status.",
          },
          { status: 403 }
        );
      }


      if (
        orderStatus === undefined
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Order status is required.",
          },
          { status: 400 }
        );
      }


      sellerOrder.orderStatus =
        orderStatus;

      await sellerOrder.save();


      console.log("====================================");
      console.log(
        "✅ SELLER UPDATED ORDER"
      );
      console.log(
        "Seller ID:",
        tokenData.userId
      );
      console.log(
        "Order ID:",
        sellerOrder._id.toString()
      );
      console.log(
        "Order Status:",
        sellerOrder.orderStatus
      );
      console.log("====================================");


      return NextResponse.json(
        {
          success: true,

          message:
            "Order status updated successfully.",

          order:
            sellerOrder,
        },
        { status: 200 }
      );
    }


    // ========================================================
    // OTHER USERS
    // ========================================================

    return NextResponse.json(
      {
        success: false,
        message:
          "You are not authorized to update orders.",
      },
      { status: 403 }
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