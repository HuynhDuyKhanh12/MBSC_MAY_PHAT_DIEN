import { Request, Response, NextFunction } from "express";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  updateProductService,
} from "./product.service";
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

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      slug,
      sku,
      shortDescription,
      description,
      categoryId,
      brandId,
      basePrice,
      salePrice,
      thumbnail,
      weight,
      length,
      width,
      height,
      status,
      isFeatured,
      tags,
      seoTitle,
      seoDescription,
      images,
      variants,
    } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!sku || !String(sku).trim()) {
      return res.status(400).json({
        success: false,
        message: "Product sku is required",
      });
    }

    if (categoryId === undefined || categoryId === null || Number.isNaN(Number(categoryId))) {
      return res.status(400).json({
        success: false,
        message: "Category id is required",
      });
    }

    if (brandId === undefined || brandId === null || Number.isNaN(Number(brandId))) {
      return res.status(400).json({
        success: false,
        message: "Brand id is required",
      });
    }

    if (basePrice === undefined || basePrice === null || Number.isNaN(Number(basePrice))) {
      return res.status(400).json({
        success: false,
        message: "Base price is required",
      });
    }

    const result = await createProductService({
      name: String(name).trim(),
      slug: slug && String(slug).trim() ? String(slug).trim() : createSlug(String(name)),
      sku: String(sku).trim(),
      shortDescription,
      description,
      categoryId: Number(categoryId),
      brandId: Number(brandId),
      basePrice: Number(basePrice),
      salePrice:
        salePrice !== undefined && salePrice !== null ? Number(salePrice) : undefined,
      thumbnail,
      weight: weight !== undefined && weight !== null ? Number(weight) : undefined,
      length: length !== undefined && length !== null ? Number(length) : undefined,
      width: width !== undefined && width !== null ? Number(width) : undefined,
      height: height !== undefined && height !== null ? Number(height) : undefined,
      status,
      isFeatured,
      tags,
      seoTitle,
      seoDescription,
      images,
      variants,
    });

    return successResponse(res, "Create product successful", result, 201);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getProductsService();
    return successResponse(res, "Get products successful", result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Product id is invalid",
      });
    }

    const result = await getProductByIdService(id);

    if (!result || result.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return successResponse(res, "Get product successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Product id is invalid",
      });
    }

    const currentProduct = await getProductByIdService(id);

    if (!currentProduct || currentProduct.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      slug,
      sku,
      shortDescription,
      description,
      categoryId,
      brandId,
      basePrice,
      salePrice,
      thumbnail,
      weight,
      length,
      width,
      height,
      status,
      isFeatured,
      tags,
      seoTitle,
      seoDescription,
    } = req.body;

    const result = await updateProductService(id, {
      name: name !== undefined ? String(name).trim() : undefined,
      slug:
        slug !== undefined
          ? String(slug).trim()
          : name !== undefined && String(name).trim()
          ? createSlug(String(name))
          : undefined,
      sku: sku !== undefined ? String(sku).trim() : undefined,
      shortDescription,
      description,
      categoryId:
        categoryId !== undefined && categoryId !== null ? Number(categoryId) : undefined,
      brandId:
        brandId !== undefined && brandId !== null ? Number(brandId) : undefined,
      basePrice:
        basePrice !== undefined && basePrice !== null ? Number(basePrice) : undefined,
      salePrice:
        salePrice !== undefined && salePrice !== null ? Number(salePrice) : undefined,
      thumbnail,
      weight: weight !== undefined && weight !== null ? Number(weight) : undefined,
      length: length !== undefined && length !== null ? Number(length) : undefined,
      width: width !== undefined && width !== null ? Number(width) : undefined,
      height: height !== undefined && height !== null ? Number(height) : undefined,
      status,
      isFeatured,
      tags,
      seoTitle,
      seoDescription,
    });

    return successResponse(res, "Update product successful", result);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Product id is invalid",
      });
    }

    const currentProduct = await getProductByIdService(id);

    if (!currentProduct || currentProduct.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const result = await deleteProductService(id);
    return successResponse(res, "Delete product successful", result);
  } catch (error) {
    next(error);
  }
};