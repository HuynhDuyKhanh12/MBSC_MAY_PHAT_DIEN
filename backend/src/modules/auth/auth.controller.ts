import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu đăng ký không hợp lệ",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { fullName, email, phone, password } = parsed.data;

    const result = await registerUser({
      fullName,
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        user: {
          id: result.user.id,
          fullName: result.user.fullName,
          email: result.user.email,
          phone: result.user.phone,
          role: result.user.role.name,
          status: result.user.status,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Lỗi khi đăng ký",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu đăng nhập không hợp lệ",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parsed.data;

    const result = await loginUser(email.trim().toLowerCase(), password);

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: {
          id: result.user.id,
          fullName: result.user.fullName,
          email: result.user.email,
          phone: result.user.phone,
          role: result.user.role.name,
          status: result.user.status,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Email hoặc mật khẩu không đúng",
    });
  }
};