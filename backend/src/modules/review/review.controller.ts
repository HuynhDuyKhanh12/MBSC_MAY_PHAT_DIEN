import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createReviewService,
  deleteReviewService,
  getReviewsByProductService,
} from "./review.service";
import { successResponse } from "../../utils/response";

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await createReviewService(req.user.id, req.body);
    return successResponse(res, "Create review successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getReviewsByProductService(Number(req.params.productId));
    return successResponse(res, "Get reviews successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteReviewService(Number(req.params.id));
    return successResponse(res, "Delete review successful", result);
  } catch (error) {
    next(error);
  }
};