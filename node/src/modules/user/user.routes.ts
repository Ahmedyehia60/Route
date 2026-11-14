import { Router } from "express";
import { getUser } from "./user.controller";
import { verifyAccessToken } from "../../../middlewares/auth.middleware";


const router = Router();

router.get("/user", verifyAccessToken, getUser);

export default router;