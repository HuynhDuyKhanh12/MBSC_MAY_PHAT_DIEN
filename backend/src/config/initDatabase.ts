import mysql from "mysql2/promise";
import { env } from "./env";

export const initDatabase = async () => {
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  await connection.end();

  console.log(`✅ Database "${env.DB_NAME}" is ready`);
};