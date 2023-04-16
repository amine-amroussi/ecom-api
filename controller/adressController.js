const Adress = require("../model/Adress");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createAdress = async (req, res) => {
  const { userId } = req.user;
  // check if the adress is already created
  const alreadyCreated = await Adress.findOne({ user: userId });
  if (alreadyCreated)
    throw new CustomError.BadRequestError("This Adress is already exist.");

  req.body.user = userId;
  const adress = await Adress.create(req.body);

  res.status(StatusCodes.CREATED).json({ adress });
};

const fetchUserAdress = async (req, res) => {
  const { userId } = req.user;
  const adress = await Adress.findOne({ user: userId });
  res.status(StatusCodes.OK).json({ adress });
};

const updateAdress = async (req, res) => {
  const adress = await Adress.findOneAndUpdate(
    { user: req.user.userId },
    req.body,
    { runValidators: true, new: true }
  );
  res.status(StatusCodes.OK).json({ adress });
};

module.exports = {
  createAdress,
  fetchUserAdress,
  updateAdress,
};
