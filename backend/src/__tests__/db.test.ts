jest.mock("mysql2/promise", () => ({
  createPool: jest.fn(() => ({ query: jest.fn() })),
}));

import mysql from "mysql2/promise";
import "../db";

it("creates pool with correct config", () => {
  expect(mysql.createPool).toHaveBeenCalledWith(
    expect.objectContaining({
      host: "localhost",
      user: "appuser",
      database: "construction_journal",
      port: 3306,
      charset: "utf8mb4",
      timezone: "+00:00",
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 10000,
      queueLimit: 0,
    }),
  );
});
