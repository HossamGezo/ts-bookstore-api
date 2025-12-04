// Import Express Types
import type {Request, Response, NextFunction} from "express";
// Import jsonwebtoken
import jwt from "jsonwebtoken";
// Verify Token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Check token existance & valid format
  const token = req.headers.token;
  if (!token || typeof token !== "string") {
    res.status(401).json({message: "No token provided or invalid format"});
    return;
  }
  // Check about secret key
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    res.status(500).json({message: "Server Error: Secret key missing"});
    return;
  }
  // Handle Promise
  try {
    const decoded = jwt.verify(token, secret) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({message: "Invalid token"});
  }
};
// Verify Token & Authorize the user
const verifyTokenAndAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    // Ensure that token belongs to user
    if (req.user?.id !== req.params.id && !req.user?.isAdmin) {
      res.status(403).json({
        message: "You are not allowed, you can only update your profile",
      });
      return;
    }
    next();
  });
};
// Verify Token & Admin
const verifyTokenAndAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    // Ensure that token belongs to Admin
    if (!req.user?.isAdmin) {
      res.status(403).json({
        message: "You are not allowed, only admin allowed",
      });
      return;
    }
    next();
  });
};
export {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};
