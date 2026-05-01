import GameScreen from "@/app/game";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

describe("GameScreen", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

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
    expect(screen.queryByLabelText("Loading game")).toBeNull();

    const homeButton = screen.getByRole("button", { name: "Back to Home" });
    expect(homeButton).toBeVisible();

    fireEvent.press(homeButton);
    expect(router.back).toHaveBeenCalled();
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

  it("cycles to the next GameState on click", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      currentDeck: { id: "1", name: "Deck", cards: ["Card 1", "Card 2"] },
      players: ["Sally", "Alice"],
      isLoading: false,
    });

    render(<GameScreen />);

    const nextCardButton = screen.getByRole("button", {
      name: "Tap to draw next card",
    });

    expect(screen.getByText("Sally's Turn")).toBeVisible();
    expect(screen.getByText("Card 1")).toBeVisible();

    fireEvent.press(nextCardButton);

    expect(screen.getByText("Alice's Turn")).toBeVisible();
    expect(screen.getByText("Card 2")).toBeVisible();
  });
});
