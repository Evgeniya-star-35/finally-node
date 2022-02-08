const Transaction = require("../model/transaction");

const createTransaction = async (body, owner) => {
  return await Transaction.create({ ...body, owner });
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndRemove({ _id: id });
};

const getTransactionByPeriod = async (owner, period) => {
  return await Transaction.find({ owner, period });
};

const getTransactionByDate = async (owner, date) => {
  return await Transaction.find({ owner, date });
};

// const getTransactionByMonth = async (owner, month) => {
//   return await Transaction.find({ owner, month });
// };

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
  // getTransactionByMonth,
  deleteTransaction,
  updateTransaction,
};
