import { DeckFactory } from "@/factories/models/DeckFactory";
import DeleteDeckModal from "@/src/components/decks/DeleteDeckModal";
import { StorageContext } from "@/src/context/StorageContext";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";
import { BaseMockStorageContext } from "../../../../test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    navigate: jest.fn(),
  },
}));

describe("DeleteDeckModal", () => {
  const mockSetIsVisible = jest.fn();
  const mockDestroyDeck = jest.fn();
  const mockSaveSelectedDeckIdx = jest.fn();

  const mockStorageContext = {
    ...BaseMockStorageContext,
    destroyDeck: mockDestroyDeck,
    saveSelectedDeckIdx: mockSaveSelectedDeckIdx,
  };

  const deck = DeckFactory();

  beforeEach(() => {
    render(
      <StorageContext.Provider value={mockStorageContext}>
        <DeleteDeckModal
          deck={deck}
          isVisible
          setIsVisible={mockSetIsVisible}
        />
      </StorageContext.Provider>,
    );
  });

  it("renders base markup; warning message including deck name, cancel + confirm buttons", () => {
    expect(
      screen.getByText(`This will delete the deck: "${deck.name}".`),
    ).toBeVisible();

    expect(
      screen.getByText(
        "This action is irreversible. Are you sure you want to continue?",
      ),
    ).toBeVisible();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete Deck" })).toBeVisible();
  });

  it("closes modal without destructive action on cancel click", () => {
    fireEvent.press(screen.getByRole("button", { name: "Cancel" }));

    expect(mockSaveSelectedDeckIdx).not.toHaveBeenCalled();
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);
    expect(router.back).not.toHaveBeenCalled();

    expect(mockDestroyDeck).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("returns to the edit page if delete fails", async () => {
    mockDestroyDeck.mockRejectedValueOnce(new Error("test error"));

    fireEvent.press(screen.getByRole("button", { name: "Delete Deck" }));

    await waitFor(() => {
      expect(mockDestroyDeck).toHaveBeenCalledWith(deck.id);
    });

    expect(mockSaveSelectedDeckIdx).toHaveBeenCalledWith(0);
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);
    expect(router.back).toHaveBeenCalledTimes(1);

    expect(router.navigate).toHaveBeenCalledWith({
      pathname: "/decks/[id]/edit",
      params: { id: deck.id },
    });
  });

  it("optimistically navigates back to homepage on successful delete", async () => {
    fireEvent.press(screen.getByRole("button", { name: "Delete Deck" }));

    await waitFor(() => {
      expect(mockDestroyDeck).toHaveBeenCalledWith(deck.id);
    });

    expect(mockSaveSelectedDeckIdx).toHaveBeenCalledWith(0);
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);
    expect(router.back).toHaveBeenCalledTimes(1);

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
