import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from 'morgan';
import helmet from "helmet";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from './routes/transaction.routes.js'
import timeoutMiddleware from "./middleware/timeOurMiddleware.js";

dotenv.config();
const app = express();

// middleware
app.use(helmet());
app.use(morgan("dev"))
app.use(cors());

app.use(express.json());

app.use(rateLimiter);
app.use(timeoutMiddleware);
app.use("/api/transaction", transactionRoutes);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Ki je kore amar server ta");
// });

// app.get("/api/transaction/:userId", async (req: Request, res: Response) => {
//   try {
//     const {userId} = req.params;

//     const transactionDetails = await sql`
//       SELECT * FROM transactions
//       WHERE user_id = ${userId}
//       ORDER BY created_at DESC
//     `

//     if (transactionDetails.length === 0) {
//       return res.status(404).json({
//         message: "Couldn't find the transaction details. Please check the user id"
//       });
//     }

//     res.status(201).json(transactionDetails);
//   } catch (error) {
//     console.error("Error in /api/transaction route method: GET. "+error);
//     res.status(500).json({message: "Internal server error: "+error});
//   }
// });
// app.get("/api/transaction/summary/:userId", async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;

//     const result = await sql`
//       SELECT 
//       COALESCE(SUM(amount),0) as total_balance,
//       COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS income,
//       COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expenses 
//       FROM transactions
//       WHERE user_id = ${userId}
//     `

//     res.status(200).json({
//       message: "Summary fteched successfully",
//       balance: result[0]?.total_balance,
//       income: result[0]?.income,
//       expense: result[0]?.expenses
//     })

//   } catch (error) {
//     console.error("Error in /api/transaction/summary route method: GET. "+error);
//     res.status(500).json({message: "Internal server error: "+error});
//   }
// })

// app.post("/api/transaction", async (req: Request, res: Response) => {
//   try {
//     const { amount, title, type, user_id, category } = req.body;

//     if (!title || !amount || !type || !user_id) {
//       res.status(400).json("All fields are required");
//     }

//     const transaction = await sql`INSERT INTO transactions(user_id, title, amount, type, category) VALUES(
//       ${user_id},
//       ${title},
//       ${amount},
//       ${type},
//       ${category}
//     ) RETURNING * `

//     res.status(201).json(transaction[0]);
//   } catch (error) {
//     console.error("Error in /api/transaction route method: POST. "+error);
//     res.status(500).json({message: "Internal server error+"+error});
//   }
// });

// app.delete("/api/transaction/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const result = await sql`
//       DELETE FROM transactions
//       WHERE id=${id}
//       RETURNING *
//     `

//     if (result.length === 0) {
//       return res.status(404).json({
//         message: "Transaction not found"
//       });
//     }

//     res.status(200).json({
//       message: "Transaction deleted successfully",
//       transaction: result[0]
//     });
//   } catch (error) {
//     console.error("Error in /api/transaction route method: DELETE. "+error);
//     res.status(500).json({message: "Internal server error+"+error});
//   }
// })

export default app;