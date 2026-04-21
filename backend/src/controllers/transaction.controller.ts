import type { Response, Request } from "express";
import { sql } from "../config/db.js";
import { redis } from "../config/redis.js";

export const userTransactionsDetails = async (req: Request, res: Response) => {
  try {
    const {userId} = req.params;

    const transactionDetails = await sql`
      SELECT * FROM transactions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    if (transactionDetails.length === 0) {
      return res.status(404).json({
        message: "Couldn't find the transaction details. Please check the user id"
      });
    }

    res.status(200).json(transactionDetails);
  } catch (error) {
    console.error("Error in /api/transaction route method: GET. "+error);
    res.status(500).json({message: "Internal server error: "+error});
  }
}

export const userTransactionsSummary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cacheKey = `summary:${userId}`

    const cache = await redis.get(cacheKey);

    if (cache) {
      return res.status(200).json(cache);
    }

    const result = await sql`
      SELECT 
      COALESCE(SUM(amount),0) as total_balance,
      COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expenses 
      FROM transactions
      WHERE user_id = ${userId}
    `

    const returnResult = {
      balance: result[0]?.total_balance,
      income: result[0]?.income,
      expense: result[0]?.expenses
    }

    await redis.set(cacheKey, returnResult, { ex: 90 });

    res.status(200).json({
      message: "Summary fteched successfully",
      balance: result[0]?.total_balance,
      income: result[0]?.income,
      expense: result[0]?.expenses
    })

  } catch (error) {
    console.error("Error in /api/transaction/summary route method: GET. "+error);
    res.status(500).json({message: "Internal server error: "+error});
  }
}

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { amount, title, type, user_id, category } = req.body;

    if (!title || !amount || !type || !user_id) {
      return res.status(400).json("All fields are required");
    }

    const transaction = await sql`INSERT INTO transactions(user_id, title, amount, type, category) VALUES(
      ${user_id},
      ${title},
      ${amount},
      ${type},
      ${category}
    ) RETURNING * `

    await redis.del(`summary:${user_id}`);

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error in /api/transaction route method: POST. "+error);
    res.status(500).json({message: "Internal server error+"+error});
  }
}

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await sql`
      DELETE FROM transactions
      WHERE id=${id}
      RETURNING *
    `

    if (result.length === 0) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    await redis.del(`summary:${result[0]?.user_id}`);

    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: result[0]
    });
  } catch (error) {
    console.error("Error in /api/transaction route method: DELETE. "+error);
    res.status(500).json({message: "Internal server error+"+error});
  }
}