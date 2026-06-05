import { render, screen } from "@testing-library/react";
import { Loader } from "components/common/loader/Loader";

describe("Loader", () => {
  it("renders spinner", () => {
    render(<Loader />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("uses default size", () => {
    render(<Loader />);

    const spinner = screen.getByTestId("spinner");
    expect(spinner.style.width).toBe("40px");
    expect(spinner.style.height).toBe("40px");
  });
});
