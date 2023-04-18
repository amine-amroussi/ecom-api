const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  showAllMyOrders,
  stripeSession,
  editStatus,
} = require("../controller/orderController");
const router = require("express").Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authenication");

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get([authenticateUser, authorizePermissions], getAllOrders);

router.route("/create-checkout-session").post(authenticateUser, stripeSession);

router.route("/showAllMyOrders").get(authenticateUser, showAllMyOrders);

router
  .route("/edit-status/:id")
  .patch([authenticateUser, authorizePermissions], editStatus);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
