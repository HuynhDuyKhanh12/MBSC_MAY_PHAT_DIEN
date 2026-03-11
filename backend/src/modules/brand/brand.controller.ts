import { Request, Response, NextFunction } from "express";
import {
  createBrandService,
  deleteBrandService,
  getBrandByIdService,
  getBrandsService,
  updateBrandService,
} from "./brand.service";
import { successResponse } from "../../utils/response";

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createBrandService(req.body);
    return successResponse(res, "Create brand successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getBrands = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getBrandsService();
    return successResponse(res, "Get brands successful", result);
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getBrandByIdService(Number(req.params.id));
    return successResponse(res, "Get brand successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateBrandService(Number(req.params.id), req.body);
    return successResponse(res, "Update brand successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteBrandService(Number(req.params.id));
    return successResponse(res, "Delete brand successful", result);
  } catch (error) {
    next(error);
  }
};