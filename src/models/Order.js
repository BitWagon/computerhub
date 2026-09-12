import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
{
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: false,
index: true,
},


orderNumber: {
  type: String,
  required: true,
  unique: true,
  index: true,
},

customer: {
  fullName: {
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

  country: {
    type: String,
    required: true,
    trim: true,
  },

  city: {
    type: String,
    required: true,
    trim: true,
  },

  state: {
    type: String,
    required: true,
    trim: true,
  },

  postalCode: {
    type: String,
    required: true,
    trim: true,
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },

  notes: {
    type: String,
    default: "",
    trim: true,
  },
},

items: [
  {
    productId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
],

subtotal: {
  type: Number,
  required: true,
  min: 0,
},

delivery: {
  type: Number,
  required: true,
  min: 0,
},

total: {
  type: Number,
  required: true,
  min: 0,
},

paymentMethod: {
  type: String,
  enum: [
    "card",
    "cod",
    "wallet",
  ],
  required: true,
},

paymentStatus: {
  type: String,
  enum: [
    "pending",
    "paid",
    "failed",
    "refunded",
  ],
  default: "pending",
},

orderStatus: {
  type: String,
  enum: [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ],
  default: "pending",
},


},
{
timestamps: true,
}
);

const Order =
mongoose.models.Order ||
mongoose.model("Order", OrderSchema);

export default Order;
