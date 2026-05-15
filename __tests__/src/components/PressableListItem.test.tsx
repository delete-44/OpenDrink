import PressableListItem from "@/src/components/PressableListItem";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("PressableListItem", () => {
  const mockOnPressItem = jest.fn();

  it("renders markup - button containing the item name", () => {
    render(
      <PressableListItem label="Sally" idx={5} onPressItem={mockOnPressItem} />,
    );

    const listButton = screen.getByRole("button", { name: "Select Sally" });

    expect(listButton).toBeVisible();
  });

  it("allows users to press the item", () => {
    render(
      <PressableListItem label="Sally" idx={5} onPressItem={mockOnPressItem} />,
    );

    const listButton = screen.getByRole("button", { name: "Select Sally" });
    fireEvent.press(listButton);

    expect(mockOnPressItem).toHaveBeenCalledWith(5);
  });
});
