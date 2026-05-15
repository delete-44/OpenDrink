import { DeckFactory } from "@/factories/models/DeckFactory";
import {
  DeckLayoutContext,
  useDeckFromLayout,
} from "@/src/context/DeckLayoutContext";
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

function TestComponent() {
  const deck = useDeckFromLayout();
  return <Text>{deck.name}</Text>;
}

describe("DeckLayoutContext / useDeckFromLayout", () => {
  it("throws an error when used without provider", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "useDeckFromLayout must be used within DeckLayout",
    );
  });

  it("throws when provider value is null", () => {
    expect(() =>
      render(
        <DeckLayoutContext.Provider value={null}>
          <TestComponent />
        </DeckLayoutContext.Provider>,
      ),
    ).toThrow("useDeckFromLayout must be used within DeckLayout");
  });

  it("returns the deck when provided via provider", () => {
    const mockDeck = DeckFactory();

    render(
      <DeckLayoutContext.Provider value={mockDeck}>
        <TestComponent />
      </DeckLayoutContext.Provider>,
    );

    expect(screen.getByText(mockDeck.name)).toBeVisible();
  });
});
