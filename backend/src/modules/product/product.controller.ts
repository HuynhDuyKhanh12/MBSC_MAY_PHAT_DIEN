import { Request, Response, NextFunction } from "express";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  updateProductService,
} from "./product.service";
import { successResponse } from "../../utils/response";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createProductService(req.body);
    return successResponse(res, "Create product successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getProductsService();
    return successResponse(res, "Get products successful", result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getProductByIdService(Number(req.params.id));
    return successResponse(res, "Get product successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateProductService(Number(req.params.id), req.body);
    return successResponse(res, "Update product successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteProductService(Number(req.params.id));
    return successResponse(res, "Delete product successful", result);
  } catch (error) {
    next(error);
  }
};