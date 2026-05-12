import { Deck } from "@/src/models/Deck";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";
import React, { act } from "react";
import { DeviceEventEmitter } from "react-native";
import Index from "../../app/index";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("Index", () => {
  it("shows loading spinner whilst fetching data", () => {
    const testDeck = new Deck("Default", ["Card 1"], "abc123");
    jest.spyOn(React, "useContext").mockReturnValue({
      selectedDeck: testDeck,
      decks: [testDeck],
      isLoading: true,
    });

    render(<Index />);

    expect(screen.queryByText("Default")).toBeNull();
    expect(screen.getByLabelText("Loading Decks")).toBeVisible();
  });

  describe("once loaded", () => {
    beforeEach(() => {
      const testDeck = new Deck("Default", ["Card 1"], "abc123");
      jest.spyOn(React, "useContext").mockReturnValue({
        selectedDeck: testDeck,
        decks: [testDeck],
        isLoading: false,
      });
    });

    it("hides DeckSelector when keyboard shows", async () => {
      render(<Index />);

      await waitFor(() => expect(screen.getByText("Default")).toBeVisible());

      // Simulate keyboard show
      act(() => {
        DeviceEventEmitter.emit("keyboardDidShow");
      });

      await waitFor(() => {
        expect(screen.queryByText("Default")).toBeNull();
      });
    });

    it("shows DeckSelector when keyboard hides", async () => {
      render(<Index />);

      await waitFor(() => expect(screen.getByText("Default")).toBeVisible());

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

    it("navigates to game screen on Get Started! press", () => {
      render(<Index />);

      const getStartedButton = screen.getByRole("button", {
        name: "Get Started!",
      });
      expect(getStartedButton).toBeVisible();

      fireEvent.press(getStartedButton);
      expect(router.navigate).toHaveBeenCalledWith({
        params: { id: "abc123" },
        pathname: "/decks/[id]/play",
      });
    });
  });
});
