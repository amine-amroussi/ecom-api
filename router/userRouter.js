const {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  showCurrentUser,
  updateUserPassword,
} = require("../controller/userController");
const router = require("express").Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authenication");

router.route("/").get(authenticateUser,authorizePermissions, getAllUsers);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/changePassword").patch(authenticateUser, updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);
router.route("/:id").patch(authenticateUser, updateUser);
router.route("/:id").delete(authenticateUser, authorizePermissions, deleteUser);

module.exports = router;
