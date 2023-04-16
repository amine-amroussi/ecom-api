const router = require("express").Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authenication");
const {
  createProduct,
  getAllProducts,
  getsingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProductReviews,
  getFeaturedProducts
} = require("../controller/productController");

router.route('/featuredProducts').get(getFeaturedProducts)
router
  .route("/")
  .post([authenticateUser, authorizePermissions], createProduct)
  .get(getAllProducts);
router
  .route("/:id")
  .get( getsingleProduct)
  .patch([authenticateUser, authorizePermissions], updateProduct)
  .delete([authenticateUser, authorizePermissions], deleteProduct);
router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions], uploadImage);

router.route("/:id/review").get(getSingleProductReviews);

module.exports = router;
