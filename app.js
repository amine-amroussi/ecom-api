require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const { createProxyMiddleware } = require("http-proxy-middleware");

// database
const connectDB = require("./db/connect");

// import middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// import routes
const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");
const productRouter = require("./router/productRouter");
const reviewRouter = require("./router/reviewRouter");
const orderRouter = require("./router/orderRouter");
const cartRouter = require("./router/cartRouter");
const adressRouter = require("./router/adressRouter");
// const emailRouter = require('./router/sendEmailRouter')

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});




// set packages
app.set("trust proxy", 1);
app.use(limiter);
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(xss());
app.use(mongoSanitize());

// set the middlewares

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(fileUpload());
app.use(express.static("./public"));

// set routes
app.get("/", (req, res) => {
  res.send("Welcom, to ecom api.");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/adress", adressRouter);
// app.use("/api/v1/email", emailRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`The server is start in port ${PORT} ...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
