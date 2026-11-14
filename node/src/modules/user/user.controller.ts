import pool from "../../../connect/database";
import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/auth.middleware";

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userResult = await pool.query(
      `SELECT id, name, email, status, created_at FROM users WHERE id = $1`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
