const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token, refreshToken) => {
  return await User.updateOne({ _id: id }, { token, refreshToken });
};

const createBalance = async (id, balance) => {
  const result = await User.findByIdAndUpdate(id, { balance }, { new: true });
  return result;
};

module.exports = { findById, findByEmail, create, updateToken, createBalance };
