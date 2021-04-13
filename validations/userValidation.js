const User = require("../models/User");

const Joi = require("joi");

// Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
};
