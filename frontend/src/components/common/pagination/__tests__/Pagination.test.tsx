import { render, screen } from "@testing-library/react";
import { Pagination } from "components/common/pagination/Pagination";

describe("Pagination", () => {
  it("renders page numbers", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  it("disables back button on first page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByText("Назад")).toBeDisabled();
    expect(screen.getByText("Вперед")).not.toBeDisabled();
  });

  it("disables forward button on last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByText("Вперед")).toBeDisabled();
    expect(screen.getByText("Назад")).not.toBeDisabled();
  });

  it("calls onPageChange with decreased page on back click", () => {
    const onChange = jest.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onChange} />);

    screen.getByText("Назад").click();

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with increased page on forward click", () => {
    const onChange = jest.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onChange} />);

    screen.getByText("Вперед").click();

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("does not call onPageChange when on first page and back clicked", () => {
    const onChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onChange} />);

    screen.getByText("Назад").click();

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not call onPageChange when on last page and forward clicked", () => {
    const onChange = jest.fn();
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onChange} />);

    screen.getByText("Вперед").click();

    expect(onChange).not.toHaveBeenCalled();
  });
});
