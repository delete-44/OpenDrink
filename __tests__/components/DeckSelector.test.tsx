import DeckSelector from "@/components/DeckSelector";
import { StorageProvider } from "@/context/StorageContext";
import { render, screen, waitFor } from "@testing-library/react-native";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async (key: string) => {
    if (key === "decks")
      return JSON.stringify([{ name: "Default", cards: ["a"] }]);
    if (key === "current_deck_idx") return JSON.stringify(0);
    return null;
  }),
  setItemAsync: jest.fn(),
}));

describe("DeckSelector", () => {
  it("renders UI elements correctly", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StorageProvider>{children}</StorageProvider>
    );

    render(<DeckSelector />, { wrapper });

    await waitFor(() => expect(screen.getByText("Default")).toBeTruthy());

    expect(screen.getByText("Default")).toBeVisible();

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
