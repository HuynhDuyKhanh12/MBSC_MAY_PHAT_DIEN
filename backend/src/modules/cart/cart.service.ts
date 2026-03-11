import { prisma } from "../../config/prisma";

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

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let unitPrice = Number(product.salePrice || product.basePrice);

  if (variantId) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) throw new Error("Variant not found");
    if (variant.stock < quantity) throw new Error("Insufficient stock");

    unitPrice = Number(variant.salePrice || variant.price || product.salePrice || product.basePrice);
  }

  const existed = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId,
    },
  });

  if (existed) {
    return prisma.cartItem.update({
      where: { id: existed.id },
      data: {
        quantity: existed.quantity + quantity,
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
  });
};

export const getCartService = async (userId: number) => {
  return prisma.cart.findUnique({
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
};

export const updateCartItemService = async (id: number, quantity: number) => {
  return prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });
};

export const deleteCartItemService = async (id: number) => {
  return prisma.cartItem.delete({
    where: { id },
  });
};