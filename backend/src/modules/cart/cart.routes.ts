import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  addToCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "./cart.controller";

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy giỏ hàng của tôi
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, addToCart);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.put("/items/:id", authMiddleware, updateCartItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/items/:id", authMiddleware, deleteCartItem);

export default router;