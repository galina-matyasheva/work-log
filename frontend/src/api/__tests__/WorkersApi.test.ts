import { WorkersApi } from "api/WorkersApi";

const mockFetch = jest.spyOn(global, "fetch");

beforeEach(() => {
  mockFetch.mockReset();
});

describe("WorkersApi.getAll", () => {
  it("returns parsed JSON on success", async () => {
    const data = [{ id: 1, label: "Иванов И.И.", value: "ivanov" }];
    mockFetch.mockResolvedValue(new Response(JSON.stringify(data), { status: 200 }));

    const result = await WorkersApi.getAll();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:5000/workers");
  });

  it("throws on error response", async () => {
    mockFetch.mockResolvedValue(new Response("Error", { status: 500 }));

    await expect(WorkersApi.getAll()).rejects.toThrow("Error");
  });
});
