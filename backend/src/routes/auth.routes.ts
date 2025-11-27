import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.get("/verify-email", authController.verifyEmail);
router.post("/login", authController.loginStep1);
router.post("/verify-otp", authController.loginStep2);
router.post("/logout", authController.logout);

export default router;
