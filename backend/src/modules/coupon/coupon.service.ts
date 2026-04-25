import { prisma } from "../../config/prisma";

type CreateCouponInput = {
  title: string;
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
  title?: string;
  code?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  minOrderValue?: number | null;
  maxDiscountValue?: number | null;
  usageLimit?: number | null;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
};

export const getCouponByIdService = async (id: number) => {
  return prisma.coupon.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
};

export const createCouponService = async (data: CreateCouponInput) => {
  const existingCoupon = await prisma.coupon.findFirst({
    where: {
      code: String(data.code).trim().toUpperCase(),
    },
  });

  if (existingCoupon) {
    const error: any = new Error("Coupon code already exists");
    error.statusCode = 400;
    throw error;
  }

  return prisma.coupon.create({
    data: {
      title: String(data.title).trim(),
      code: String(data.code).trim().toUpperCase(),
      description: data.description ? String(data.description).trim() : null,
      discountType: data.discountType as any,
      discountValue: Number(data.discountValue),
      minOrderValue:
        data.minOrderValue !== undefined ? Number(data.minOrderValue) : null,
      maxDiscountValue:
        data.maxDiscountValue !== undefined ? Number(data.maxDiscountValue) : null,
      usageLimit:
        data.usageLimit !== undefined ? Number(data.usageLimit) : null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive ?? true,
    },
  });
};

export const getCouponsService = async () => {
  return prisma.coupon.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTrashCouponsService = async () => {
  return prisma.coupon.findMany({
    where: {
      deletedAt: {
        not: null,
      },
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
  const coupon = await prisma.coupon.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!coupon) {
    const error: any = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.code) {
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        code: String(data.code).trim().toUpperCase(),
        NOT: {
          id,
        },
      },
    });

    if (existingCoupon) {
      const error: any = new Error("Coupon code already exists");
      error.statusCode = 400;
      throw error;
    }
  }

  return prisma.coupon.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: String(data.title).trim() }),
      ...(data.code !== undefined && {
        code: String(data.code).trim().toUpperCase(),
      }),
      ...(data.description !== undefined && {
        description: data.description ? String(data.description).trim() : null,
      }),
      ...(data.discountType !== undefined && {
        discountType: data.discountType as any,
      }),
      ...(data.discountValue !== undefined && {
        discountValue: Number(data.discountValue),
      }),
      ...(data.minOrderValue !== undefined && {
        minOrderValue:
          data.minOrderValue === null ? null : Number(data.minOrderValue),
      }),
      ...(data.maxDiscountValue !== undefined && {
        maxDiscountValue:
          data.maxDiscountValue === null ? null : Number(data.maxDiscountValue),
      }),
      ...(data.usageLimit !== undefined && {
        usageLimit: data.usageLimit === null ? null : Number(data.usageLimit),
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
  const coupon = await prisma.coupon.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!coupon) {
    const error: any = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.coupon.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });
};

export const restoreCouponService = async (id: number) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      id,
      deletedAt: {
        not: null,
      },
    },
  });

  if (!coupon) {
    const error: any = new Error("Coupon not found in trash");
    error.statusCode = 404;
    throw error;
  }

  return prisma.coupon.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};

export const forceDeleteCouponService = async (id: number) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      id,
    },
    include: {
      orders: {
        take: 1,
      },
    },
  });

  if (!coupon) {
    const error: any = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  if (coupon.orders.length > 0) {
    const error: any = new Error(
      "Cannot permanently delete coupon because it has been used in orders"
    );
    error.statusCode = 400;
    throw error;
  }

  return prisma.coupon.delete({
    where: { id },
  });
};

export const toggleCouponService = async (id: number) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!coupon) {
    const error: any = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.coupon.update({
    where: { id },
    data: {
      isActive: !coupon.isActive,
    },
  });
};