import { prisma } from "../../config/prisma";

export const addToWishlistService = async (userId: number, productId: number) => {
  return prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {},
    create: {
      userId,
      productId,
    },
  });
};

export const getWishlistService = async (userId: number) => {
  return prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: true,
          variants: true,
          category: true,
          brand: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const removeWishlistService = async (userId: number, productId: number) => {
  return prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};