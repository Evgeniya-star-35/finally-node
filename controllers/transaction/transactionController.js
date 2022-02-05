const User = require("../../repository/users");
const { HttpCode } = require("../../lib/constants");
const Transaction = require("../../model/transaction");

class TransactionControllers {
  async createTransaction(req, res, next) {
    try {
      const newTransaction = { ...req.body.transaction, owner: req.user._id };
      console.log(req.body);
      console.log(1);
      console.log(newTransaction);
      const resultTransaction = await Transaction.create(newTransaction);
      const userId = req.body._id;
      const userBalance = req.body.balance;
      const resultBalance = await User.createBalance(userId, userBalance);
      if (!resultBalance) {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not Found",
        });
      }
      console.log(2);
      const { balance } = resultBalance;
      res.status(HttpCode.CREATED).json({
        status: "Created",
        code: HttpCode.CREATED,
        resultTransaction,
        balance,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
}

module.exports = TransactionControllers;
