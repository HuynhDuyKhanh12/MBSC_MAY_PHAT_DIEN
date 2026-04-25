import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

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

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("GET CATEGORIES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy danh sách danh mục",
      error: error.message,
    });
  }
};

export const getTrashCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("GET TRASH CATEGORIES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy thùng rác danh mục",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const category = await prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error("GET CATEGORY BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy chi tiết danh mục",
      error: error.message,
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, image, description, isVisible } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục là bắt buộc",
      });
    }

    const parentId = null;

    const baseSlug = slugify(name);
    let slug = baseSlug || `category-${Date.now()}`;
    let count = 1;

    while (await prisma.category.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const existedSameName = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        parentId,
        deletedAt: null,
      },
    });

    if (existedSameName) {
      return res.status(400).json({
        success: false,
        message: "Danh mục đã tồn tại",
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        image: image || null,
        description: description || null,
        parentId,
        isVisible: typeof isVisible === "boolean" ? isVisible : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error: any) {
    console.error("CREATE CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi tạo danh mục",
      error: error.message,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, image, description, isVisible } = req.body;

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    let slug = existing.slug;

    if (name?.trim() && name.trim() !== existing.name) {
      const baseSlug = slugify(name);
      slug = baseSlug || `category-${Date.now()}`;
      let count = 1;

      while (true) {
        const found = await prisma.category.findFirst({
          where: {
            slug,
            id: { not: id },
          },
        });

        if (!found) break;
        slug = `${baseSlug}-${count++}`;
      }
    }

    const nextName = name?.trim() || existing.name;

    const duplicateName = await prisma.category.findFirst({
      where: {
        id: { not: id },
        name: nextName,
        parentId: null,
        deletedAt: null,
      },
    });

    if (duplicateName) {
      return res.status(400).json({
        success: false,
        message: "Danh mục đã tồn tại",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: nextName,
        slug,
        image: image !== undefined ? image : existing.image,
        description:
          description !== undefined ? description : existing.description,
        parentId: null,
        isVisible:
          typeof isVisible === "boolean" ? isVisible : existing.isVisible,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: category,
    });
  } catch (error: any) {
    console.error("UPDATE CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi cập nhật danh mục",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    await prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Đã chuyển danh mục vào thùng rác",
    });
  } catch (error: any) {
    console.error("DELETE CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xóa danh mục",
      error: error.message,
    });
  }
};

export const restoreCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    if (!existing.deletedAt) {
      return res.status(400).json({
        success: false,
        message: "Danh mục này chưa bị xóa",
      });
    }

    const duplicateName = await prisma.category.findFirst({
      where: {
        id: { not: id },
        name: existing.name,
        parentId: null,
        deletedAt: null,
      },
    });

    if (duplicateName) {
      return res.status(400).json({
        success: false,
        message: "Không thể khôi phục vì đã có danh mục trùng tên",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        deletedAt: null,
        parentId: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Khôi phục danh mục thành công",
      data: category,
    });
  } catch (error: any) {
    console.error("RESTORE CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khôi phục danh mục",
      error: error.message,
    });
  }
};

export const forceDeleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const existing = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: {
            deletedAt: null,
          },
          take: 1,
        },
        children: {
          where: {
            deletedAt: null,
          },
          take: 1,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    if (existing.products.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa vĩnh viễn vì danh mục vẫn còn sản phẩm",
      });
    }

    if (existing.children.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa vĩnh viễn vì danh mục vẫn còn danh mục con",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn danh mục thành công",
    });
  } catch (error: any) {
    console.error("FORCE DELETE CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xóa vĩnh viễn danh mục",
      error: error.message,
    });
  }
};

export const toggleCategoryVisibility = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const existing = await prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        isVisible: !existing.isVisible,
      },
    });

    return res.status(200).json({
      success: true,
      message: category.isVisible
        ? "Đã hiển thị danh mục"
        : "Đã ẩn danh mục",
      data: category,
    });
  } catch (error: any) {
    console.error("TOGGLE CATEGORY VISIBILITY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi đổi trạng thái hiển thị danh mục",
      error: error.message,
    });
  }
};