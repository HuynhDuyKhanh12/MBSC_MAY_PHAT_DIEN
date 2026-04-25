import { Router } from "express";
import {
  authMiddleware,
  requireRole,
} from "../../middlewares/auth.middleware";
import {
  createBrand,
  deleteBrand,
  forceDeleteBrand,
  getBrandById,
  getBrands,
  getTrashBrands,
  restoreBrand,
  toggleBrandVisibility,
  updateBrand,
} from "./brand.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: APIs quản lý brand
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Lấy danh sách brand
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Get brands successful
 */
router.get("/", getBrands);

/**
 * @swagger
 * /api/brands/trash:
 *   get:
 *     summary: Lấy danh sách brand trong thùng rác
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get trash brands successful
 */
router.get(
  "/trash",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  getTrashBrands
);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Lấy chi tiết brand
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get brand by id successful
 *       404:
 *         description: Brand not found
 */
router.get("/:id", getBrandById);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Tạo brand mới
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Honda
 *               logo:
 *                 type: string
 *                 example: https://example.com/honda.png
 *               description:
 *                 type: string
 *                 example: Thương hiệu máy phát điện Honda
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Create brand successful
 */
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  createBrand
);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Cập nhật brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Yamaha
 *               logo:
 *                 type: string
 *                 example: https://example.com/yamaha.png
 *               description:
 *                 type: string
 *                 example: Thương hiệu Yamaha
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Update brand successful
 */
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  updateBrand
);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Xóa mềm brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete brand successful
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  deleteBrand
);

/**
 * @swagger
 * /api/brands/{id}/restore:
 *   patch:
 *     summary: Khôi phục brand từ thùng rác
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restore brand successful
 */
router.patch(
  "/:id/restore",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  restoreBrand
);

/**
 * @swagger
 * /api/brands/{id}/force:
 *   delete:
 *     summary: Xóa vĩnh viễn brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Force delete brand successful
 */
router.delete(
  "/:id/force",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  forceDeleteBrand
);

/**
 * @swagger
 * /api/brands/{id}/toggle-visibility:
 *   patch:
 *     summary: Ẩn hiện brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Toggle brand visibility successful
 */
router.patch(
  "/:id/toggle-visibility",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  toggleBrandVisibility
);

export default router;