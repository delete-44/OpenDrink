import { DeckFactory } from "@/factories/models/DeckFactory";
import DeckForm from "@/src/components/decks/DeckForm";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

describe("DeckForm", () => {
  const mockSaveDeck = jest.fn();

  it("renders empty state for decks with no id", () => {
    render(
      <DeckForm
        // @ts-expect-error using stub deck object
        deck={{ id: null, name: "Test..." }}
        saveDeckCallback={mockSaveDeck}
      />,
    );

    expect(screen.getByRole("button", { name: "Rename Deck" })).toBeVisible();

    expect(screen.getByText("Give your Deck a name")).toBeVisible();

    expect(
      screen.queryByRole("button", { name: "Load Default Cards" }),
    ).toBeNull();
    expect(screen.queryByText("... or add your own here!")).toBeNull();
  });

  describe("with a complete deck", () => {
    const testDeck = DeckFactory();

    beforeEach(() => {
      render(<DeckForm deck={testDeck} saveDeckCallback={mockSaveDeck} />);
    });

    it("composes the DeckTitleBar & CardList", () => {
      expect(screen.getByRole("button", { name: "Rename Deck" })).toBeVisible();

      expect(screen.queryByText("Give your Deck a name")).toBeNull();

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
        expect(
          screen.getByRole("button", { name: "Rename Deck" }),
        ).toBeVisible();
      });
    });
  });
});
