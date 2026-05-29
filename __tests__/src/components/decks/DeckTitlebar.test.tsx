import { DeckFactory } from "@/factories/models/DeckFactory";
import DeckTitlebar from "@/src/components/decks/DeckTitlebar";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

describe("DeckTitlebar", () => {
  const mockSaveDeckCallback = jest.fn();

  const deck = DeckFactory();

  const assertInert = () => {
    expect(screen.getByRole("button", { name: "Rename Deck" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete Deck" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Confirm Change" })).toBeNull();
    expect(screen.queryByLabelText("Deck Name")).toBeNull();
  };

  const assertActive = () => {
    expect(screen.queryByRole("button", { name: "Rename Deck" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Delete Deck" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Confirm Change" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Deck Name")).toBeVisible();
  };

  it("renders in active state if deck name is empty", () => {
    const deck = DeckFactory({ name: "" });

    render(
      <DeckTitlebar deck={deck} saveDeckCallback={mockSaveDeckCallback} />,
    );

    assertActive();
  });

  describe("when deck name is populated", () => {
    beforeEach(() => {
      render(
        <DeckTitlebar deck={deck} saveDeckCallback={mockSaveDeckCallback} />,
      );
    });

    it("opens DeleteDeckModal on delete button press", () => {
      assertInert();

      fireEvent.press(screen.getByRole("button", { name: "Delete Deck" }));

      expect(
        screen.getByText(`This will delete the deck: "${deck.name}".`),
      ).toBeVisible();
    });

    it("allows user to enter the active state by clicking the edit button", () => {
      assertInert();

      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      assertActive();
    });

    it("stays in active state & shows errors from the update callback in UI", async () => {
      mockSaveDeckCallback.mockRejectedValueOnce(new Error("test error"));

      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "Renamed Deck");

      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      await waitFor(() => {
        expect(screen.getByText("test error")).toBeVisible();
      });

      assertActive();
    });

    it("clears error message on new input", async () => {
      mockSaveDeckCallback.mockRejectedValueOnce(new Error("test error"));

      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "");

      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      await waitFor(() => {
        expect(screen.getByText("test error")).toBeVisible();
      });

      expect(mockSaveDeckCallback).toHaveBeenCalledWith("");

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "T");

      expect(screen.queryByText("test error")).toBeNull();
    });

    it("returns to inert state + commits the updated deck on save", async () => {
      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "Renamed Deck");

      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      expect(mockSaveDeckCallback).toHaveBeenCalledWith("Renamed Deck");

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Rename Deck" }),
        ).toBeVisible();
      });

      assertInert();
    });

    it("allows user to save using the native keyboard interaction", async () => {
      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "Renamed Deck");

      fireEvent(screen.getByLabelText("Deck Name"), "submitEditing");

      expect(mockSaveDeckCallback).toHaveBeenCalledWith("Renamed Deck");

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Rename Deck" }),
        ).toBeVisible();
      });

      assertInert();
    });
  });
});
