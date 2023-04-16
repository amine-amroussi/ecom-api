const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "please provide reating."],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "The title is required."],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "The comment must be required."],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: false,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averaggeRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averaggeRating || 0),
        numOfReviews: Math.ceil(result[0]?.numOfReviews || 0),
      }
    );
  } catch (error) {
    console.log(error)
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
