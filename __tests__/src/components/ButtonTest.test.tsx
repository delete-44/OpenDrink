import globalStyles from "@/assets/global-styles";
import Button from "@/src/components/Button";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

describe("Button", () => {
  const mockOnPress = jest.fn();

  it("renders markup - base button, with children", () => {
    render(
      <Button onPress={mockOnPress}>
        <Text>Test Button!</Text>
      </Button>,
    );

    expect(screen.getByText("Test Button!")).toBeVisible();
    expect(screen.getByRole("button")).toBeVisible();
  });

  it("calls onPress handler on press", () => {
    render(
      <Button onPress={mockOnPress}>
        <Text>Test Button!</Text>
      </Button>,
    );

    fireEvent.press(screen.getByRole("button"));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("defaults to default styling when no type provided", () => {
    render(
      <Button onPress={mockOnPress}>
        <Text>Test Button!</Text>
      </Button>,
    );

    const btn = screen.getByRole("button");

    expect(btn).toHaveStyle(globalStyles.button);
    expect(btn).not.toHaveStyle(globalStyles.buttonPressed);
  });

  it("provides plain styling when type=plain", () => {
    render(
      <Button onPress={mockOnPress} type="plain">
        <Text>Test Button!</Text>
      </Button>,
    );

    const btn = screen.getByRole("button");

    expect(btn).toHaveStyle(globalStyles.buttonPlain);
    expect(btn).not.toHaveStyle(globalStyles.buttonPressed);
  });

  it("provides highlight styling when type=highlight", () => {
    render(
      <Button onPress={mockOnPress} type="highlight">
        <Text>Test Button!</Text>
      </Button>,
    );

    const btn = screen.getByRole("button");

    expect(btn).toHaveStyle(globalStyles.buttonHighlight);
    expect(btn).not.toHaveStyle(globalStyles.buttonPressed);
  });

  it("provides danger styling when type=danger", () => {
    render(
      <Button onPress={mockOnPress} type="danger">
        <Text>Test Button!</Text>
      </Button>,
    );

    const btn = screen.getByRole("button");

    expect(btn).toHaveStyle(globalStyles.buttonDanger);
    expect(btn).not.toHaveStyle(globalStyles.buttonPressed);
  });

  it("scales button down when pressed", () => {
    render(
      <Button onPress={mockOnPress} testOnly_pressed>
        <Text>Test Button!</Text>
      </Button>,
    );

    const btn = screen.getByRole("button");

    expect(btn).toHaveStyle(globalStyles.button);
    expect(btn).toHaveStyle(globalStyles.buttonPressed);
  });
});
