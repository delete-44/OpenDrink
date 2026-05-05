import DeckSelector from "@/components/DeckSelector";
import { Deck } from "@/src/models/Deck";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("DeckSelector", () => {
  const testDeck = new Deck("Default", ["Card 1"], "1");

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders loading spinner when fetching data", () => {
    jest.spyOn(React, "useContext").mockReturnValueOnce({
      decks: [testDeck],
      selectedDeck: testDeck,
      isLoading: true,
    });

    render(<DeckSelector />);

    expect(screen.getByLabelText("Loading decks")).toBeVisible();
    expect(screen.queryByText("Default")).toBeNull();
    expect(screen.queryByRole("button", { name: "Edit Deck" })).toBeNull();
    expect(screen.queryByRole("button", { name: "New Deck" })).toBeNull();
  });

  describe("once loaded", () => {
    beforeEach(() => {
      jest.spyOn(React, "useContext").mockReturnValueOnce({
        decks: [testDeck],
        selectedDeck: testDeck,
        isLoading: false,
      });
    });

    it("renders UI elements correctly", async () => {
      render(<DeckSelector />);

      expect(screen.queryByLabelText("Loading decks")).toBeNull();
      expect(screen.getByText("Default")).toBeVisible();
      expect(screen.queryByRole("button", { name: "Edit Deck" })).toBeVisible();
      expect(screen.queryByRole("button", { name: "New Deck" })).toBeVisible();
    });

    it("navigates to the edit page for a deck when edit clicked", () => {
      render(<DeckSelector />);

      fireEvent.press(screen.getByRole("button", { name: "Edit Deck" }));
      expect(router.navigate).toHaveBeenCalledWith({
        params: { id: testDeck.id },
        pathname: "/decks/[id]/edit",
      });
    });
  });
});
