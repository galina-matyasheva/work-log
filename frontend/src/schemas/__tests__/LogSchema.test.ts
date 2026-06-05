import { editLogSchema,logSchema } from "schemas/LogSchema";

describe("logSchema", () => {
  const validData = {
    date: "2026-06-05",
    work_type: "Бетонирование",
    volume: "12.5",
    unit: "m3",
    worker_name: "ivanov",
  };

  it("passes with valid data", () => {
    const result = logSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when date is empty", () => {
    const result = logSchema.safeParse({ ...validData, date: "" });
    expect(result.success).toBe(false);
  });

  it("fails when work_type is empty", () => {
    const result = logSchema.safeParse({ ...validData, work_type: "" });
    expect(result.success).toBe(false);
  });

  it("fails when work_type exceeds 35 chars", () => {
    const result = logSchema.safeParse({ ...validData, work_type: "A".repeat(36) });
    expect(result.success).toBe(false);
  });

  it("fails when volume is empty", () => {
    const result = logSchema.safeParse({ ...validData, volume: "" });
    expect(result.success).toBe(false);
  });

  it("fails when volume exceeds 10 chars", () => {
    const result = logSchema.safeParse({ ...validData, volume: "1".repeat(11) });
    expect(result.success).toBe(false);
  });

  it("fails when volume has more than 2 decimal places", () => {
    const result = logSchema.safeParse({ ...validData, volume: "12.345" });
    expect(result.success).toBe(false);
  });

  it("fails when volume is 0", () => {
    const result = logSchema.safeParse({ ...validData, volume: "0" });
    expect(result.success).toBe(false);
  });

  it("fails when volume is negative", () => {
    const result = logSchema.safeParse({ ...validData, volume: "-5" });
    expect(result.success).toBe(false);
  });

  it("fails when unit is empty", () => {
    const result = logSchema.safeParse({ ...validData, unit: "" });
    expect(result.success).toBe(false);
  });

  it("fails when worker_name is empty", () => {
    const result = logSchema.safeParse({ ...validData, worker_name: "" });
    expect(result.success).toBe(false);
  });
});

describe("editLogSchema", () => {
  const validData = {
    id: 1,
    work_type: "Бетонирование",
    volume: "12.5",
    unit: "m3",
    worker_name: "ivanov",
  };

  it("passes with valid data", () => {
    const result = editLogSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when id is missing", () => {
    const { id, ...rest } = validData;
    const result = editLogSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("fails when volume is NaN", () => {
    const result = editLogSchema.safeParse({ ...validData, volume: "abc" });
    expect(result.success).toBe(false);
  });
});
