import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

function createOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `CH-${timestamp}-${random}`;
}

// ================================
// CREATE ORDER
// ================================
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    console.log("");
    console.log("====================================");
    console.log("📦 CHECKOUT DATA RECEIVED");
    console.log(JSON.stringify(body, null, 2));
    console.log("====================================");

    const {
      customer,
      items,
      paymentMethod,
    } = body;

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer information is missing.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    const fullName =
      customer.fullName ||
      `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim();

    const customerData = {
      fullName,
      email: customer.email?.trim() || "",
      phone: customer.phone?.trim() || "",
      country: customer.country?.trim() || "",
      city: customer.city?.trim() || "",
      state: customer.state?.trim() || "",
      postalCode:
        customer.postalCode?.trim() || "",
      address: customer.address?.trim() || "",
      notes: customer.notes?.trim() || "",
    };

    const requiredFields = [
      ["fullName", "Full name"],
      ["email", "Email address"],
      ["phone", "Phone number"],
      ["country", "Country"],
      ["city", "City"],
      ["postalCode", "Postal code"],
      ["address", "Street address"],
    ];

    for (const [field, label] of requiredFields) {
      if (!customerData[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `${label} is required.`,
          },
          { status: 400 }
        );
      }
    }

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
            "Please select a valid payment method.",
        },
        { status: 400 }
      );
    }

    const formattedItems = items.map((item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);

      return {
        productId: String(
          item.id || item.productId || ""
        ),

        name: String(
          item.name || "Product"
        ),

        image:
          item.images?.[0] ||
          item.image ||
          "",

        price,

        quantity,

        total: price * quantity,
      };
    });

    const calculatedSubtotal =
      formattedItems.reduce(
        (sum, item) => sum + item.total,
        0
      );

    const calculatedDelivery =
      calculatedSubtotal >= 500
        ? 0
        : 15;

    const calculatedTotal =
      calculatedSubtotal +
      calculatedDelivery;

    const order = await Order.create({
      orderNumber: createOrderNumber(),

      customer: customerData,

      items: formattedItems,

      subtotal: calculatedSubtotal,

      delivery: calculatedDelivery,

      total: calculatedTotal,

      paymentMethod,

      paymentStatus: "pending",

      orderStatus: "pending",
    });

    console.log("");
    console.log("====================================");
    console.log("✅ NEW COMPUTERHUB ORDER");
    console.log("====================================");
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
    console.log("====================================");
    console.log("");

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        order: {
          id: order._id.toString(),
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.orderStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("");
    console.error(
      "❌ CREATE ORDER ERROR:"
    );
    console.error(error);
    console.error("");

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


// ================================
// GET ALL ORDERS
// ================================
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

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
          "Unable to load orders.",
      },
      { status: 500 }
    );
  }
}


// ================================
// UPDATE ORDER STATUS
// ================================
export async function PATCH(request) {
  try {
    await connectDB();

    const body = await request.json();

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

    const validOrderStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const validPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    const updateData = {};

    if (orderStatus) {
      if (
        !validOrderStatuses.includes(
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

    if (paymentStatus) {
      if (
        !validPaymentStatuses.includes(
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
      Object.keys(updateData).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No changes were provided.",
        },
        { status: 400 }
      );
    }

    const updatedOrder =
      await Order.findByIdAndUpdate(
        orderId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        { status: 404 }
      );
    }

    console.log("");
    console.log(
      "✅ ORDER UPDATED:",
      updatedOrder.orderNumber
    );

    console.log(
      "Order Status:",
      updatedOrder.orderStatus
    );

    console.log(
      "Payment Status:",
      updatedOrder.paymentStatus
    );

    console.log("");

    return NextResponse.json(
      {
        success: true,
        message:
          "Order updated successfully.",
        order: updatedOrder,
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