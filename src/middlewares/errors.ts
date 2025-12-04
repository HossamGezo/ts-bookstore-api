// Import Express Types
import type {Request, Response, NextFunction} from "express";
// Not Found Error
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(err);
};
// Error Handler Middleware
const errorHandler = (
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err instanceof Error ? err.message : "Something went wrong!";
  res.status(statusCode).json({message: message});
};

export {notFound, errorHandler};
