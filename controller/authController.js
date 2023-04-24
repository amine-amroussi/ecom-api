const User = require("../model/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new CustomError.BadRequestError("The email is already exist.");
  }
  const _user = await User.create(req.body);
  const tokenUser = createTokenUser(_user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    throw new CustomError.BadRequestError("Please, provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.BadRequestError("There is no user with this email.");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new CustomError.BadRequestError("The password is not correct.");
  }

  const token = createTokenUser(user);

  attachCookiesToResponse({ res, user: token });
  res.status(StatusCodes.OK).json({ user: token });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
    secure: true,
    signed: true,
    sameSite: "none",
    domain: ".onrender.com",
  });
  res.status(StatusCodes.OK).json({ msg: "Logged out" });
};

module.exports = { register, login, logout };
