const Transaction = require("../model/transaction");

const createTransaction = async (body) => {
  return await Transaction.create({ ...body });
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndRemove({ _id: id });
};

const getTransactionByPeriod = async ({ owner, year }) => {
  return await Transaction.find({ owner, year });
};

const getTransactionByYearAndMonth = async ({ owner, year, month }) => {
  return await Transaction.find({ owner, year, month });
};

const getTransactionByDate = async ({ owner, date }) => {
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
  getTransactionByYearAndMonth,
};
