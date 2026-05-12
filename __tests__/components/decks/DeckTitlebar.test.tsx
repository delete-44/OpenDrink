import DeckTitlebar from "@/components/decks/DeckTitlebar";
import { Deck } from "@/src/models/Deck";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { BaseTestDeck } from "../../../test-utils";

describe("DeckTitlebar", () => {
  const mockSaveDeckCallback = jest.fn();

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
    const newDeck = new Deck("", []);

    render(
      <DeckTitlebar deck={newDeck} saveDeckCallback={mockSaveDeckCallback} />,
    );

    assertActive();
  });

  describe("when deck name is populated", () => {
    beforeEach(() => {
      render(
        <DeckTitlebar
          deck={BaseTestDeck}
          saveDeckCallback={mockSaveDeckCallback}
        />,
      );
    });

    it("opens DeleteDeckModal on delete button press", () => {
      assertInert();

      fireEvent.press(screen.getByRole("button", { name: "Delete Deck" }));

      expect(
        screen.getByText(`This will delete the deck: "${BaseTestDeck.name}".`),
      ).toBeVisible();
    });

    it("allows user to enter the active state by clicking the edit button", () => {
      assertInert();

      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      assertActive();
    });

    it("stays in active state & shows an error on failed update", () => {
      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "");

      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      expect(screen.getByText("Deck name cannot be empty")).toBeVisible();
      expect(mockSaveDeckCallback).not.toHaveBeenCalled();

      assertActive();
    });

    it("shows errors from the update callback in UI", async () => {
      mockSaveDeckCallback.mockRejectedValueOnce(new Error("test error"));

      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "Renamed Deck");

      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      await waitFor(() => {
        expect(screen.getByText("test error")).toBeVisible();
      });

      assertActive();
    });

    it("clears error message on new input", () => {
      fireEvent.press(screen.getByRole("button", { name: "Rename Deck" }));

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "");

      fireEvent.press(screen.getByRole("button", { name: "Confirm Change" }));

      expect(screen.getByText("Deck name cannot be empty")).toBeVisible();
      expect(mockSaveDeckCallback).not.toHaveBeenCalled();

      fireEvent.changeText(screen.getByLabelText("Deck Name"), "T");

      expect(screen.queryByText("Deck name cannot be empty")).toBeNull();
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
  });
});
