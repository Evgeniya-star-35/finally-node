const jwt = require("jsonwebtoken");
const User = require("../model/user");

const createBalance = async (id, balance) => {
  const result = await User.findByIdAndUpdate(id, { balance }, { new: true });
  return result;
};

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findByVerifyToken = async (verifyTokenEmail) => {
  return await User.findOne({ verifyTokenEmail });
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const createToken = (id) => {
  const payload = { id, test: "Hello" };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "2h",
  });
  return token;
};

const createRefreshToken = (id) => {
  const payload = { id, test: "Hello again" };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "10h",
  });
  return token;
};

const updateToken = async (id, token, refreshToken) => {
  return await User.updateOne({ _id: id }, { token, refreshToken });
};

const updateVerify = async (id, status) => {
  return await User.updateOne(
    { _id: id },
    { isVerify: status, verifyTokenEmail: null }
  );
};

const update = async (id, email, password, avatar) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { user: { email, password, avatar } },
    { new: true }
  );
  return result;
};

const updateGoogleUser = async (userId, body) => {
  const result = await User.findOneAndUpdate(
    { _id: userId },
    {
      avatarURL: body,
      verify: true,
      verifyToken: null,
    },
    { returnDocument: "after", runValidators: true }
  );
  return result;
};

module.exports = {
  createBalance,
  findById,
  findByEmail,
  findByVerifyToken,
  create,
  updateToken,
  updateVerify,
  update,
  updateGoogleUser,
  createToken,
  createRefreshToken,
};
