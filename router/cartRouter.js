const {
  addToCart,
  showMyCart,
  removeItem,
  deleteProductFromCart,
  clearCart,
} = require("../controller/cartController");
const router = require("express").Router();
const { authenticateUser } = require("../middleware/authenication");

router.route("/addToCart").post(authenticateUser, addToCart);
router.route("/clear").get(authenticateUser, clearCart);
router.route("/:id/removeItem").patch(authenticateUser, removeItem);
router
  .route("/:id/deleteProduct")
  .patch(authenticateUser, deleteProductFromCart);
router.route("/showMyCart").get(authenticateUser, showMyCart);

module.exports = router;
