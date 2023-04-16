const mongoose = require("mongoose");

const SingleOrderItemSchema = mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "The tax is required."],
    },
    shippingFee: {
      type: Number,
      required: [true, "The shepping is required."],
      default: 0,
    },
    subtotal: {
      type: Number,
      required: ["sub total is required."],
      default: 0,
    },
    total: {
      type: Number,
      required: [true, "the total is required"],
      default: 0,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
