const Transaction = require("../model/transaction");

const createTransaction = async (body, owner) => {
  return await Transaction.create({ ...body, owner });
};

const getTransactionByPeriod = async (owner, period) => {
  return await Transaction.find({ owner, period });
};

module.exports = { createTransaction, getTransactionByPeriod };
