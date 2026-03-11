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
 */
router.put("/:id/status", authMiddleware, requireRole("ADMIN"), updateOrderStatus);

export default router;