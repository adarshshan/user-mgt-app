import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { protect } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);

export default router;
