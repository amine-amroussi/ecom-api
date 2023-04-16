const { isTokenValid } = require("../utils");
const CustomError = require("../errors");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnAuthenticateError("Authentication invalid");
  }
  try {
    const { name, email, role, userId } = isTokenValid({ token });
    req.user = { name, email, role, userId };
    next();
  } catch (error) {
    throw new CustomError.UnAuthenticateError("Authentication invalid");
  }
};

const authorizePermissions = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new CustomError.UnAuthorizeError("Unauthorize route");
  }
  next()
};

module.exports = {authenticateUser, authorizePermissions}