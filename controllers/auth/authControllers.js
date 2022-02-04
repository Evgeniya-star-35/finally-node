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
}

export default new AuthControllers();
