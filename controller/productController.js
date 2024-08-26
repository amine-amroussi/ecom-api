const Product = require("../model/Product");
const Review = require("../model/Review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find();
  console.log("Get Products");
  
  res.status(StatusCodes.OK).json({ products });
};

const getsingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id }).populate("reviews");
  if (!product)
    throw new CustomError.NotFoundError(`There is no product with id ${id}`);
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    runValidators: true,
    new: true,
  });
  if (!product)
    throw new CustomError.NotFoundError(`There is no product with id ${id}`);
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product)
    throw new CustomError.NotFoundError(`There is no product with id ${id}`);

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "The product was deleted." });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploded.");
  }
  const productImage = req.files.image;
  console.log(productImage);
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please provide a valid image.");
  }
  const maxsize = 1024 * 1024 * 10;
  if (productImage.size > maxsize) {
    throw new CustomError.BadRequestError("Image must be smaller then 10MB");
  }
  const imagePath = path.join(
    __dirname,
    "/public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId }).populate(
    "user",
    "name"
  );
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getFeaturedProducts = async (req, res) => {
  const featuredProducts = await Product.find({featured : true});
  res.status(StatusCodes.OK).json({ featuredProducts });
};

module.exports = {
  createProduct,
  getAllProducts,
  getsingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProductReviews,
  getFeaturedProducts
};
