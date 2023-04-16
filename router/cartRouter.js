const {
  addToCart,
  showMyCart,
  removeItem,
  deleteProductFromCart,
} = require("../controller/cartController");
const router = require("express").Router();
const { authenticateUser } = require("../middleware/authenication");

router.route("/addToCart").post(authenticateUser, addToCart);
router.route("/:id/removeItem").patch(authenticateUser, removeItem);
router.route('/:id/deleteProduct').patch(authenticateUser, deleteProductFromCart)
router.route("/showMyCart").get(authenticateUser, showMyCart);

module.exports = router;
