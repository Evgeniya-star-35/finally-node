const Transaction = require("../model/transaction");

const createTransaction = async (body, owner) => {
  return await Transaction.create({ ...body, owner });
};

module.exports = createTransaction;
