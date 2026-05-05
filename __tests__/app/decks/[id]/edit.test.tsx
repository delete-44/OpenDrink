import Edit from "@/app/decks/[id]/edit";
import { DeckLayoutContext } from "@/context/DeckLayoutContext";
import { StorageContext } from "@/context/StorageContext";
import DEFAULT_DECK from "@/src/constants/default-deck";
import { Deck } from "@/src/models/Deck";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("Edit", () => {
  const testDeck = new Deck("Test Deck", [], "abc123");
  const mockUpdateDeck = jest.fn();

  const mockStorageContext = {
    selectedDeck: testDeck,
    saveSelectedDeckId: jest.fn(),
    decks: [testDeck],
    fetchDeck: jest.fn(),
    updateDeck: mockUpdateDeck,
    players: ["Alice"],
    savePlayers: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("with no cards initialised", () => {
    beforeEach(() => {
      render(
        <DeckLayoutContext.Provider value={testDeck}>
          <StorageContext.Provider value={mockStorageContext}>
            <Edit />
          </StorageContext.Provider>
        </DeckLayoutContext.Provider>,
      );
    });

    it("renders an empty state when no cards provided", () => {
      expect(
        screen.getByRole("button", { name: "Load Default Cards" }),
      ).toBeVisible();
      expect(screen.getByText("... or add your own here!")).toBeVisible();

      expect(screen.queryByLabelText("Loading Deck")).toBeNull();
      expect(screen.queryByText("Error: Failed to load Deck.")).toBeNull();
    });

    it("allows the user to load the default deck", () => {
      fireEvent.press(
        screen.getByRole("button", { name: "Load Default Cards" }),
      );

      expect(mockUpdateDeck).toHaveBeenCalledWith(
        testDeck.id,
        new Deck(testDeck.name, DEFAULT_DECK.cards, testDeck.id),
      );
    });

    it("prevents user adding empty cards", () => {
      let errorMessage = screen.queryByText("Card cannot be empty");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Card Content");
      const addButton = screen.getByRole("button", { name: "Add Card" });
      fireEvent.press(addButton);

      expect(mockUpdateDeck).not.toHaveBeenCalled();
      expect(input).toHaveProp("value", "");

      errorMessage = screen.getByText("Card cannot be empty");
      expect(errorMessage).toBeVisible();
    });

    it("clears error message on new input", () => {
      let errorMessage = screen.queryByText("Card cannot be empty");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Card Content");
      const addButton = screen.getByRole("button", { name: "Add Card" });
      fireEvent.press(addButton);

      expect(mockUpdateDeck).not.toHaveBeenCalled();
      expect(input).toHaveProp("value", "");

      errorMessage = screen.getByText("Card cannot be empty");
      expect(errorMessage).toBeVisible();

      fireEvent.changeText(input, "Drink up!");

      errorMessage = screen.queryByText("Card cannot be empty");
      expect(errorMessage).toBeNull();
    });

    it("trims whitespace from card contents", () => {
      const input = screen.getByLabelText("Card Content");
      fireEvent.changeText(input, " Drink up!  ");

      const addButton = screen.getByRole("button", { name: "Add Card" });
      fireEvent.press(addButton);

      expect(mockUpdateDeck).toHaveBeenCalledWith(
        testDeck.id,
        new Deck(testDeck.name, ["Drink up!"], testDeck.id),
      );

      expect(input).toHaveProp("value", "");
    });
  });

  describe("with existing cards", () => {
    const testDeck = new Deck(
      "Test Deck",
      ["Drink up!", "Do a flip", "Go for a walk"],
      "abc123",
    );

    beforeEach(() => {
      render(
        <DeckLayoutContext.Provider value={testDeck}>
          <StorageContext.Provider value={mockStorageContext}>
            <Edit />
          </StorageContext.Provider>
        </DeckLayoutContext.Provider>,
      );
    });

    it("renders a list of cards from storage", () => {
      expect(screen.getByText("Drink up!")).toBeVisible();
      expect(screen.getByText("Do a flip")).toBeVisible();
    });

    it("allows user to remove cards", () => {
      const removeCardButton = screen.getByRole("button", {
        name: "Remove Do a flip",
      });

      fireEvent.press(removeCardButton);
      expect(mockUpdateDeck).toHaveBeenCalledWith(
        testDeck.id,
        new Deck(testDeck.name, ["Drink up!", "Go for a walk"], testDeck.id),
      );
    });
  });
});
