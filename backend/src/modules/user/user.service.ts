import { prisma } from "../../config/prisma";
import { hashPassword } from "../../utils/hash";

export const getUsersService = async () => {
  return prisma.user.findMany({
    where: { deletedAt: null },
    include: {
      role: true,
      addresses: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getProfileService = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      addresses: true,
    },
  });
};

export const updateProfileService = async (userId: number, data: any) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      fullName: data.fullName,
      phone: data.phone,
      avatar: data.avatar,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    },
    include: {
      role: true,
    },
  });
};

export const changePasswordService = async (userId: number, newPassword: string) => {
  const hashed = await hashPassword(newPassword);

  return prisma.user.update({
    where: { id: userId },
    data: {
      password: hashed,
    },
  });
};

export const deleteUserService = async (id: number) => {
  return prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: "INACTIVE",
    },
  });
};