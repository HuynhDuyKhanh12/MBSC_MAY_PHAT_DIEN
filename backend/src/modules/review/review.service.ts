import { prisma } from "../../config/prisma";

export const createReviewService = async (userId: number, data: any) => {
  return prisma.review.upsert({
    where: {
      userId_productId: {
        userId,
        productId: data.productId,
      },
    },
    update: {
      rating: data.rating,
      comment: data.comment,
    },
    create: {
      userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
    },
  });
};

export const getReviewsByProductService = async (productId: number) => {
  return prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteReviewService = async (id: number) => {
  return prisma.review.delete({
    where: { id },
  });
};