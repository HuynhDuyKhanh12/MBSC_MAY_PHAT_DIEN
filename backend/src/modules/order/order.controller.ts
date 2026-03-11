import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createOrderService,
  getAllOrdersService,
  getMyOrdersService,
  updateOrderStatusService,
} from "./order.service";
import { successResponse } from "../../utils/response";

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await createOrderService(req.user.id, req.body);
    return successResponse(res, "Create order successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getMyOrdersService(req.user.id);
    return successResponse(res, "Get my orders successful", result);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllOrdersService();
    return successResponse(res, "Get all orders successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateOrderStatusService(Number(req.params.id), req.body.status);
    return successResponse(res, "Update order status successful", result);
  } catch (error) {
    next(error);
  }
};