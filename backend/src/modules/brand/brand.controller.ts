import { Request, Response, NextFunction } from "express";
import {
  createBrandService,
  deleteBrandService,
  getBrandByIdService,
  getBrandsService,
  updateBrandService,
} from "./brand.service";
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

export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, slug, logo, description } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    const result = await createBrandService({
      name: String(name).trim(),
      slug: slug && String(slug).trim() ? String(slug).trim() : createSlug(String(name)),
      logo,
      description,
    });

    return successResponse(res, "Create brand successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getBrands = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getBrandsService();
    return successResponse(res, "Get brands successful", result);
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Brand id is invalid",
      });
    }

    const result = await getBrandByIdService(id);

    if (!result || result.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return successResponse(res, "Get brand successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Brand id is invalid",
      });
    }

    const { name, slug, logo, description } = req.body;

    const currentBrand = await getBrandByIdService(id);

    if (!currentBrand || currentBrand.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const result = await updateBrandService(id, {
      name: name !== undefined ? String(name).trim() : undefined,
      slug:
        slug !== undefined
          ? String(slug).trim()
          : name !== undefined && String(name).trim()
          ? createSlug(String(name))
          : undefined,
      logo,
      description,
    });

    return successResponse(res, "Update brand successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Brand id is invalid",
      });
    }

    const currentBrand = await getBrandByIdService(id);

    if (!currentBrand || currentBrand.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const result = await deleteBrandService(id);
    return successResponse(res, "Delete brand successful", result);
  } catch (error) {
    next(error);
  }
};