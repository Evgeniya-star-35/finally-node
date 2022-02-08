const User = require("../../repository/users");
const Transaction = require("../../repository/transaction");
const { HttpCode } = require("../../lib/constants");

class TransactionControllers {
  async createTransaction(req, res, next) {
    try {
      const allFields = { ...req.body, owner: req.user._id };
      const newTransaction = await Transaction.createTransaction(allFields);
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
      const remove = await Transaction.deleteTransaction(id);
      if (!remove) {
        res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Id of transaction not found",
        });
      }
      res
        .status(HttpCode.OK)
        .json({ code: HttpCode.OK, message: "Your transaction was delete" });
    } catch (error) {
      console.log(error.message);
    }
  }

  async transactionsByDate(req, res, next) {
    try {
      const { date } = req.params;
      const { owner } = req.user._id;

      const result = await Transaction.getTransactionByDate(owner, date);

      return res
        .status(HttpCode.OK)
        .json({ status: "success", code: HttpCode.OK, result });
    } catch (error) {
      next();
    }
  }

  // async transactionsByMonth(req, res, next) {
  //   try {
  //     const { month } = req.params;
  //     const { owner } = req.user._id;

  //     const result = await Transaction.getTransactionByMonth(owner, month);

  //     return res
  //       .status(HttpCode.OK)
  //       .json({ status: "success", code: HttpCode.OK, result });
  //   } catch (error) {
  //     next();
  //   }
  // }

  async transactionByPeriod(req, res, next) {
    try {
      const { period } = req.params;
      const { owner } = req.user._id;
      const periodLength = period.length;

      if (period) {
        if (periodLength <= 5) {
          const year = period;
          const result = await Transaction.getTransactionByPeriod(owner, year);
          return res
            .status(HttpCode.OK)
            .json({ status: "success", code: HttpCode.OK, result });
        }

        if (periodLength > 6) {
          const newPeriod = period.split("-");
          const month = newPeriod[0];
          const year = newPeriod[1];
          const result = await TTransaction.getTransactionByPeriod(
            owner,
            year,
            month
          );
          console.log(result);
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
      console.log(id);
      const userTransaction = req.body;
      console.log(userTransaction);
      const result = await Transaction.updateTransaction(id, userTransaction);
      console.log(result);
      if (!result) {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not Found",
        });
      }
      const userId = req.user._id;
      console.log(userId);
      const userBalance = req.body.balance;
      console.log(userBalance);
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
