import { prisma } from "../../config/prisma";

export const createCouponService = async (data: any) => {
  return prisma.coupon.create({
    data: {
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderValue: data.minOrderValue,
      maxDiscountValue: data.maxDiscountValue,
      usageLimit: data.usageLimit,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive ?? true,
    },
  });
};

export const getCouponsService = async () => {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const updateCouponService = async (id: number, data: any) => {
  return prisma.coupon.update({
    where: { id },
    data: {
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderValue: data.minOrderValue,
      maxDiscountValue: data.maxDiscountValue,
      usageLimit: data.usageLimit,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      isActive: data.isActive,
    },
  });
};

export const deleteCouponService = async (id: number) => {
  return prisma.coupon.delete({
    where: { id },
  });
};