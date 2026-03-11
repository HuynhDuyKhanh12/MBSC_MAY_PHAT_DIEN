import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  addToCartService,
  deleteCartItemService,
  getCartService,
  updateCartItemService,
} from "./cart.service";
import { successResponse } from "../../utils/response";

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const result = await addToCartService(req.user.id, productId, variantId || null, quantity || 1);
    return successResponse(res, "Add to cart successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getCartService(req.user.id);
    return successResponse(res, "Get cart successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await updateCartItemService(Number(req.params.id), req.body.quantity);
    return successResponse(res, "Update cart item successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await deleteCartItemService(Number(req.params.id));
    return successResponse(res, "Delete cart item successful", result);
  } catch (error) {
    next(error);
  }
};