const User = require("../../repository/users");
// const repositoryTransactions = require("../../repository/transaction");
const { HttpCode } = require("../../lib/constants");
const Transaction = require("../../model/transaction");

class TransactionControllers {
  async createTransaction(req, res, next) {
    try {
      const newTransaction = { ...req.body, owner: req.user._id };
      const resultTransaction = await Transaction.create(newTransaction);
      const userId = req.user._id;
      const userBalance = req.body.balance;
      const resultBalance = await User.createBalance(userId, userBalance);
      if (!resultBalance) {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not Found",
        });
      }
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

  async transactionsByDate(req, res, next) {
    try {
      const { date } = req.params;
      const result = await Transaction.find({
        owner: req.user._id,
        date,
      });
      return res
        .status(HttpCode.OK)
        .json({ status: "success", code: HttpCode.OK, result });
    } catch (error) {
      next();
    }
  }

  async transactionByPeriod(req, res, next) {
    try {
      const { period } = req.params;

      const periodLength = period.length;
      if (period) {
        if (periodLength <= 4) {
          const year = period;
          const result = await Transaction.find({ owner: req.user._id, year });
          return res
            .status(HttpCode.OK)
            .json({ status: "success", code: HttpCode.OK, result });
        }

        if (periodLength > 5) {
          const newPeriod = period.split("-");
          const month = newPeriod[0];
          const year = newPeriod[1];
          const result = await Transaction.find({
            owner: req.user._id,
            year,
            month,
          });
          return res
            .status(HttpCode.OK)
            .json({ status: "success", code: HttpCode.OK, result });
        }
      }
    } catch (error) {
      next();
    }
  }
}

module.exports = TransactionControllers;
