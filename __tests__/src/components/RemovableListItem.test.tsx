import RemovableListItem from "@/src/components/RemovableListItem";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("RemovableListItem", () => {
  const mockRemoveItemCb = jest.fn();

  it("renders markup - player name and a remove button", () => {
    render(<RemovableListItem label="Sally" removeItemCb={mockRemoveItemCb} />);

    const name = screen.getByText("Sally");
    const removeButton = screen.getByRole("button", { name: "Remove Sally" });

    expect(name).toBeVisible();
    expect(removeButton).toBeVisible();
  });

  it("allows users to remove the item", () => {
    render(<RemovableListItem label="Sally" removeItemCb={mockRemoveItemCb} />);

    const removeButton = screen.getByRole("button", { name: "Remove Sally" });
    fireEvent.press(removeButton);

    expect(mockRemoveItemCb).toHaveBeenCalledTimes(1);
  });
});
