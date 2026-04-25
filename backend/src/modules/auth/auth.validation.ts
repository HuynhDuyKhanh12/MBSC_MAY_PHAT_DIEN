import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải từ 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").optional(),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
});