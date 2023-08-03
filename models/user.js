const { Schema, model } = require("mongoose");
const { hendleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegexp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const userShema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    }
  },
  { versionKey: false, timestamps: true }
);
userShema.post("save", hendleMongooseError);

const registerShema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginShema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const sсhemas = {
  registerShema,
  loginShema,
};

const User = model("user", userShema);

module.exports = {
  User,
  sсhemas,
};
