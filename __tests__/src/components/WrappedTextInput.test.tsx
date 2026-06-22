import globalStyles from "@/assets/global-styles";
import StatusMessage from "@/src/components/StatusMessage";
import WrappedTextInput from "@/src/components/WrappedTextInput";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("WrappedTextInput", () => {
  const value = "Value <3";
  const label = "Test Label";
  const onChange = jest.fn();

  it("renders a semantic label & text input", () => {
    render(
      <WrappedTextInput
        label={label}
        value={value}
        onChange={onChange}
        statusMessage={null}
      />,
    );

    // Assert input is accessible by semantic label
    expect(screen.getByLabelText(label)).toBeVisible();

    // Assert value is set correctly
    expect(screen.getByDisplayValue(value)).toBeVisible();

    // Assert rest state is valid
    expect(screen.getByLabelText(label)).toHaveProp("aria-invalid", false);
    expect(screen.getByLabelText(label)).not.toHaveProp("aria-describedby");
  });

  it("renders a status message when one is provided", () => {
    render(
      <WrappedTextInput
        label={label}
        value={value}
        onChange={onChange}
        statusMessage={
          <StatusMessage
            type="success"
            message="Something went right :)"
            describes={label}
          />
        }
      />,
    );

    const statusMessage = screen.getByText("Something went right :)");

    expect(statusMessage).toBeVisible();
    expect(statusMessage).toHaveStyle(globalStyles.textSuccess);

    const input = screen.getByLabelText(label);
    expect(input).toHaveProp("aria-describedby", `${label}-status`);
  });

  it("flags as invalid when ariaInvalid prop provided", () => {
    render(
      <WrappedTextInput
        label={label}
        value={value}
        onChange={onChange}
        ariaInvalid
        statusMessage={null}
      />,
    );

    const input = screen.getByLabelText(label);

    expect(input).toBeVisible();
    expect(input).toHaveProp("aria-invalid", true);
  });

  it("responds to change callback", () => {
    render(
      <WrappedTextInput
        label={label}
        value={value}
        onChange={onChange}
        statusMessage={null}
      />,
    );

    const input = screen.getByLabelText(label);
    fireEvent.changeText(input, "Alice");

    expect(onChange).toHaveBeenCalledWith("Alice");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
