import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Administrator" },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER", description: "Customer role" },
  });

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      fullName: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  const cat1 = await prisma.category.upsert({
    where: { slug: "may-phat-dien" },
    update: {},
    create: {
      name: "Máy phát điện",
      slug: "may-phat-dien",
      description: "Danh mục máy phát điện",
      image: "https://example.com/category-may-phat-dien.jpg",
    },
  });

  const cat2 = await prisma.category.upsert({
    where: { slug: "phu-kien" },
    update: {},
    create: {
      name: "Phụ kiện",
      slug: "phu-kien",
      description: "Danh mục phụ kiện",
      image: "https://example.com/category-phu-kien.jpg",
    },
  });

  const brand1 = await prisma.brand.upsert({
    where: { slug: "honda" },
    update: {},
    create: {
      name: "Honda",
      slug: "honda",
      logo: "https://example.com/honda-logo.png",
      description: "Thương hiệu Honda",
    },
  });

  const brand2 = await prisma.brand.upsert({
    where: { slug: "yamaha" },
    update: {},
    create: {
      name: "Yamaha",
      slug: "yamaha",
      logo: "https://example.com/yamaha-logo.png",
      description: "Thương hiệu Yamaha",
    },
  });

  const product1 = await prisma.product.upsert({
    where: { slug: "may-phat-dien-honda-10kva" },
    update: {},
    create: {
      name: "Máy phát điện Honda 10KVA",
      slug: "may-phat-dien-honda-10kva",
      sku: "HONDA-10KVA",
      shortDescription: "Máy phát điện công suất 10KVA",
      description: "Sản phẩm máy phát điện Honda 10KVA chất lượng cao",
      categoryId: cat1.id,
      brandId: brand1.id,
      basePrice: 35000000,
      salePrice: 32000000,
      thumbnail: "https://example.com/honda-10kva.jpg",
      status: "ACTIVE",
      isFeatured: true,
      tags: "honda,10kva,máy phát điện",
      seoTitle: "Máy phát điện Honda 10KVA",
      seoDescription: "Máy phát điện Honda 10KVA giá tốt",
      images: {
        create: [
          {
            imageUrl: "https://example.com/honda-10kva-1.jpg",
            isMain: true,
            sortOrder: 0,
          },
          {
            imageUrl: "https://example.com/honda-10kva-2.jpg",
            isMain: false,
            sortOrder: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "HONDA-10KVA-RED",
            color: "Đỏ",
            size: "Tiêu chuẩn",
            material: "Kim loại",
            price: 35000000,
            salePrice: 32000000,
            stock: 10,
            image: "https://example.com/honda-10kva-red.jpg",
          },
        ],
      },
    },
  });

  const product2 = await prisma.product.upsert({
    where: { slug: "phu-kien-loc-gio" },
    update: {},
    create: {
      name: "Phụ kiện lọc gió",
      slug: "phu-kien-loc-gio",
      sku: "PK-LOC-GIO",
      shortDescription: "Lọc gió cho máy phát điện",
      description: "Phụ kiện lọc gió chính hãng",
      categoryId: cat2.id,
      brandId: brand2.id,
      basePrice: 500000,
      salePrice: 450000,
      thumbnail: "https://example.com/loc-gio.jpg",
      status: "ACTIVE",
      tags: "phụ kiện,lọc gió",
      seoTitle: "Phụ kiện lọc gió",
      seoDescription: "Lọc gió máy phát điện giá tốt",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@gmail.com" },
    update: {},
    create: {
      fullName: "Nguyen Van A",
      email: "customer@gmail.com",
      phone: "0909123456",
      password: await bcrypt.hash("123456", 10),
      roleId: customerRole.id,
    },
  });

  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "Nguyen Van A",
      phone: "0909123456",
      province: "TP.HCM",
      district: "Quận 1",
      ward: "Bến Nghé",
      detailAddress: "123 Nguyễn Huệ",
      postalCode: "700000",
      isDefault: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "GIAM10" },
    update: {},
    create: {
      code: "GIAM10",
      description: "Giảm 10 phần trăm",
      discountType: "PERCENT",
      discountValue: 10,
      minOrderValue: 1000000,
      maxDiscountValue: 500000,
      usageLimit: 100,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      isActive: true,
    },
  });

  await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            unitPrice: 32000000,
          },
          {
            productId: product2.id,
            quantity: 2,
            unitPrice: 450000,
          },
        ],
      },
    },
  });

  await prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId: customer.id,
        productId: product1.id,
      },
    },
    update: {},
    create: {
      userId: customer.id,
      productId: product1.id,
    },
  });

  await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: customer.id,
        productId: product1.id,
      },
    },
    update: {},
    create: {
      userId: customer.id,
      productId: product1.id,
      rating: 5,
      comment: "Sản phẩm rất tốt, chạy ổn định",
    },
  });

  console.log("Seed completed successfully");
  console.log("Admin: admin@gmail.com / Admin@123");
  console.log("Customer: customer@gmail.com / 123456");
  console.log("Default address created:", address.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });