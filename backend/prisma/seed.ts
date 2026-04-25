import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: "ADMIN", description: "Administrator" },
    { name: "SUPER_ADMIN", description: "Super administrator" },
    { name: "CUSTOMER", description: "Customer role" },
    { name: "TECHNICIAN", description: "Technician role" },
    { name: "STAFF", description: "Staff role" },
    { name: "MANAGER", description: "Manager role" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" },
  });

  const customerRole = await prisma.role.findUnique({
    where: { name: "CUSTOMER" },
  });

  if (!adminRole || !customerRole) {
    throw new Error("Không tìm thấy role ADMIN hoặc CUSTOMER");
  }

  const hashedAdminPassword = await bcrypt.hash("Admin@123", 10);
  const hashedCustomerPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      fullName: "Super Admin",
      email: "admin@gmail.com",
      password: hashedAdminPassword,
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
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

  console.log("Seed completed successfully");
  console.log("Admin: admin@gmail.com / Admin@123");
  console.log("Customer: customer@gmail.com / 123456");
  console.log("Roles: ADMIN, SUPER_ADMIN, CUSTOMER, TECHNICIAN, STAFF, MANAGER");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });