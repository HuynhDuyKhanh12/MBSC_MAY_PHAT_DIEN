import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from "./brand.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Lấy danh sách thương hiệu
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Get brands successful
 */
router.get("/", getBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Lấy chi tiết thương hiệu
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get brand successful
 */
router.get("/:id", getBrandById);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Tạo thương hiệu
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Create brand successful
 */
router.post("/", authMiddleware, requireRole("ADMIN"), createBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Cập nhật thương hiệu
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
 *         description: Update brand successful
 */
router.put("/:id", authMiddleware, requireRole("ADMIN"), updateBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Xóa thương hiệu
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
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteBrand);

export default router;