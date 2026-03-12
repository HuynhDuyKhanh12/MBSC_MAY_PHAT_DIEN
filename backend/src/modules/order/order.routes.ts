import { Router } from "express";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "./order.controller";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - fullName
 *               - phone
 *               - province
 *               - district
 *               - ward
 *               - detailAddress
 *             properties:
 *               addressId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               couponCode:
 *                 type: string
 *                 example: SALE10
 *               shippingFee:
 *                 type: number
 *                 example: 30000
 *               paymentMethod:
 *                 type: string
 *                 example: COD
 *               note:
 *                 type: string
 *                 example: Giao giờ hành chính
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               phone:
 *                 type: string
 *                 example: 0901234567
 *               province:
 *                 type: string
 *                 example: Hồ Chí Minh
 *               district:
 *                 type: string
 *                 example: Quận 1
 *               ward:
 *                 type: string
 *                 example: Phường Bến Nghé
 *               detailAddress:
 *                 type: string
 *                 example: 123 Lê Lợi
 *     responses:
 *       201:
 *         description: Create order successful
 */
router.post("/", authMiddleware, createOrder);

/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: Lấy đơn hàng của tôi
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get my orders successful
 */
router.get("/me", authMiddleware, getMyOrders);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy tất cả đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get all orders successful
 */
router.get("/", authMiddleware, requireRole("ADMIN"), getAllOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: CONFIRMED
 *     responses:
 *       200:
 *         description: Update order status successful
 */
router.put("/:id/status", authMiddleware, requireRole("ADMIN"), updateOrderStatus);

export default router;