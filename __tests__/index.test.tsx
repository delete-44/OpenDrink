import { StorageProvider } from "@/context/StorageContext";
import { render, screen, waitFor } from "@testing-library/react-native";
import { act } from "react";
import { DeviceEventEmitter } from "react-native";
import Index from "../app/index";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async (key: string) => {
    if (key === "decks")
      return JSON.stringify([{ name: "Default", cards: ["a"] }]);
    if (key === "current_deck_idx") return JSON.stringify(0);
    return null;
  }),
  setItemAsync: jest.fn(),
}));

describe("Index", () => {
  it("should hide DeckSelector when keyboard shows", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StorageProvider>{children}</StorageProvider>
    );

    render(<Index />, { wrapper });

    await waitFor(() => expect(screen.getByText("Default")).toBeTruthy());

    // Simulate keyboard show
    act(() => {
      DeviceEventEmitter.emit("keyboardDidShow");
    });

    await waitFor(() => {
      expect(screen.queryByText("Default")).toBeNull();
    });
  });

  it("should show DeckSelector when keyboard hides", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StorageProvider>{children}</StorageProvider>
    );

    render(<Index />, { wrapper });

    await waitFor(() => expect(screen.getByText("Default")).toBeTruthy());

    act(() => {
      DeviceEventEmitter.emit("keyboardDidShow");
    });

    await waitFor(() => {
      expect(screen.queryByText("Default")).toBeNull();
    });

    act(() => {
      DeviceEventEmitter.emit("keyboardDidHide");
    });

    await waitFor(() => {
      expect(screen.getByText("Default")).toBeVisible();
    });
  });
});
