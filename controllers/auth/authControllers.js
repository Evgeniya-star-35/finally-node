const { HttpCode } = require("../../lib/constants");
const authService = require("../../service/auth");
const createBalance = require("../../repository/users");

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
  async logout(req, res, next) {
    try {
      const id = req.user.id;
      await authService.setToken(
        id,
        (req.user.token = null),
        (req.user.refreshToken = null)
      );

      return res.status(200).json({ code: 200, message: "Logout Success" });
    } catch (error) {
      next(error);
    }
  }

  async current(req, res) {
    const { email, subscription } = req.user;
    const userToken = await req.user.token;
    const userRefreshToken = await req.user.refreshToken;

    const userId = await req.user.id;
    if (!userToken || !userRefreshToken || !userId) {
      return res.status(HttpCode.UNAUTORIZED).json({
        status: "error",
        code: HttpCode.UNAUTORIZED,
        message: "Not authorized",
      });
    }

    res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: {
          email,
          subscription,
        },
      },
    });
  }

  async updateBalance(req, res, next) {
    try {
      const userId = req.user.id;
      const userBalance = req.body.balance;
      const result = await createBalance(userId, userBalance);
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
