import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  userTransactionsDetails,
  userTransactionsSummary
} from "../controllers/transaction.controller.js"

const router = Router();

// GET Requests
router.get("/:userId", userTransactionsDetails);
router.get("/summary/:userId", userTransactionsSummary);

// POST Requests
router.post("/", createTransaction);

// DELETE Requests
router.delete("/:id", deleteTransaction);

export default router;