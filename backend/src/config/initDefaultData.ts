import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const initDefaultData = async () => {
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: { name: "SUPER_ADMIN", description: "Super Administrator" },
  });

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

  const technicianRole = await prisma.role.upsert({
    where: { name: "TECHNICIAN" },
    update: {},
    create: {
      name: "TECHNICIAN",
      description: "Nhân viên bảo quản / sửa chữa",
    },
  });

  const webManagerRole = await prisma.role.upsert({
    where: { name: "WEB_MANAGER" },
    update: {},
    create: {
      name: "WEB_MANAGER",
      description: "Nhân viên quản lý website",
    },
  });

  const hashedSuperAdminPassword = await bcrypt.hash("SuperAdmin@123", 10);
  const hashedAdminPassword = await bcrypt.hash("Admin@123", 10);
  const hashedTechPassword = await bcrypt.hash("Tech@123", 10);
  const hashedWebPassword = await bcrypt.hash("Web@123", 10);
  const hashedCustomerPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "superadmin@gmail.com" },
    update: {},
    create: {
      fullName: "Super Admin",
      email: "superadmin@gmail.com",
      password: hashedSuperAdminPassword,
      roleId: superAdminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      fullName: "Admin",
      email: "admin@gmail.com",
      password: hashedAdminPassword,
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "tech@gmail.com" },
    update: {},
    create: {
      fullName: "Nhân viên kỹ thuật",
      email: "tech@gmail.com",
      phone: "0909000001",
      password: hashedTechPassword,
      roleId: technicianRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "webmanager@gmail.com" },
    update: {},
    create: {
      fullName: "Nhân viên quản lý website",
      email: "webmanager@gmail.com",
      phone: "0909000002",
      password: hashedWebPassword,
      roleId: webManagerRole.id,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@gmail.com" },
    update: {},
    create: {
      fullName: "Nguyen Van A",
      email: "customer@gmail.com",
      phone: "0909123456",
      password: hashedCustomerPassword,
      roleId: customerRole.id,
    },
  });

  await prisma.address.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
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

  console.log("✅ Init default roles/users completed");
  console.log("SUPER_ADMIN: superadmin@gmail.com / SuperAdmin@123");
  console.log("ADMIN: admin@gmail.com / Admin@123");
  console.log("TECHNICIAN: tech@gmail.com / Tech@123");
  console.log("WEB_MANAGER: webmanager@gmail.com / Web@123");
  console.log("CUSTOMER: customer@gmail.com / 123456");
};