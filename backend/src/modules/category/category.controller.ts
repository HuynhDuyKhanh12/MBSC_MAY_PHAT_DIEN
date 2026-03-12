import { Request, Response, NextFunction } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from "./category.service";
import { successResponse } from "../../utils/response";

const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, slug, description, image, parentId } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const result = await createCategoryService({
      name: String(name).trim(),
      slug: slug && String(slug).trim() ? String(slug).trim() : createSlug(String(name)),
      description,
      image,
      parentId,
    });

    return successResponse(res, "Create category successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getCategoriesService();
    return successResponse(res, "Get categories successful", result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Category id is invalid",
      });
    }

    const result = await getCategoryByIdService(id);

    if (!result || result.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return successResponse(res, "Get category successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Category id is invalid",
      });
    }

    const currentCategory = await getCategoryByIdService(id);

    if (!currentCategory || currentCategory.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name, slug, description, image, parentId } = req.body;

    const result = await updateCategoryService(id, {
      name: name !== undefined ? String(name).trim() : undefined,
      slug:
        slug !== undefined
          ? String(slug).trim()
          : name !== undefined && String(name).trim()
          ? createSlug(String(name))
          : undefined,
      description,
      image,
      parentId,
    });

    return successResponse(res, "Update category successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Category id is invalid",
      });
    }

    const currentCategory = await getCategoryByIdService(id);

    if (!currentCategory || currentCategory.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const result = await deleteCategoryService(id);
    return successResponse(res, "Delete category successful", result);
  } catch (error) {
    next(error);
  }
};