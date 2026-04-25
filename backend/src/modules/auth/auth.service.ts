import { prisma } from "../../config/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

export const registerUser = async (data: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}) => {
  const existedEmail = await prisma.user.findUnique({
    where: { email: data.email.trim().toLowerCase() },
  });

  if (existedEmail) {
    throw new Error("Email đã tồn tại");
  }

  if (data.phone?.trim()) {
    const existedPhone = await prisma.user.findUnique({
      where: { phone: data.phone.trim() },
    });

    if (existedPhone) {
      throw new Error("Số điện thoại đã tồn tại");
    }
  }

  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: {
      name: "CUSTOMER",
      description: "Khách hàng",
    },
  });

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      password: hashedPassword,
      roleId: customerRole.id,
    },
    include: {
      role: true,
    },
  });

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role.name,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  try {
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("SAVE REFRESH TOKEN ERROR:", error);
  }

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { role: true },
  });

  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  if (user.deletedAt) {
    throw new Error("Tài khoản đã bị xóa");
  }

  if (user.status === "BLOCKED") {
    throw new Error("Tài khoản đã bị khóa");
  }

  if (user.status === "INACTIVE") {
    throw new Error("Tài khoản chưa kích hoạt");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role.name,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  try {
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("SAVE REFRESH TOKEN ERROR:", error);
  }

  return {
    user,
    accessToken,
    refreshToken,
  };
};