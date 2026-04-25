import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  addToCartService,
  deleteCartItemByProductService,
  getCartService,
  updateCartItemByProductService,
} from "./cart.service";
import { successResponse } from "../../utils/response";

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, variantId, quantity } = req.body || {};

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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getCartService(req.user.id);
    return successResponse(res, "Get cart successful", result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const updateCartItemByProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = Number(req.params.productId);
    const { quantity, variantId } = req.body || {};

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product id is invalid",
      });
    }

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const result = await updateCartItemByProductService(
      req.user.id,
      productId,
      variantId ?? null,
      Number(quantity)
    );

    return successResponse(res, "Update cart item successful", result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const deleteCartItemByProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = Number(req.params.productId);
    const body = req.body || {};

    const variantId =
      body.variantId ?? req.query.variantId ?? null;

    const result = await deleteCartItemByProductService(
      req.user.id,
      productId,
      variantId ? Number(variantId) : null
    );

    return successResponse(res, "Delete cart item successful", result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};