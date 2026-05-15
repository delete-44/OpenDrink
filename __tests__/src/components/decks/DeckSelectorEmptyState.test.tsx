import DeckSelectorEmptyState from "@/src/components/decks/DeckSelectorEmptyState";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("DeckSelectorEmptyState", () => {
  it("renders UI elements correctly", () => {
    render(<DeckSelectorEmptyState />);

    expect(screen.getByText("Add a Deck to get started:")).toBeVisible();
    expect(screen.getByRole("button", { name: "New Deck" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Edit Deck" })).toBeNull();
  });

  it("navigates to the new page when new deck clicked", () => {
    render(<DeckSelectorEmptyState />);

    fireEvent.press(screen.getByRole("button", { name: "New Deck" }));
    expect(router.navigate).toHaveBeenCalledWith("/decks/new");
  });
});
