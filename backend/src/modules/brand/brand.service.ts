import { prisma } from "../../config/prisma";

export const createBrandService = async (data: any) => {
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
    where: { deletedAt: null },
    include: {
      products: {
        where: { deletedAt: null },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getBrandByIdService = async (id: number) => {
  return prisma.brand.findUnique({
    where: { id },
    include: {
      products: {
        where: { deletedAt: null },
      },
    },
  });
};

export const updateBrandService = async (id: number, data: any) => {
  return prisma.brand.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      logo: data.logo,
      description: data.description,
    },
  });
};

export const deleteBrandService = async (id: number) => {
  return prisma.brand.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};