import DecksLayout from "@/app/decks/[id]/_layout";
import { DeckFactory } from "@/factories/models/DeckFactory";
import { DeckLayoutContext } from "@/src/context/DeckLayoutContext";
import { StorageContext } from "@/src/context/StorageContext";
import { BaseMockStorageContext } from "@/test-utils";
import { render, screen } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

describe("DecksLayout", () => {
  const testDeck = DeckFactory();
  const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

  beforeEach(() => {
    mockUseLocalSearchParams.mockReturnValue({ id: "abc123" });
  });

  it("renders a loading state", () => {
    const loadingContext = {
      ...BaseMockStorageContext,
      isLoading: true,
    };

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
        <StorageContext.Provider value={BaseMockStorageContext}>
          <DecksLayout />
        </StorageContext.Provider>
      </DeckLayoutContext.Provider>,
    );

    expect(screen.queryByText("... or add your own here!")).toBeNull();
    expect(screen.queryByLabelText("Loading Deck")).toBeNull();
    expect(screen.getByText("Error: Failed to load Deck.")).toBeVisible();
  });
});
