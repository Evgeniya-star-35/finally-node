import express from "express";
import { guard } from "../../middlewares";
import { updateBalance } from "../../controllers";

const router = express.Router();

router.patch("/balance", guard, updateBalance);

export default router;
