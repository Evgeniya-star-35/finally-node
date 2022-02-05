const { HttpCode } = require("../../lib/constants");
const authService = require("../../service/auth");
const Users = require("../../repository/users");

class AuthControllers {
  async registration(req, res, next) {
    try {
      const { email } = req.body;
      const userExist = await authService.userExist(email);
      if (userExist) {
        return res.status(HttpCode.CONFLICT).json({
          status: "error",
          code: HttpCode.CONFLICT,
          message: "User is exist",
        });
      }
      const userData = await authService.create(req.body);
      return res
        .status(HttpCode.CREATED)
        .json({ status: "success", code: HttpCode.CREATED, ...userData });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.getUser(email, password);
      if (!user) {
        return res.status(HttpCode.UNAUTHORIZED).json({
          status: "Unauthorized",
          code: HttpCode.UNAUTHORIZED,
          message: "Email or password is wrong",
        });
      }
      const token = authService.createToken(user);
      const refreshToken = authService.createRefreshToken(user);

      await authService.setToken(user.id, token, refreshToken);

      const { name, avatar } = user;

      res.status(HttpCode.OK).json({
        status: "OK",
        code: HttpCode.OK,
        data: { token, refreshToken, user: { name, email, avatar } },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBalance(req, res, next) {
    try {
      const userId = req.user.id;
      const userBalance = req.body.balance;
      const result = await Users.createBalance(userId, userBalance);
      if (result) {
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          data: { balance: result.balance },
        });
      }

      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Not found",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthControllers;
