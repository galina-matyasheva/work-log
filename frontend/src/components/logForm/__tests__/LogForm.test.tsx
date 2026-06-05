import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LogForm } from "components/logForm/LogForm";
import { TEXTS } from "constants/texts";

const mockWorkers = [
  { id: 1, label: "Иванов И.И.", value: "ivanov" },
];
const mockUnits = [
  { id: 1, label: "м³", value: "m3" },
];

describe("LogForm", () => {
  it("renders all fields and button", () => {
    render(
      <LogForm onAdd={jest.fn()} resetErrorsKey={0} workers={mockWorkers} units={mockUnits} />,
    );

    expect(screen.getByPlaceholderText(TEXTS.form.placeholder.work)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(TEXTS.form.placeholder.volume)).toBeInTheDocument();
    expect(screen.getByText(TEXTS.form.addButton)).toBeInTheDocument();
  });

  it("calls onAdd when form is submitted with valid data", async () => {
    const onAdd = jest.fn().mockResolvedValue(undefined);
    render(
      <LogForm onAdd={onAdd} resetErrorsKey={0} workers={mockWorkers} units={mockUnits} />,
    );

    fireEvent.change(screen.getByTestId("date-input"), { target: { name: "date", value: "2026-06-05" } });
    fireEvent.change(screen.getByPlaceholderText(TEXTS.form.placeholder.work), { target: { name: "work_type", value: "Бетонирование" } });
    fireEvent.change(screen.getByPlaceholderText(TEXTS.form.placeholder.volume), { target: { name: "volume", value: "12.5" } });
    fireEvent.change(screen.getByDisplayValue("Единица"), { target: { name: "unit", value: "m3" } });
    fireEvent.change(screen.getByDisplayValue("Исполнитель"), { target: { name: "worker_name", value: "ivanov" } });

    fireEvent.click(screen.getByText(TEXTS.form.addButton));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          date: "2026-06-05",
          work_type: "Бетонирование",
          volume: "12.5",
        }),
      );
    });
  });

  it("shows validation errors for empty fields", async () => {
    render(
      <LogForm onAdd={jest.fn()} resetErrorsKey={0} workers={mockWorkers} units={mockUnits} />,
    );

    fireEvent.click(screen.getByText(TEXTS.form.addButton));

    await waitFor(() => {
      expect(screen.getByText(TEXTS.validation.date.min)).toBeInTheDocument();
    });
  });

  it("disables button while submitting", async () => {
    const onAdd = jest.fn().mockImplementation(() => new Promise(() => {}));
    render(
      <LogForm onAdd={onAdd} resetErrorsKey={0} workers={mockWorkers} units={mockUnits} />,
    );

    fireEvent.change(screen.getByTestId("date-input"), { target: { name: "date", value: "2026-06-05" } });
    fireEvent.change(screen.getByPlaceholderText(TEXTS.form.placeholder.work), { target: { name: "work_type", value: "Бетонирование" } });
    fireEvent.change(screen.getByPlaceholderText(TEXTS.form.placeholder.volume), { target: { name: "volume", value: "12.5" } });
    fireEvent.change(screen.getByDisplayValue("Единица"), { target: { name: "unit", value: "m3" } });
    fireEvent.change(screen.getByDisplayValue("Исполнитель"), { target: { name: "worker_name", value: "ivanov" } });

    fireEvent.click(screen.getByText(TEXTS.form.addButton));

    await waitFor(() => {
      expect(screen.getByText(TEXTS.form.addButton)).toBeDisabled();
    });
  });
});
