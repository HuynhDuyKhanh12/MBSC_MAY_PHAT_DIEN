import { execSync } from "child_process";

export const initPrismaSchema = async () => {
  try {
    execSync("npx prisma db push", { stdio: "inherit" });
    console.log("✅ Prisma schema synced");
  } catch (error) {
    console.error("❌ Prisma db push failed");
    throw error;
  }
};