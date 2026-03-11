import { Request, Response, NextFunction } from "express";
import {
  createCouponService,
  deleteCouponService,
  getCouponsService,
  updateCouponService,
} from "./coupon.service";
import { successResponse } from "../../utils/response";

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createCouponService(req.body);
    return successResponse(res, "Create coupon successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getCouponsService();
    return successResponse(res, "Get coupons successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateCouponService(Number(req.params.id), req.body);
    return successResponse(res, "Update coupon successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteCouponService(Number(req.params.id));
    return successResponse(res, "Delete coupon successful", result);
  } catch (error) {
    next(error);
  }
};