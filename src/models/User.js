import mongoose from "mongoose";

const UserSchema =
  new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 60,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 60,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
      },

      password: {
        type: String,
        required: true,
        minlength: 6,
        select: true,
      },

      role: {
        type: String,

        enum: [
          "customer",
          "seller",
          "admin",
        ],

        default: "customer",

        index: true,
      },

      isActive: {
        type: Boolean,

        default: true,

        index: true,
      },
    },

    {
      timestamps: true,
    }
  );

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    UserSchema
  );

export default User;