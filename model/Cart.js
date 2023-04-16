const mongoose = require("mongoose");

const SingleProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [SingleProductSchema],
  total: { type: Number, required: true },
});

module.exports = mongoose.model("Cart", CartSchema);
