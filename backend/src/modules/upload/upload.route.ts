import { Router } from "express";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import {
  uploadBrandImage,
  uploadCategoryImage as uploadCategoryImageMiddleware,
  uploadUserImage,
  uploadProductImage,
} from "../../config/multer";
import {
  uploadBrandLogo,
  uploadCategoryImage,
  uploadUserAvatar,
  uploadProductThumbnail,
} from "./upload.controller";

const router = Router();

router.post(
  "/brand-logo",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadBrandImage.single("image"),
  uploadBrandLogo
);

router.post(
  "/category-image",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadCategoryImageMiddleware.single("image"),
  uploadCategoryImage
);

router.post(
  "/user-avatar",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadUserImage.single("image"),
  uploadUserAvatar
);

router.post(
  "/product-thumbnail",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadProductImage.single("image"),
  uploadProductThumbnail
);

export default router;