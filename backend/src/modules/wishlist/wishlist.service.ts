import { prisma } from "../../config/prisma";

export const addToWishlistService = async (userId: number, productId: number) => {
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
  });
};

export const getWishlistService = async (userId: number) => {
  const items = await prisma.wishlist.findMany({
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

  const validItems = items.filter(
    (item) => item.product && item.product.deletedAt === null
  );

  return {
    totalItems: validItems.length,
    items: validItems,
  };
};

export const removeWishlistService = async (userId: number, productId: number) => {
  const existed = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!existed) {
    throw new Error("Wishlist item not found");
  }

  await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return {
    userId,
    productId,
    deleted: true,
  };
};