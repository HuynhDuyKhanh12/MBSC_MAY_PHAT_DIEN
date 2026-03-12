import { prisma } from "../../config/prisma";

type AddressInput = {
  fullName?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  detailAddress?: string;
  postalCode?: string;
  isDefault?: boolean;
};

export const createAddressService = async (userId: number, data: AddressInput) => {
  const existingCount = await prisma.address.count({
    where: { userId },
  });

  const shouldSetDefault = data.isDefault === true || existingCount === 0;

  if (shouldSetDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      fullName: data.fullName!,
      phone: data.phone!,
      province: data.province!,
      district: data.district!,
      ward: data.ward!,
      detailAddress: data.detailAddress!,
      postalCode: data.postalCode,
      isDefault: shouldSetDefault,
    },
  });
};

export const getAddressesService = async (userId: number) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
};

export const updateAddressService = async (
  userId: number,
  id: number,
  data: AddressInput
) => {
  const address = await prisma.address.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (data.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id },
    data: {
      ...(data.fullName !== undefined && { fullName: String(data.fullName).trim() }),
      ...(data.phone !== undefined && { phone: String(data.phone).trim() }),
      ...(data.province !== undefined && { province: String(data.province).trim() }),
      ...(data.district !== undefined && { district: String(data.district).trim() }),
      ...(data.ward !== undefined && { ward: String(data.ward).trim() }),
      ...(data.detailAddress !== undefined && {
        detailAddress: String(data.detailAddress).trim(),
      }),
      ...(data.postalCode !== undefined && {
        postalCode: data.postalCode ? String(data.postalCode).trim() : null,
      }),
      ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
    },
  });
};

export const deleteAddressService = async (userId: number, id: number) => {
  const address = await prisma.address.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await prisma.address.delete({
    where: { id },
  });

  if (address.isDefault) {
    const anotherAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (anotherAddress) {
      await prisma.address.update({
        where: { id: anotherAddress.id },
        data: { isDefault: true },
      });
    }
  }

  return { id, deleted: true };
};