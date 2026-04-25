import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { ProductStatus } from "@prisma/client";

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        brand: true,
        category: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("GET PRODUCTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

export const getTrashProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      include: {
        brand: true,
        category: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("GET TRASH PRODUCTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy thùng rác sản phẩm",
      error: error.message,
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy chi tiết sản phẩm",
      error: error.message,
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
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

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên sản phẩm là bắt buộc",
      });
    }

    if (!sku?.trim()) {
      return res.status(400).json({
        success: false,
        message: "SKU là bắt buộc",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Danh mục là bắt buộc",
      });
    }

    if (basePrice === undefined || basePrice === null || Number(basePrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Giá gốc không hợp lệ",
      });
    }

    const category = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
        deletedAt: null,
      },
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    if (brandId) {
      const brand = await prisma.brand.findFirst({
        where: {
          id: Number(brandId),
          deletedAt: null,
        },
      });

      if (!brand) {
        return res.status(400).json({
          success: false,
          message: "Thương hiệu không tồn tại",
        });
      }
    }

    const skuExists = await prisma.product.findFirst({
      where: {
        sku: sku.trim(),
      },
    });

    if (skuExists) {
      return res.status(400).json({
        success: false,
        message: "SKU đã tồn tại",
      });
    }

    const baseSlug = slugify(name);
    let slug = baseSlug || `product-${Date.now()}`;
    let count = 1;

    while (await prisma.product.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const validStatuses = ["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"];
    const nextStatus = validStatuses.includes(status) ? status : "DRAFT";

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        sku: sku.trim(),
        shortDescription: shortDescription?.trim() || null,
        description: description?.trim() || null,
        categoryId: Number(categoryId),
        brandId: brandId ? Number(brandId) : null,
        basePrice: Number(basePrice),
        salePrice:
          salePrice !== undefined && salePrice !== null && salePrice !== ""
            ? Number(salePrice)
            : null,
        thumbnail: thumbnail?.trim() || null,
        weight:
          weight !== undefined && weight !== null && weight !== ""
            ? Number(weight)
            : null,
        length:
          length !== undefined && length !== null && length !== ""
            ? Number(length)
            : null,
        width:
          width !== undefined && width !== null && width !== ""
            ? Number(width)
            : null,
        height:
          height !== undefined && height !== null && height !== ""
            ? Number(height)
            : null,
        status: nextStatus as ProductStatus,
        isFeatured: Boolean(isFeatured),
        tags: tags?.trim() || null,
        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: product,
    });
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi tạo sản phẩm",
      error: error.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
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

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    if (sku && sku.trim() !== existing.sku) {
      const skuExists = await prisma.product.findFirst({
        where: {
          sku: sku.trim(),
          id: { not: id },
        },
      });

      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: "SKU đã tồn tại",
        });
      }
    }

    const nextCategoryId =
      categoryId !== undefined && categoryId !== null && categoryId !== ""
        ? Number(categoryId)
        : existing.categoryId;

    const category = await prisma.category.findFirst({
      where: {
        id: nextCategoryId,
        deletedAt: null,
      },
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    const nextBrandId =
      brandId !== undefined
        ? brandId === null || brandId === ""
          ? null
          : Number(brandId)
        : existing.brandId;

    if (nextBrandId) {
      const brand = await prisma.brand.findFirst({
        where: {
          id: nextBrandId,
          deletedAt: null,
        },
      });

      if (!brand) {
        return res.status(400).json({
          success: false,
          message: "Thương hiệu không tồn tại",
        });
      }
    }

    let slug = existing.slug;

    if (name?.trim() && name.trim() !== existing.name) {
      const baseSlug = slugify(name);
      slug = baseSlug || `product-${Date.now()}`;
      let count = 1;

      while (true) {
        const found = await prisma.product.findFirst({
          where: {
            slug,
            id: { not: id },
          },
        });

        if (!found) break;
        slug = `${baseSlug}-${count++}`;
      }
    }

    const validStatuses = ["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"];

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name?.trim() || existing.name,
        slug,
        sku: sku?.trim() || existing.sku,
        shortDescription:
          shortDescription !== undefined
            ? shortDescription?.trim() || null
            : existing.shortDescription,
        description:
          description !== undefined
            ? description?.trim() || null
            : existing.description,
        categoryId: nextCategoryId,
        brandId: nextBrandId,
        basePrice:
          basePrice !== undefined && basePrice !== null && basePrice !== ""
            ? Number(basePrice)
            : existing.basePrice,
        salePrice:
          salePrice !== undefined
            ? salePrice === null || salePrice === ""
              ? null
              : Number(salePrice)
            : existing.salePrice,
        thumbnail:
          thumbnail !== undefined
            ? thumbnail?.trim() || null
            : existing.thumbnail,
        weight:
          weight !== undefined
            ? weight === null || weight === ""
              ? null
              : Number(weight)
            : existing.weight,
        length:
          length !== undefined
            ? length === null || length === ""
              ? null
              : Number(length)
            : existing.length,
        width:
          width !== undefined
            ? width === null || width === ""
              ? null
              : Number(width)
            : existing.width,
        height:
          height !== undefined
            ? height === null || height === ""
              ? null
              : Number(height)
            : existing.height,
        status: validStatuses.includes(status)
          ? (status as ProductStatus)
          : existing.status,
        isFeatured:
          typeof isFeatured === "boolean" ? isFeatured : existing.isFeatured,
        tags: tags !== undefined ? tags?.trim() || null : existing.tags,
        seoTitle:
          seoTitle !== undefined ? seoTitle?.trim() || null : existing.seoTitle,
        seoDescription:
          seoDescription !== undefined
            ? seoDescription?.trim() || null
            : existing.seoDescription,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error: any) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi cập nhật sản phẩm",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Đã chuyển sản phẩm vào thùng rác",
    });
  } catch (error: any) {
    console.error("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xóa sản phẩm",
      error: error.message,
    });
  }
};

