const User = require("../../repository/users");
const Transactions = require("../../repository/transaction");
const { HttpCode } = require("../../lib/constants");
const Transaction = require("../../model/transaction");

class TransactionControllers {
  async createTransaction(req, res, next) {
    try {
      const { _id } = req.user;
      const userId = req.user._id;
      const userBalance = req.user.balance;
      const newTransaction = await Transactions.createTransaction({
        ...req.body,
        owner: req.user._id,
      });

      const transaction = await Transaction.findOne({ owner: _id }).sort({
        $natural: -1,
      });
      const { sum, type } = transaction;
      const updateBalance =
        type === "cost" ? userBalance - sum : userBalance + sum;

      if (updateBalance < 0) {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: "error",
          code: HttpCode.BAD_REQUEST,
          message: "There is no money for this purchase",
        });
      }

      const resultBalance = await User.createBalance(userId, updateBalance);
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
        newTransaction,
        balance,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async deleteTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const userBalance = req.user.balance;

      const removeTransaction = await Transactions.deleteTransaction(id);
      if (!removeTransaction) {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Id of transaction not found",
        });
      }
      // res
      //   .status(HttpCode.OK)
      //   .json({ code: HttpCode.OK, message: "Your transaction was delete" });

      const { sum, type } = removeTransaction;
      const updateBalance =
        type === "cost" ? userBalance + sum : userBalance - sum;

      if (updateBalance < 0) {
        throw new BadRequest("There are no enough money for this purchase");
      }

      const resultBalance = await User.createBalance(userId, updateBalance);
      if (!resultBalance) {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not Found",
        });
      }

      const { balance } = resultBalance;

      return res.status(HttpCode.CREATED).json({
        status: "Created",
        code: HttpCode.CREATED,
        balance,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async transactionsByDate(req, res, next) {
    try {
      const { date } = req.params;

      const result = await Transactions.getTransactionByDate({
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

          const result = await Transactions.getTransactionByPeriod({
            owner: req.user._id,
            year,
          });
          return res.status(HttpCode.OK).json({
            status: "success",
            code: HttpCode.OK,
            result,
          });
        }

        if (periodLength > 5) {
          const newPeriod = period.split(".");
          const month = newPeriod[0];
          const year = newPeriod[1];
          const result = await Transactions.getTransactionByYearAndMonth({
            owner: req.user._id,
            month,
            year,
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

  async updateTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const userTransaction = req.body;
      const result = await Transactions.updateTransaction(id, userTransaction);
      if (!result) {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not Found",
        });
      }
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
        result,
        balance,
      });
    } catch (error) {
      next();
    }
  }
}

module.exports = TransactionControllers;
