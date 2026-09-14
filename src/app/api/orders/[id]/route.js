import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUserToken } from "@/lib/auth";

export async function GET(
  request,
  { params }
) {
  try {
    await connectDB();

    const tokenData =
      getCurrentUserToken();

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to view this order.",
        },
        {
          status: 401,
        }
      );
    }

    const orderId =
      params?.id;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        orderId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order ID.",
        },
        {
          status: 400,
        }
      );
    }

    let order;

    /*
     * ADMIN CAN VIEW ANY ORDER.
     */

    if (
      tokenData.role === "admin"
    ) {
      order =
        await Order.findById(
          orderId
        ).lean();
    } else {
      /*
       * CUSTOMER CAN ONLY VIEW
       * THEIR OWN ORDER.
       */

      order =
        await Order.findOne({
          _id: orderId,
          userId:
            tokenData.userId,
        }).lean();
    }

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "===================================="
    );

    console.error(
      "❌ GET ORDER DETAILS ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Unable to load order.",
      },
      {
        status: 500,
      }
    );
  }
}