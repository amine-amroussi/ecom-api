const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {checkPermissions} = require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`there is no user with this id : ${id}`);
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user });
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new CustomError(`there is no user with this id : ${id}`);
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user });
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new CustomError(`there is no user with this id : ${id}`);
  }
  checkPermissions(req.user, user._id)
  res.send("delete user");
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const {userId} = req.user;

  const user = await User.findOne({_id : userId})

  const isMatch = await user.comparePassword(oldPassword)

  if(!isMatch) {
    throw new CustomError.BadRequestError('The old password is not correct.')
  }

  user.password = newPassword;
  await user.save()
  checkPermissions(req.user, user._id)

  res.status(StatusCodes.OK).json({msg : 'The password has changed successfuly..'})

};

const showCurrentUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId }).select('-password');
  console.log(user)
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  showCurrentUser,
  updateUserPassword
};
