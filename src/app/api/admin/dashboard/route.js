import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";
import Review from "@/models/Review";
import Seller from "@/models/Seller";

import {
  requireAdmin,
} from "@/lib/adminAuth";

export async function GET() {
  try {
    await connectDB();

    const auth =
      await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authorization required.",
        },
        {
          status: 403,
        }
      );
    }

    const [
      totalUsers,
      totalCustomers,
      totalSellers,
      totalAdmins,

      activeProducts,
      inactiveProducts,

      totalProducts,
      totalCategories,

      totalOrders,

      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,

      pendingReviews,

      sellerDocuments,
    ] = await Promise.all([
      User.countDocuments({}),

      User.countDocuments({
        role: "customer",
      }),

      User.countDocuments({
        role: "seller",
      }),

      User.countDocuments({
        role: "admin",
      }),

      Product.countDocuments({
        isActive: true,
      }),

      Product.countDocuments({
        isActive: false,
      }),

      Product.countDocuments({}),

      Category.countDocuments({}),

      Order.countDocuments({}),

      Order.countDocuments({
        orderStatus: "pending",
      }),

      Order.countDocuments({
        orderStatus: "confirmed",
      }),

      Order.countDocuments({
        orderStatus: "processing",
      }),

      Order.countDocuments({
        orderStatus: "shipped",
      }),

      Order.countDocuments({
        orderStatus: "delivered",
      }),

      Order.countDocuments({
        orderStatus: "cancelled",
      }),

      Review.countDocuments({
        isApproved: false,
      }),

      Seller.countDocuments({}),
    ]);

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: "cancelled",
            },
          },
        },

        {
          $group: {
            _id: null,

            revenue: {
              $sum: "$total",
            },

            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const revenue =
      Number(
        revenueResult?.[0]?.revenue
      ) || 0;

    const recentOrders =
      await Order.find({})
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .lean();

    const recentProducts =
      await Product.find({})
        .populate(
          "categoryId",
          "name slug"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .lean();

    return NextResponse.json(
      {
        success: true,

        stats: {
          totalUsers,

          totalCustomers,

          totalSellers,

          totalAdmins,

          totalProducts,

          activeProducts,

          inactiveProducts,

          totalCategories,

          totalOrders,

          pendingOrders,

          confirmedOrders,

          processingOrders,

          shippedOrders,

          deliveredOrders,

          cancelledOrders,

          pendingReviews,

          totalSellerRecords:
            sellerDocuments,

          revenue,
        },

        recentOrders,

        recentProducts,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/dashboard:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load dashboard statistics.",
      },
      {
        status: 500,
      }
    );
  }
}