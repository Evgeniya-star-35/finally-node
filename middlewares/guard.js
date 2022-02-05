const passport = require("passport");
require("../config/password");
const { HttpCode } = require("../lib/constants");

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    const headerAuth = req.get("Authorization");
    let token = null;
    if (headerAuth) {
      token = headerAuth.split(" ")[1];
    }

    if (error) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
    if (!user || token !== user?.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Unvalid token",
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
