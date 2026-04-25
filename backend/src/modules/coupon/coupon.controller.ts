import { Request, Response } from "express";
import {
  createCouponService,
  deleteCouponService,
  forceDeleteCouponService,
  getCouponByIdService,
  getCouponsService,
  getTrashCouponsService,
  restoreCouponService,
  toggleCouponService,
  updateCouponService,
} from "./coupon.service";
import { successResponse } from "../../utils/response";

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      title,
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

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: "Coupon title is required",
      });
    }

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

    if (
      discountValue === undefined ||
      discountValue === null ||
      Number.isNaN(Number(discountValue))
    ) {
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
      title: String(title).trim(),
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
  } catch (error: any) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const getCoupons = async (_req: Request, res: Response) => {
  try {
    const result = await getCouponsService();
    return successResponse(res, "Get coupons successful", result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const getTrashCoupons = async (_req: Request, res: Response) => {
  try {
    const result = await getTrashCouponsService();
    return successResponse(res, "Get trash coupons successful", result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const getCouponById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon id is invalid",
      });
    }

    const result = await getCouponByIdService(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return successResponse(res, "Get coupon successful", result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
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
      title,
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

    const finalStartDate = startDate || currentCoupon.startDate;
    const finalEndDate = endDate || currentCoupon.endDate;

    if (new Date(finalStartDate) >= new Date(finalEndDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be greater than start date",
      });
    }

    const result = await updateCouponService(id, {
      title: title !== undefined ? String(title).trim() : undefined,
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
        minOrderValue !== undefined
          ? minOrderValue === null
            ? null
            : Number(minOrderValue)
          : undefined,
      maxDiscountValue:
        maxDiscountValue !== undefined
          ? maxDiscountValue === null
            ? null
            : Number(maxDiscountValue)
          : undefined,
      usageLimit:
        usageLimit !== undefined
          ? usageLimit === null
            ? null
            : Number(usageLimit)
          : undefined,
      startDate,
      endDate,
      isActive,
    });

    return successResponse(res, "Update coupon successful", result);
  } catch (error: any) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon id is invalid",
      });
    }

    const result = await deleteCouponService(id);
    return successResponse(res, "Delete coupon successful", result);
  } catch (error: any) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const restoreCoupon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon id is invalid",
      });
    }

    const result = await restoreCouponService(id);
    return successResponse(res, "Restore coupon successful", result);
  } catch (error: any) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const forceDeleteCoupon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon id is invalid",
      });
    }

    const result = await forceDeleteCouponService(id);
    return successResponse(res, "Force delete coupon successful", result);
  } catch (error: any) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const toggleCoupon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon id is invalid",
      });
    }

    const result = await toggleCouponService(id);
    return successResponse(res, "Toggle coupon successful", result);
  } catch (error: any) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};