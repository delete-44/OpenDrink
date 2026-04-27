import DeckSelector from "@/components/DeckSelector";
import { render, screen } from "@testing-library/react-native";

describe("DeckSelector", () => {
  it("renders UI elements correctly", () => {
    render(<DeckSelector />);

    expect(screen.getByText("Default")).toBeVisible();

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
