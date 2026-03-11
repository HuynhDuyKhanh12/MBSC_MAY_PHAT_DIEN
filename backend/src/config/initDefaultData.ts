import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const initDefaultData = async () => {
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Administrator",
    },
  });

  await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: {
      name: "CUSTOMER",
      description: "Customer role",
    },
  });

  const adminEmail = "admin@gmail.com";
  const existedAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existedAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await prisma.user.create({
      data: {
        fullName: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        roleId: adminRole.id,
      },
    });
  }

  console.log("✅ Default data ready");
};