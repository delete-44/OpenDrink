import DeckSelector from "@/components/DeckSelector";
import { render, screen } from "@testing-library/react-native";
import React from "react";

describe("DeckSelector", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders loading spinner when fetching data", () => {
    jest.spyOn(React, "useContext").mockReturnValueOnce({
      decks: [{ id: "1", name: "Default", cards: ["Card 1"] }],
      currentDeckIndex: 0,
      isLoading: true,
    });

    render(<DeckSelector />);

    expect(screen.getByLabelText("Loading decks")).toBeVisible();
    expect(screen.queryByText("Default")).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("renders UI elements correctly", async () => {
    jest.spyOn(React, "useContext").mockReturnValueOnce({
      decks: [{ id: "1", name: "Default", cards: ["Card 1"] }],
      currentDeckIndex: 0,
      isLoading: false,
    });

    render(<DeckSelector />);

    expect(screen.queryByLabelText("Loading decks")).toBeNull();
    expect(screen.getByText("Default")).toBeVisible();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
