const queryString = require("query-string");
const axios = require("axios");
const Users = require("../../repository/users");

let HOST;

switch (process.env.NODE_ENV) {
  case "development":
    HOST = process.env.BASE_URL;
    break;
  case "production":
    HOST = process.env.BACK_BASE;
    break;
  default:
    HOST = process.env.BASE_URL;
    break;
}

const googleAuth = async (_req, res, next) => {
  try {
    const stringifiedParams = queryString.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${HOST}/api/users/google-redirect`,
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
    });
    return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
    );
  } catch (error) {
    next(error);
  }
};

const googleRedirect = async (req, res, next) => {
  try {
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;
    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: "post",
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${HOST}/api/users/google-redirect`,
        grant_type: "authorization_code",
        code,
      },
    });

    const userData = await axios({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
      method: "get",
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
      },
    });

    const { email, name, picture, id } = userData.data;

    const user = await Users.findByEmail(email);
    if (!user) {
      const newUser = await Users.create({ email, name, password: id });
      const idUser = newUser.id;
      await Users.updateGoogleUser(idUser, picture);
      const token = Users.createToken(idUser);
      const refreshToken = Users.createRefreshToken(idUser);
      await Users.updateToken(idUser, token, refreshToken);
      return res.redirect(
        `${process.env.FRONTEND_URL}?token=${token}&refreshToken=${refreshToken}`
      );
    }
    const idUser = user.id;
    const token = Users.createToken(idUser);
    const refreshToken = Users.createRefreshToken(idUser);
    await Users.updateToken(idUser, token, refreshToken);
    return res.redirect(
      `${process.env.FRONTEND_URL}/googleAuth?token=${token}&refreshToken=${refreshToken}`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { googleAuth, googleRedirect };
// ============