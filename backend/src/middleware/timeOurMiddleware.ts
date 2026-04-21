import type { NextFunction, Request, Response } from "express";

const timeoutMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  res.setTimeout(8000, () => {
    res.status(408).json({
      message: "Request timeout",
    });
  });

  next();
}

export default timeoutMiddleware;