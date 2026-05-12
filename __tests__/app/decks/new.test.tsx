import New from "@/app/decks/new";
import { StorageContext } from "@/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { BaseMockStorageContext } from "@/test-utils";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

describe("New", () => {
  const mockUpdateDeck = jest.fn();
  const mockCreateDeck = jest.fn();
  const mockFetchDeck = jest.fn();

  const mockStorageContext = {
    ...BaseMockStorageContext,
    createDeck: mockCreateDeck,
    updateDeck: mockUpdateDeck,
    fetchDeck: mockFetchDeck,
    isLoading: true,
  };

  const testDeck = new Deck("Created Deck", [], "abc123");

  it("shows loading state whilst initialising data", async () => {
    render(
      <StorageContext.Provider value={mockStorageContext}>
        <New />
      </StorageContext.Provider>,
    );

    expect(screen.getByLabelText("Loading Decks")).toBeVisible();

    expect(screen.queryByLabelText("Deck Name")).toBeNull();
    expect(screen.queryByRole("button", { name: "Confirm Change" })).toBeNull();

    expect(mockFetchDeck).not.toHaveBeenCalled();
    expect(mockCreateDeck).not.toHaveBeenCalled();
    expect(mockUpdateDeck).not.toHaveBeenCalled();
  });

  describe("once loaded", () => {
    const mockStorageContext = {
      ...BaseMockStorageContext,
      createDeck: mockCreateDeck,
      updateDeck: mockUpdateDeck,
      fetchDeck: mockFetchDeck,
    };

    beforeEach(() => {
      render(
        <StorageContext.Provider value={mockStorageContext}>
          <New />
        </StorageContext.Provider>,
      );
    });

    it("composes the DeckTitleBar (in active state by default) & CardList", () => {
      expect(
        screen.getByRole("button", { name: "Confirm Change" }),
      ).toBeVisible();
      expect(screen.getByLabelText("Deck Name")).toBeVisible();

      expect(
        screen.getByRole("button", { name: "Load Default Cards" }),
      ).toBeVisible();
      expect(screen.getByText("... or add your own here!")).toBeVisible();
    });

    it("prevents duplicate submissions while saving", async () => {
      jest.useFakeTimers();

      // Slow promise so we can repeat the submission
      mockCreateDeck.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(testDeck), 100);
          }),
      );

      mockFetchDeck.mockReturnValueOnce(testDeck);

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "Test Deck");

      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));
      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      expect(mockCreateDeck).toHaveBeenCalledTimes(1);

      // Fast-forward time to let the promise resolve
      jest.runAllTimers();

      await waitFor(() => expect(mockFetchDeck).toHaveBeenCalledWith("abc123"));

      jest.useRealTimers();
    });

    it("creates a deck on the first submission", async () => {
      mockCreateDeck.mockResolvedValueOnce(testDeck);
      mockFetchDeck.mockReturnValueOnce(testDeck);

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "Test Deck");
      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      expect(mockCreateDeck).toHaveBeenCalledWith("Test Deck");

      await waitFor(() => expect(mockFetchDeck).toHaveBeenCalledWith("abc123"));

      await screen.findByText(testDeck.name);

      expect(mockUpdateDeck).not.toHaveBeenCalled();
    });

    it("saves the deck id & performs updates on subsequent changes", async () => {
      mockCreateDeck.mockResolvedValueOnce(testDeck);
      mockFetchDeck.mockReturnValueOnce(testDeck);

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "Test Deck");
      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      // Fetches the live deck from storage to use as source of truth
      await waitFor(() => expect(mockFetchDeck).toHaveBeenCalledWith("abc123"));

      await screen.findByText(testDeck.name);

      expect(mockCreateDeck).toHaveBeenCalledWith("Test Deck");
      expect(mockUpdateDeck).not.toHaveBeenCalled();

      // Return to active state for second edit
      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "Updated Deck");
      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      await waitFor(() => expect(mockCreateDeck).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(mockUpdateDeck).toHaveBeenCalledWith("abc123", {
          name: "Updated Deck",
        }),
      );
    });
  });
});
