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
 *     responses:
 *       200:
 *         description: Get cart successful
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               variantId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Add to cart successful
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Update cart item successful
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete cart item successful
 */
router.delete("/items/:id", authMiddleware, deleteCartItem);

export default router;