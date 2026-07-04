const mongoose = require("mongoose");

const orderItems = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  subTotal: {
    type: Number,
    required: true,
  },
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["Stripe", "cash"],
  },
  paymentId: String,
  sessionId: String, // Storing the Stripe Session ID here
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paidAt: Date,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [orderItems],
    shippingAddress: {
      type: String,
      required: true,
    },
    insideDhaka: {
      type: Boolean,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    payment: paymentSchema,
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    deliveredAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("order", orderSchema);
