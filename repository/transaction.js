const Transaction = require("../model/transaction");

const createTransaction = async (body, owner) => {
  return await Transaction.create({ ...body, owner });
};

const getTransactionByPeriod = async (owner, period) => {
  return await Transaction.find({ owner, period });
};

const getTransactionByDate = async (owner, date) => {
  return await Transaction.find({ owner, date });
};

module.exports = {
  createTransaction,
  getTransactionByPeriod,
  getTransactionByDate,
};
