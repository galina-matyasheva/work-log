import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EditLogModal } from "components/modals/editLogModal/EditLogModal";

const mockItem = {
  id: 1,
  date: "2026-06-05",
  work_type: "Бетонирование",
  volume: 12.5,
  unit: "m3",
  worker_name: "ivanov",
};

const mockWorkers = [{ id: 1, label: "Иванов И.И.", value: "ivanov" }];
const mockUnits = [{ id: 1, label: "м³", value: "m3" }];

describe("EditLogModal", () => {
  it("renders with item data pre-filled", () => {
    render(
      <EditLogModal
        item={mockItem}
        onClose={jest.fn()}
        onSave={jest.fn()}
        workers={mockWorkers}
        units={mockUnits}
      />,
    );

    expect(screen.getByDisplayValue("Бетонирование")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12.5")).toBeInTheDocument();
  });

  it("calls onSave with form data on save click", async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);

    render(
      <EditLogModal
        item={mockItem}
        onClose={jest.fn()}
        onSave={onSave}
        workers={mockWorkers}
        units={mockUnits}
      />,
    );

    fireEvent.click(screen.getByText("Сохранить"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          work_type: "Бетонирование",
          volume: 12.5,
        }),
      );
    });
  });

  it("calls onClose on close button click", () => {
    const onClose = jest.fn();
    render(
      <EditLogModal
        item={mockItem}
        onClose={onClose}
        onSave={jest.fn()}
        workers={mockWorkers}
        units={mockUnits}
      />,
    );

    fireEvent.click(screen.getByText("Отмена"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("disables buttons while submitting", async () => {
    const onSave = jest.fn().mockImplementation(() => new Promise(() => {}));

    render(
      <EditLogModal
        item={mockItem}
        onClose={jest.fn()}
        onSave={onSave}
        workers={mockWorkers}
        units={mockUnits}
      />,
    );

    fireEvent.click(screen.getByText("Сохранить"));

    await waitFor(() => expect(screen.getByText("Сохранить")).toBeDisabled());
    await waitFor(() => expect(screen.getByText("Отмена")).toBeDisabled());
  });

  it("shows validation errors for empty fields", async () => {
    render(
      <EditLogModal
        item={{ ...mockItem, work_type: "" }}
        onClose={jest.fn()}
        onSave={jest.fn()}
        workers={mockWorkers}
        units={mockUnits}
      />,
    );

    fireEvent.click(screen.getByText("Сохранить"));

    await waitFor(() => {
      expect(screen.getByText("Укажите тип работы")).toBeInTheDocument();
    });
  });
});
