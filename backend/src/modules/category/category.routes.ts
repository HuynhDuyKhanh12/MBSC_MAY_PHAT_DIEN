import { Router } from "express";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import {
  createCategory,
  deleteCategory,
  forceDeleteCategory,
  getCategories,
  getCategoryById,
  getTrashCategories,
  restoreCategory,
  toggleCategoryVisibility,
  updateCategory,
} from "./category.controller";

const router = Router();

router.get("/", getCategories);
router.get(
  "/trash",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  getTrashCategories
);
router.get("/:id", getCategoryById);

router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  deleteCategory
);

router.patch(
  "/:id/restore",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  restoreCategory
);

router.delete(
  "/:id/force",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  forceDeleteCategory
);

router.patch(
  "/:id/toggle-visibility",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  toggleCategoryVisibility
);

export default router;