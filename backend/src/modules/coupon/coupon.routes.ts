import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "./coupon.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Lấy danh sách mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get coupons successful
 */
router.get("/", authMiddleware, requireRole("ADMIN"), getCoupons);

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Tạo mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *               - startDate
 *               - endDate
 *             properties:
 *               code:
 *                 type: string
 *                 example: SALE10
 *               description:
 *                 type: string
 *                 example: Giảm 10% cho đơn hàng
 *               discountType:
 *                 type: string
 *                 example: PERCENT
 *               discountValue:
 *                 type: number
 *                 example: 10
 *               minOrderValue:
 *                 type: number
 *                 example: 500000
 *               maxDiscountValue:
 *                 type: number
 *                 example: 100000
 *               usageLimit:
 *                 type: integer
 *                 example: 100
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-12T00:00:00.000Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-31T23:59:59.000Z
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Create coupon successful
 */
router.post("/", authMiddleware, requireRole("ADMIN"), createCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Cập nhật mã giảm giá
 *     tags: [Coupons]
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
 *               code:
 *                 type: string
 *                 example: SALE20
 *               description:
 *                 type: string
 *                 example: Giảm 20% cho đơn hàng
 *               discountType:
 *                 type: string
 *                 example: PERCENT
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               minOrderValue:
 *                 type: number
 *                 example: 1000000
 *               maxDiscountValue:
 *                 type: number
 *                 example: 200000
 *               usageLimit:
 *                 type: integer
 *                 example: 200
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-12T00:00:00.000Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-30T23:59:59.000Z
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Update coupon successful
 */
router.put("/:id", authMiddleware, requireRole("ADMIN"), updateCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Xóa mã giảm giá
 *     tags: [Coupons]
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
 *         description: Delete coupon successful
 */
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteCoupon);

export default router;