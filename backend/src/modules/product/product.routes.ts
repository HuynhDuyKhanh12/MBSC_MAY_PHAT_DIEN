import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Get products successful
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get product successful
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm
 *     tags: [Products]
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
 *               - sku
 *               - categoryId
 *               - brandId
 *               - basePrice
 *             properties:
 *               name:
 *                 type: string
 *                 example: Máy phát điện Honda 5KW
 *               slug:
 *                 type: string
 *                 example: may-phat-dien-honda-5kw
 *               sku:
 *                 type: string
 *                 example: HONDA-5KW-001
 *               shortDescription:
 *                 type: string
 *                 example: Máy phát điện dân dụng 5KW
 *               description:
 *                 type: string
 *                 example: Sản phẩm phù hợp cho gia đình và văn phòng nhỏ
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               brandId:
 *                 type: integer
 *                 example: 1
 *               basePrice:
 *                 type: number
 *                 example: 15000000
 *               salePrice:
 *                 type: number
 *                 example: 13900000
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/product-thumb.png
 *               weight:
 *                 type: number
 *                 example: 35
 *               length:
 *                 type: number
 *                 example: 60
 *               width:
 *                 type: number
 *                 example: 40
 *               height:
 *                 type: number
 *                 example: 45
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *               isFeatured:
 *                 type: boolean
 *                 example: true
 *               tags:
 *                 type: string
 *                 example: honda,may-phat-dien,5kw
 *               seoTitle:
 *                 type: string
 *                 example: Máy phát điện Honda 5KW chính hãng
 *               seoDescription:
 *                 type: string
 *                 example: Máy phát điện Honda 5KW giá tốt
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - https://example.com/product-1.png
 *                   - https://example.com/product-2.png
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sku:
 *                       type: string
 *                       example: HONDA-5KW-RED
 *                     color:
 *                       type: string
 *                       example: Red
 *                     size:
 *                       type: string
 *                       example: Standard
 *                     material:
 *                       type: string
 *                       example: Steel
 *                     price:
 *                       type: number
 *                       example: 15000000
 *                     salePrice:
 *                       type: number
 *                       example: 14000000
 *                     stock:
 *                       type: integer
 *                       example: 10
 *                     image:
 *                       type: string
 *                       example: https://example.com/variant-red.png
 *                     attributesJson:
 *                       type: object
 *                       example:
 *                         fuel: xang
 *                         phase: 1
 *     responses:
 *       201:
 *         description: Create product successful
 */
router.post("/", authMiddleware, requireRole("ADMIN"), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Products]
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
 *                 example: Máy phát điện Honda 6KW
 *               slug:
 *                 type: string
 *                 example: may-phat-dien-honda-6kw
 *               sku:
 *                 type: string
 *                 example: HONDA-6KW-001
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               brandId:
 *                 type: integer
 *               basePrice:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *               weight:
 *                 type: number
 *               length:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *               isFeatured:
 *                 type: boolean
 *               tags:
 *                 type: string
 *               seoTitle:
 *                 type: string
 *               seoDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update product successful
 *       404:
 *         description: Product not found
 */
router.put("/:id", authMiddleware, requireRole("ADMIN"), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Xóa mềm sản phẩm
 *     tags: [Products]
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
 *         description: Delete product successful
 *       404:
 *         description: Product not found
 */
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteProduct);

export default router;