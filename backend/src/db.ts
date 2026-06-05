import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "construction_journal",
  port: Number(process.env.DB_PORT) || 3306,
  charset: "utf8mb4",
  timezone: "+00:00",
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000,
  queueLimit: 0,
  dateStrings: true,
});
