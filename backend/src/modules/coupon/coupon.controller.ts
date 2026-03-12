import { Request, Response, NextFunction } from "express";
import {
  createCouponService,
  deleteCouponService,
  getCouponByIdService,
  getCouponsService,
  updateCouponService,
} from "./coupon.service";
import { successResponse } from "../../utils/response";

export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      usageLimit,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (!code || !String(code).trim()) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (!discountType || !String(discountType).trim()) {
      return res.status(400).json({
        success: false,
        message: "Discount type is required",
      });
    }

    if (discountValue === undefined || discountValue === null || Number.isNaN(Number(discountValue))) {
      return res.status(400).json({
        success: false,
        message: "Discount value is required",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be greater than start date",
      });
    }

    const result = await createCouponService({
      code: String(code).trim().toUpperCase(),
      description,
      discountType: String(discountType).trim().toUpperCase(),
      discountValue: Number(discountValue),
      minOrderValue:
        minOrderValue !== undefined && minOrderValue !== null
          ? Number(minOrderValue)
          : undefined,
      maxDiscountValue:
        maxDiscountValue !== undefined && maxDiscountValue !== null
          ? Number(maxDiscountValue)
          : undefined,
      usageLimit:
        usageLimit !== undefined && usageLimit !== null
          ? Number(usageLimit)
          : undefined,
      startDate,
      endDate,
      isActive,
    });

    return successResponse(res, "Create coupon successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getCouponsService();
    return successResponse(res, "Get coupons successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon id is invalid",
      });
    }

    const currentCoupon = await getCouponByIdService(id);

    if (!currentCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      usageLimit,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (
      startDate &&
      endDate &&
      new Date(startDate) >= new Date(endDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "End date must be greater than start date",
      });
    }

    const result = await updateCouponService(id, {
      code: code !== undefined ? String(code).trim().toUpperCase() : undefined,
      description,
      discountType:
        discountType !== undefined
          ? String(discountType).trim().toUpperCase()
          : undefined,
      discountValue:
        discountValue !== undefined && discountValue !== null
          ? Number(discountValue)
          : undefined,
      minOrderValue:
        minOrderValue !== undefined && minOrderValue !== null
          ? Number(minOrderValue)
          : undefined,
      maxDiscountValue:
        maxDiscountValue !== undefined && maxDiscountValue !== null
          ? Number(maxDiscountValue)
          : undefined,
      usageLimit:
        usageLimit !== undefined && usageLimit !== null
          ? Number(usageLimit)
          : undefined,
      startDate,
      endDate,
      isActive,
    });

    return successResponse(res, "Update coupon successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon id is invalid",
      });
    }

    const currentCoupon = await getCouponByIdService(id);

    if (!currentCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const result = await deleteCouponService(id);
    return successResponse(res, "Delete coupon successful", result);
  } catch (error) {
    next(error);
  }
};