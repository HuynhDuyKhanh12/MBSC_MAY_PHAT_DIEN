import { prisma } from "../../config/prisma";

const generateOrderCode = () => "ORD" + Date.now();

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
    throw new Error("Cart is empty");
  }

  let subtotal = 0;

  for (const item of cart.items) {
    subtotal += Number(item.unitPrice) * item.quantity;

    if (item.variantId && item.variant && item.variant.stock < item.quantity) {
      throw new Error(`Variant ${item.variant.sku} out of stock`);
    }
  }

  let discountAmount = 0;
  let couponId: number | null = null;

  if (payload.couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: payload.couponCode,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    if (coupon) {
      couponId = coupon.id;

      if (coupon.discountType === "PERCENT") {
        discountAmount = (subtotal * Number(coupon.discountValue)) / 100;

        if (coupon.maxDiscountValue) {
          discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountValue));
        }
      } else {
        discountAmount = Number(coupon.discountValue);
      }
    }
  }

  const shippingFee = payload.shippingFee || 0;
  const totalAmount = subtotal - discountAmount + shippingFee;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        code: generateOrderCode(),
        userId,
        addressId: payload.addressId,
        couponId,
        status: "PENDING",
        paymentMethod: payload.paymentMethod,
        paymentStatus: "UNPAID",
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        note: payload.note,
        fullName: payload.fullName,
        phone: payload.phone,
        province: payload.province,
        district: payload.district,
        ward: payload.ward,
        detailAddress: payload.detailAddress,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.product.name,
            sku: item.variant?.sku || item.product.sku,
            image: item.variant?.image || item.product.thumbnail,
            color: item.variant?.color || null,
            size: item.variant?.size || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: Number(item.unitPrice) * item.quantity,
          })),
        },
      },
      include: {
        items: true,
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

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });
};

export const getMyOrdersService = async (userId: number) => {
  return prisma.order.findMany({
    where: { userId },
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

export const updateOrderStatusService = async (id: number, status: any) => {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
};