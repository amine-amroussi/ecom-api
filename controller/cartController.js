const Cart = require("../model/Cart");
const Product = require("../model/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const addToCart = async (req, res) => {
  // get the product and get search of the cart
  const { productId, amount } = req.body;
  const dbProduct = await Product.findOne({ _id: productId });

  // get the cart
  let cart = await Cart.findOne({ user: req.user.userId });
  // check if the products cart length
  if (cart?.products.length < 1) {
    await cart.remove();
    cart = null;
  }
  // distruct the {title, price , image _id}
  const { title, price, image, _id } = dbProduct;
  // check if the cart exist

  if (!cart) {
    // create cart obj
    const cartObj = {};

    cartObj.products = {
      title,
      price,
      image,
      _id,
      product: _id,
      amount,
      shippingCost: dbProduct.shippingCost || 0,
    };
    console.log(dbProduct.shippingCost);
    cartObj.amount = amount;
    cartObj.total = amount * price;
    cartObj.user = req.user.userId;
    // create cart
    const _cart = await Cart.create(cartObj);
    return res.status(StatusCodes.CREATED).json({ cart: _cart });
  }

  // check if product is exesting
  const index = cart.products.findIndex(
    (item) => item.product.toString() === productId
  );
  if (index !== null && index !== -1) {
    cart.products[index].amount += amount;
    cart.total += price * amount;
    await cart.save();
    return res.status(StatusCodes.OK).json({ cart });
  }

  // add new product to products cart
  const total = cart.total + amount * price;
  cart.total = total;
  cart.products = [
    ...cart.products,
    {
      title,
      price,
      image,
      product: _id,
      amount,
      shippingCost: dbProduct.shippingCost || 0,
    },
  ];
  await cart.save();
  return res.status(StatusCodes.OK).json({ cart });
};

const showMyCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ cart });
};

const removeItem = async (req, res) => {
  const { id } = req.params;
  // get cart
  const cart = await Cart.findOne({ user: req.user.userId });
  // get Product
  const dbProduct = await Product.findOne({ _id: id });
  // get specific product
  const index = cart.products.findIndex(
    (item) => item.product.toString() === id
  );

  const product = cart.products[index];

  // check if product exist
  if (index === null) {
    throw new CustomError.NotFoundError(
      `there is no product in cart with id :${id}`
    );
  }
  // check product amount
  if (product.amount <= 1) {
    const filtredProductsCart = cart.products.filter(
      (product) => product.product.toString() !== id
    );
    cart.products = filtredProductsCart;
    await cart.save();
    return res.status(StatusCodes.OK).json({ cart });
  }

  cart.products[index].amount -= 1;
  cart.total -= dbProduct.price;
  cart.shippingCost -= dbProduct.shippingCost;
  await cart.save();
  res.status(StatusCodes.OK).json({ cart });
};

const deleteProductFromCart = async (req, res) => {
  const { id } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.userId },
    { $pull: { products: { product: id } } },
    { new: true, runValidators: true, safe: true, multi: true }
  );

  // const _cart = await cart.products.pull({ product: id });

  res.status(StatusCodes.OK).json({ cart });
};

module.exports = {
  addToCart,
  showMyCart,
  removeItem,
  deleteProductFromCart,
};
