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
      next();
    }
  }
}

module.exports = TransactionControllers;
