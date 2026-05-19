import { CardFactory } from "@/factories/models/CardFactory";
import { DeckFactory } from "@/factories/models/DeckFactory";
import CardList from "@/src/components/CardList";
import DEFAULT_DECK from "@/src/constants/default-deck";
import { StorageContext } from "@/src/context/StorageContext";
import { BaseMockStorageContext } from "@/test-utils";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

describe("CardList", () => {
  const testDeck = DeckFactory({ cards: [] });
  const mockCreateCard = jest.fn();
  const mockUpdateDeck = jest.fn();

  const mockStorageContext = {
    ...BaseMockStorageContext,
    selectedDeck: testDeck,
    decks: [testDeck],
    updateDeck: mockUpdateDeck,
    createCard: mockCreateCard,
  };

  describe("with no cards initialised", () => {
    beforeEach(() => {
      render(
        <StorageContext.Provider value={mockStorageContext}>
          <CardList deck={testDeck} />
        </StorageContext.Provider>,
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

    it.skip("allows the user to load the default deck", () => {
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
      const addButton = screen.getByRole("button", {
        name: "Add Card to Deck",
      });
      fireEvent.press(addButton);

      expect(mockUpdateDeck).not.toHaveBeenCalled();
      expect(input).toHaveProp("value", "");

      errorMessage = screen.getByText("Card cannot be empty");
      expect(errorMessage).toBeVisible();
    });

    it("surfaces errors from StorageContext on create", async () => {
      mockCreateCard.mockRejectedValueOnce(new Error("test error"));

      let errorMessage = screen.queryByText("test error");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Card Content");
      fireEvent.changeText(input, "New card <3");

      const addButton = screen.getByRole("button", {
        name: "Add Card to Deck",
      });
      fireEvent.press(addButton);

      expect(mockCreateCard).toHaveBeenCalledWith(testDeck.id, {
        content: "New card <3",
      });
      expect(input).toHaveProp("value", "New card <3");

      await waitFor(() => {
        expect(screen.getByText("test error")).toBeVisible();
      });
    });

    it("clears error message on new input", () => {
      let errorMessage = screen.queryByText("Card cannot be empty");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Card Content");
      const addButton = screen.getByRole("button", {
        name: "Add Card to Deck",
      });
      fireEvent.press(addButton);

      expect(mockUpdateDeck).not.toHaveBeenCalled();
      expect(input).toHaveProp("value", "");

      errorMessage = screen.getByText("Card cannot be empty");
      expect(errorMessage).toBeVisible();

      fireEvent.changeText(input, "Drink up!");

      errorMessage = screen.queryByText("Card cannot be empty");
      expect(errorMessage).toBeNull();
    });

    it("trims whitespace from card contents", async () => {
      const input = screen.getByLabelText("Card Content");
      fireEvent.changeText(input, " Drink up!  ");

      const addButton = screen.getByRole("button", {
        name: "Add Card to Deck",
      });
      fireEvent.press(addButton);

      expect(mockCreateCard).toHaveBeenCalledWith(testDeck.id, {
        content: "Drink up!",
      });

      await waitFor(() => {
        expect(input).toHaveProp("value", "");
      });
    });
  });

  describe("with existing cards", () => {
    const card1 = CardFactory({ id: 1, content: "Drink up!" });
    const card2 = CardFactory({ id: 2, content: "Do a flip" });
    const card3 = CardFactory({ id: 3, content: "Go for a walk" });

    const mockStorageContext = {
      ...BaseMockStorageContext,
      selectedDeck: testDeck,
      decks: [testDeck],
      deckCards: [card1, card2, card3],
      updateDeck: mockUpdateDeck,
      createCard: mockCreateCard,
    };

    beforeEach(() => {
      render(
        <StorageContext.Provider value={mockStorageContext}>
          <CardList deck={testDeck} />
        </StorageContext.Provider>,
      );
    });

    it("renders a list of cards from storage", () => {
      expect(screen.getByText(card1.content)).toBeVisible();
      expect(screen.getByText(card2.content)).toBeVisible();
      expect(screen.getByText(card3.content)).toBeVisible();
    });

    it.skip("allows user to remove cards", () => {
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
