const express = require("express");
const router = express.Router();
const TransactionControllers = require("../../controllers/transaction");
const { guard } = require("../../middlewares");

const transactionControllers = new TransactionControllers();

router.post("/", guard, transactionControllers.createTransaction);
router.delete("/:id", guard, transactionControllers.deleteTransaction);

module.exports = router;
