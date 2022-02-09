const Transaction = require("../model/transaction");

const createTransaction = async (body, owner) => {
  return await Transaction.create({ ...body, owner });
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndRemove({ _id: id });
};

const getTransactionByPeriod = async (owner, year) => {
  return await Transaction.find({ owner, year });
};

const getTransactionByDate = async (owner, date) => {
  return await Transaction.find({ owner, date });
};

const updateTransaction = async (id, transaction) => {
  return await Transaction.findByIdAndUpdate(
    id,
    { transaction },
    { new: true }
  );
};

module.exports = {
  createTransaction,
  getTransactionByPeriod,
  getTransactionByDate,
  deleteTransaction,
  updateTransaction,
};
