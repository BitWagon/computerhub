import mongoose from "mongoose";

const WishlistItemSchema =
  new mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        default: "",
        trim: true,
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      oldPrice: {
        type: Number,
        default: 0,
        min: 0,
      },

      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      sellerName: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const WishlistSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },

      items: {
        type: [WishlistItemSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model(
    "Wishlist",
    WishlistSchema
  );

export default Wishlist;