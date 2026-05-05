import Edit from "@/app/decks/[idx]/edit";
import DEFAULT_DECK from "@/src/constants/default-deck";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

describe("Edit", () => {
  const mockSaveDeck = jest.fn();
  const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

  jest.mock("expo-router", () => ({
    useLocalSearchParams: mockUseLocalSearchParams,
  }));

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders an error state when deck not found", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      decks: [{ id: "1", name: "Test Deck", cards: [] }],
      saveDeck: mockSaveDeck,
      isLoading: false,
    });

    mockUseLocalSearchParams.mockReturnValue({ idx: "500" });

    render(<Edit />);

    expect(screen.queryByText("... or add your own here!")).toBeNull();
    expect(screen.queryByLabelText("Loading Deck")).toBeNull();
    expect(screen.getByText("Error: Failed to load Deck.")).toBeVisible();
  });

  describe("when deck found", () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({ idx: "0" });
    });

    it("renders a loading state", () => {
      jest.spyOn(React, "useContext").mockReturnValue({
        decks: [{ name: "Test Deck", cards: [] }],
        saveDeck: mockSaveDeck,
        isLoading: true,
      });

      render(<Edit />);

      expect(screen.queryByText("... or add your own here!")).toBeNull();
      expect(screen.getByLabelText("Loading Deck")).toBeVisible();
      expect(screen.queryByText("Error: Failed to load Deck.")).toBeNull();
    });

    describe("with no cards initialised", () => {
      beforeEach(() => {
        jest.spyOn(React, "useContext").mockReturnValue({
          decks: [{ id: "1", name: "Test Deck", cards: [] }],
          saveDeck: mockSaveDeck,
          isLoading: false,
        });
      });

      it("renders an empty state when no cards provided", () => {
        render(<Edit />);

        expect(
          screen.getByRole("button", { name: "Load Default Cards" }),
        ).toBeVisible();
        expect(screen.getByText("... or add your own here!")).toBeVisible();

        expect(screen.queryByLabelText("Loading Deck")).toBeNull();
        expect(screen.queryByText("Error: Failed to load Deck.")).toBeNull();
      });

      it("allows the user to load the default deck", () => {
        render(<Edit />);

        fireEvent.press(
          screen.getByRole("button", { name: "Load Default Cards" }),
        );

        expect(mockSaveDeck).toHaveBeenCalledWith(0, {
          id: "1",
          name: "Test Deck",
          cards: DEFAULT_DECK.cards,
        });
      });

      it("prevents user adding empty cards", () => {
        render(<Edit />);

        let errorMessage = screen.queryByText("Card cannot be empty");
        expect(errorMessage).toBeNull();

        const input = screen.getByLabelText("Card Content");
        const addButton = screen.getByRole("button", { name: "Add Card" });
        fireEvent.press(addButton);

        expect(mockSaveDeck).not.toHaveBeenCalled();
        expect(input).toHaveProp("value", "");

        errorMessage = screen.getByText("Card cannot be empty");
        expect(errorMessage).toBeVisible();
      });

      it("clears error message on new input", () => {
        render(<Edit />);

        let errorMessage = screen.queryByText("Card cannot be empty");
        expect(errorMessage).toBeNull();

        const input = screen.getByLabelText("Card Content");
        const addButton = screen.getByRole("button", { name: "Add Card" });
        fireEvent.press(addButton);

        expect(mockSaveDeck).not.toHaveBeenCalled();
        expect(input).toHaveProp("value", "");

        errorMessage = screen.getByText("Card cannot be empty");
        expect(errorMessage).toBeVisible();

        fireEvent.changeText(input, "Drink up!");

        errorMessage = screen.queryByText("Card cannot be empty");
        expect(errorMessage).toBeNull();
      });

      it("trims whitespace from card contents", () => {
        render(<Edit />);

        const input = screen.getByLabelText("Card Content");
        fireEvent.changeText(input, " Drink up!  ");

        const addButton = screen.getByRole("button", { name: "Add Card" });
        fireEvent.press(addButton);

        expect(mockSaveDeck).toHaveBeenCalledWith(0, {
          id: "1",
          name: "Test Deck",
          cards: ["Drink up!"],
        });

        expect(input).toHaveProp("value", "");
      });
    });

    describe("with existing cards", () => {
      beforeEach(() => {
        jest.spyOn(React, "useContext").mockReturnValue({
          decks: [
            { id: "1", name: "Test Deck", cards: ["Drink up!", "Do a flip"] },
          ],
          saveDeck: mockSaveDeck,
          isLoading: false,
        });
      });

      it("renders a list of cards from storage", () => {
        render(<Edit />);

        expect(screen.getByText("Drink up!")).toBeVisible();
        expect(screen.getByText("Do a flip")).toBeVisible();
      });

      it("allows user to remove cards", () => {
        render(<Edit />);

        const removeCardButton = screen.getByRole("button", {
          name: "Remove Do a flip",
        });

        fireEvent.press(removeCardButton);
        expect(mockSaveDeck).toHaveBeenCalledWith(0, {
          id: "1",
          name: "Test Deck",
          cards: ["Drink up!"],
        });
      });
    });
  });
});
