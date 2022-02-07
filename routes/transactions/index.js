const express = require("express");
const router = express.Router();
const TransactionControllers = require("../../controllers/transaction");
const { guard } = require("../../middlewares");

const transactionControllers = new TransactionControllers();

router.post("/", guard, transactionControllers.createTransaction);
router.delete("/:id", guard, transactionControllers.deleteTransaction);
router.get(
  "/period/:period",
  guard,
  transactionControllers.transactionByPeriod
);
router.get("/:date", guard, transactionControllers.transactionsByDate);
router.put("/:id", guard, transactionControllers.updateTransaction);

module.exports = router;
