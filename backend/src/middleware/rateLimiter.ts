import type { NextFunction, Request, Response } from "express";
import rateLimit from "../config/upstash.js";

const rateLimiter = async(req: Request, res: Response, next: NextFunction) => {
  try {
    // add the id from clerk, when setting up clerk.
    const { success } = await rateLimit.limit("my-rate-limiter");

    if (!success) {
      return res.status(429).json({
        message: "Too many request, please try again later."
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error: "+error);
    next(error);
  }
}

export default rateLimiter;