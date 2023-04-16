const mongoose = require("mongoose");
const validator = require("validator");
const bycript = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name must be required."],
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "The email must be required."],
      unique : [true, 'This email is Already exist.'],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a validate email !",
      },
    },
    password: {
      type: String,
      required: [true, "The password must be required."],
      minlength: 6,
    },
    numberPhone: {
      type: String,
      required: [true, "The number phone must be required."],
      maxlength: 20,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    adress : {
      type : String,
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function() {
    if(!this.isModified('password')) return
    const salt = await bycript.genSalt(10)
    this.password = await bycript.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function(clientPassword) {
    const isMatch = await bycript.compare(clientPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User' , UserSchema)