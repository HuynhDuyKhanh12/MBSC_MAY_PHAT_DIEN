import { prisma } from "../../config/prisma";

const generateOrderCode = () => "ORD" + Date.now();

const getCartItemUnitPrice = (item: any) => {
  return Number(
    item?.variant?.salePrice ??
      item?.variant?.price ??
      item?.product?.salePrice ??
      item?.product?.basePrice ??
      0
  );
};

export const getOrderByIdService = async (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      coupon: true,
      address: true,
      user: true,
    },
  });
};

export const createOrderService = async (userId: number, payload: any) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    const error: any = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  let addressRecord: any = null;

  if (payload.addressId !== undefined && payload.addressId !== null) {
    addressRecord = await prisma.address.findFirst({
      where: {
        id: Number(payload.addressId),
        userId,
      },
    });

    if (!addressRecord) {
      const error: any = new Error("Address not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const orderItems = cart.items.map((item) => {
    if (!item.product || item.product.deletedAt || item.product.status !== "ACTIVE") {
      const error: any = new Error(`Product ${item.productId} is unavailable`);
      error.statusCode = 400;
      throw error;
    }

    if (item.variantId) {
      if (!item.variant) {
        const error: any = new Error("Variant not found");
        error.statusCode = 404;
        throw error;
      }

      if (item.variant.productId !== item.productId) {
        const error: any = new Error("Variant does not belong to product");
        error.statusCode = 400;
        throw error;
      }

      if ((item.variant.stock ?? 0) < item.quantity) {
        const error: any = new Error(`Variant ${item.variant.sku} out of stock`);
        error.statusCode = 400;
        throw error;
      }
    }

    const unitPrice = getCartItemUnitPrice(item);

    if (!unitPrice || Number.isNaN(unitPrice)) {
      const error: any = new Error(`Invalid price for product ${item.productId}`);
      error.statusCode = 400;
      throw error;
    }

    return {
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      sku: item.variant?.sku || item.product.sku,
      image: item.variant?.image || item.product.thumbnail,
      color: item.variant?.color || null,
      size: item.variant?.size || null,
      quantity: item.quantity,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  let discountAmount = 0;
  let couponId: number | null = null;

  if (payload.couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: String(payload.couponCode).trim().toUpperCase(),
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    if (!coupon) {
      const error: any = new Error("Coupon is invalid or expired");
      error.statusCode = 400;
      throw error;
    }

    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined) {
      if ((coupon.usedCount ?? 0) >= coupon.usageLimit) {
        const error: any = new Error("Coupon usage limit exceeded");
        error.statusCode = 400;
        throw error;
      }
    }

    if (
      coupon.minOrderValue !== null &&
      coupon.minOrderValue !== undefined &&
      subtotal < Number(coupon.minOrderValue)
    ) {
      const error: any = new Error("Order does not meet minimum value for coupon");
      error.statusCode = 400;
      throw error;
    }

    couponId = coupon.id;

    if (coupon.discountType === "PERCENT") {
      discountAmount = (subtotal * Number(coupon.discountValue)) / 100;

      if (
        coupon.maxDiscountValue !== null &&
        coupon.maxDiscountValue !== undefined
      ) {
        discountAmount = Math.min(
          discountAmount,
          Number(coupon.maxDiscountValue)
        );
      }
    } else {
      discountAmount = Number(coupon.discountValue);
    }
  }

  const shippingFee = Number(payload.shippingFee || 0);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        code: generateOrderCode(),
        user: {
          connect: { id: userId },
        },
        ...(addressRecord
          ? {
              address: {
                connect: { id: addressRecord.id },
              },
            }
          : {}),
        ...(couponId
          ? {
              coupon: {
                connect: { id: couponId },
              },
            }
          : {}),
        status: "PENDING",
        paymentMethod: payload.paymentMethod,
        paymentStatus: "UNPAID",
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        note: payload.note || null,
        fullName: payload.fullName,
        phone: payload.phone,
        province: payload.province,
        district: payload.district,
        ward: payload.ward,
        detailAddress: payload.detailAddress,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        coupon: true,
        address: true,
      },
    });

    for (const item of cart.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            variantId: item.variantId,
            type: "EXPORT",
            quantity: item.quantity,
            note: `Export for order ${order.code}`,
          },
        });
      }

      await tx.product.update({
        where: { id: item.productId },
        data: {
          soldCount: {
            increment: item.quantity,
          },
        },
      });
    }

    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });
};

export const getMyOrdersService = async (userId: number) => {
  return prisma.order.findMany({
    where: { user: { id: userId } },
    include: {
      items: true,
      coupon: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllOrdersService = async () => {
  return prisma.order.findMany({
    include: {
      user: true,
      items: true,
      coupon: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateOrderStatusService = async (id: number, status: string) => {
  return prisma.order.update({
    where: { id },
    data: { status: status as any },
    include: {
      user: true,
      items: true,
      coupon: true,
      address: true,
    },
  });
};