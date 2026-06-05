import { formatVolume } from "utils/formatVolume";

describe("formatVolume", () => {
  it("formats integer string", () => {
    expect(formatVolume("12")).toBe("12");
  });

  it("formats decimal string", () => {
    expect(formatVolume("12.5")).toBe("12.5");
  });

  it("removes trailing zeros after dot", () => {
    expect(formatVolume("12.00")).toBe("12");
  });

  it("formats number input", () => {
    expect(formatVolume(12.5)).toBe("12.5");
  });

  it("returns empty string for NaN", () => {
    expect(formatVolume("abc")).toBe("");
  });
});
