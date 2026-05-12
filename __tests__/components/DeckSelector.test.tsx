import DeckSelector from "@/components/DeckSelector";
import { Deck } from "@/src/models/Deck";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("DeckSelector", () => {
  const testDeck = new Deck("Default", ["Card 1"], "1");
  const mockCreateDeck = jest.fn();

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
        createDeck: mockCreateDeck,
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

    it("creates an empty deck & navigates to the edit page for it when create clicked", async () => {
      const secondDeck = new Deck("", []);
      mockCreateDeck.mockResolvedValueOnce(secondDeck);

      render(<DeckSelector />);

      fireEvent.press(screen.getByRole("button", { name: "New Deck" }));
      expect(mockCreateDeck).toHaveBeenCalledWith();

      await waitFor(() =>
        expect(router.navigate).toHaveBeenCalledWith({
          params: { id: secondDeck.id },
          pathname: "/decks/[id]/edit",
        }),
      );
    });
  });

  describe("selecting decks", () => {
    const deck2 = new Deck("Test 2", []);
    const deck3 = new Deck("Test 3", []);
    const mockSaveSelectedDeckIdx = jest.fn();

    const assertModalHidden = () => {
      expect(screen.queryByText("Select Deck")).toBeNull();
      expect(screen.queryByRole("button", { name: "Close Modal" })).toBeNull();
    };

    const assertModalVisible = () => {
      expect(screen.getByText("Select Deck")).toBeVisible();
      expect(
        screen.getAllByRole("button", { name: "Close Modal" }).length,
      ).toEqual(2);
    };

    beforeEach(() => {
      jest.spyOn(React, "useContext").mockReturnValue({
        decks: [testDeck, deck2, deck3],
        selectedDeck: deck3,
        createDeck: mockCreateDeck,
        saveSelectedDeckIdx: mockSaveSelectedDeckIdx,
        isLoading: false,
      });
    });

    it("renders only the currently selected deck as a trigger", () => {
      render(<DeckSelector />);

      expect(screen.queryByRole("button", { name: "Default" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Test 2" })).toBeNull();
      expect(screen.getByRole("button", { name: "Test 3" })).toBeVisible();

      assertModalHidden();
    });

    it("opens the selection modal on click", () => {
      render(<DeckSelector />);

      assertModalHidden();

      fireEvent.press(screen.getByRole("button", { name: "Test 3" }));

      assertModalVisible();

      expect(screen.getByRole("button", { name: "Default" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Test 2" })).toBeVisible();
      expect(screen.getAllByRole("button", { name: "Test 3" }).length).toEqual(
        2,
      );

      fireEvent.press(screen.getByRole("button", { name: "Test 2" }));

      expect(mockSaveSelectedDeckIdx).toHaveBeenCalledWith(1);

      assertModalHidden();
    });
  });
});
