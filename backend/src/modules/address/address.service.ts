import { prisma } from "../../config/prisma";

export const createAddressService = async (userId: number, data: any) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      province: data.province,
      district: data.district,
      ward: data.ward,
      detailAddress: data.detailAddress,
      postalCode: data.postalCode,
      isDefault: data.isDefault || false,
    },
  });
};

export const getAddressesService = async (userId: number) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
};

export const updateAddressService = async (userId: number, id: number, data: any) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id },
    data: {
      fullName: data.fullName,
      phone: data.phone,
      province: data.province,
      district: data.district,
      ward: data.ward,
      detailAddress: data.detailAddress,
      postalCode: data.postalCode,
      isDefault: data.isDefault,
    },
  });
};

export const deleteAddressService = async (id: number) => {
  return prisma.address.delete({
    where: { id },
  });
};