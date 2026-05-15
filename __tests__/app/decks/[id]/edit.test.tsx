import Edit from "@/app/decks/[id]/edit";
import { DeckLayoutContext } from "@/src/context/DeckLayoutContext";
import { StorageContext } from "@/src/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { BaseMockStorageContext } from "@/test-utils";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

describe("Edit", () => {
  const testDeck = new Deck("Test Deck", [], "abc123");
  const mockUpdateDeck = jest.fn();

  const mockStorageContext = {
    ...BaseMockStorageContext,
    selectedDeck: testDeck,
    updateDeck: mockUpdateDeck,
  };

  beforeEach(() => {
    render(
      <DeckLayoutContext.Provider value={testDeck}>
        <StorageContext.Provider value={mockStorageContext}>
          <Edit />
        </StorageContext.Provider>
      </DeckLayoutContext.Provider>,
    );
  });

  it("composes the DeckTitleBar & CardList", () => {
    expect(screen.getByRole("button", { name: "Rename Deck" })).toBeVisible();

    expect(
      screen.getByRole("button", { name: "Load Default Cards" }),
    ).toBeVisible();
    expect(screen.getByText("... or add your own here!")).toBeVisible();
  });

  it("loads the deck from StorageContext#selectedDeck", () => {
    expect(screen.getByText("Test Deck")).toBeVisible();
  });

  it("creates deck & saves it on name change", async () => {
    fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

    fireEvent.changeText(screen.getByLabelText("Deck Name"), "Renamed Deck");

    fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

    expect(mockUpdateDeck).toHaveBeenCalledWith("abc123", {
      name: "Renamed Deck",
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Rename Deck" })).toBeVisible();
    });
  });
});
