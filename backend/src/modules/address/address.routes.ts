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
 */
router.delete("/:id", authMiddleware, deleteAddress);

export default router;