const Order = require("../model/Order");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");
const Product = require("../model/Product");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  const { products, tax, shippingFee } = req.body;
  console.log(req.body);
  if (!products || products.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }

  // if (!shippingFee || !tax) {
  //   throw new CustomError.BadRequestError(
  //     "the tax and shipping fee must be provided."
  //   );
  // }

  let orderItems = [];
  let subtotal = 0;

  for (const item of products) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct)
      throw new CustomError.NotFoundError(
        `there is no product with id : ${item.product}`
      );

    const { title, price, image, _id } = dbProduct;
    const singleOrderItem = {
      title,
      price,
      image,
      product: _id,
      amount: item.amount,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }

  const total = shippingFee + tax + subtotal;

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    shippingFee,
    tax,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ order });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
};
const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  if (!order)
    throw new CustomError.NotFoundError(`there is no order with id ! ${id}`);
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;
  if (!paymentIntentId)
    throw new CustomError.BadRequestError("Please provide payment intent id");

  const order = await Order.findOne({ _id: id });
  if (!order)
    throw new CustomError.NotFoundError(`there is no order with id : ${id}`);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  checkPermissions(req.user, order.user);
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};
const showAllMyOrders = async (req, res) => {
  const { userId: user } = req.user;
  const orders = await Order.find({ user });
  res.status(StatusCodes.OK).json({ orders });
};

const stripeSession = async (req, res) => {
  const { items, shippingFee } = req.body;
  const lineItems = items.map((item) => {
    const image = `https://localhost:5000/${item.image}`;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [image],
        },
        unit_amount: item.price,
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
      },
      quantity: item.amount,
    };
  });

  const shippingDisplay =
    shippingFee === 0 ? "Free Shipping ! " : `Shipping Fee : ${shippingFee}`;

  const params = {
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingFee,
            currency: "usd",
          },
          display_name: shippingDisplay,
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    mode: "payment",
    submit_type: "pay",
    payment_method_types: ["card"],
    billing_address_collection: "auto",
    success_url: `http://localhost:3000/checkout/success?status=true`,
    cancel_url: `http://localhost:3000/cart`,
  };
  const session = await stripe.checkout.sessions.create(params);
  console.log("Result");
  console.log(session);
  res.status(StatusCodes.OK).json(session);
};

const editStatus = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOneAndUpdate({ _id: id }, req.body, {
    runValidators: true,
    new: true,
  });

  if (!order) {
    throw new CustomError.NotFoundError(`there is no item with id ${id}`);
  }


  res.cookie("token", "strip", {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    signed: true,
    sameSite: "none",
    domain: "strip.com",
  });

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  showAllMyOrders,
  stripeSession,
  editStatus,
};
