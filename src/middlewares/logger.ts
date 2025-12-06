// Import Types
import type {Request, Response, NextFunction} from "express";
// Logger Middleware
const logger = (req: Request, _: Response, next: NextFunction) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  // ----- OR -----
  // console.log(
  //   `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  // );
  // --------------
  next();
};

export default logger;
