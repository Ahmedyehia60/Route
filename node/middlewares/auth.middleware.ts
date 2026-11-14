import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../connect/database";
import "dotenv/config";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const verifyAccessToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };

    userId = decoded.sub;
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await pool.query("SELECT status FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0 || result.rows[0].status !== "ACTIVE") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { id: userId };
    return next();
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
