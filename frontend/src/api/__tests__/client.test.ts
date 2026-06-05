import { checkResponse } from "api/client";

describe("checkResponse", () => {
  it("returns response when ok", async () => {
    const res = new Response(null, { status: 200 });
    const result = await checkResponse(res);
    expect(result).toBe(res);
  });

  it("throws with error text when not ok", async () => {
    const res = new Response("Not found", { status: 404 });
    await expect(checkResponse(res)).rejects.toThrow("Not found");
  });

  it("throws with HTTP status when no body", async () => {
    const res = new Response(null, { status: 500 });
    await expect(checkResponse(res)).rejects.toThrow("HTTP 500");
  });

  it("throws with HTTP status when body read fails", async () => {
    const res = new Response(null, { status: 403 });
    jest.spyOn(res, "text").mockRejectedValue(new Error("body error"));
    await expect(checkResponse(res)).rejects.toThrow("HTTP 403");
  });
});
