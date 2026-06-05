const mockQuery = jest.fn();

jest.mock("mysql2/promise", () => ({
  createPool: jest.fn(() => ({ query: mockQuery })),
}));

jest.mock("dotenv/config", () => ({}));

import request from "supertest";
import app, { loadReferences, setAllowedReferences } from "../app";

beforeEach(() => {
  jest.clearAllMocks();
  setAllowedReferences(["m3", "m2", "pcs"], ["ivanov", "petrov"]);
});

describe("GET /health", () => {
  it("returns 200 when DB is reachable", async () => {
    mockQuery.mockResolvedValue([[{ 1: 1 }], {}]);

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns 503 when DB query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB down"));

    const res = await request(app).get("/health");

    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: "error" });
  });
});

describe("GET /log", () => {
  it("returns entries sorted by date DESC", async () => {
    const rows = [
      { id: 2, date: "2026-06-02", work_type: "A", volume: 1, unit: "m3", worker_name: "ivanov" },
      { id: 1, date: "2026-06-01", work_type: "B", volume: 2, unit: "m2", worker_name: "petrov" },
    ];
    mockQuery.mockResolvedValue([rows, {}]);

    const res = await request(app).get("/log");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(rows);
    expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM journal_entries ORDER BY date DESC");
  });

  it("returns 500 on DB error", async () => {
    mockQuery.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/log");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("POST /log", () => {
  const validBody = {
    date: "2026-06-05",
    work_type: "Бетонирование",
    volume: "12.5",
    unit: "m3",
    worker_name: "ivanov",
  };

  it("creates entry with valid data", async () => {
    mockQuery.mockResolvedValue([{ affectedRows: 1 }, {}]);

    const res = await request(app).post("/log").send(validBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO journal_entries"),
      ["2026-06-05", "Бетонирование", 12.5, "m3", "ivanov"],
    );
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/log").send({ date: "2026-06-05" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing fields" });
  });

  it("returns 400 when work_type is too long", async () => {
    const res = await request(app)
      .post("/log")
      .send({ ...validBody, work_type: "A".repeat(36) });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid work_type" });
  });

  it("returns 400 when volume is NaN", async () => {
    const res = await request(app)
      .post("/log")
      .send({ ...validBody, volume: "abc" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid volume" });
  });

  it("returns 400 when volume is 0", async () => {
    const res = await request(app)
      .post("/log")
      .send({ ...validBody, volume: "0" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid volume" });
  });

  it("returns 400 when volume is negative", async () => {
    const res = await request(app)
      .post("/log")
      .send({ ...validBody, volume: "-5" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid volume" });
  });

  it("returns 400 when volume exceeds max", async () => {
    const res = await request(app)
      .post("/log")
      .send({ ...validBody, volume: "10000000" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid volume" });
  });

  it("returns 400 when unit is not in allowed list", async () => {
    const res = await request(app)
      .post("/log")
      .send({ ...validBody, unit: "km" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid unit" });
  });

  it("returns 400 when worker_name is not in allowed list", async () => {
    const res = await request(app)
      .post("/log")
      .send({ ...validBody, worker_name: "unknown" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid worker_name" });
  });

  it("returns 500 on DB error", async () => {
    mockQuery.mockRejectedValue(new Error("DB error"));

    const res = await request(app).post("/log").send(validBody);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("DELETE /log/:id", () => {
  it("deletes and returns 200", async () => {
    mockQuery.mockResolvedValue([{ affectedRows: 1 }, {}]);

    const res = await request(app).delete("/log/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM journal_entries WHERE id = ?",
      [1],
    );
  });

  it("returns 404 when entry not found", async () => {
    mockQuery.mockResolvedValue([{ affectedRows: 0 }, {}]);

    const res = await request(app).delete("/log/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Запись не найдена" });
  });

  it("returns 400 when id is not a number", async () => {
    const res = await request(app).delete("/log/abc");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid id" });
  });

  it("returns 400 when id is 0", async () => {
    const res = await request(app).delete("/log/0");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid id" });
  });

  it("returns 400 when id is negative", async () => {
    const res = await request(app).delete("/log/-1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid id" });
  });

  it("returns 500 on DB error", async () => {
    mockQuery.mockRejectedValue(new Error("DB error"));

    const res = await request(app).delete("/log/1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("PATCH /log/:id", () => {
  const validUpdate = { work_type: "Штукатурка", volume: "15.5", unit: "m2", worker_name: "petrov" };

  it("updates and returns 200", async () => {
    mockQuery.mockResolvedValue([{ affectedRows: 1 }, {}]);

    const res = await request(app).patch("/log/1").send(validUpdate);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it("returns 400 when id is not a number", async () => {
    const res = await request(app).patch("/log/abc").send(validUpdate);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid id" });
  });

  it("returns 400 when id is 0", async () => {
    const res = await request(app).patch("/log/0").send(validUpdate);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid id" });
  });

  it("returns 400 when work_type is too long", async () => {
    const res = await request(app)
      .patch("/log/1")
      .send({ work_type: "A".repeat(36) });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid work_type" });
  });

  it("returns 400 when volume is NaN", async () => {
    const res = await request(app)
      .patch("/log/1")
      .send({ volume: "abc" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid volume" });
  });

  it("returns 400 when unit is not allowed", async () => {
    const res = await request(app)
      .patch("/log/1")
      .send({ unit: "km" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid unit" });
  });

  it("returns 400 when worker_name is not allowed", async () => {
    const res = await request(app)
      .patch("/log/1")
      .send({ worker_name: "unknown" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid worker_name" });
  });

  it("returns 400 when no valid fields provided", async () => {
    const res = await request(app)
      .patch("/log/1")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "No valid fields to update" });
  });

  it("returns 404 when entry not found", async () => {
    mockQuery.mockResolvedValue([{ affectedRows: 0 }, {}]);

    const res = await request(app).patch("/log/999").send({ work_type: "A" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Запись не найдена" });
  });

  it("returns 500 on DB error", async () => {
    mockQuery.mockRejectedValue(new Error("DB error"));

    const res = await request(app).patch("/log/1").send(validUpdate);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("GET /workers", () => {
  it("returns workers from DB", async () => {
    const workers = [{ id: 1, label: "Иванов И.И.", value: "ivanov" }];
    mockQuery.mockResolvedValue([workers, {}]);

    const res = await request(app).get("/workers");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(workers);
  });

  it("returns 500 on DB error", async () => {
    mockQuery.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/workers");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("GET /units", () => {
  it("returns units from DB", async () => {
    const units = [{ id: 1, label: "м³", value: "m3" }];
    mockQuery.mockResolvedValue([units, {}]);

    const res = await request(app).get("/units");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(units);
  });

  it("returns 500 on DB error", async () => {
    mockQuery.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/units");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});

describe("loadReferences", () => {
  it("loads units and workers from DB", async () => {
    const unitRows = [{ value: "m3" }, { value: "m2" }];
    const workerRows = [{ value: "ivanov" }, { value: "petrov" }];
    mockQuery
      .mockResolvedValueOnce([unitRows, {}])
      .mockResolvedValueOnce([workerRows, {}]);

    await loadReferences();

    expect(mockQuery).toHaveBeenNthCalledWith(1, "SELECT value FROM units");
    expect(mockQuery).toHaveBeenNthCalledWith(2, "SELECT value FROM workers");
  });

  it("retries on failure", async () => {
    mockQuery.mockRejectedValue(new Error("DB not ready"));

    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);

    await loadReferences();

    expect(mockQuery).toHaveBeenCalledTimes(3);
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });
});


