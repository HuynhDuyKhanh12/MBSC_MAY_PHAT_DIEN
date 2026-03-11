import { prisma } from "../../config/prisma";

export const createProductService = async (data: any) => {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      shortDescription: data.shortDescription,
      description: data.description,
      categoryId: data.categoryId,
      brandId: data.brandId,
      basePrice: data.basePrice,
      salePrice: data.salePrice,
      thumbnail: data.thumbnail,
      weight: data.weight,
      length: data.length,
      width: data.width,
      height: data.height,
      status: data.status || "ACTIVE",
      isFeatured: data.isFeatured || false,
      tags: data.tags,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      images: data.images
        ? {
            create: data.images.map((img: string, index: number) => ({
              imageUrl: img,
              isMain: index === 0,
              sortOrder: index,
            })),
          }
        : undefined,
      variants: data.variants
        ? {
            create: data.variants.map((variant: any) => ({
              sku: variant.sku,
              color: variant.color,
              size: variant.size,
              material: variant.material,
              price: variant.price,
              salePrice: variant.salePrice,
              stock: variant.stock || 0,
              image: variant.image,
              attributesJson: variant.attributesJson
                ? JSON.stringify(variant.attributesJson)
                : null,
            })),
          }
        : undefined,
    },
    include: {
      category: true,
      brand: true,
      images: true,
      variants: true,
    },
  });
};

export const getProductsService = async () => {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      category: true,
      brand: true,
      images: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductByIdService = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      images: true,
      variants: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
};

export const updateProductService = async (id: number, data: any) => {
  return prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      shortDescription: data.shortDescription,
      description: data.description,
      categoryId: data.categoryId,
      brandId: data.brandId,
      basePrice: data.basePrice,
      salePrice: data.salePrice,
      thumbnail: data.thumbnail,
      weight: data.weight,
      length: data.length,
      width: data.width,
      height: data.height,
      status: data.status,
      isFeatured: data.isFeatured,
      tags: data.tags,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
    },
  });
};

export const deleteProductService = async (id: number) => {
  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: "INACTIVE",
    },
  });
};