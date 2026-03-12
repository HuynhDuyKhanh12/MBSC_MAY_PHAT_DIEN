import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  addToCartService,
  deleteCartItemService,
  getCartService,
  updateCartItemService,
} from "./cart.service";
import { successResponse } from "../../utils/response";

export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, variantId, quantity } = req.body;

    if (!productId || Number.isNaN(Number(productId))) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    if (
      quantity !== undefined &&
      (Number.isNaN(Number(quantity)) || Number(quantity) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const result = await addToCartService(
      req.user.id,
      Number(productId),
      variantId !== undefined && variantId !== null ? Number(variantId) : null,
      quantity !== undefined ? Number(quantity) : 1
    );

    return successResponse(res, "Add to cart successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getCartService(req.user.id);
    return successResponse(res, "Get cart successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (Number.isNaN(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Cart item id is invalid",
      });
    }

    if (Number.isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const result = await updateCartItemService(req.user.id, itemId, quantity);
    return successResponse(res, "Update cart item successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = Number(req.params.id);

    if (Number.isNaN(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Cart item id is invalid",
      });
    }

    const result = await deleteCartItemService(req.user.id, itemId);
    return successResponse(res, "Delete cart item successful", result);
  } catch (error) {
    next(error);
  }
};