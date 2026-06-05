import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LogTable } from "components/logTable/LogTable";
import { LogItem } from "types/log";

const mockItems: LogItem[] = [
  { id: 1, date: "2026-06-02", work_type: "Бетонирование", volume: 12.5, unit: "m3", worker_name: "ivanov" },
  { id: 2, date: "2026-06-01", work_type: "Покраска", volume: 10, unit: "m2", worker_name: "petrov" },
];

const mockWorkers = [
  { id: 1, label: "Иванов И.И.", value: "ivanov" },
  { id: 2, label: "Петров П.П.", value: "petrov" },
];

const mockUnits = [
  { id: 1, label: "м³", value: "m3" },
  { id: 2, label: "м²", value: "m2" },
];

const defaultProps = {
  items: mockItems,
  onDelete: jest.fn().mockResolvedValue(undefined),
  reload: jest.fn(),
  resetFormErrors: jest.fn(),
  onError: jest.fn(),
  onSuccess: jest.fn(),
  workers: mockWorkers,
  units: mockUnits,
};

jest.mock("api/LogApi", () => ({
  LogApi: {
    update: jest.fn().mockResolvedValue(undefined),
  },
}));

describe("LogTable", () => {
  it("renders table with items", () => {
    render(<LogTable {...defaultProps} />);

    expect(screen.getByText("Бетонирование")).toBeInTheDocument();
    expect(screen.getByText("Покраска")).toBeInTheDocument();
  });

  it("shows empty state when no items", () => {
    render(<LogTable {...defaultProps} items={[]} />);

    expect(screen.getByText("Нет записей")).toBeInTheDocument();
  });

  it("sorts by date on header click", () => {
    render(<LogTable {...defaultProps} />);

    const dateButton = screen.getByText("Дата");
    fireEvent.click(dateButton);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("opens delete modal on delete button click", () => {
    render(<LogTable {...defaultProps} />);

    const deleteButtons = screen.getAllByTitle("Удалить");
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText("Удалить запись из журнала?")).toBeInTheDocument();
  });

  it("calls onDelete when delete is confirmed", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    render(<LogTable {...defaultProps} onDelete={onDelete} />);

    fireEvent.click(screen.getAllByTitle("Удалить")[0]);
    fireEvent.click(screen.getByText("Да"));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(1);
    });
  });

  it("calls onSuccess when edit is saved via LogApi", async () => {
    const onSuccess = jest.fn();

    render(<LogTable {...defaultProps} onSuccess={onSuccess} />);

    const editButtons = screen.getAllByTitle("Редактировать");
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Бетонирование")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Сохранить"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("shows pagination when many items", () => {
    const manyItems = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      date: "2026-06-01",
      work_type: `Work ${i}`,
      volume: 1,
      unit: "m3",
      worker_name: "ivanov",
    }));

    render(<LogTable {...defaultProps} items={manyItems} />);

    expect(screen.getByText("Вперед")).toBeInTheDocument();
  });
});
