import { Request, Response } from "express";
import pool from "./../../../connect/database";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import "dotenv/config";
import { sendPasswordResetEmail } from "../../../connect/mailer";

const isValidEmail = (email: string) =>
  email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const login = async (req: Request, res: Response) => {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!isValidEmail(email) || !password) {
    return res.status(400).json({
      message: "Valid email and password are required",
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash, status FROM users WHERE email=$1",
      [email],
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);

    if (!isPasswordValid || user.status !== "ACTIVE") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" },
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, refreshTokenHash, expiresAt, req.ip, req.headers["user-agent"]],
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const dbResult = await client.query(
      `SELECT id, user_id, expires_at, is_revoked
   FROM refresh_tokens
   WHERE token_hash = $1
     AND expires_at > NOW()
     AND is_revoked = FALSE 
     FOR UPDATE`,
      [tokenHash],
    );

    if (dbResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userResult = await client.query(
      `SELECT status FROM users WHERE id = $1`,
      [dbResult.rows[0].user_id],
    );

    if (
      userResult.rows.length === 0 ||
      userResult.rows[0].status !== "ACTIVE"
    ) {
      await client.query("ROLLBACK");
      return res.status(401).json({ message: "Unauthorized" });
    }

    await client.query(`DELETE FROM refresh_tokens WHERE id=$1`, [
      dbResult.rows[0].id,
    ]);

    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    const newHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await client.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [dbResult.rows[0].user_id, newHash, expiresAt],
    );

    await client.query("COMMIT");
    const newAccessToken = jwt.sign(
      { sub: String(dbResult.rows[0].user_id) },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      await pool.query(`DELETE FROM refresh_tokens WHERE token_hash = $1`, [
        tokenHash,
      ]);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }
  const genericMessage = {
    message: "If the account exists, a reset code will be sent",
  };

  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND status = 'ACTIVE'",
      [email],
    );
    if (userResult.rows.length === 0) {
      return res.status(200).json(genericMessage);
    }

    const userId = userResult.rows[0].id;
    const resetCode = crypto
      .randomInt(0, 100_000_000)
      .toString()
      .padStart(8, "0");

    const resetCodeHash = crypto
      .createHmac("sha256", process.env.RESET_OTP_SECRET!)
      .update(resetCode)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `DELETE FROM password_reset_tokens
       WHERE user_id = $1 AND used_at IS NULL`,
      [userId],
    );

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, resetCodeHash, expiresAt],
    );

    await sendPasswordResetEmail(email, resetCode);

    return res.status(200).json(genericMessage);
  } catch (error) {
    console.error("Password reset request failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const resetCode =
    typeof req.body?.resetCode === "string" ? req.body.resetCode.trim() : "";
  const newPassword =
    typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

  if (!email || !resetCode || newPassword.length < 12) {
    return res.status(400).json({
      message:
        "Email, code, and a password of at least 12 characters are required",
    });
  }

  const secret = process.env.RESET_OTP_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Internal server error" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1 AND status = 'ACTIVE' FOR UPDATE",
      [email],
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(401).json({ message: "Invalid or expired code" });
    }

    const userId = userResult.rows[0].id;

    const tokenResult = await client.query(
      `SELECT id, token_hash, failed_attempts
       FROM password_reset_tokens
       WHERE user_id = $1
         AND used_at IS NULL
         AND expires_at > NOW()
         AND failed_attempts < 5
       ORDER BY created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [userId],
    );

    if (tokenResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(401).json({ message: "Invalid or expired code" });
    }

    const savedCode = tokenResult.rows[0];
    const submittedHash = crypto
      .createHmac("sha256", secret)
      .update(resetCode)
      .digest("hex");

    const submittedHashBuffer = Buffer.from(submittedHash, "hex");
    const savedHashBuffer = Buffer.from(savedCode.token_hash, "hex");

    const codeIsCorrect =
      submittedHashBuffer.length === savedHashBuffer.length &&
      crypto.timingSafeEqual(submittedHashBuffer, savedHashBuffer);

    if (!codeIsCorrect) {
      await client.query(
        `UPDATE password_reset_tokens
         SET failed_attempts = failed_attempts + 1
         WHERE id = $1`,
        [savedCode.id],
      );

      await client.query("COMMIT");
      return res.status(401).json({ message: "Invalid or expired code" });
    }

    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });

    await client.query(
      `UPDATE users
       SET password_hash = $1, password_changed_at = NOW()
       WHERE id = $2`,
      [passwordHash, userId],
    );

    await client.query(
      `UPDATE password_reset_tokens
       SET used_at = NOW()
       WHERE id = $1`,
      [savedCode.id],
    );

    await client.query("DELETE FROM refresh_tokens WHERE user_id = $1", [
      userId,
    ]);

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Password reset successfully. Please log in again.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};
