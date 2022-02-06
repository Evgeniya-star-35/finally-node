const express = require("express");
const router = express.Router();
const TransactionControllers = require("../../controllers/transaction");
const { guard } = require("../../middlewares");

const transactionControllers = new TransactionControllers();

router.post("/", guard, transactionControllers.createTransaction);

router.get(
  "/period/:period",
  guard,
  transactionControllers.transactionByPeriod
);

router.get("/:date", guard, transactionControllers.transactionsByDate);

module.exports = router;
