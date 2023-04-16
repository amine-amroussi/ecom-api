const router = require("express").Router();

const {
  createReview,
  getSingleReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");

const { authenticateUser } = require("../middleware/authenication");

router
  .route("/")
  .get(getAllReviews)
  .post(authenticateUser, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
