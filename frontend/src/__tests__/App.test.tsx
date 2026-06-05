import { render, screen, waitFor } from "@testing-library/react";
import { LogApi } from "api/LogApi";
import { UnitsApi } from "api/UnitsApi";
import { WorkersApi } from "api/WorkersApi";
import App from "App";

const mockLogData = [
  { id: 1, date: "2026-06-05", work_type: "A", volume: 12.5, unit: "m3", worker_name: "ivanov" },
];

const mockWorkersData = [
  { id: 1, label: "Иванов И.И.", value: "ivanov" },
];

const mockUnitsData = [
  { id: 1, label: "м³", value: "m3" },
];

jest.mock("api/LogApi", () => ({
  LogApi: {
    getAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock("api/WorkersApi", () => ({
  WorkersApi: {
    getAll: jest.fn(),
  },
}));

jest.mock("api/UnitsApi", () => ({
  UnitsApi: {
    getAll: jest.fn(),
  },
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (LogApi.getAll as jest.Mock).mockResolvedValue(mockLogData);
    (WorkersApi.getAll as jest.Mock).mockResolvedValue(mockWorkersData);
    (UnitsApi.getAll as jest.Mock).mockResolvedValue(mockUnitsData);
  });

  it("shows loader initially", () => {
    (LogApi.getAll as jest.Mock).mockImplementation(() => new Promise(() => {}));
    (WorkersApi.getAll as jest.Mock).mockImplementation(() => new Promise(() => {}));
    (UnitsApi.getAll as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<App />);

    expect(screen.getByText("Журнал работ")).toBeInTheDocument();
  });

  it("renders main content after loading", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Добавить")).toBeInTheDocument();
    });
  });

  it("calls API on mount", async () => {
    render(<App />);

    await waitFor(() => expect(LogApi.getAll).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(WorkersApi.getAll).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(UnitsApi.getAll).toHaveBeenCalledTimes(1));
  });

  it("shows error notification when LogApi.getAll fails", async () => {
    (LogApi.getAll as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Ошибка загрузки данных")).toBeInTheDocument();
    });
  });

  it("shows error notification when WorkersApi.getAll fails", async () => {
    (WorkersApi.getAll as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Ошибка загрузки справочников")).toBeInTheDocument();
    });
  });
});
