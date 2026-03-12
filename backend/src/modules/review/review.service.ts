import { prisma } from "../../config/prisma";

export const createReviewService = async (
  userId: number,
  data: {
    productId: number;
    rating: number;
    comment?: string | null;
  }
) => {
  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      deletedAt: null,
      status: "ACTIVE",
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const review = await prisma.review.upsert({
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
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          thumbnail: true,
        },
      },
    },
  });

  return review;
};

export const getReviewsByProductService = async (productId: number) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      thumbnail: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const reviews = await prisma.review.findMany({
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

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number(
          (
            reviews.reduce((sum, item) => sum + Number(item.rating), 0) /
            totalReviews
          ).toFixed(1)
        )
      : 0;

  const ratingBreakdown = {
    1: reviews.filter((r) => Number(r.rating) === 1).length,
    2: reviews.filter((r) => Number(r.rating) === 2).length,
    3: reviews.filter((r) => Number(r.rating) === 3).length,
    4: reviews.filter((r) => Number(r.rating) === 4).length,
    5: reviews.filter((r) => Number(r.rating) === 5).length,
  };

  return {
    product,
    averageRating,
    totalReviews,
    ratingBreakdown,
    reviews,
  };
};

export const deleteReviewService = async (id: number) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return prisma.review.delete({
    where: { id },
  });
};