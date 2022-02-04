import { HttpCode } from "../../lib/constants";
import authService from "../../service/auth";

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
}

export default new AuthControllers();
