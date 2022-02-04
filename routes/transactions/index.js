import express from "express";
import guard from "../../midllewares/guard";
import { updateBalance } from "../../controllers";

const router = express.Router();

router.patch("/balance", guard, updateBalance);

export default router;
