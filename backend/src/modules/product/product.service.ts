import { prisma } from "../../config/prisma";

type VariantInput = {
  sku?: string;
  color?: string;
  size?: string;
  material?: string;
  price?: number;
  salePrice?: number;
  stock?: number;
  image?: string;
  attributesJson?: any;
};

type CreateProductInput = {
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  salePrice?: number;
  thumbnail?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  status?: "ACTIVE" | "INACTIVE";
  isFeatured?: boolean;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
  images?: string[];
  variants?: VariantInput[];
};

type UpdateProductInput = {
  name?: string;
  slug?: string;
  sku?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: number;
  brandId?: number;
  basePrice?: number;
  salePrice?: number;
  thumbnail?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  status?: "ACTIVE" | "INACTIVE";
  isFeatured?: boolean;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export const createProductService = async (data: CreateProductInput) => {
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
      isFeatured: data.isFeatured ?? false,
      tags: data.tags,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      images:
        data.images && Array.isArray(data.images) && data.images.length > 0
          ? {
              create: data.images.map((img: string, index: number) => ({
                imageUrl: img,
                isMain: index === 0,
                sortOrder: index,
              })),
            }
          : undefined,
      variants:
        data.variants && Array.isArray(data.variants) && data.variants.length > 0
          ? {
              create: data.variants
                .filter((variant: VariantInput) => variant.sku)
                .map((variant: VariantInput) => ({
                  sku: variant.sku!,
                  color: variant.color || "",
                  size: variant.size || "",
                  material: variant.material || "",
                  price: variant.price || 0,
                  salePrice: variant.salePrice || 0,
                  stock: variant.stock ?? 0,
                  image: variant.image || "",
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
  return prisma.product.findFirst({
    where: {
      id,
    },
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

export const updateProductService = async (
  id: number,
  data: UpdateProductInput
) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.shortDescription !== undefined && {
        shortDescription: data.shortDescription,
      }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.brandId !== undefined && { brandId: data.brandId }),
      ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
      ...(data.salePrice !== undefined && { salePrice: data.salePrice }),
      ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
      ...(data.weight !== undefined && { weight: data.weight }),
      ...(data.length !== undefined && { length: data.length }),
      ...(data.width !== undefined && { width: data.width }),
      ...(data.height !== undefined && { height: data.height }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.tags !== undefined && { tags: data.tags }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && {
        seoDescription: data.seoDescription,
      }),
    },
    include: {
      category: true,
      brand: true,
      images: true,
      variants: true,
    },
  });
};

export const deleteProductService = async (id: number) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      status: "INACTIVE",
    },
  });
};