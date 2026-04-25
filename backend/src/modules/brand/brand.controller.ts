import { Request, Response } from "express";
import slugify from "slugify";
import { prisma } from "../../config/prisma";
import { createBrandSchema, updateBrandSchema } from "./brand.validation";

export const getBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { deletedAt: null },
      orderBy: { id: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách brand",
      error: error.message,
    });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID brand không hợp lệ",
      });
    }

    const brand = await prisma.brand.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy brand",
      });
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết brand",
      error: error.message,
    });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const payload = createBrandSchema.parse(req.body);

    const slug = slugify(payload.name, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    const existed = await prisma.brand.findFirst({
      where: {
        OR: [{ name: payload.name }, { slug }],
      },
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Brand đã tồn tại",
      });
    }

    const brand = await prisma.brand.create({
      data: {
        name: payload.name,
        slug,
        logo: payload.logo || "",
        description: payload.description || "",
        isVisible: payload.isVisible ?? true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tạo brand thành công",
      data: brand,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo brand",
      error: error.message,
    });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID brand không hợp lệ",
      });
    }

    const payload = updateBrandSchema.parse(req.body);

    const oldBrand = await prisma.brand.findUnique({ where: { id } });

    if (!oldBrand || oldBrand.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy brand",
      });
    }

    const newSlug = payload.name
      ? slugify(payload.name, { lower: true, strict: true, locale: "vi" })
      : oldBrand.slug;

    if (payload.name) {
      const duplicate = await prisma.brand.findFirst({
        where: {
          id: { not: id },
          OR: [{ name: payload.name }, { slug: newSlug }],
        },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Tên brand hoặc slug đã tồn tại",
        });
      }
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: payload.name ?? oldBrand.name,
        slug: newSlug,
        logo: payload.logo ?? oldBrand.logo,
        description: payload.description ?? oldBrand.description,
        isVisible: payload.isVisible ?? oldBrand.isVisible,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cập nhật brand thành công",
      data: brand,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật brand",
      error: error.message,
    });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID brand không hợp lệ",
      });
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand || brand.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy brand",
      });
    }

    await prisma.brand.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Đã chuyển brand vào thùng rác",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa brand",
      error: error.message,
    });
  }
};

export const getTrashBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      orderBy: { id: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách brand trong thùng rác",
      error: error.message,
    });
  }
};

export const restoreBrand = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID brand không hợp lệ",
      });
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy brand",
      });
    }

    await prisma.brand.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Khôi phục brand thành công",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi khôi phục brand",
      error: error.message,
    });
  }
};

export const forceDeleteBrand = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID brand không hợp lệ",
      });
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy brand",
      });
    }

    await prisma.brand.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn brand thành công",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa vĩnh viễn brand",
      error: error.message,
    });
  }
};

export const toggleBrandVisibility = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID brand không hợp lệ",
      });
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand || brand.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy brand",
      });
    }

    const updated = await prisma.brand.update({
      where: { id },
      data: {
        isVisible: !brand.isVisible,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Đổi trạng thái hiển thị thành công",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi đổi trạng thái hiển thị brand",
      error: error.message,
    });
  }
};