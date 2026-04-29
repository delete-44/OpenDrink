import { DANGER_COLOR } from "@/assets/style-constants";
import WrappedTextInput from "@/components/WrappedTextInput";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("WrappedTextInput", () => {
  const value = "Value <3";
  const label = "Test Label";
  const onChange = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders a semantic label & text input", () => {
    render(
      <WrappedTextInput
        label={label}
        value={value}
        errorMessage=""
        onChange={onChange}
      />,
    );

    // Assert input is accessible by semantic label
    expect(screen.getByLabelText("Test Label")).toBeVisible();

    // Assert value is set correctly
    expect(screen.getByDisplayValue(value)).toBeVisible();
  });

  it("renders an error message when one is provided", () => {
    render(
      <WrappedTextInput
        label={label}
        value={value}
        errorMessage="Something went wrong :("
        onChange={onChange}
      />,
    );

    const errorMessage = screen.getByText("Something went wrong :(");

    expect(errorMessage).toBeVisible();
    expect(errorMessage).toHaveStyle({ color: DANGER_COLOR });
  });

  it("responds to change callback", () => {
    render(
      <WrappedTextInput
        label={label}
        value={value}
        errorMessage=""
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText("Test Label");
    fireEvent.changeText(input, "Alice");

    expect(onChange).toHaveBeenCalledWith("Alice");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
