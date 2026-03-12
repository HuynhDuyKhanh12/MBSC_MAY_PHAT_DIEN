import app from "./app";
import { env } from "./config/env";
import { initDatabase } from "./config/initDatabase";
import { initPrismaSchema } from "./config/initPrisma";
import { initDefaultData } from "./config/initDefaultData";

const startServer = async () => {
  try {
    await initDatabase();
    await initPrismaSchema();
    await initDefaultData();

    app.listen(env.PORT, () => {
      console.log(`✅ Server running at http://localhost:${env.PORT}`);
      console.log(`✅ Swagger at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();