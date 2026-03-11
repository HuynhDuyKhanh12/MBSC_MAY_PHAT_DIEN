import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  addToWishlistService,
  getWishlistService,
  removeWishlistService,
} from "./wishlist.service";
import { successResponse } from "../../utils/response";

export const addToWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await addToWishlistService(req.user.id, req.body.productId);
    return successResponse(res, "Add to wishlist successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getWishlistService(req.user.id);
    return successResponse(res, "Get wishlist successful", result);
  } catch (error) {
    next(error);
  }
};

export const removeWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await removeWishlistService(req.user.id, Number(req.params.productId));
    return successResponse(res, "Remove wishlist successful", result);
  } catch (error) {
    next(error);
  }
};