import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  forceDeleteProduct,
  getProductById,
  getProducts,
  getTrashProducts,
  restoreProduct,
  toggleProductVisibility,
  updateProduct,
} from "./product.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getProducts);
router.get("/trash", authMiddleware, requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"), getTrashProducts);
router.get("/:id", getProductById);

router.post("/", authMiddleware, requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"), createProduct);
router.put("/:id", authMiddleware, requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"), updateProduct);

router.delete("/:id", authMiddleware, requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"), deleteProduct);
router.patch("/:id/restore", authMiddleware, requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"), restoreProduct);
router.delete("/:id/force", authMiddleware, requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"), forceDeleteProduct);
router.patch("/:id/toggle-visibility", authMiddleware, requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"), toggleProductVisibility);

export default router;