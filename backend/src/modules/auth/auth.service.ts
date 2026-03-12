import { prisma } from "../../config/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export const registerUser = async (data: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}) => {
  const existedEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existedEmail) {
    throw new Error("Email already exists");
  }

  if (data.phone) {
    const existedPhone = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existedPhone) {
      throw new Error("Phone already exists");
    }
  }

  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: {
      name: "CUSTOMER",
      description: "Customer role",
    },
  });

  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: hashed,
      roleId: customerRole.id,
    },
    include: {
      role: true,
    },
  });

  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  const refreshToken = signRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  const refreshToken = signRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (token: string) => {
  const decoded = verifyRefreshToken(token) as any;

  const found = await prisma.refreshToken.findFirst({
    where: {
      token,
      isRevoked: false,
    },
    include: {
      user: {
        include: { role: true },
      },
    },
  });

  if (!found || found.user.id !== decoded.id) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = signAccessToken({
    id: found.user.id,
    email: found.user.email,
    role: found.user.role.name,
  });

  return { accessToken };
};