import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createOrderService,
  getAllOrdersService,
  getMyOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
} from "./order.service";
import { successResponse } from "../../utils/response";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
];

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      paymentMethod,
      fullName,
      phone,
      province,
      district,
      ward,
      detailAddress,
      shippingFee,
    } = req.body;

    if (!paymentMethod || !String(paymentMethod).trim()) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!phone || !String(phone).trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    if (!province || !String(province).trim()) {
      return res.status(400).json({
        success: false,
        message: "Province is required",
      });
    }

    if (!district || !String(district).trim()) {
      return res.status(400).json({
        success: false,
        message: "District is required",
      });
    }

    if (!ward || !String(ward).trim()) {
      return res.status(400).json({
        success: false,
        message: "Ward is required",
      });
    }

    if (!detailAddress || !String(detailAddress).trim()) {
      return res.status(400).json({
        success: false,
        message: "Detail address is required",
      });
    }

    if (
      shippingFee !== undefined &&
      shippingFee !== null &&
      (Number.isNaN(Number(shippingFee)) || Number(shippingFee) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping fee is invalid",
      });
    }

    const result = await createOrderService(req.user.id, {
      ...req.body,
      shippingFee:
        shippingFee !== undefined && shippingFee !== null
          ? Number(shippingFee)
          : 0,
    });

    return successResponse(res, "Create order successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getMyOrdersService(req.user.id);
    return successResponse(res, "Get my orders successful", result);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllOrdersService();
    return successResponse(res, "Get all orders successful", result);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Order id is invalid",
      });
    }

    const result = await getOrderByIdService(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return successResponse(res, "Get order detail successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const status = req.body.status;

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Order id is invalid",
      });
    }

    if (!status || !ORDER_STATUSES.includes(String(status).toUpperCase())) {
      return res.status(400).json({
        success: false,
        message:
          "Status is invalid. Allowed: PENDING, CONFIRMED, PROCESSING, SHIPPING, DELIVERED, CANCELLED",
      });
    }

    const currentOrder = await getOrderByIdService(id);

    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const result = await updateOrderStatusService(
      id,
      String(status).toUpperCase()
    );

    return successResponse(res, "Update order status successful", result);
  } catch (error) {
    next(error);
  }
};