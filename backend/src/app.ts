import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import type mysql from "mysql2";
import { db } from "./db";

export let allowedUnits: string[] = [];
export let allowedWorkers: string[] = [];

export const loadReferences = async () => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const [unitRows] = (await db.query(
        "SELECT value FROM units",
      ));
      const [workerRows] = (await db.query(
        "SELECT value FROM workers",
      ));
      allowedUnits = (unitRows as Array<{ value: string }>).map((r) => r.value);
      allowedWorkers = (workerRows as Array<{ value: string }>).map((r) => r.value);
      return;
    } catch {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  console.error("Failed to load reference data from database");
  process.exit(1);
};

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "10kb" }));

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await db.query("SELECT 1");
    return res.json({ status: "ok" });
  } catch {
    return res.status(503).json({ status: "error" });
  }
});

app.get("/log", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM journal_entries ORDER BY date DESC",
    );

    return res.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/log", async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const { date, work_type, volume, unit, worker_name } = req.body;

    if (!date || !work_type || volume === undefined || !unit || !worker_name) {
      return res.status(400).json({ error: "Missing fields" });
    }
    if (typeof work_type !== "string" || work_type.length > 35) {
      return res.status(400).json({ error: "Invalid work_type" });
    }
    const volumeNum = Number(volume);
    if (isNaN(volumeNum) || volumeNum <= 0 || volumeNum > 9999999.99) {
      return res.status(400).json({ error: "Invalid volume" });
    }
    if (!allowedUnits.includes(unit)) {
      return res.status(400).json({ error: "Invalid unit" });
    }
    if (!allowedWorkers.includes(worker_name)) {
      return res.status(400).json({ error: "Invalid worker_name" });
    }

    await db.query(
      `INSERT INTO journal_entries (date, work_type, volume, unit, worker_name)
       VALUES (?, ?, ?, ?, ?)`,
      [date, work_type, volumeNum, unit, worker_name],
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/log/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const result = (await db.query(
      "DELETE FROM journal_entries WHERE id = ?", [idNum],
    ))[0] as mysql.ResultSetHeader;

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const ALLOWED_UPDATE_FIELDS = ["work_type", "volume", "unit", "worker_name"] as const;

app.patch("/log/:id", async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const { id } = req.params;

    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const fields: Record<string, unknown> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (req.body[key] !== undefined) {
        if (key === "work_type") {
          if (typeof req.body[key] !== "string" || req.body[key].length > 35) {
            return res.status(400).json({ error: "Invalid work_type" });
          }
        }
        if (key === "volume") {
          const volumeNum = Number(req.body[key]);
          if (isNaN(volumeNum) || volumeNum <= 0 || volumeNum > 9999999.99) {
            return res.status(400).json({ error: "Invalid volume" });
          }
          fields[key] = volumeNum;
          continue;
        }
        if (key === "unit") {
          if (!allowedUnits.includes(req.body[key])) {
            return res.status(400).json({ error: "Invalid unit" });
          }
        }
        if (key === "worker_name") {
          if (typeof req.body[key] !== "string" || !allowedWorkers.includes(req.body[key])) {
            return res.status(400).json({ error: "Invalid worker_name" });
          }
        }
        fields[key] = req.body[key];
      }
    }

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const result = (await db.query(
      `UPDATE journal_entries SET ? WHERE id=?`, [fields, idNum],
    ))[0] as mysql.ResultSetHeader;

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/workers", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM workers");
    return res.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/units", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM units");
    return res.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export function setAllowedReferences(units: string[], workers: string[]) {
  allowedUnits = units;
  allowedWorkers = workers;
}

export default app;
