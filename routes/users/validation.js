const Joi = require("joi");
const { HttpCode } = require("../../lib/constants");
const pkg = require("mongoose");
const { Types } = pkg;

const createUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const validateCreateUser = async (req, res, next) => {
  try {
    await createUserSchema.validateAsync(req.body);
  } catch (err) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "You forget something",
    });
  }
  next();
};

// const validationUserLogin = (req, res, next) => {
//   if ("password" in req.body && "email" in req.body) {
//     return validate(schemaUserLogin, req.body, next);
//   }
//   return res.status(HttpCode.BAD_REQUEST).json({
//     status: "error",
//     code: HttpCode.BAD_REQUEST,
//     message: "Missing required name field",
//   });
// };

const validationUserId = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.user.id)) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Invalid token",
    });
  }
  next();
};
module.exports = {
  validateCreateUser,
  validationUserId,
};
