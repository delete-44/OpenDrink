import DecksLayout from "@/app/decks/[id]/_layout";
import { DeckLayoutContext } from "@/context/DeckLayoutContext";
import { StorageContext } from "@/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { render, screen } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

describe("DecksLayout", () => {
  const testDeck = new Deck("Test Deck", [], "abc123");
  const mockFetchDeck = jest.fn();
  const mockSaveDeck = jest.fn();
  const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

  const mockStorageContext = {
    selectedDeck: testDeck,
    saveSelectedDeckId: jest.fn(),
    decks: [testDeck],
    fetchDeck: mockFetchDeck,
    saveDeck: mockSaveDeck,
    players: ["Alice"],
    savePlayers: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    mockUseLocalSearchParams.mockReturnValue({ id: "abc123" });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders an error state when deck not found", () => {
    mockFetchDeck.mockReturnValueOnce(null);

    render(
      <DeckLayoutContext.Provider value={testDeck}>
        <StorageContext.Provider value={mockStorageContext}>
          <DecksLayout />
        </StorageContext.Provider>
      </DeckLayoutContext.Provider>,
    );

    expect(screen.queryByText("... or add your own here!")).toBeNull();
    expect(screen.queryByLabelText("Loading Deck")).toBeNull();
    expect(screen.getByText("Error: Failed to load Deck.")).toBeVisible();
  });

  it("renders a loading state", () => {
    const loadingContext = {
      ...mockStorageContext,
      isLoading: true,
    };
    mockFetchDeck.mockReturnValueOnce(testDeck);

    render(
      <DeckLayoutContext.Provider value={testDeck}>
        <StorageContext.Provider value={loadingContext}>
          <DecksLayout />
        </StorageContext.Provider>
      </DeckLayoutContext.Provider>,
    );

    expect(screen.queryByText("... or add your own here!")).toBeNull();
    expect(screen.getByLabelText("Loading Deck")).toBeVisible();
    expect(screen.queryByText("Error: Failed to load Deck.")).toBeNull();
  });

  it("shows an error if DeckLayoutContext is used without a Deck", () => {
    render(
      <DeckLayoutContext.Provider value={null}>
        <StorageContext.Provider value={mockStorageContext}>
          <DecksLayout />
        </StorageContext.Provider>
      </DeckLayoutContext.Provider>,
    );

    expect(screen.queryByText("... or add your own here!")).toBeNull();
    expect(screen.queryByLabelText("Loading Deck")).toBeNull();
    expect(screen.getByText("Error: Failed to load Deck.")).toBeVisible();
  });
});
