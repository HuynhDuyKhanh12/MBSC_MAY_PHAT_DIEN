import { prisma } from "../../config/prisma";

type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number | null;
};

type UpdateCategoryInput = {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: number | null;
};

export const createCategoryService = async (data: CreateCategoryInput) => {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      parentId:
        data.parentId !== undefined && data.parentId !== null
          ? Number(data.parentId)
          : null,
    },
    include: {
      parent: true,
      children: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
};

export const getCategoriesService = async () => {
  return prisma.category.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      parent: true,
      children: {
        where: {
          deletedAt: null,
        },
      },
      products: {
        where: {
          deletedAt: null,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCategoryByIdService = async (id: number) => {
  return prisma.category.findFirst({
    where: {
      id,
    },
    include: {
      parent: true,
      children: {
        where: {
          deletedAt: null,
        },
      },
      products: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
};

export const updateCategoryService = async (
  id: number,
  data: UpdateCategoryInput
) => {
  return prisma.category.update({
    where: {
      id,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.parentId !== undefined && {
        parentId: data.parentId !== null ? Number(data.parentId) : null,
      }),
    },
    include: {
      parent: true,
      children: {
        where: {
          deletedAt: null,
        },
      },
      products: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
};

export const deleteCategoryService = async (id: number) => {
  return prisma.category.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};