import { formatDate } from "utils/formatDate";

describe("formatDate", () => {
  it("formats YYYY-MM-DD to DD.MM.YYYY", () => {
    expect(formatDate("2026-06-05")).toBe("05.06.2026");
  });

  it("handles single-digit months and days", () => {
    expect(formatDate("2026-01-01")).toBe("01.01.2026");
  });

  it("returns empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });

  it("parses ISO string correctly", () => {
    expect(formatDate("2026-06-05T12:00:00.000Z")).toBe("05.06.2026");
  });
});
