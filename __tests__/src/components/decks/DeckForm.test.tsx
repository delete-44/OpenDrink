import DeckForm from "@/src/components/decks/DeckForm";
import { Deck } from "@/src/models/Deck";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

describe("DeckForm", () => {
  const testDeck = new Deck("Test Deck", [], "abc123");
  const mockSaveDeck = jest.fn();

  beforeEach(() => {
    render(<DeckForm deck={testDeck} saveDeckCallback={mockSaveDeck} />);
  });

  it("composes the DeckTitleBar & CardList", () => {
    expect(screen.getByRole("button", { name: "Rename Deck" })).toBeVisible();

    expect(
      screen.getByRole("button", { name: "Load Default Cards" }),
    ).toBeVisible();
    expect(screen.getByText("... or add your own here!")).toBeVisible();
  });

  it("renders the given deck", () => {
    expect(screen.getByText("Test Deck")).toBeVisible();
  });

  it("calls callback on name change", async () => {
    fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

    fireEvent.changeText(screen.getByLabelText("Deck Name"), "Renamed Deck");

    fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

    expect(mockSaveDeck).toHaveBeenCalledWith("Renamed Deck");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Rename Deck" })).toBeVisible();
    });
  });
});
