import jwt from "jsonwebtoken";
import repositoryUsers from "../../repository/users";
const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthService {
  async userExist(email) {
    const user = await repositoryUsers.findByEmail(email);
    return !!user;
  }

  async create(body) {
    const { id, name, email, avatar } = await repositoryUsers.create(body);
    return { id, name, email, avatar };
  }

  async getUser(email, password) {
    const user = await repositoryUsers.findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!isValidPassword) {
      return null;
    }
    return user;
  }

  createToken(user) {
    const { id, email } = user;
    const payload = { id, email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    return token;
  }

  createRefreshToken = (user) => {
    const { id, email } = user;
    const payload = { id, email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "8h" });
    return token;
  };

  async setToken(id, token, refreshToken) {
    await repositoryUsers.updateToken(id, token, refreshToken);
  }
}

export default new AuthService();
