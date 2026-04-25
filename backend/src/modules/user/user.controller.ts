import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        role: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy danh sách người dùng",
      error: error.message,
    });
  }
};

export const getTrashUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      include: {
        role: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error("GET TRASH USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy thùng rác người dùng",
      error: error.message,
    });
  }
};

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error("GET ROLES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy danh sách vai trò",
      error: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("GET USER BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy chi tiết người dùng",
      error: error.message,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      avatar,
      gender,
      dateOfBirth,
      status,
      roleId,
    } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Họ tên là bắt buộc",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email là bắt buộc",
      });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: "Vai trò là bắt buộc",
      });
    }

    const emailExists = await prisma.user.findFirst({
      where: { email: email.trim() },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại",
      });
    }

    if (phone?.trim()) {
      const phoneExists = await prisma.user.findFirst({
        where: { phone: phone.trim() },
      });

      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Số điện thoại đã tồn tại",
        });
      }
    }

    const role = await prisma.role.findUnique({
      where: { id: Number(roleId) },
    });

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        password: hashedPassword,
        avatar: avatar?.trim() || null,
        gender: gender || null,
        dateOfBirth:
          dateOfBirth && String(dateOfBirth).trim()
            ? new Date(dateOfBirth)
            : null,
        status: status || "ACTIVE",
        roleId: Number(roleId),
      },
      include: {
        role: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tạo người dùng thành công",
      data: user,
    });
  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi tạo người dùng",
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { fullName, email, phone, avatar, gender, dateOfBirth, status, roleId } =
      req.body;

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (email && email !== existing.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại",
        });
      }
    }

    if (phone && phone !== existing.phone) {
      const phoneExists = await prisma.user.findFirst({
        where: {
          phone,
          id: { not: id },
        },
      });

      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Số điện thoại đã tồn tại",
        });
      }
    }

    if (roleId !== undefined && roleId !== null) {
      const role = await prisma.role.findUnique({
        where: { id: Number(roleId) },
      });

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Vai trò không tồn tại",
        });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        fullName: fullName !== undefined ? fullName : existing.fullName,
        email: email !== undefined ? email : existing.email,
        phone: phone !== undefined ? phone : existing.phone,
        avatar: avatar !== undefined ? avatar : existing.avatar,
        gender: gender !== undefined ? gender : existing.gender,
        dateOfBirth:
          dateOfBirth !== undefined && dateOfBirth !== null && dateOfBirth !== ""
            ? new Date(dateOfBirth)
            : dateOfBirth === null || dateOfBirth === ""
            ? null
            : existing.dateOfBirth,
        status: status !== undefined ? status : existing.status,
        roleId:
          roleId !== undefined && roleId !== null
            ? Number(roleId)
            : existing.roleId,
      },
      include: {
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cập nhật người dùng thành công",
      data: user,
    });
  } catch (error: any) {
    console.error("UPDATE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi cập nhật người dùng",
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!existing || existing.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (existing.role?.name === "SUPER_ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa SUPER_ADMIN",
      });
    }

    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Đã chuyển người dùng vào thùng rác",
    });
  } catch (error: any) {
    console.error("DELETE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xóa người dùng",
      error: error.message,
    });
  }
};

export const restoreUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (!existing.deletedAt) {
      return res.status(400).json({
        success: false,
        message: "Người dùng này chưa bị xóa",
      });
    }

    const emailExists = await prisma.user.findFirst({
      where: {
        id: { not: id },
        email: existing.email,
        deletedAt: null,
      },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Không thể khôi phục vì email đã tồn tại",
      });
    }

    if (existing.phone) {
      const phoneExists = await prisma.user.findFirst({
        where: {
          id: { not: id },
          phone: existing.phone,
          deletedAt: null,
        },
      });

      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Không thể khôi phục vì số điện thoại đã tồn tại",
        });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Khôi phục người dùng thành công",
      data: user,
    });
  } catch (error: any) {
    console.error("RESTORE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khôi phục người dùng",
      error: error.message,
    });
  }
};

export const forceDeleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        orders: { take: 1 },
        reviews: { take: 1 },
        wishlists: { take: 1 },
        addresses: { take: 1 },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (existing.role?.name === "SUPER_ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa vĩnh viễn SUPER_ADMIN",
      });
    }

    if (
      existing.orders.length > 0 ||
      existing.reviews.length > 0 ||
      existing.wishlists.length > 0 ||
      existing.addresses.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa vĩnh viễn vì người dùng đang có dữ liệu liên quan",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn người dùng thành công",
    });
  } catch (error: any) {
    console.error("FORCE DELETE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xóa vĩnh viễn người dùng",
      error: error.message,
    });
  }
};

export const changeUserStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = ["ACTIVE", "INACTIVE", "BLOCKED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const existing = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (existing.role?.name === "SUPER_ADMIN" && status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Không thể khóa hoặc chặn SUPER_ADMIN",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      include: {
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái người dùng thành công",
      data: user,
    });
  } catch (error: any) {
    console.error("CHANGE USER STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi cập nhật trạng thái người dùng",
      error: error.message,
    });
  }
};