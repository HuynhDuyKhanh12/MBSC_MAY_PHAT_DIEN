import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  forceDeleteCoupon,
  getCouponById,
  getCoupons,
  getTrashCoupons,
  restoreCoupon,
  toggleCoupon,
  updateCoupon,
} from "./coupon.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: APIs mã giảm giá
 */

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
 * /api/coupons/trash:
 *   get:
 *     summary: Lấy danh sách coupon trong thùng rác
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get trash coupons successful
 */
router.get("/trash", authMiddleware, requireRole("ADMIN"), getTrashCoupons);

/**
 * @swagger
 * /api/coupons/{id}:
 *   get:
 *     summary: Lấy chi tiết mã giảm giá
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
 *         description: Get coupon successful
 */
router.get("/:id", authMiddleware, requireRole("ADMIN"), getCouponById);

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
 *               - title
 *               - code
 *               - discountType
 *               - discountValue
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Khuyến mãi giảm 10%
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
 *               title:
 *                 type: string
 *                 example: Khuyến mãi giảm 20%
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

/**
 * @swagger
 * /api/coupons/{id}/toggle:
 *   patch:
 *     summary: Ẩn / hiện coupon
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
 *         description: Toggle coupon successful
 */
router.patch("/:id/toggle", authMiddleware, requireRole("ADMIN"), toggleCoupon);

/**
 * @swagger
 * /api/coupons/{id}/restore:
 *   patch:
 *     summary: Khôi phục coupon từ thùng rác
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
 *         description: Restore coupon successful
 */
router.patch("/:id/restore", authMiddleware, requireRole("ADMIN"), restoreCoupon);

/**
 * @swagger
 * /api/coupons/{id}/force:
 *   delete:
 *     summary: Xóa vĩnh viễn coupon
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
 *         description: Force delete coupon successful
 */
router.delete("/:id/force", authMiddleware, requireRole("ADMIN"), forceDeleteCoupon);

export default router;