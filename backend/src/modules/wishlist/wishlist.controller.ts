import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  addToWishlistService,
  getWishlistService,
  removeWishlistService,
} from "./wishlist.service";
import { successResponse } from "../../utils/response";

export const addToWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.body.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    const result = await addToWishlistService(req.user.id, productId);
    return successResponse(res, "Add to wishlist successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getWishlistService(req.user.id);
    return successResponse(res, "Get wishlist successful", result);
  } catch (error) {
    next(error);
  }
};

export const removeWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product id is invalid",
      });
    }

    const result = await removeWishlistService(req.user.id, productId);
    return successResponse(res, "Remove wishlist successful", result);
  } catch (error) {
    next(error);
  }
};