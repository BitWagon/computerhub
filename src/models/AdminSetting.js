import mongoose from "mongoose";

const AdminSettingSchema =
  new mongoose.Schema(
    {
      key: {
        type: String,
        required: true,
        unique: true,
        default: "store",
      },

      storeName: {
        type: String,
        default: "ComputerHub",
        trim: true,
      },

      storeEmail: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },

      supportEmail: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },

      currency: {
        type: String,
        default: "PKR",
        trim: true,
        uppercase: true,
      },

      country: {
        type: String,
        default: "Pakistan",
        trim: true,
      },

      maintenanceMode: {
        type: Boolean,
        default: false,
      },

      allowSellerRegistration: {
        type: Boolean,
        default: true,
      },

      allowCustomerRegistration: {
        type: Boolean,
        default: true,
      },

      requireReviewApproval: {
        type: Boolean,
        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

const AdminSetting =
  mongoose.models.AdminSetting ||
  mongoose.model(
    "AdminSetting",
    AdminSettingSchema
  );

export default AdminSetting;