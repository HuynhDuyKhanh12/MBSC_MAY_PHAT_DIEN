import { prisma } from "../../config/prisma";

type CreateBrandInput = {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
};

type UpdateBrandInput = {
  name?: string;
  slug?: string;
  logo?: string;
  description?: string;
};

export const createBrandService = async (data: CreateBrandInput) => {
  return prisma.brand.create({
    data: {
      name: data.name,
      slug: data.slug,
      logo: data.logo,
      description: data.description,
    },
  });
};

export const getBrandsService = async () => {
  return prisma.brand.findMany({
    where: {
      deletedAt: null,
    },
    include: {
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

export const getBrandByIdService = async (id: number) => {
  return prisma.brand.findFirst({
    where: {
      id,
    },
    include: {
      products: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
};

export const updateBrandService = async (id: number, data: UpdateBrandInput) => {
  return prisma.brand.update({
    where: {
      id,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.logo !== undefined && { logo: data.logo }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });
};

export const deleteBrandService = async (id: number) => {
  return prisma.brand.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};