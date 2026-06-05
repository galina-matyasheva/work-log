import { render, screen } from "@testing-library/react";
import { FormField } from "components/common/formField/FormField";

describe("FormField", () => {
  it("renders children", () => {
    render(
      <FormField>
        <input />
      </FormField>,
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders error text when provided", () => {
    render(
      <FormField error="Обязательное поле">
        <input />
      </FormField>,
    );

    expect(screen.getByText("Обязательное поле")).toBeInTheDocument();
  });

  it("renders error span when no error", () => {
    render(
      <FormField>
        <input />
      </FormField>,
    );

    expect(screen.getByTestId("form-field-error")).toBeInTheDocument();
  });
});
