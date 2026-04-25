import { Request, Response } from "express";

export const uploadBrandLogo = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file ảnh",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/brands/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Upload ảnh thành công",
      data: {
        filename: req.file.filename,
        url: fileUrl,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Upload ảnh thất bại",
      error: error.message,
    });
  }
};

export const uploadCategoryImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file ảnh",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/categories/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Upload ảnh danh mục thành công",
      data: {
        filename: req.file.filename,
        url: fileUrl,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Upload ảnh danh mục thất bại",
      error: error.message,
    });
  }
};

export const uploadUserAvatar = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file ảnh",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/users/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Upload avatar thành công",
      data: {
        filename: req.file.filename,
        url: fileUrl,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Upload avatar thất bại",
      error: error.message,
    });
  }
};

export const uploadProductThumbnail = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file ảnh",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/products/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Upload thumbnail sản phẩm thành công",
      data: {
        filename: req.file.filename,
        url: fileUrl,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Upload thumbnail sản phẩm thất bại",
      error: error.message,
    });
  }
};