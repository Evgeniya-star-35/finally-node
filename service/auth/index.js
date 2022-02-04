import repositoryUsers from "../../repository/users";

class AuthService {
  async userExist(email) {
    const user = await repositoryUsers.findByEmail(email);
    return !!user;
  }
  async create(body) {
    const { id, name, email, avatar } = await repositoryUsers.create(body);
    return { id, name, email, avatar };
  }
}

export default new AuthService();
