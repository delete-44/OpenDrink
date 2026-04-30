import GameScreen from "@/app/game";
import { render, screen } from "@testing-library/react-native";
import React from "react";

const mockGetItemAsync = jest.fn();

jest.mock("expo-secure-store", () => ({
  getItemAsync: mockGetItemAsync,
}));

describe("Game", () => {
  it("shows loading spinner whilst loading content from store", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      currentDeck: { id: "1", name: "Deck", cards: ["Card 1"] },
      players: ["Player 1", "Player 2"],
      isLoading: true,
    });

    render(<GameScreen />);

    expect(screen.getByLabelText("Loading game")).toBeVisible();
  });

  it("shows a CTA to return home if the initialisation fails", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      currentDeck: { id: "1", name: "Deck", cards: ["Card 1"] },
      players: [],
      isLoading: false,
    });

    render(<GameScreen />);

    expect(screen.getByText("Error: Game has no players")).toBeVisible();
    expect(screen.getByRole("button", { name: "Back to Home" })).toBeVisible();
    expect(screen.queryByLabelText("Loading game")).toBeNull();
  });

  it("renders a GameState on load", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      currentDeck: { id: "1", name: "Deck", cards: ["Card 1"] },
      players: ["Sally"],
      isLoading: false,
    });

    render(<GameScreen />);

    expect(screen.getByText("Sally's Turn")).toBeVisible();
    expect(screen.getByText("Card 1")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Tap to draw next card" }),
    ).toBeVisible();

    expect(screen.queryByLabelText("Loading game")).toBeNull();
    expect(screen.queryByRole("button", { name: "Back to Home" })).toBeNull();
  });
});
