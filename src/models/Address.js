import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "Pakistan",
      trim: true,
    },

    label: {
      type: String,
      default: "Home",
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

AddressSchema.index({
  userId: 1,
  isDefault: 1,
});

const Address =
  mongoose.models.Address ||
  mongoose.model("Address", AddressSchema);

export default Address;