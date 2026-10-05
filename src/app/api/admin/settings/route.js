import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import AdminSetting from "@/models/AdminSetting";

import {
  requireAdmin,
} from "@/lib/adminAuth";

const DEFAULT_SETTINGS = {
  storeName: "ComputerHub",

  storeEmail: "",

  supportEmail: "",

  currency: "PKR",

  country: "Pakistan",

  maintenanceMode: false,

  allowSellerRegistration: true,

  allowCustomerRegistration: true,

  requireReviewApproval: true,
};

async function getSettings() {
  let settings =
    await AdminSetting.findOne({
      key: "store",
    });

  if (!settings) {
    settings =
      await AdminSetting.create({
        key: "store",
        ...DEFAULT_SETTINGS,
      });
  }

  return settings;
}

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

    const settings =
      await getSettings();

    return NextResponse.json(
      {
        success: true,

        settings: {
          storeName:
            settings.storeName,

          storeEmail:
            settings.storeEmail,

          supportEmail:
            settings.supportEmail,

          currency:
            settings.currency,

          country:
            settings.country,

          maintenanceMode:
            settings.maintenanceMode,

          allowSellerRegistration:
            settings.allowSellerRegistration,

          allowCustomerRegistration:
            settings.allowCustomerRegistration,

          requireReviewApproval:
            settings.requireReviewApproval,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/settings:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request
) {
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

    const body =
      await request.json();

    const settings =
      await getSettings();

    if (
      body.storeName !==
      undefined
    ) {
      const value =
        String(
          body.storeName
        ).trim();

      if (!value) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Store name cannot be empty.",
          },
          {
            status: 400,
          }
        );
      }

      settings.storeName =
        value;
    }

    if (
      body.storeEmail !==
      undefined
    ) {
      settings.storeEmail =
        String(
          body.storeEmail
        )
          .trim()
          .toLowerCase();
    }

    if (
      body.supportEmail !==
      undefined
    ) {
      settings.supportEmail =
        String(
          body.supportEmail
        )
          .trim()
          .toLowerCase();
    }

    if (
      body.currency !==
      undefined
    ) {
      settings.currency =
        String(
          body.currency
        )
          .trim()
          .toUpperCase();
    }

    if (
      body.country !==
      undefined
    ) {
      settings.country =
        String(
          body.country
        ).trim();
    }

    const booleanFields = [
      "maintenanceMode",
      "allowSellerRegistration",
      "allowCustomerRegistration",
      "requireReviewApproval",
    ];

    for (
      const field of booleanFields
    ) {
      if (
        body[field] !==
        undefined
      ) {
        if (
          typeof body[field] !==
          "boolean"
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                `${field} must be true or false.`,
            },
            {
              status: 400,
            }
          );
        }

        settings[field] =
          body[field];
      }
    }

    await settings.save();

    return NextResponse.json(
      {
        success: true,

        message:
          "Settings saved successfully.",

        settings: {
          storeName:
            settings.storeName,

          storeEmail:
            settings.storeEmail,

          supportEmail:
            settings.supportEmail,

          currency:
            settings.currency,

          country:
            settings.country,

          maintenanceMode:
            settings.maintenanceMode,

          allowSellerRegistration:
            settings.allowSellerRegistration,

          allowCustomerRegistration:
            settings.allowCustomerRegistration,

          requireReviewApproval:
            settings.requireReviewApproval,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH /api/admin/settings:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to save settings.",
      },
      {
        status: 500,
      }
    );
  }
}