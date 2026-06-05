import { act,render, screen } from "@testing-library/react";
import { Notification } from "components/common/notification/Notification";

describe("Notification", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders success message", () => {
    render(<Notification type="success" message="Успех" onClose={jest.fn()} />);

    expect(screen.getByText("Успех")).toBeInTheDocument();
    expect(screen.getByText("Успех")).toHaveClass("notification--success");
  });

  it("renders error message", () => {
    render(<Notification type="error" message="Ошибка" onClose={jest.fn()} />);

    expect(screen.getByText("Ошибка")).toBeInTheDocument();
    expect(screen.getByText("Ошибка")).toHaveClass("notification--error");
  });

  it("calls onClose after 4 seconds", () => {
    const onClose = jest.fn();
    render(<Notification type="success" message="Успех" onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on click", () => {
    const onClose = jest.fn();
    render(<Notification type="success" message="Успех" onClose={onClose} />);

    screen.getByText("Успех").click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