export const restoreProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    if (!existing.deletedAt) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm này chưa bị xóa",
      });
    }

    const skuExists = await prisma.product.findFirst({
      where: {
        id: { not: id },
        sku: existing.sku,
        deletedAt: null,
      },
    });

    if (skuExists) {
      return res.status(400).json({
        success: false,
        message: "Không thể khôi phục vì SKU đã tồn tại",
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        deletedAt: null,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Khôi phục sản phẩm thành công",
      data: product,
    });
  } catch (error: any) {
    console.error("RESTORE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khôi phục sản phẩm",
      error: error.message,
    });
  }
};

export const forceDeleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.product.findUnique({
      where: { id },
      include: {
        cartItems: { take: 1 },
        orderItems: { take: 1 },
        reviews: { take: 1 },
        wishlistItems: { take: 1 },
        variants: { take: 1 },
        images: { take: 1 },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    if (
      existing.cartItems.length > 0 ||
      existing.orderItems.length > 0 ||
      existing.reviews.length > 0 ||
      existing.wishlistItems.length > 0 ||
      existing.variants.length > 0 ||
      existing.images.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa vĩnh viễn vì sản phẩm còn dữ liệu liên quan",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn sản phẩm thành công",
    });
  } catch (error: any) {
    console.error("FORCE DELETE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xóa vĩnh viễn sản phẩm",
      error: error.message,
    });
  }
};

export const toggleProductVisibility = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    let nextStatus: ProductStatus = "ACTIVE";

    if (existing.status === "ACTIVE") {
      nextStatus = "INACTIVE";
    } else if (existing.status === "INACTIVE" || existing.status === "DRAFT") {
      nextStatus = "ACTIVE";
    } else if (existing.status === "OUT_OF_STOCK") {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm hết hàng, không thể bật hiển thị bằng nút ẩn/hiện",
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        status: nextStatus,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        product.status === "ACTIVE"
          ? "Đã hiển thị sản phẩm"
          : "Đã ẩn sản phẩm",
      data: product,
    });
  } catch (error: any) {
    console.error("TOGGLE PRODUCT VISIBILITY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi đổi trạng thái hiển thị sản phẩm",
      error: error.message,
    });
  }
};