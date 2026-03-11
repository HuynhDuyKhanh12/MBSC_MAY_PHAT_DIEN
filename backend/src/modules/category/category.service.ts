import { prisma } from "../../config/prisma";

export const createCategoryService = async (data: any) => {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      parentId: data.parentId || null,
    },
    include: {
      parent: true,
      children: true,
    },
  });
};

export const getCategoriesService = async () => {
  return prisma.category.findMany({
    where: { deletedAt: null },
    include: {
      parent: true,
      children: true,
      products: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getCategoryByIdService = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      products: {
        where: { deletedAt: null },
      },
    },
  });
};

export const updateCategoryService = async (id: number, data: any) => {
  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      parentId: data.parentId || null,
    },
  });
};

export const deleteCategoryService = async (id: number) => {
  return prisma.category.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};