import { Request } from "express";

declare global {
  interface UserPayload {
    id: string;
    isAdmin: boolean;
    iat?: number;
    exp?: number;
  }
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
