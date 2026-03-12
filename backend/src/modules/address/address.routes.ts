import { Router } from "express";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "./address.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Lấy danh sách địa chỉ
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get addresses successful
 */
router.get("/", authMiddleware, getAddresses);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Tạo địa chỉ
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - province
 *               - district
 *               - ward
 *               - detailAddress
 *             properties:
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
 *               postalCode:
 *                 type: string
 *                 example: 700000
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Create address successful
 */
router.post("/", authMiddleware, createAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Cập nhật địa chỉ
 *     tags: [Addresses]
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
 *               postalCode:
 *                 type: string
 *                 example: 700000
 *               isDefault:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Update address successful
 */
router.put("/:id", authMiddleware, updateAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Xóa địa chỉ
 *     tags: [Addresses]
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
 *         description: Delete address successful
 */
router.delete("/:id", authMiddleware, deleteAddress);

export default router;