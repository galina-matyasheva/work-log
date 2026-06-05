import { UnitsApi } from "api/UnitsApi";

const mockFetch = jest.spyOn(global, "fetch");

beforeEach(() => {
  mockFetch.mockReset();
});

describe("UnitsApi.getAll", () => {
  it("returns parsed JSON on success", async () => {
    const data = [{ id: 1, label: "м³", value: "m3" }];
    mockFetch.mockResolvedValue(new Response(JSON.stringify(data), { status: 200 }));

    const result = await UnitsApi.getAll();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:5000/units");
  });

  it("throws on error response", async () => {
    mockFetch.mockResolvedValue(new Response("Error", { status: 500 }));

    await expect(UnitsApi.getAll()).rejects.toThrow("Error");
  });
});
