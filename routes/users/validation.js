import Joi from "joi";
import { HttpCode } from "../../lib/constants";

const schemaUserLogin = Joi.object({
  password: Joi.string()
    .pattern(/[0-9A-Za-zА-Яа-яЁёЄєЇї!@#$%^&*]{6,}/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  subscription: Joi.string().optional(),
});

export const validationUserLogin = (req, res, next) => {
  if ("password" in req.body && "email" in req.body) {
    return validate(schemaUserLogin, req.body, next);
  }
  return res.status(HttpCode.BAD_REQUEST).json({
    status: "error",
    code: HttpCode.BAD_REQUEST,
    message: "Missing required name field",
  });
};
