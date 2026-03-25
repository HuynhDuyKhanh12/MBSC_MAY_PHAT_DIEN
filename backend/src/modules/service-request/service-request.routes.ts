import { Router } from "express";
import {
  authMiddleware,
  requireRole,
} from "../../middlewares/auth.middleware";
import {
  assignTechnician,
  createServiceRequest,
  deleteServiceRequest,
  getAllServiceRequests,
  getAssignedServiceRequests,
  getMyServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  updateServiceRequestStatus,
} from "./service-request.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Service Requests
 *   description: Quản lý phiếu bảo dưỡng / sửa chữa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceRequestCreateInput:
 *       type: object
 *       required:
 *         - type
 *         - customerName
 *         - customerPhone
 *         - province
 *         - district
 *         - ward
 *         - detailAddress
 *         - productName
 *         - issueTitle
 *       properties:
 *         type:
 *           type: string
 *           enum: [MAINTENANCE, REPAIR]
 *         customerName:
 *           type: string
 *           example: Nguyễn Văn A
 *         customerPhone:
 *           type: string
 *           example: 0909123456
 *         customerEmail:
 *           type: string
 *           example: a@gmail.com
 *         province:
 *           type: string
 *           example: Hồ Chí Minh
 *         district:
 *           type: string
 *           example: Quận 12
 *         ward:
 *           type: string
 *           example: Phường Tân Chánh Hiệp
 *         detailAddress:
 *           type: string
 *           example: 123 Nguyễn Ảnh Thủ
 *         productName:
 *           type: string
 *           example: Máy phát điện Honda 5KW
 *         productModel:
 *           type: string
 *           example: EU50
 *         serialNumber:
 *           type: string
 *           example: SN123456
 *         purchaseDate:
 *           type: string
 *           format: date
 *           example: 2026-03-01
 *         warrantyExpiry:
 *           type: string
 *           format: date
 *           example: 2027-03-01
 *         issueTitle:
 *           type: string
 *           example: Máy không nổ
 *         issueDescription:
 *           type: string
 *           example: Đề máy không lên
 *         preferredDate:
 *           type: string
 *           format: date
 *           example: 2026-03-26
 *         preferredTimeSlot:
 *           type: string
 *           example: 08:00 - 10:00
 *         imageUrls:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - https://example.com/image1.jpg
 *             - https://example.com/image2.jpg
 *
 *     ServiceRequestUpdateInput:
 *       type: object
 *       properties:
 *         customerName:
 *           type: string
 *         customerPhone:
 *           type: string
 *         customerEmail:
 *           type: string
 *         province:
 *           type: string
 *         district:
 *           type: string
 *         ward:
 *           type: string
 *         detailAddress:
 *           type: string
 *         productName:
 *           type: string
 *         productModel:
 *           type: string
 *         serialNumber:
 *           type: string
 *         purchaseDate:
 *           type: string
 *           format: date
 *         warrantyExpiry:
 *           type: string
 *           format: date
 *         issueTitle:
 *           type: string
 *         issueDescription:
 *           type: string
 *         preferredDate:
 *           type: string
 *           format: date
 *         preferredTimeSlot:
 *           type: string
 *         imageUrls:
 *           type: array
 *           items:
 *             type: string
 *
 *     AssignTechnicianInput:
 *       type: object
 *       required:
 *         - assignedToId
 *       properties:
 *         assignedToId:
 *           type: integer
 *           example: 12
 *         note:
 *           type: string
 *           example: Giao kỹ thuật viên gần khu vực khách hàng
 *
 *     UpdateServiceStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, RECEIVED, ASSIGNED, INSPECTING, IN_PROGRESS, COMPLETED, CANCELLED]
 *           example: IN_PROGRESS
 *         note:
 *           type: string
 *           example: Đang kiểm tra máy
 *         visitFee:
 *           type: number
 *           example: 150000
 *         repairFee:
 *           type: number
 *           example: 500000
 *         totalFee:
 *           type: number
 *           example: 650000
 */

/**
 * @swagger
 * /api/service-requests:
 *   post:
 *     summary: Tạo phiếu bảo dưỡng / sửa chữa
 *     tags: [Service Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRequestCreateInput'
 *     responses:
 *       201:
 *         description: Tạo phiếu thành công
 */
router.post(
  "/",
  authMiddleware,
  requireRole("CUSTOMER", "ADMIN", "SUPER_ADMIN"),
  createServiceRequest
);

/**
 * @swagger
 * /api/service-requests/my:
 *   get:
 *     summary: Khách hàng xem phiếu của mình
 *     tags: [Service Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phiếu của tôi
 */
router.get(
  "/my",
  authMiddleware,
  requireRole("CUSTOMER"),
  getMyServiceRequests
);

/**
 * @swagger
 * /api/service-requests/assigned:
 *   get:
 *     summary: Kỹ thuật viên xem phiếu được giao
 *     tags: [Service Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phiếu được giao
 */
router.get(
  "/assigned",
  authMiddleware,
  requireRole("TECHNICIAN"),
  getAssignedServiceRequests
);

/**
 * @swagger
 * /api/service-requests:
 *   get:
 *     summary: Admin xem toàn bộ phiếu có lọc và phân trang
 *     tags: [Service Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, RECEIVED, ASSIGNED, INSPECTING, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MAINTENANCE, REPAIR]
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: Honda
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Danh sách phiếu
 */
router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  getAllServiceRequests
);

/**
 * @swagger
 * /api/service-requests/{id}:
 *   get:
 *     summary: Xem chi tiết phiếu
 *     tags: [Service Requests]
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
 *         description: Chi tiết phiếu
 *       404:
 *         description: Không tìm thấy phiếu
 */
router.get(
  "/:id",
  authMiddleware,
  requireRole("CUSTOMER", "TECHNICIAN", "ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  getServiceRequestById
);

/**
 * @swagger
 * /api/service-requests/{id}:
 *   put:
 *     summary: Sửa thông tin phiếu
 *     tags: [Service Requests]
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
 *             $ref: '#/components/schemas/ServiceRequestUpdateInput'
 *     responses:
 *       200:
 *         description: Cập nhật phiếu thành công
 */
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN", "WEB_MANAGER"),
  updateServiceRequest
);

/**
 * @swagger
 * /api/service-requests/{id}:
 *   delete:
 *     summary: Xóa phiếu
 *     tags: [Service Requests]
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
 *         description: Xóa phiếu thành công
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  deleteServiceRequest
);

/**
 * @swagger
 * /api/service-requests/{id}/assign:
 *   patch:
 *     summary: Phân công kỹ thuật viên
 *     tags: [Service Requests]
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
 *             $ref: '#/components/schemas/AssignTechnicianInput'
 *     responses:
 *       200:
 *         description: Phân công thành công
 */
router.patch(
  "/:id/assign",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  assignTechnician
);

/**
 * @swagger
 * /api/service-requests/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái phiếu
 *     tags: [Service Requests]
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
 *             $ref: '#/components/schemas/UpdateServiceStatusInput'
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("TECHNICIAN", "ADMIN", "SUPER_ADMIN"),
  updateServiceRequestStatus
);

export default router;