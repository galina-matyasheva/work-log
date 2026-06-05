import { LogApi } from "api/LogApi";

const mockFetch = jest.spyOn(global, "fetch");

beforeEach(() => {
  mockFetch.mockReset();
});

describe("LogApi.getAll", () => {
  it("returns parsed JSON on success", async () => {
    const data = [{ id: 1, date: "2026-06-05", work_type: "A", volume: 1, unit: "m3", worker_name: "ivanov" }];
    mockFetch.mockResolvedValue(new Response(JSON.stringify(data), { status: 200 }));

    const result = await LogApi.getAll();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:5000/log");
  });

  it("throws on error response", async () => {
    mockFetch.mockResolvedValue(new Response("Server error", { status: 500 }));

    await expect(LogApi.getAll()).rejects.toThrow("Server error");
  });
});

describe("LogApi.create", () => {
  const payload = { date: "2026-06-05", work_type: "A", volume: "12.5", unit: "m3", worker_name: "ivanov" };

  it("sends POST with JSON body", async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    await LogApi.create(payload);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:5000/log",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  });

  it("throws on error response", async () => {
    mockFetch.mockResolvedValue(new Response("Error", { status: 400 }));

    await expect(LogApi.create(payload)).rejects.toThrow("Error");
  });
});

describe("LogApi.remove", () => {
  it("sends DELETE with id in URL", async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

    await LogApi.remove(5);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:5000/log/5",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("throws on error response", async () => {
    mockFetch.mockResolvedValue(new Response("Not found", { status: 404 }));

    await expect(LogApi.remove(999)).rejects.toThrow("Not found");
  });
});

describe("LogApi.update", () => {
  const payload = { work_type: "B", volume: 10, unit: "m2", worker_name: "petrov" };

  it("sends PATCH with JSON body", async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

    await LogApi.update(1, payload);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:5000/log/1",
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  });

  it("throws on error response", async () => {
    mockFetch.mockResolvedValue(new Response("Error", { status: 400 }));

    await expect(LogApi.update(1, payload)).rejects.toThrow("Error");
  });
});
