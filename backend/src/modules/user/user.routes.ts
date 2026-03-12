import { Router } from "express";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import {
  changePassword,
  deleteUser,
  getProfile,
  getUsers,
  updateProfile,
} from "./user.controller";

const router = Router();

router.get("/", authMiddleware, requireRole("ADMIN"), getUsers);
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.put("/me/change-password", authMiddleware, changePassword);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteUser);

export default router;