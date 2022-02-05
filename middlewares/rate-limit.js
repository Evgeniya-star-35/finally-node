const { rateLimit } = require("express-rate-limit");
const { HttpCode } = require("../lib/constants");

const limiter = (duration, limit) => {
  return rateLimit({
    windowMs: duration,
    max: limit,
    standardHeaders: true, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next) => {
      return res.status(HttpCode.TOO_MANY_REQUEST).json({
        status: "error",
        code: HttpCode.TOO_MANY_REQUEST,
        message: "Too many requests, please try again later",
      });
    },
  });
};
module.exports = limiter;
