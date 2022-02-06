const Transaction = require("../model/transaction");

const createTransaction = async (body, owner) => {
  return await Transaction.create({ ...body, owner });
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndRemove({ _id: id });
};

module.exports = { createTransaction, deleteTransaction };
