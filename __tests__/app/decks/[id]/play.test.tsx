import Play from "@/app/decks/[id]/play";
import { DeckLayoutContext } from "@/src/context/DeckLayoutContext";
import { StorageContext } from "@/src/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { BaseMockStorageContext } from "@/test-utils";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

describe("Play", () => {
  const testDeck = new Deck("Test Deck", ["Card 1", "Card 2"], "abc123");

  const mockStorageContext = {
    ...BaseMockStorageContext,
    players: [],
  };

  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
  });

  it("shows a CTA to return home if the initialisation fails", () => {
    render(
      <DeckLayoutContext.Provider value={testDeck}>
        <StorageContext.Provider value={mockStorageContext}>
          <Play />
        </StorageContext.Provider>
      </DeckLayoutContext.Provider>,
    );

    expect(screen.getByText("Error: Game has no Players")).toBeVisible();
    expect(screen.queryByLabelText("Loading Game")).toBeNull();

    const homeButton = screen.getByRole("button", { name: "Back to Home" });
    expect(homeButton).toBeVisible();

    fireEvent.press(homeButton);
    expect(router.back).toHaveBeenCalled();
  });

  describe("with a valid game", () => {
    beforeEach(() => {
      render(
        <DeckLayoutContext.Provider value={testDeck}>
          <StorageContext.Provider value={BaseMockStorageContext}>
            <Play />
          </StorageContext.Provider>
        </DeckLayoutContext.Provider>,
      );
    });

    it("renders a GameState on load", () => {
      expect(screen.getByText("Sally's Turn")).toBeVisible();
      expect(screen.getByText("Card 1")).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Tap to draw next Card" }),
      ).toBeVisible();

      expect(screen.queryByLabelText("Loading Game")).toBeNull();
      expect(screen.queryByRole("button", { name: "Back to Home" })).toBeNull();
    });

    it("cycles to the next GameState on click", () => {
      const nextCardButton = screen.getByRole("button", {
        name: "Tap to draw next Card",
      });

      expect(screen.getByText("Sally's Turn")).toBeVisible();
      expect(screen.getByText("Card 1")).toBeVisible();

      fireEvent.press(nextCardButton);

      expect(screen.getByText("Alice's Turn")).toBeVisible();
      expect(screen.getByText("Card 2")).toBeVisible();
    });
  });
});
