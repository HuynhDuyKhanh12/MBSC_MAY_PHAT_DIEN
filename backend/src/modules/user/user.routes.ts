import { Router } from "express";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import {
  changeUserStatus,
  createUser,
  deleteUser,
  forceDeleteUser,
  getRoles,
  getTrashUsers,
  getUserById,
  getUsers,
  restoreUser,
  updateUser,
} from "./user.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  getUsers
);

router.get(
  "/trash",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  getTrashUsers
);

router.get(
  "/roles", 
  authMiddleware, 
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"), 
  getRoles
);

router.get(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  getUserById
);

router.post(
  "/", 
  authMiddleware, 
  requireRole("ADMIN", "SUPER_ADMIN"), 
  createUser
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  deleteUser
);

router.patch(
  "/:id/restore",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  restoreUser
);

router.delete(
  "/:id/force",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  forceDeleteUser
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  changeUserStatus
);

export default router;