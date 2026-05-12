import Edit from "@/app/decks/[id]/edit";
import { DeckLayoutContext } from "@/context/DeckLayoutContext";
import { StorageContext } from "@/context/StorageContext";
import DEFAULT_DECK from "@/src/constants/default-deck";
import { Deck } from "@/src/models/Deck";
import { BaseMockStorageContext } from "@/test-utils";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("Edit", () => {
  const testDeck = new Deck("Test Deck", [], "abc123");
  const mockUpdateDeck = jest.fn();

  const mockStorageContext = {
    ...BaseMockStorageContext,
    selectedDeck: testDeck,
    decks: [testDeck],
    updateDeck: mockUpdateDeck,
  };

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

      expect(mockUpdateDeck).toHaveBeenCalledWith(testDeck.id, {
        cards: DEFAULT_DECK.cards,
      });
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

      expect(mockUpdateDeck).toHaveBeenCalledWith(testDeck.id, {
        cards: ["Drink up!"],
      });

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
      expect(mockUpdateDeck).toHaveBeenCalledWith(testDeck.id, {
        cards: ["Drink up!", "Go for a walk"],
      });
    });
  });
});
