import { render, screen } from "@testing-library/react";
import { ConfirmDeleteModal } from "components/modals/confirmDeleteModal/ConfirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  it("renders when open", () => {
    render(
      <ConfirmDeleteModal open={true} onConfirm={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(screen.getByText("Удалить запись из журнала?")).toBeInTheDocument();
    expect(screen.getByText("Да")).toBeInTheDocument();
    expect(screen.getByText("Нет")).toBeInTheDocument();
  });

  it("returns null when closed", () => {
    render(
      <ConfirmDeleteModal open={false} onConfirm={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(screen.queryByText("Удалить запись из журнала?")).not.toBeInTheDocument();
  });

  it("calls onConfirm on confirm button click", () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmDeleteModal open={true} onConfirm={onConfirm} onCancel={jest.fn()} />,
    );

    screen.getByText("Да").click();

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel on cancel button click", () => {
    const onCancel = jest.fn();
    render(
      <ConfirmDeleteModal open={true} onConfirm={jest.fn()} onCancel={onCancel} />,
    );

    screen.getByText("Нет").click();

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables confirm button when disabled prop is true", () => {
    render(
      <ConfirmDeleteModal open={true} disabled={true} onConfirm={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(screen.getByText("Да")).toBeDisabled();
  });
});
