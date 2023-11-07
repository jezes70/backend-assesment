const Joi = require("joi");
const { body } = require("express-validator");

const createUserValidator = Joi.object({
  phone: Joi.string().required().min(11),
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()

    .pattern(/^[a-zA-Z0-9]{4,8}$/)
    .required()
    .label("Password")
    .messages({
      "string.pattern.base": "{#label} must contain only alphabets and numbers",
    }),

  interests: Joi.string().required(),
  phone: Joi.number().required(),
});

const loginUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .min(5)
    .regex(/^[a-zA-Z0-9]{5,15}$/)
    .required(),
});
const variables = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

const isOtpValid = (user, providedOtp) => {
  if (!user.otp_expiry) {
    return false;
  }
  const currentTimestamp = new Date();
  return user.otp === providedOtp && currentTimestamp <= user.otp_expiry;
};
module.exports = {
  isOtpValid,
  variables,
  loginUserSchema,
  createUserValidator,
};
