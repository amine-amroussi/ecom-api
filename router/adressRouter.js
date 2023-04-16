const router = require("express").Router();
const { authenticateUser } = require("../middleware/authenication");
const {
  fetchUserAdress,
  createAdress,
  updateAdress,
} = require("../controller/adressController");

router
  .route("/")
  .get(authenticateUser, fetchUserAdress)
  .patch(authenticateUser, updateAdress)
  .post(authenticateUser, createAdress);

module.exports = router;
