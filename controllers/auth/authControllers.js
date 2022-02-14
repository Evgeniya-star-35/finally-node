// const axios = require("axios");
// const queryString = require("query-string");
const { HttpCode } = require("../../lib/constants");
const authService = require("../../service/auth");
const Users = require("../../repository/users");
const {
  AvatarStorage,
  CloudStorage,
  // LocalStorage,
} = require("../../service/storageAvatar");
const EmailService = require("../../service/email/service");
const { CreateSenderSendGrid } = require("../../service/email/sender");

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
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid()
      );

      const isSend = await emailService.sendVerifyEmail(
        email,
        userData.name,
        userData.verifyTokenEmail
      );

      delete userData.verifyTokenEmail;
      return res.status(HttpCode.CREATED).json({
        status: "success",
        code: HttpCode.CREATED,
        data: { ...userData, isSendEmailVerify: isSend },
      });
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
          message: "Not unauthorized",
        });
      }
      const token = authService.createToken(user);
      const refreshToken = authService.createRefreshToken(user);

      await authService.setToken(user.id, token, refreshToken);

      const { name, avatar, balance } = user;

      res.status(HttpCode.OK).json({
        status: "OK",
        code: HttpCode.OK,
        data: { token, refreshToken, user: { name, email, avatar, balance } },
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

  async uploadAvatar(req, res, next) {
    const avatarStorage = new AvatarStorage(CloudStorage, req.file, req.user);

    const avatarUrl = await avatarStorage.updateAvatar();

    res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data: { avatarUrl } });
  }

  async current(req, res) {
    const { email, balance, avatar } = req.user;
    const userToken = await req.user.token;
    const userRefreshToken = await req.user.refreshToken;
    const userId = await req.user.id;
    if (!userToken || !userRefreshToken || !userId) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: {
          email,
          avatar,
          balance,
        },
      },
    });
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

  async aggregationBalance(req, res, next) {
    const { id } = req.params;
    console.log(id);
    const data = await Users.getStatisticsBalance(id);
    console.log(data);
    if (data) {
      return res
        .status(HttpCode.OK)
        .json({ status: "success", code: HttpCode.OK, data });
    }
    res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  }

  async verifyUser(req, res, next) {
    try {
      const userFromToken = await Users.findByVerifyToken(req.params.token);
      if (userFromToken) {
        await Users.updateVerify(userFromToken.id, true);
        return res.status(HttpCode.OK).json({
          status: "ОК",
          code: HttpCode.OK,
          data: { message: "Success" },
        });
      }
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "success",
        code: HttpCode.BAD_REQUEST,
        data: { message: "Invalid token" },
      });
    } catch (error) {
      next(error);
    }
  }

  async repeatVerifyUser(req, res, next) {
    try {
      const user = await Users.findByEmail(req.body.email);
      if (user) {
        const { email, name, isVerify, verifyTokenEmail } = user;
        if (!isVerify) {
          const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateSenderSendGrid()
          );
          const isSend = await emailService.sendVerifyEmail(
            email,
            name,
            verifyTokenEmail
          );
          if (isSend) {
            return res.status(HttpCode.OK).json({
              status: "success",
              code: HttpCode.OK,
              data: { message: "Verification email sent" },
            });
          }
        }
        return res.status(HttpCode.UE).json({
          status: "error",
          code: HttpCode.UE,
          message: "Unprocessable Entity",
        });
      }
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "User with email not found",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthControllers;
