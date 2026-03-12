import { prisma } from "../../config/prisma";

const buildCartResponse = (cart: any) => {
  if (!cart) {
    return {
      id: null,
      userId: null,
      items: [],
      totalItems: 0,
      totalQuantity: 0,
      subtotal: 0,
    };
  }

  const items = cart.items.map((item: any) => ({
    ...item,
    lineTotal: Number(item.unitPrice) * item.quantity,
  }));

  const totalItems = items.length;
  const totalQuantity = items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.lineTotal,
    0
  );

  return {
    ...cart,
    items,
    totalItems,
    totalQuantity,
    subtotal,
  };
};

export const addToCartService = async (
  userId: number,
  productId: number,
  variantId: number | null,
  quantity: number
) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
      status: "ACTIVE",
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let unitPrice = Number(product.salePrice || product.basePrice);

  if (variantId) {
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId,
      },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }

    if ((variant.stock ?? 0) < quantity) {
      throw new Error("Insufficient stock");
    }

    unitPrice = Number(
      variant.salePrice || variant.price || product.salePrice || product.basePrice
    );
  }

  const existed = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId,
    },
  });

  if (existed) {
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (variant && (variant.stock ?? 0) < existed.quantity + quantity) {
        throw new Error("Insufficient stock");
      }
    }

    return prisma.cartItem.update({
      where: { id: existed.id },
      data: {
        quantity: existed.quantity + quantity,
        unitPrice,
      },
      include: {
        product: true,
        variant: true,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      variantId,
      quantity,
      unitPrice,
    },
    include: {
      product: true,
      variant: true,
    },
  });
};

export const getCartService = async (userId: number) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
        orderBy: {
          id: "desc",
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  return buildCartResponse(cart);
};

export const updateCartItemService = async (
  userId: number,
  id: number,
  quantity: number
) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: {
      cart: true,
      product: true,
      variant: true,
    },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Cart item not found");
  }

  if (cartItem.variant && (cartItem.variant.stock ?? 0) < quantity) {
    throw new Error("Insufficient stock");
  }

  return prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: {
      product: true,
      variant: true,
    },
  });
};

export const deleteCartItemService = async (userId: number, id: number) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: {
      cart: true,
    },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Cart item not found");
  }

  return prisma.cartItem.delete({
    where: { id },
  });
};