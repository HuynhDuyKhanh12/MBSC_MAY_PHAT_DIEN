import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        role?: {
          name: string;
          permissions?: Array<{ permission: { key: string } }>;
        };
      };
    }
  }
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const roleName = req.user?.role?.name;

    if (!roleName) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập",
      });
    }

    if (!allowedRoles.includes(roleName)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập",
      });
    }

    next();
  };
};

export const authorizePermissions = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissions =
      req.user?.role?.permissions?.map(
        (item: { permission: { key: string } }) => item.permission.key
      ) || [];

    const hasPermission = requiredPermissions.every((permission) =>
      permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện chức năng này",
      });
    }

    next();
  };
};