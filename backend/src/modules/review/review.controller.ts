import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createReviewService,
  deleteReviewService,
  getReviewsByProductService,
} from "./review.service";
import { successResponse } from "../../utils/response";

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || Number.isNaN(Number(productId))) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    if (
      rating === undefined ||
      rating === null ||
      Number.isNaN(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be from 1 to 5",
      });
    }

    const result = await createReviewService(req.user.id, {
      productId: Number(productId),
      rating: Number(rating),
      comment: comment !== undefined ? String(comment).trim() : null,
    });

    return successResponse(res, "Create review successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProduct = async (
  req: Request,
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

    const result = await getReviewsByProductService(productId);
    return successResponse(res, "Get reviews successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Review id is invalid",
      });
    }

    const result = await deleteReviewService(id);
    return successResponse(res, "Delete review successful", result);
  } catch (error) {
    next(error);
  }
};