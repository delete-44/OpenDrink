import { CardContextFactory } from "@/factories/context/CardContextFactory";
import { CardFactory } from "@/factories/models/CardFactory";
import { DeckFactory } from "@/factories/models/DeckFactory";
import CardList from "@/src/components/CardList";
import { DEFAULT_CARDS } from "@/src/constants/default-deck";
import { CardContext } from "@/src/context/CardContext";
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
  const testDeck = DeckFactory();
  const mockCreateCard = jest.fn();
  const mockCreateManyCards = jest.fn();
  const mockDeleteCard = jest.fn();

  const mockCardContext = CardContextFactory({
    deck: testDeck,
    cards: [],
    createCard: mockCreateCard,
    createManyCards: mockCreateManyCards,
    deleteCard: mockDeleteCard,
  });

  describe("with no cards initialised", () => {
    beforeEach(() => {
      render(
        <CardContext.Provider value={mockCardContext}>
          <CardList deck={testDeck} />
        </CardContext.Provider>,
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

      expect(mockCreateManyCards).toHaveBeenCalledWith(DEFAULT_CARDS);
    });

    it("prevents user adding empty cards", () => {
      let errorMessage = screen.queryByText("Card cannot be empty");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Card Content");
      const addButton = screen.getByRole("button", {
        name: "Add Card to Deck",
      });
      fireEvent.press(addButton);

      expect(mockCreateCard).not.toHaveBeenCalled();
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

      expect(mockCreateCard).toHaveBeenCalledWith({
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

      expect(mockCreateCard).not.toHaveBeenCalled();
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

      expect(mockCreateCard).toHaveBeenCalledWith({
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
    };

    const mockCardContext = CardContextFactory({
      deck: testDeck,
      cards: [card1, card2, card3],
      createCard: mockCreateCard,
      deleteCard: mockDeleteCard,
    });

    beforeEach(() => {
      render(
        <CardContext.Provider value={mockCardContext}>
          <StorageContext.Provider value={mockStorageContext}>
            <CardList deck={testDeck} />
          </StorageContext.Provider>
        </CardContext.Provider>,
      );
    });

    it("renders a list of cards from storage", () => {
      expect(screen.getByText(card1.content)).toBeVisible();
      expect(screen.getByText(card2.content)).toBeVisible();
      expect(screen.getByText(card3.content)).toBeVisible();
    });

    it("surfaces errors from StorageContext on delete", async () => {
      mockDeleteCard.mockRejectedValueOnce(new Error("test error"));

      let errorMessage = screen.queryByText("test error");
      expect(errorMessage).toBeNull();

      const removeCardButton = screen.getByRole("button", {
        name: `Remove ${card2.content}`,
      });

      fireEvent.press(removeCardButton);

      expect(mockDeleteCard).toHaveBeenCalledWith(card2.id);

      await waitFor(() => {
        expect(screen.getByText("test error")).toBeVisible();
      });
    });

    it("allows user to remove cards", () => {
      const removeCardButton = screen.getByRole("button", {
        name: `Remove ${card3.content}`,
      });

      fireEvent.press(removeCardButton);
      expect(mockDeleteCard).toHaveBeenCalledWith(card3.id);
    });
  });
});
