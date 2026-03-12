import { prisma } from "../../config/prisma";

type CreateCouponInput = {
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
};

type UpdateCouponInput = {
  code?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  deletedAt?: Date | null;
};

export const getCouponByIdService = async (id: number) => {
  return prisma.coupon.findFirst({
    where: {
      id,
    },
  });
};

export const createCouponService = async (data: CreateCouponInput) => {
  const existingCoupon = await prisma.coupon.findFirst({
    where: {
      code: data.code,
    },
  });

  if (existingCoupon) {
    throw new Error("Coupon code already exists");
  }

  return prisma.coupon.create({
    data: {
      code: data.code,
      description: data.description,
      discountType: data.discountType as any,
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
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateCouponService = async (
  id: number,
  data: UpdateCouponInput
) => {
  if (data.code) {
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        code: data.code,
        NOT: {
          id,
        },
      },
    });

    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }
  }

  return prisma.coupon.update({
    where: { id },
    data: {
      ...(data.code !== undefined && { code: data.code }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.discountType !== undefined && {
        discountType: data.discountType as any,
      }),
      ...(data.discountValue !== undefined && {
        discountValue: data.discountValue,
      }),
      ...(data.minOrderValue !== undefined && {
        minOrderValue: data.minOrderValue,
      }),
      ...(data.maxDiscountValue !== undefined && {
        maxDiscountValue: data.maxDiscountValue,
      }),
      ...(data.usageLimit !== undefined && {
        usageLimit: data.usageLimit,
      }),
      ...(data.startDate !== undefined && {
        startDate: new Date(data.startDate),
      }),
      ...(data.endDate !== undefined && {
        endDate: new Date(data.endDate),
      }),
      ...(data.isActive !== undefined && {
        isActive: data.isActive,
      }),
    },
  });
};

export const deleteCouponService = async (id: number) => {
  return prisma.coupon.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
};