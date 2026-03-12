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
 *       404:
 *         description: Brand not found
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
 *               slug:
 *                 type: string
 *                 example: honda
 *               description:
 *                 type: string
 *                 example: Thương hiệu máy phát điện Honda
 *               logo:
 *                 type: string
 *                 example: https://example.com/honda.png
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Honda Updated
 *               slug:
 *                 type: string
 *                 example: honda-updated
 *               description:
 *                 type: string
 *                 example: Mô tả mới
 *               logo:
 *                 type: string
 *                 example: https://example.com/new-logo.png
 *     responses:
 *       200:
 *         description: Update brand successful
 *       404:
 *         description: Brand not found
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
 *       404:
 *         description: Brand not found
 */
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteBrand);

export default router;