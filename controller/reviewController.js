const CustomError = require("../errors");
const Review = require("../model/Review");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    throw new CustomError.BadRequestError("provide product id.");
  }

  req.body.product = productId;
  req.body.user = req.user.userId;

  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find();
  res.status(StatusCodes.OK).json({ reviews });
};
const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id }).populate({
    path: "product",
    select: "title category",
  });
  if (!review) {
    throw new CustomError.NotFoundError(`there is no review with id : ${id}`);
  }
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { title, rating, comment } = req.body;
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`there is no review with id : ${id}`);
  }
  checkPermissions(req.user, review.user);
  review.title = title;
  review.comment = comment;
  review.rating = rating;
  const _review = await review.save();
  res.status(StatusCodes.OK).json({ review: _review });
};
const deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`there is no review with id : ${id}`);
  }
  checkPermissions(req.user, review.user);
  await review.save();
  res.status(StatusCodes.OK).json({ msg: "The review was deleted." });
};

module.exports = {
  createReview,
  getSingleReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
