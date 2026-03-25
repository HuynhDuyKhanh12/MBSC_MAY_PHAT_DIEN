import { z } from "zod";

export const createServiceRequestSchema = z.object({
  type: z.enum(["MAINTENANCE", "REPAIR"]),
  customerName: z.string().min(2, "Tên khách hàng quá ngắn"),
  customerPhone: z.string().min(8, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  province: z.string().min(1, "Vui lòng nhập tỉnh/thành"),
  district: z.string().min(1, "Vui lòng nhập quận/huyện"),
  ward: z.string().min(1, "Vui lòng nhập phường/xã"),
  detailAddress: z.string().min(1, "Vui lòng nhập địa chỉ chi tiết"),
  productName: z.string().min(1, "Vui lòng nhập tên máy"),
  productModel: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  issueTitle: z.string().min(1, "Vui lòng nhập tiêu đề lỗi"),
  issueDescription: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  imageUrls: z.array(z.string().url("Link ảnh không hợp lệ")).optional(),
});

export const updateServiceRequestSchema = z.object({
  type: z.enum(["MAINTENANCE", "REPAIR"]).optional(),
  customerName: z.string().min(2).optional(),
  customerPhone: z.string().min(8).optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  province: z.string().min(1).optional(),
  district: z.string().min(1).optional(),
  ward: z.string().min(1).optional(),
  detailAddress: z.string().min(1).optional(),
  productName: z.string().min(1).optional(),
  productModel: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  issueTitle: z.string().min(1).optional(),
  issueDescription: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

export const assignTechnicianSchema = z.object({
  assignedToId: z.number().int().positive(),
  note: z.string().optional(),
});

export const updateServiceRequestStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "RECEIVED",
    "ASSIGNED",
    "INSPECTING",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
  note: z.string().optional(),
  visitFee: z.number().nonnegative().optional(),
  repairFee: z.number().nonnegative().optional(),
  totalFee: z.number().nonnegative().optional(),
});

export const serviceRequestQuerySchema = z.object({
  status: z
    .enum([
      "PENDING",
      "RECEIVED",
      "ASSIGNED",
      "INSPECTING",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  type: z.enum(["MAINTENANCE", "REPAIR"]).optional(),
  keyword: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});