import { Request, Response, NextFunction } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from "./category.service";
import { successResponse } from "../../utils/response";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createCategoryService(req.body);
    return successResponse(res, "Create category successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getCategoriesService();
    return successResponse(res, "Get categories successful", result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getCategoryByIdService(Number(req.params.id));
    return successResponse(res, "Get category successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateCategoryService(Number(req.params.id), req.body);
    return successResponse(res, "Update category successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteCategoryService(Number(req.params.id));
    return successResponse(res, "Delete category successful", result);
  } catch (error) {
    next(error);
  }
};