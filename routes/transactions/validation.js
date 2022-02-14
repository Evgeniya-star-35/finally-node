const Joi = require("joi");
const { HttpCode } = require("../../lib/constants");
const pkg = require("mongoose");
const { Types } = pkg;

const createTransactionSchema = Joi.object({
  type: Joi.string().required(),
  date: Joi.string().required(),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  sum: Joi.number().required(),
  day: Joi.string().optional(),
  month: Joi.string().optional(),
  year: Joi.string().optional(),
});

const validateCreateTransaction = async (req, res, next) => {
  try {
    await createTransactionSchema.validateAsync(req.body);
  } catch (err) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: err.message,
    });
  }
  next();
};

const validationId = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Invalid ObjectID",
    });
  }
  next();
};

module.exports = { validateCreateTransaction, validationId };
