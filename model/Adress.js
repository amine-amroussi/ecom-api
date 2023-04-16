const mongoose = require("mongoose");

const schemaAdress = new mongoose.Schema({
  mainAdress: {
    type: String,
    required: [true, "The adress must be require. "],
  },
  telephone: {
    type: String,
    required: [true, "The telephone number is required."],
  },
  city: {
    type: String,
    required: [true, "The city is required."],
  },
  zip: {
    type: String,
    required: [true, "Zip code is required."],
  },
  country : {
    type : String,
    required : [true , "The country is required"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The adress must have attached with a user"],
  },
});

module.exports = mongoose.model("Adress", schemaAdress);
