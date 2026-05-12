import RemovableListItem from "@/components/RemovableListItem";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("RemovableListItem", () => {
  const mockRemoveItemAt = jest.fn();

  it("renders markup - player name and a remove button", () => {
    render(
      <RemovableListItem
        label="Sally"
        idx={5}
        removeItemAt={mockRemoveItemAt}
      />,
    );

    const name = screen.getByText("Sally");
    const removeButton = screen.getByRole("button", { name: "Remove Sally" });

    expect(name).toBeVisible();
    expect(removeButton).toBeVisible();
  });

  it("allows users to remove the item", () => {
    render(
      <RemovableListItem
        label="Sally"
        idx={5}
        removeItemAt={mockRemoveItemAt}
      />,
    );

    const removeButton = screen.getByRole("button", { name: "Remove Sally" });
    fireEvent.press(removeButton);

    expect(mockRemoveItemAt).toHaveBeenCalledWith(5);
  });
});
